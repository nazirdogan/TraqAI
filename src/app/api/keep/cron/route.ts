import { timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ZOOM_EMAIL_ISO, reminderFromMs, sessionEndMs, sessionStartMs } from '@/lib/keep-session';
import { getSettings, pendingBuyers, type SentColumn } from '@/lib/keep/db';
import type { KeepEmailKind } from '@/lib/keep/emails';
import { SEND_GAP_MS, nowMs, sendTo, sleep } from '@/lib/keep/send';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// Hobby allows up to 60 seconds. At one send every 0.6s that is ~80 emails a
// run; anything left over goes out ten minutes later.
export const maxDuration = 60;
const MAX_SENDS_PER_RUN = 80;

function authorised(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const got = Buffer.from(request.headers.get('authorization') ?? '', 'utf8');
  const want = Buffer.from(`Bearer ${secret}`, 'utf8');
  return got.length === want.length && timingSafeEqual(got, want);
}

/**
 * Called every 10 minutes by Supabase pg_cron (supabase/keep.sql), because
 * the Vercel Hobby plan only runs crons once a day.
 *
 * Each email has a window and a condition; inside it, every buyer whose
 * sent_* column is still empty gets it. Order matters: a retry of a missed
 * Email 1 comes first, so nobody gets the Zoom link before their confirmation.
 */
async function run() {
  const now = nowMs();
  const settings = await getSettings();
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY missing');
  const resend = new Resend(key);

  const plan: { kind: KeepEmailKind; column: SentColumn; due: boolean; why?: string }[] = [
    // Email 1 retries: the webhook's own send failed. Give it 5 minutes first.
    { kind: 'confirm', column: 'sent_confirm_at', due: true },
    {
      kind: 'zoom',
      column: 'sent_zoom_at',
      due: now >= Date.parse(ZOOM_EMAIL_ISO) && now < sessionEndMs() && Boolean(settings.zoom_url),
      why: now >= Date.parse(ZOOM_EMAIL_ISO) && !settings.zoom_url ? 'zoom_url not set' : undefined,
    },
    {
      kind: 'reminder',
      column: 'sent_reminder_at',
      due: now >= reminderFromMs() && now < sessionStartMs() && Boolean(settings.zoom_url),
      why: now >= reminderFromMs() && now < sessionStartMs() && !settings.zoom_url ? 'zoom_url not set' : undefined,
    },
    { kind: 'replay', column: 'sent_replay_at', due: now >= sessionEndMs() && Boolean(settings.replay_url) },
  ];

  const report: Record<string, { sent: number; already: number; failed: number; skipped?: string }> = {};
  let budget = MAX_SENDS_PER_RUN;

  for (const step of plan) {
    report[step.kind] = { sent: 0, already: 0, failed: 0 };
    if (step.why) {
      console.warn(`[keep] ${step.kind}: ${step.why}, nothing sent`);
      report[step.kind].skipped = step.why;
    }
    if (!step.due || budget <= 0) continue;

    let buyers = await pendingBuyers(step.column, budget);
    if (step.kind === 'confirm') buyers = buyers.filter((b) => now - Date.parse(b.created_at) > 5 * 60_000);

    for (const buyer of buyers) {
      if (budget-- <= 0) break;
      const result = await sendTo(resend, step.kind, buyer, settings);
      report[step.kind][result] += 1;
      await sleep(SEND_GAP_MS);
    }
  }
  // Counts only, and only in the server log; the response carries nothing.
  console.info('[keep] cron', JSON.stringify(report));
}

async function handle(request: Request) {
  if (!authorised(request)) return NextResponse.json({ error: 'unauthorised' }, { status: 401 });
  try {
    await run();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[keep] cron failed', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

export const GET = handle;
export const POST = handle;

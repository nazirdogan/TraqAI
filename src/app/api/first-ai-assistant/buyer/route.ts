import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import FirstAiAssistantEmail from '@/emails/FirstAiAssistantEmail';
import { checkRate } from '@/lib/intake/ratelimit';
import { clientIp, verifyTurnstile } from '@/lib/intake/turnstile';
import { buildBuyerSequence, vipBuyerSequence, type FaaEmail } from '@/lib/first-ai-assistant-emails';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const schema = z.object({
  name: z.string().trim().max(80).optional().or(z.literal('')),
  email: z.string().trim().email('Check your email address').max(160),
  kind: z.enum(['build', 'vip']),
});

const FROM = 'Naz at Traq Collective <hello@traqcollective.com>';
const NOTIFY = process.env.FAA_NOTIFY_EMAIL ?? 'nazir@traqcollective.com';

/**
 * A buyer, on the welcome page after paying, asks for their joining details
 * and reminders by email. Everything is sent or scheduled through Resend here,
 * so no one has to press send.
 */
export async function POST(request: Request) {
  const ip = clientIp(request);
  const gate = await checkRate('submit-hour', ip);
  if (!gate.ok) return NextResponse.json({ error: 'rate_limited' }, { status: 429 });

  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }
  const parsed = schema.safeParse(body.buyer ?? null);
  if (!parsed.success) return NextResponse.json({ error: 'validation_failed', issues: parsed.error.flatten().fieldErrors }, { status: 400 });

  if (process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY) {
    const ok = await verifyTurnstile(String(body.turnstileToken ?? ''), ip);
    if (!ok) return NextResponse.json({ error: 'turnstile_failed' }, { status: 403 });
  }

  const d = parsed.data;
  const firstName = (d.name || '').split(/\s+/)[0] ?? '';
  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ ok: true, emailed: false });

  const resend = new Resend(key);
  const now = Date.now();
  const emails: FaaEmail[] = (d.kind === 'build' ? buildBuyerSequence(firstName) : vipBuyerSequence(firstName)).filter(
    (e) => !e.sendAt || Date.parse(e.sendAt) > now + 5 * 60_000,
  );

  const results = await Promise.allSettled(
    emails.map((e) =>
      resend.emails.send({
        from: FROM,
        to: d.email,
        replyTo: 'hello@traqcollective.com',
        subject: e.subject,
        react: FirstAiAssistantEmail({ preview: e.preview, heading: e.heading, blocks: e.blocks }),
        ...(e.sendAt ? { scheduledAt: e.sendAt } : {}),
        tags: [
          { name: 'funnel', value: 'first_ai_assistant' },
          { name: 'step', value: e.key },
        ],
      }),
    ),
  );
  const failed = results.filter((r) => r.status === 'rejected' || (r.status === 'fulfilled' && r.value.error)).length;
  if (failed) console.error('[faa-buyer] some emails failed', failed);

  try {
    await resend.emails.send({
      from: FROM,
      to: NOTIFY,
      replyTo: d.email,
      subject: `Buyer opted in to emails: ${d.name || d.email} (${d.kind})`,
      text: `${d.name || '-'}\n${d.email}\nKind: ${d.kind}\nScheduled: ${emails.map((e) => e.key).join(', ')}`,
    });
  } catch (err) {
    console.error('[faa-buyer] notify failed', err);
  }

  return NextResponse.json({ ok: true, emailed: failed === 0 });
}

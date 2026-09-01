import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { aiPlanPrepSchema } from '@/lib/intake/types';
import { checkRate } from '@/lib/intake/ratelimit';
import { clientIp, verifyTurnstile } from '@/lib/intake/turnstile';
import { buildPrepRecord, savePrep } from '@/lib/intake/applications';
import AiPlanPrepEmail from '@/emails/AiPlanPrepEmail';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * The pre-session task, from a confirmed attendee.
 *
 * Same shape as the application route, one email instead of two: this is
 * material for the room, not a lead, and the person sending it has already had
 * a personal email from Nazir. A second automated receipt on top of that reads
 * as noise, so the confirmation is on screen only.
 */

const NOTIFY_EMAIL = process.env.AI_PLAN_SESSION_NOTIFY_EMAIL ?? 'nazir@traqcollective.com';

export async function POST(request: Request) {
  const ip = clientIp(request);

  const gate = await checkRate('submit-hour', ip);
  if (!gate.ok) {
    return NextResponse.json(
      { error: 'rate_limited', retryAfterSec: gate.retryAfterSec },
      { status: 429, headers: { 'Retry-After': String(gate.retryAfterSec) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const envelope = typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {};

  const parsed = aiPlanPrepSchema.safeParse(envelope.prep ?? null);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'validation_failed', issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const tsOk = await verifyTurnstile((envelope.turnstileToken as string | undefined) ?? '', ip);
  if (!tsOk) {
    return NextResponse.json({ error: 'turnstile_failed' }, { status: 403 });
  }

  const record = buildPrepRecord(parsed.data);
  const stored = await savePrep(record);

  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL ?? 'Traq Collective <hello@traqcollective.com>';

  if (!resendKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[ai-plan-prep] dev mode, skipping Resend. Prep:', record);
      return NextResponse.json({ ok: true, dev: true, stored });
    }
    return NextResponse.json({ error: 'email_not_configured' }, { status: 500 });
  }

  try {
    const resend = new Resend(resendKey);
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: NOTIFY_EMAIL,
      replyTo: record.email,
      subject: `Pre-session task: ${record.name}, ${record.company}`,
      react: AiPlanPrepEmail({ prep: record }),
    });
    if (error) {
      console.error('[ai-plan-prep] send failed:', error);
      return NextResponse.json({ error: 'email_send_failed', detail: error }, { status: 502 });
    }
    console.info('[ai-plan-prep] sent', { prep: record.id, stored, message: data?.id });
  } catch (err) {
    console.error('[ai-plan-prep] send exception:', err);
    const message = err instanceof Error ? err.message : 'email_send_failed';
    return NextResponse.json({ error: 'email_send_failed', detail: message }, { status: 502 });
  }

  return NextResponse.json({ ok: true, stored });
}

export async function GET() {
  return NextResponse.json({ ok: true, endpoint: 'intake/ai-plan-session/prep' });
}

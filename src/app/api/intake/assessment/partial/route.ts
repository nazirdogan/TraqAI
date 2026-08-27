import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { assessmentPartialSchema } from '@/lib/intake/types';
import { checkRate } from '@/lib/intake/ratelimit';
import { clientIp } from '@/lib/intake/turnstile';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Partial assessment capture.
 *
 * Fires once, the moment someone hands over their email part-way through the
 * quiz. Its whole job is to make sure that address exists somewhere other than
 * the tab it was typed into, so an abandoner can be followed up.
 *
 * No Turnstile here on purpose: the widget only mounts on the final capture
 * form, and gating a mid-quiz keystroke behind a challenge would cost more
 * completions than the spam is worth. The submit-hour rate limit still applies,
 * and the endpoint accepts nothing that is not an email plus a counter, so the
 * worst case is a junk address in an inbox.
 */
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

  const parsed = assessmentPartialSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'validation_failed', issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const partial = parsed.data;
  const resendKey = process.env.RESEND_API_KEY;
  const teamEmail = process.env.TEAM_INTAKE_EMAIL ?? 'hello@traqcollective.com';
  const fromEmail =
    process.env.FROM_EMAIL ?? 'Traq Collective <hello@traqcollective.com>';

  if (!resendKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[intake/assessment/partial] dev mode, skipping Resend:', partial);
      return NextResponse.json({ ok: true, dev: true });
    }
    return NextResponse.json({ error: 'email_not_configured' }, { status: 500 });
  }

  // Plain text on purpose. This is an internal signal, not a designed email,
  // and it needs to be readable on a phone within a few minutes of landing.
  const lines = [
    `${partial.email} started the AI readiness assessment and gave their email at question ${partial.answered}.`,
    '',
    partial.source ? `Page: ${partial.source}` : null,
    partial.attribution ? `Attribution: ${partial.attribution}` : null,
    '',
    'If no completed result follows within the hour, they dropped out part-way.',
    'One line asking whether they want the rest of the score usually recovers it.',
  ].filter((l) => l !== null);

  try {
    const res = await new Resend(resendKey).emails.send({
      from: fromEmail,
      to: teamEmail,
      replyTo: partial.email,
      subject: `Assessment started: ${partial.email}`,
      text: lines.join('\n'),
    });
    if (res.error) {
      return NextResponse.json(
        { error: 'email_send_failed', detail: res.error },
        { status: 502 },
      );
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'email_send_failed';
    return NextResponse.json({ error: 'email_send_failed', detail: message }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ ok: true, endpoint: 'intake/assessment/partial' });
}

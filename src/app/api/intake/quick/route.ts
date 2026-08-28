import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { quickIntakeSchema } from '@/lib/intake/types';
import { checkRate } from '@/lib/intake/ratelimit';
import { clientIp, verifyTurnstile } from '@/lib/intake/turnstile';
import { recordLead } from '@/lib/intake/leadstore';
import QuickLeadEmail from '@/emails/QuickLeadEmail';
import QuickConfirmationEmail from '@/emails/QuickConfirmationEmail';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

  const parsed = quickIntakeSchema.safeParse(
    typeof body === 'object' && body !== null ? (body as Record<string, unknown>).intake : null,
  );
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'validation_failed', issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const turnstileToken =
    typeof body === 'object' && body !== null
      ? ((body as Record<string, unknown>).turnstileToken as string | undefined)
      : undefined;
  const tsOk = await verifyTurnstile(turnstileToken ?? '', ip);
  if (!tsOk) {
    return NextResponse.json({ error: 'turnstile_failed' }, { status: 403 });
  }

  const intake = parsed.data;

  await recordLead({
    kind: 'quick',
    email: intake.email,
    firstName: intake.firstName,
    lastName: intake.lastName,
    company: intake.company,
    ...(intake.click ?? {}),
  });

  const resendKey = process.env.RESEND_API_KEY;
  const teamEmail = process.env.TEAM_INTAKE_EMAIL ?? 'hello@traqcollective.com';
  const fromEmail = process.env.FROM_EMAIL ?? 'Traq Collective <hello@traqcollective.com>';

  if (!resendKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[intake/quick] dev mode — skipping Resend. Intake:', intake);
      return NextResponse.json({ ok: true, dev: true });
    }
    return NextResponse.json({ error: 'email_not_configured' }, { status: 500 });
  }

  const resend = new Resend(resendKey);

  try {
    const teamSend = resend.emails.send({
      from: fromEmail,
      to: teamEmail,
      replyTo: intake.email,
      subject: `Quick-form lead: ${intake.firstName} ${intake.lastName} @ ${intake.company}`,
      react: QuickLeadEmail({ intake }),
    });
    const leadSend = resend.emails.send({
      from: fromEmail,
      to: intake.email,
      subject: `Thanks ${intake.firstName}, a Traq specialist will be in touch shortly`,
      react: QuickConfirmationEmail({ intake }),
    });
    const [teamRes, leadRes] = await Promise.all([teamSend, leadSend]);
    if (teamRes.error || leadRes.error) {
      return NextResponse.json(
        { error: 'email_send_failed', teamError: teamRes.error, leadError: leadRes.error },
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
  return NextResponse.json({ ok: true, endpoint: 'intake/quick' });
}

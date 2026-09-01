import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { aiPlanSessionSchema } from '@/lib/intake/types';
import { checkRate } from '@/lib/intake/ratelimit';
import { clientIp, verifyTurnstile } from '@/lib/intake/turnstile';
import { buildApplicationRecord, saveApplication } from '@/lib/intake/applications';
import { recordLead } from '@/lib/intake/leadstore';
import AiPlanSessionApplicationEmail from '@/emails/AiPlanSessionApplicationEmail';
import AiPlanSessionAckEmail from '@/emails/AiPlanSessionAckEmail';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Applications for the 2027 AI Plan session.
 *
 * The route captures and notifies, and does nothing else. It never scores,
 * ranks, filters or rejects on the strength of an answer: seats are decided by
 * hand, by email, after this has run. Company size and the leadership question
 * are context for that decision, not gates in front of it, so every complete
 * and human submission gets the same 200.
 */

/** Where the application lands. The screening inbox, not the shared one. */
const NOTIFY_EMAIL = process.env.AI_PLAN_SESSION_NOTIFY_EMAIL ?? 'nazir@traqcollective.com';

/**
 * The receipt goes out under Nazir's name from the shared address, because the
 * copy is written in the first person and signed by him. The team notification
 * keeps using the configured FROM_EMAIL like every other route.
 */
const ACK_FROM_EMAIL =
  process.env.AI_PLAN_SESSION_ACK_FROM ?? 'Nazir at Traq Collective <hello@traqcollective.com>';

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

  const parsed = aiPlanSessionSchema.safeParse(envelope.application ?? null);
  if (!parsed.success) {
    // Field-keyed issues, so the form can put each message back beside the
    // input that produced it rather than dropping one banner on the page.
    return NextResponse.json(
      { error: 'validation_failed', issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const tsOk = await verifyTurnstile((envelope.turnstileToken as string | undefined) ?? '', ip);
  if (!tsOk) {
    return NextResponse.json({ error: 'turnstile_failed' }, { status: 403 });
  }

  const application = parsed.data;
  const record = buildApplicationRecord(application);

  // Store before sending. Email is the notification; this is the copy that
  // survives a spam filter, and a capped session cannot afford a lost seat.
  const stored = await saveApplication(record);

  // And a row in the lead sheet, which is the store that is actually live in
  // production while the Upstash database is missing (see
  // docs/2026-08-28-lead-sheet-setup.md). It carries the applicant and the
  // click, not the answers, so it is a safety net rather than the record: the
  // full application lives in Redis above and in the notification email. The
  // row is inert in the ads pipeline until a stage date is typed against it.
  const [firstName, ...rest] = application.name.trim().split(/\s+/);
  await recordLead({
    kind: 'ai_plan_session',
    email: application.email,
    firstName,
    lastName: rest.join(' ') || undefined,
    company: application.company,
    source: 'ai-plan-session',
    ...(application.click ?? {}),
  });

  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL ?? 'Traq Collective <hello@traqcollective.com>';

  if (!resendKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[ai-plan-session] dev mode, skipping Resend. Application:', record);
      return NextResponse.json({ ok: true, dev: true, stored });
    }
    return NextResponse.json({ error: 'email_not_configured' }, { status: 500 });
  }

  const resend = new Resend(resendKey);

  try {
    const notify = resend.emails.send({
      from: fromEmail,
      to: NOTIFY_EMAIL,
      replyTo: application.email,
      subject: `New application: ${application.name}, ${application.company}`,
      react: AiPlanSessionApplicationEmail({ application: record }),
    });
    const ack = resend.emails.send({
      from: ACK_FROM_EMAIL,
      to: application.email,
      replyTo: NOTIFY_EMAIL,
      subject: 'Your application for the 2027 AI Plan session',
      react: AiPlanSessionAckEmail({ name: application.name }),
    });

    const [notifyRes, ackRes] = await Promise.all([notify, ack]);

    if (notifyRes.error) {
      console.error('[ai-plan-session] notification failed:', notifyRes.error);
      return NextResponse.json(
        { error: 'email_send_failed', detail: notifyRes.error },
        { status: 502 },
      );
    }
    // A failed receipt is not worth making the applicant submit again: the
    // application is stored and Nazir already has it, and a retry would only
    // duplicate the record. It is logged instead, so a broken receipt shows up
    // in the function logs rather than in a second application.
    if (ackRes.error) {
      console.error('[ai-plan-session] applicant receipt failed:', ackRes.error);
    }

    // Message ids, so a "did it actually send" question months from now can be
    // answered from the logs and Resend rather than from memory.
    console.info('[ai-plan-session] sent', {
      application: record.id,
      stored,
      notify: notifyRes.data?.id,
      ack: ackRes.data?.id,
    });
  } catch (err) {
    console.error('[ai-plan-session] send exception:', err);
    const message = err instanceof Error ? err.message : 'email_send_failed';
    return NextResponse.json({ error: 'email_send_failed', detail: message }, { status: 502 });
  }

  return NextResponse.json({ ok: true, stored });
}

export async function GET() {
  return NextResponse.json({ ok: true, endpoint: 'intake/ai-plan-session' });
}

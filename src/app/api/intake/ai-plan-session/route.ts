import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { aiPlanSessionSchema } from '@/lib/intake/types';
import { decideSeat, isApproved } from '@/lib/intake/qualify';
import { checkRate } from '@/lib/intake/ratelimit';
import { clientIp, verifyTurnstile } from '@/lib/intake/turnstile';
import { buildSignUpRecord, saveSignUp } from '@/lib/intake/applications';
import { recordLead } from '@/lib/intake/leadstore';
import { getSeatCount } from '@/lib/seats';
import { SITE_URL } from '@/lib/seo/schema';
import AiPlanSignUpNotifyEmail from '@/emails/AiPlanSignUpNotifyEmail';
import AiPlanHoldYourSeatEmail from '@/emails/AiPlanHoldYourSeatEmail';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Sign-ups for the 2027 AI Plan session.
 *
 * The route is the qualifier. It applies the one rule in lib/intake/qualify.ts
 * to the position answer and tells the form the outcome. Approved people are
 * handed the deposit page, with their email and reference in the query string
 * so the Stripe payment can be matched back to this record. Declined people
 * are told on screen and not emailed; Nazir still gets the notification, so a
 * rule that is wrong about someone can be overridden by hand.
 *
 * The decision is made here and nowhere else. The form never computes it.
 */

/** Where the notification lands. The screening inbox, not the shared one. */
const NOTIFY_EMAIL = process.env.AI_PLAN_SESSION_NOTIFY_EMAIL ?? 'nazir@traqcollective.com';

/**
 * The hold-your-seat email goes out under Nazir's name from the shared address,
 * because the copy is written in the first person and signed by him. The team
 * notification keeps using the configured FROM_EMAIL like every other route.
 */
const ACK_FROM_EMAIL =
  process.env.AI_PLAN_SESSION_ACK_FROM ?? 'Nazir at Traq Collective <hello@traqcollective.com>';

const SECURE_SEAT_PATH = '/ai-plan-session/secure-seat';

/**
 * The deposit page, addressed to one person. The reference is what ties a row
 * in Stripe back to this sign-up, and it is the only thing the deposit page
 * accepts as proof that someone came through the form.
 */
function secureSeatPath(email: string, ref: string): string {
  const q = new URLSearchParams({ email, ref });
  return `${SECURE_SEAT_PATH}?${q.toString()}`;
}

export async function POST(request: Request) {
  const ip = clientIp(request);

  const gate = await checkRate('submit-hour', ip);
  if (!gate.ok) {
    return NextResponse.json(
      { error: 'rate_limited', retryAfterSec: gate.retryAfterSec },
      { status: 429, headers: { 'Retry-After': String(gate.retryAfterSec) } },
    );
  }

  // Checked before the body is even read, against a live count rather than
  // the cached one the pages show: a full room refuses cleanly rather than
  // approving someone into a seat that does not exist.
  const seats = await getSeatCount({ live: true });
  if (!seats.open) {
    return NextResponse.json({ error: 'closed' }, { status: 409 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const envelope = typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {};

  const parsed = aiPlanSessionSchema.safeParse(envelope.signUp ?? null);
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

  const signUp = parsed.data;
  const outcome = decideSeat(signUp.position);
  const approved = isApproved(outcome);
  const record = buildSignUpRecord(signUp, outcome);
  const next = approved ? secureSeatPath(signUp.email, record.id) : null;

  // Store before sending. Email is the notification; this is the copy that
  // survives a spam filter, and a capped session cannot afford a lost seat.
  const stored = await saveSignUp(record);

  // And a row in the lead sheet, which is the store that is actually live in
  // production while the Upstash database is missing (see
  // docs/2026-08-28-lead-sheet-setup.md). It carries the person and the click,
  // not the answers, so it is a safety net rather than the record. Declined
  // sign-ups are recorded too: they are still a lead, just not for this room.
  const [firstName, ...rest] = signUp.name.trim().split(/\s+/);
  await recordLead({
    kind: 'ai_plan_session',
    email: signUp.email,
    firstName,
    lastName: rest.join(' ') || undefined,
    company: signUp.company,
    source: 'ai-plan-session',
    ...(signUp.click ?? {}),
  });

  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL ?? 'Traq Collective <hello@traqcollective.com>';

  if (!resendKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[ai-plan-session] dev mode, skipping Resend. Sign-up:', record);
      return NextResponse.json({ ok: true, dev: true, stored, outcome, next });
    }
    return NextResponse.json({ error: 'email_not_configured' }, { status: 500 });
  }

  const resend = new Resend(resendKey);

  try {
    const subject = approved
      ? `Approved: ${signUp.name}, ${signUp.company}`
      : `Declined by the form: ${signUp.name}, ${signUp.company} (${signUp.position})`;

    const notify = resend.emails.send({
      from: fromEmail,
      to: NOTIFY_EMAIL,
      replyTo: signUp.email,
      subject,
      react: AiPlanSignUpNotifyEmail({ signUp: record }),
    });

    // Only an approved person hears from the site. The declined message is on
    // their screen already, and putting "not senior enough" in writing in an
    // inbox helps nobody.
    const hold =
      approved && next
        ? resend.emails.send({
            from: ACK_FROM_EMAIL,
            to: signUp.email,
            replyTo: NOTIFY_EMAIL,
            subject: 'Your seat at Three Decisions: one step left',
            // The canonical host, not the request's: a preview deployment must
            // never put its own hostname into a customer's inbox.
            react: AiPlanHoldYourSeatEmail({ name: signUp.name, secureSeatUrl: `${SITE_URL}${next}` }),
          })
        : Promise.resolve(null);

    const [notifyRes, holdRes] = await Promise.all([notify, hold]);

    if (notifyRes.error) {
      console.error('[ai-plan-session] notification failed:', notifyRes.error);
      return NextResponse.json(
        { error: 'email_send_failed', detail: notifyRes.error },
        { status: 502 },
      );
    }
    // A failed hold-your-seat email is not worth making the person submit
    // again: the record is stored, Nazir has it, and the form is about to send
    // them to the deposit page anyway. It is logged so a broken email shows up
    // in the function logs rather than in a second sign-up.
    if (holdRes?.error) {
      console.error('[ai-plan-session] hold-your-seat email failed:', holdRes.error);
    }

    // Message ids, so a "did it actually send" question months from now can be
    // answered from the logs and Resend rather than from memory.
    console.info('[ai-plan-session] sent', {
      signUp: record.id,
      outcome,
      stored,
      notify: notifyRes.data?.id,
      hold: holdRes?.data?.id,
    });
  } catch (err) {
    console.error('[ai-plan-session] send exception:', err);
    const message = err instanceof Error ? err.message : 'email_send_failed';
    return NextResponse.json({ error: 'email_send_failed', detail: message }, { status: 502 });
  }

  return NextResponse.json({ ok: true, stored, outcome, next });
}

export async function GET() {
  return NextResponse.json({ ok: true, endpoint: 'intake/ai-plan-session' });
}

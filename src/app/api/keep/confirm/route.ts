import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import FirstAiAssistantEmail from '@/emails/FirstAiAssistantEmail';
import { getRedis } from '@/lib/intake/redis';
import { recordLead } from '@/lib/intake/leadstore';
import { KEEP_KICKER, buyerSequence, notifyText, type KeepEmail } from '@/lib/keep-emails';
import { KEEP_PAYMENT_LINK_ID } from '@/lib/keep-session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FROM = 'Naz at Traq Collective <hello@traqcollective.com>';
const NOTIFY = process.env.FAA_NOTIFY_EMAIL ?? 'nazir@traqcollective.com';
const STRIPE = process.env.STRIPE_API_BASE ?? 'https://api.stripe.com/v1';

type CheckoutSession = {
  id: string;
  status: string | null;
  payment_status: string;
  payment_link: string | null;
  customer_details: { email: string | null; name: string | null; phone: string | null } | null;
};

/**
 * A buyer lands on /keep/thanks?session_id=cs_... straight from Stripe, and
 * the page posts that id here.
 *
 * The id is only trusted after Stripe confirms it is a paid checkout on this
 * session's Payment Link, so the Zoom emails cannot be had by visiting the
 * thanks page without paying. The email address comes from Stripe, not from
 * the browser. A reload, or a second tab, sends nothing twice: Redis records
 * the checkout once, and Resend's idempotency key backs that up for a day.
 *
 * Needs STRIPE_RESTRICTED_KEY (read access to Checkout Sessions) and
 * RESEND_API_KEY. Without either it answers `unconfigured` and the thanks
 * page tells the buyer to write in if no email arrives.
 */
export async function POST(request: Request) {
  let sessionId = '';
  try {
    sessionId = String(((await request.json()) as { sessionId?: unknown }).sessionId ?? '');
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }
  if (!/^cs_(live|test)_[A-Za-z0-9]{10,200}$/.test(sessionId)) {
    return NextResponse.json({ error: 'invalid_session' }, { status: 400 });
  }

  const stripeKey = process.env.STRIPE_RESTRICTED_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  if (!stripeKey || !resendKey) {
    console.error('[keep] confirm unconfigured', { stripe: Boolean(stripeKey), resend: Boolean(resendKey) });
    return NextResponse.json({ ok: false, error: 'unconfigured' }, { status: 503 });
  }

  const res = await fetch(`${STRIPE}/checkout/sessions/${sessionId}`, {
    headers: { authorization: `Bearer ${stripeKey}` },
    cache: 'no-store',
  });
  if (!res.ok) {
    console.error('[keep] stripe lookup failed', res.status);
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  }
  const cs = (await res.json()) as CheckoutSession;
  const email = cs.customer_details?.email ?? '';
  if (cs.payment_link !== KEEP_PAYMENT_LINK_ID || cs.status !== 'complete' || cs.payment_status !== 'paid' || !email) {
    return NextResponse.json({ ok: false, error: 'not_paid' }, { status: 402 });
  }

  const fullName = cs.customer_details?.name?.trim() ?? '';
  const [firstName = '', ...rest] = fullName.split(/\s+/);

  // Claim this checkout. If Redis is down or unset, carry on: Resend's
  // idempotency key still stops duplicates within its 24-hour window.
  const redis = getRedis();
  if (redis) {
    try {
      const claimed = await redis.set(`keep:buyer:${cs.id}`, Date.now(), { nx: true, ex: 60 * 60 * 24 * 30 });
      if (claimed === null) return NextResponse.json({ ok: true, firstName, already: true });
    } catch (err) {
      console.warn('[keep] redis claim failed', err);
    }
  }

  await recordLead({ kind: 'keep', email, firstName, lastName: rest.join(' ') || undefined, phone: cs.customer_details?.phone ?? undefined, source: 'keep-2026-10-24' });

  const resend = new Resend(resendKey);
  const now = Date.now();
  // Skip any reminder already due, or due within ten minutes (a late buyer
  // gets the confirmation and whatever is still ahead of them).
  const emails: KeepEmail[] = buyerSequence(firstName).filter((e) => !e.sendAt || Date.parse(e.sendAt) > now + 10 * 60_000);

  const results = await Promise.allSettled(
    emails.map((e) =>
      resend.emails.send(
        {
          from: FROM,
          to: email,
          replyTo: 'hello@traqcollective.com',
          subject: e.subject,
          react: FirstAiAssistantEmail({ preview: e.preview, heading: e.heading, blocks: e.blocks, kicker: KEEP_KICKER }),
          ...(e.sendAt ? { scheduledAt: e.sendAt } : {}),
          tags: [
            { name: 'funnel', value: 'keep' },
            { name: 'step', value: e.key },
          ],
        },
        { idempotencyKey: `keep-${cs.id}-${e.key}` },
      ),
    ),
  );
  const sent = emails.filter((_, i) => {
    const r = results[i];
    return r.status === 'fulfilled' && !r.value.error;
  });
  if (sent.length < emails.length) console.error('[keep] some emails failed', emails.length - sent.length);
  // Nothing went out: release the claim so a reload of the thanks page can try again.
  if (sent.length === 0 && redis) {
    await redis.del(`keep:buyer:${cs.id}`).catch(() => undefined);
  }

  const n = notifyText({ name: fullName, email, phone: cs.customer_details?.phone ?? undefined, sessionId: cs.id, scheduled: sent.map((e) => e.key) });
  try {
    await resend.emails.send({ from: FROM, to: NOTIFY, replyTo: email, subject: n.subject, text: n.text });
  } catch (err) {
    console.error('[keep] notify failed', err);
  }

  return NextResponse.json({ ok: sent.length > 0, firstName });
}

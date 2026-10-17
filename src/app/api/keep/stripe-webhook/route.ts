import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { KEEP_PAYMENT_LINK_ID } from '@/lib/keep-session';
import { getSettings, upsertBuyer } from '@/lib/keep/db';
import { sendTo } from '@/lib/keep/send';
import { verifyStripeSignature } from '@/lib/keep/stripe-signature';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type CheckoutSession = {
  id: string;
  payment_link: string | null;
  payment_status: string;
  customer_details: { email: string | null; name: string | null } | null;
};

/**
 * Stripe -> here, for `checkout.session.completed` on the £19 Payment Link.
 *
 * Authenticated by the Stripe signature, not a session: anything unsigned or
 * signed with another secret is refused. Saves the buyer once per Checkout
 * Session, then sends Email 1. A non-2xx makes Stripe retry for up to three
 * days, and the retry finds the saved row and only sends what is still owed;
 * the cron also re-sends any Email 1 that never went out.
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[keep] STRIPE_WEBHOOK_SECRET missing');
    return NextResponse.json({ error: 'unconfigured' }, { status: 500 });
  }

  const raw = await request.text();
  if (!verifyStripeSignature(raw, request.headers.get('stripe-signature'), secret)) {
    return NextResponse.json({ error: 'bad_signature' }, { status: 400 });
  }

  let event: { type?: string; data?: { object?: CheckoutSession } };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  // Acknowledge everything else so Stripe stops sending it.
  if (event.type !== 'checkout.session.completed') return NextResponse.json({ ignored: 'event_type' });
  const cs = event.data?.object;
  if (!cs || cs.payment_link !== KEEP_PAYMENT_LINK_ID) return NextResponse.json({ ignored: 'payment_link' });
  if (cs.payment_status !== 'paid') return NextResponse.json({ ignored: 'unpaid' });

  const email = cs.customer_details?.email?.trim();
  if (!email) {
    console.error('[keep] paid checkout with no email', cs.id);
    return NextResponse.json({ ignored: 'no_email' });
  }
  const firstName = cs.customer_details?.name?.trim().split(/\s+/)[0] || 'there';

  try {
    const buyer = await upsertBuyer({ stripe_session_id: cs.id, email, first_name: firstName });
    if (buyer.sent_confirm_at) return NextResponse.json({ ok: true, already: true });

    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error('RESEND_API_KEY missing');
    const result = await sendTo(new Resend(key), 'confirm', buyer, await getSettings());
    if (result === 'failed') return NextResponse.json({ error: 'send_failed' }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[keep] webhook failed', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

import { AI_PLAN_EVENT as EVENT } from '@/lib/event';
import {
  countPaidSessions,
  matchPaymentLink,
  seatsRemaining,
  signUpOpen,
  type StripeCheckoutSession,
  type StripePaymentLink,
} from '@/lib/intake/seatcount';

/**
 * How many seats are taken, read from Stripe.
 *
 * Stripe is already the confirmed list (docs/2026-08-31-ai-plan-session-setup.md,
 * section 4), so this reads that list rather than keeping a second one that
 * could disagree with it. A seat is a completed, paid, unrefunded Checkout
 * Session on the deposit Payment Link. Refund a cancellation and the seat
 * comes back on its own.
 *
 * Needs STRIPE_RESTRICTED_KEY, a restricted key with read access to Payment
 * Links, Checkout Sessions, Payment Intents and Charges, and nothing else. It
 * can read who paid; it cannot charge, refund or change anything. Without it,
 * or without the Payment Link, the count is unknown: pages say "15 seats" with
 * no number left, and the form stays open. Stripe's own payment limit on the
 * link is the backstop in that state.
 */

export type SeatCount = {
  capacity: number;
  /** Null when Stripe is not configured or did not answer. */
  taken: number | null;
  remaining: number | null;
  /** Whether the form should take a sign-up right now. */
  open: boolean;
  source: 'stripe' | 'unconfigured' | 'error';
};

/**
 * Overridable for local testing only, so the reader can be pointed at a mock
 * that answers with real-shaped Stripe JSON. Never set in production.
 */
const STRIPE = process.env.STRIPE_API_BASE ?? 'https://api.stripe.com/v1';

type Options = {
  /**
   * Pages read a count that is at most a minute old, which is plenty for a
   * fifteen-seat room and keeps a Stripe call off every page view. The intake
   * route and the deposit page ask for a live one, because they are the two
   * places a stale count could let a sixteenth seat through.
   */
  live?: boolean;
};

async function stripeGet<T>(path: string, key: string, live: boolean, revalidate: number): Promise<T> {
  const res = await fetch(`${STRIPE}${path}`, {
    headers: { authorization: `Bearer ${key}` },
    ...(live ? { cache: 'no-store' as const } : { next: { revalidate } }),
  });
  if (!res.ok) throw new Error(`stripe ${res.status} on ${path}`);
  return (await res.json()) as T;
}

/**
 * The Payment Link's id, from its public URL. The dashboard hands out the URL
 * and the site already stores it; the sessions list filters on the id. Cached
 * for an hour, because the link does not change once it exists.
 */
async function paymentLinkId(key: string, url: string, live: boolean): Promise<string | null> {
  const page = await stripeGet<{ data: StripePaymentLink[] }>(
    '/payment_links?limit=100&active=true',
    key,
    live,
    3600,
  );
  return matchPaymentLink(page.data, url);
}

async function seatsTaken(key: string, linkId: string, live: boolean): Promise<number> {
  // Completed sessions only, with the charge expanded so a refund can be seen.
  // A fifteen-seat room never gets near the page size.
  const page = await stripeGet<{ data: StripeCheckoutSession[] }>(
    `/checkout/sessions?payment_link=${encodeURIComponent(linkId)}&status=complete&limit=100&expand[]=data.payment_intent.latest_charge`,
    key,
    live,
    60,
  );
  return countPaidSessions(page.data);
}

export async function getSeatCount({ live = false }: Options = {}): Promise<SeatCount> {
  const capacity = EVENT.capacity;
  const key = process.env.STRIPE_RESTRICTED_KEY;
  const url = process.env.AI_PLAN_DEPOSIT_PAYMENT_URL;

  const unknown = (source: SeatCount['source']): SeatCount => ({
    capacity,
    taken: null,
    remaining: null,
    open: signUpOpen(EVENT.signUpOpen, null),
    source,
  });

  if (!key || !url) return unknown('unconfigured');

  try {
    const linkId = await paymentLinkId(key, url, live);
    if (!linkId) {
      console.warn('[seats] no active Payment Link matches AI_PLAN_DEPOSIT_PAYMENT_URL');
      return unknown('error');
    }
    const taken = await seatsTaken(key, linkId, live);
    const remaining = seatsRemaining(capacity, taken);
    return {
      capacity,
      taken,
      remaining,
      open: signUpOpen(EVENT.signUpOpen, remaining),
      source: 'stripe',
    };
  } catch (err) {
    console.warn('[seats] count failed:', err instanceof Error ? err.message : err);
    return unknown('error');
  }
}

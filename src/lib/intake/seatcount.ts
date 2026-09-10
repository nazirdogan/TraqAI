/**
 * The seat arithmetic for the 2027 AI Plan session.
 *
 * A seat is taken when its deposit has cleared in Stripe and not been refunded.
 * That is the only definition the public page has ever used ("the seat is not
 * yours until that is done"), so it is the only one the count uses. Approved
 * sign-ups are not seats: the form approves more people than the room holds,
 * by design, and they race for the deposit.
 *
 * No imports, so the rules here can be tested with nothing but Node. The
 * fetching lives in lib/seats.ts; this file only counts and phrases.
 */

/** The parts of a Stripe Checkout Session the count reads. Ids arrive as strings when not expanded. */
export type StripeCheckoutSession = {
  payment_status?: string;
  payment_intent?:
    | string
    | null
    | {
        latest_charge?: string | null | { refunded?: boolean };
      };
};

export type StripePaymentLink = { id: string; url: string };

/**
 * Completed sessions that were paid and not refunded.
 *
 * A session whose charge could not be inspected still counts. The cap exists
 * to stop a sixteenth person paying for a seat that is not there, and a
 * phantom free seat is the failure that does that.
 */
export function countPaidSessions(sessions: StripeCheckoutSession[]): number {
  let taken = 0;
  for (const s of sessions) {
    if (s.payment_status !== 'paid') continue;
    const pi = s.payment_intent;
    const charge = pi && typeof pi === 'object' ? pi.latest_charge : null;
    const refunded = charge && typeof charge === 'object' ? charge.refunded === true : false;
    if (!refunded) taken += 1;
  }
  return taken;
}

/** Null in, null out: an unknown count must never be shown as a number. */
export function seatsRemaining(capacity: number, taken: number | null): number | null {
  if (taken === null) return null;
  return Math.max(0, capacity - taken);
}

/**
 * How the seat count is described in public.
 *
 * Unknown (Stripe not configured, or not answering) says only the cap, which
 * is true whatever else is. A live count says how many are left, and a full
 * room says so plainly.
 */
export function seatsLine(capacity: number, remaining: number | null): string {
  if (remaining === null) return `${capacity} seats`;
  if (remaining <= 0) return 'Room full';
  if (remaining >= capacity) return `${capacity} seats, all still open`;
  return `${remaining} of ${capacity} seats left`;
}

/**
 * Whether the form should take a sign-up. Unknown stays open: Stripe's own
 * payment limit is the backstop, and closing the room because a status call
 * failed would turn a Stripe blip into a lost seat.
 */
export function signUpOpen(openByHand: boolean, remaining: number | null): boolean {
  if (!openByHand) return false;
  return remaining === null || remaining > 0;
}

function canonicalUrl(url: string): string {
  try {
    const u = new URL(url.trim());
    return `${u.origin}${u.pathname.replace(/\/+$/, '')}`;
  } catch {
    return url.trim().replace(/[?#].*$/, '').replace(/\/+$/, '');
  }
}

/**
 * The id of the configured Payment Link, found by its public URL. The URL is
 * what the dashboard hands out and what the site already stores; the id is
 * what the Checkout Sessions list filters on.
 */
export function matchPaymentLink(links: StripePaymentLink[], configuredUrl: string): string | null {
  const want = canonicalUrl(configuredUrl);
  for (const link of links) {
    if (canonicalUrl(link.url) === want) return link.id;
  }
  return null;
}

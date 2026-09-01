import type { Metadata } from 'next';
import Link from 'next/link';
import { AI_PLAN_EVENT as EVENT, eventDateLong, eventTimeRange } from '@/lib/event';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { absolute: `Secure your seat · ${EVENT.name}` },
  // Reached only from a personal confirmation email. It is not a page anyone
  // should arrive at from search, because arriving here without an offered seat
  // means paying to hold a seat that does not exist.
  robots: { index: false, follow: false },
};

/**
 * The deposit page.
 *
 * The payment itself is a Stripe Payment Link, the same mechanism already used
 * for client deposits in the onboarding process. That choice is deliberate:
 * Stripe's own dashboard becomes the list of who has paid, refunds are one
 * click, no card data or secret key touches this site, and there is no webhook
 * or database to go stale between now and the session.
 *
 * This page exists in front of that link rather than sending the raw Stripe URL
 * because a bare checkout page cannot say what the money is for, when it comes
 * back, or what happens if you cannot come. Those three answers are the whole
 * reason the deposit reads as a commitment device rather than a fee.
 *
 * Set AI_PLAN_DEPOSIT_PAYMENT_URL to the Payment Link. Without it the page says
 * so plainly and gives an email fallback, rather than showing a dead button.
 */

/** Stripe rejects a malformed prefill, so anything that is not clean is dropped. */
function cleanEmail(value: string | undefined): string | null {
  if (!value) return null;
  const v = value.trim();
  if (v.length > 200) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? v : null;
}

/** The application reference, so a payment can be matched to an application. */
function cleanRef(value: string | undefined): string | null {
  if (!value) return null;
  const v = value.trim();
  return /^[A-Za-z0-9-]{1,64}$/.test(v) ? v : null;
}

function buildPaymentUrl(email: string | null, ref: string | null): string | null {
  const base = process.env.AI_PLAN_DEPOSIT_PAYMENT_URL;
  if (!base) return null;
  let url: URL;
  try {
    url = new URL(base);
  } catch {
    return null;
  }
  // Both are documented Payment Link parameters. The email saves the applicant
  // retyping it; the reference is what ties a row in Stripe back to an
  // application without anyone having to match names by eye.
  if (email) url.searchParams.set('prefilled_email', email);
  if (ref) url.searchParams.set('client_reference_id', ref);
  return url.toString();
}

const LABEL = 'text-[11px] font-semibold uppercase tracking-widest text-ink-faint';

export default function SecureSeatPage({
  searchParams,
}: {
  searchParams: { email?: string; ref?: string };
}) {
  const email = cleanEmail(searchParams.email);
  const ref = cleanRef(searchParams.ref);
  const paymentUrl = buildPaymentUrl(email, ref);

  return (
    <section className="relative px-5 pb-20 pt-32 sm:px-8 sm:pb-28 sm:pt-40">
      <div className="mx-auto max-w-2xl">
        <div className="eyebrow eyebrow-accent">Your seat is offered</div>
        <h1 className="mt-4 text-balance text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
          {`Secure your seat at ${EVENT.name}`}
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-ink-soft sm:text-base">
          {`You are through. The last step is a fully refundable AED ${EVENT.depositAed} hold, which comes back to you in the room on the day. Your seat is not confirmed until it is done, because the seats are named and there are only ${EVENT.capacity}.`}
        </p>

        <div className="mt-8 rounded-[24px] border border-border-subtle bg-white p-6 shadow-card sm:p-8">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
            {[
              { k: 'The session', v: EVENT.name },
              { k: 'When', v: `${eventDateLong()}, ${eventTimeRange()}` },
              { k: 'Where', v: `${EVENT.city}, in person` },
              { k: 'To hold your seat', v: `AED ${EVENT.depositAed}, refundable` },
            ].map((row) => (
              <div key={row.k}>
                <dt className={LABEL}>{row.k}</dt>
                <dd className="mt-1.5 text-[14px] font-semibold leading-snug text-ink">{row.v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-7 border-t border-border-subtle pt-7">
            {paymentUrl ? (
              <>
                <a
                  href={paymentUrl}
                  className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full focus-visible:rounded-full bg-traq-purple px-7 py-3.5 text-sm font-semibold text-white shadow-card transition-all hover:-translate-y-px hover:bg-traq-purple-ink hover:shadow-cardHover active:scale-[0.98]"
                >
                  {`Hold my seat with AED ${EVENT.depositAed}`}
                  <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                    &rarr;
                  </span>
                </a>
                <p className="mt-4 text-center text-[13px] leading-relaxed text-ink-faint">
                  {'Payment is handled by Stripe. Your card details never touch this site.'}
                </p>
              </>
            ) : (
              <div className="rounded-xl border border-signal-warn/30 bg-signal-warn/5 px-4 py-3.5 text-[14px] leading-relaxed text-signal-warn">
                {'The payment link is not live yet. Reply to my confirmation email and I will send it to you directly, and your seat is held in the meantime.'}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 rounded-[20px] border border-border-subtle bg-traq-tint p-6">
          <h2 className="text-[15px] font-semibold text-ink">What happens to the money</h2>
          <ul className="mt-4 space-y-2.5">
            {[
              'It comes back to you in the room, before the session starts.',
              `Cancel with more than ${EVENT.cancellationNoticeHours} hours notice and it is refunded in full, and your seat goes to the waiting list.`,
              'It is not a fee, a booking charge, or a deposit against anything else. Attending costs nothing.',
            ].map((line) => (
              <li key={line} className="flex items-start gap-3">
                <span
                  className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-traq-purple"
                  aria-hidden="true"
                />
                <span className="text-[14px] leading-relaxed text-ink-soft">{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-8 text-center text-[13.5px] leading-relaxed text-ink-faint">
          {'Something not right, or the date no longer works? '}
          <a
            href="mailto:nazir@traqcollective.com"
            className="font-semibold text-traq-purple underline underline-offset-4"
          >
            Email me
          </a>
          {' and I will sort it.'}
        </p>

        <div className="mt-6 text-center">
          <Link
            href="/ai-plan-session"
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-traq-purple transition-colors hover:text-traq-purple-ink"
          >
            <span aria-hidden="true">&larr;</span>
            Back to the session details
          </Link>
        </div>
      </div>
    </section>
  );
}

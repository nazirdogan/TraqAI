import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { AI_PLAN_EVENT as EVENT, eventDateLong, eventTimeRange } from '@/lib/event';

export const metadata: Metadata = {
  title: { absolute: `Seat confirmed · ${EVENT.name}` },
  robots: { index: false, follow: false },
};

/**
 * Where Stripe sends people after the deposit clears.
 *
 * Set this URL as the Payment Link's confirmation page in the Stripe dashboard
 * (docs/2026-08-31-ai-plan-session-setup.md). Stripe's own receipt page says a
 * payment succeeded; it cannot say what the seat now requires, which is the
 * pre-session task. Landing them here instead is what stops the prep request
 * arriving cold in an inbox a week later.
 */
export default function SeatSecuredPage() {
  return (
    <section className="relative px-5 pb-20 pt-32 sm:px-8 sm:pb-28 sm:pt-40">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-[24px] border border-border-subtle bg-white p-6 shadow-card sm:p-9">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border-subtle bg-traq-tint text-traq-purple">
            <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="mt-6 text-balance text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl">
            {'That is your seat held.'}
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-soft sm:text-base">
            {`You are on the list for ${EVENT.name}, ${eventDateLong()}, ${eventTimeRange()}, in ${EVENT.city}. Your AED ${EVENT.depositAed} comes back to you in the room, before we start.`}
          </p>

          <div className="mt-7 border-t border-border-subtle pt-7">
            <h2 className="text-[15px] font-semibold text-ink">Two things now</h2>
            <ol className="mt-4 space-y-4">
              {[
                {
                  t: 'Put it in your calendar',
                  b: 'The exact address goes out the week before, along with parking and the room number.',
                },
                {
                  t: 'Send me your one workflow',
                  b: 'Two minutes, and it is what makes the session about your business rather than about AI in general. You can do it now or any time before the week of the session.',
                },
              ].map((row, i) => (
                <li key={row.t} className="flex gap-4">
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full border border-traq-purple bg-traq-tint text-[12px] font-bold text-traq-purple-ink">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-[14.5px] font-semibold leading-snug text-ink">{row.t}</h3>
                    <p className="mt-1 text-[14px] leading-relaxed text-ink-soft">{row.b}</p>
                  </div>
                </li>
              ))}
            </ol>

            <Link
              href="/ai-plan-session/prep"
              className="group mt-6 inline-flex w-full items-center justify-center gap-2.5 rounded-full focus-visible:rounded-full bg-traq-purple px-7 py-3.5 text-sm font-semibold text-white shadow-card transition-all hover:-translate-y-px hover:bg-traq-purple-ink hover:shadow-cardHover active:scale-[0.98]"
            >
              Send my workflow now
              <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                &rarr;
              </span>
            </Link>
          </div>
        </div>

        <p className="mt-8 text-center text-[13.5px] leading-relaxed text-ink-faint">
          {'Anything changes, '}
          <a
            href="mailto:nazir@traqcollective.com"
            className="font-semibold text-traq-purple underline underline-offset-4"
          >
            email me
          </a>
          {` with more than ${EVENT.cancellationNoticeHours} hours notice and your deposit comes straight back.`}
        </p>
      </div>
    </section>
  );
}

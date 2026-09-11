import type { Metadata } from 'next';
import Link from 'next/link';
import { OG_IMAGE } from '@/lib/metadata';
import { BreadcrumbsJsonLd } from '@/components/seo/JsonLd';
import type { BreadcrumbItem } from '@/lib/seo/schema';
import { AI_PLAN_EVENT as EVENT } from '@/lib/event';
import { seatsLine } from '@/lib/intake/seatcount';
import { getSeatCount } from '@/lib/seats';
import SignUpForm from './SignUpForm';
import EventFactsCard from '../_components/EventFactsCard';

/** The seat count is read from Stripe at most once a minute. */
export const revalidate = 60;

const PATH = '/ai-plan-session/sign-up';
const CANONICAL = `https://traqcollective.com${PATH}`;

const SHORT_DESCRIPTION = `Reserve your seat at Three Decisions, 3 AI decisions before 2027: a two hour, in person working session in Dubai, capped at ${EVENT.capacity} seats and secured with a refundable AED ${EVENT.depositAed}.`;

export const metadata: Metadata = {
  title: 'Reserve your seat: Three Decisions',
  description: SHORT_DESCRIPTION,
  alternates: { canonical: CANONICAL },
  // The landing page at /ai-plan-session is the one that gets shared and
  // indexed. This is the form behind it: same subject, no extra content, so
  // indexing it would only split the signal between two near-identical pages.
  robots: { index: false, follow: true },
  openGraph: {
    images: [OG_IMAGE],
    title: 'Reserve your seat: Three Decisions | Traq Collective',
    description: SHORT_DESCRIPTION,
    url: CANONICAL,
  },
};

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', url: '/' },
  { name: 'Three Decisions', url: '/ai-plan-session' },
  { name: 'Reserve your seat', url: PATH },
];

/**
 * Shown instead of the form once the room is full or the sign-up is closed by
 * hand. Says what happened and gives the one useful thing to do about it.
 */
function RoomFull() {
  return (
    <div className="rounded-[24px] border border-border-subtle bg-white p-6 shadow-card sm:p-9">
      <h2 className="text-xl font-bold leading-snug tracking-tight text-ink sm:text-2xl">
        {'The room is full.'}
      </h2>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-soft sm:text-base">
        {`All ${EVENT.capacity} seats are held. Seats do come back when someone cancels, so if you want one, email me and I will keep a short waiting list in the order people ask. You would have about a day to take a seat if one opens.`}
      </p>
      <a
        href="mailto:hello@traqcollective.com?subject=Waiting%20list%3A%20Three%20Decisions"
        className="group mt-6 inline-flex items-center justify-center gap-2.5 rounded-full focus-visible:rounded-full bg-traq-purple px-7 py-3.5 text-sm font-semibold text-white shadow-card transition-all hover:-translate-y-px hover:bg-traq-purple-ink hover:shadow-cardHover active:scale-[0.98]"
      >
        {'Join the waiting list'}
        <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
          &rarr;
        </span>
      </a>
    </div>
  );
}

export default async function AiPlanSignUpPage() {
  const seats = await getSeatCount();

  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbItems} />

      <section className="relative px-5 pb-20 pt-32 sm:px-8 sm:pb-28 sm:pt-40 lg:px-10 lg:pt-44 xl:px-16">
        <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-[1fr_340px] lg:items-start lg:gap-16 xl:gap-20">
          <div className="max-w-2xl">
            <div className="eyebrow eyebrow-accent">Dubai · Two hours · In person</div>

            <h1 className="mt-4 text-balance text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
              {'Reserve your seat: Three Decisions'}
            </h1>

            <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-ink-soft sm:text-base">
              <p>
                {'AI stalled because you never made three decisions: AI strategy, AI safety and governance, AI training. Two hours in Dubai, in a trio, writing all three into your own decision record and leaving with the steps to roll out your AI strategy.'}
              </p>
              <p>
                {`Eight questions, about two minutes. The form screens on position. If the room is built for you, you go straight to securing your seat with a fully refundable AED ${EVENT.depositAed}, which comes back to you in the room.`}
              </p>
              <p className="font-semibold text-ink">{seatsLine(EVENT.capacity, seats.remaining)}</p>
            </div>

            <div className="mt-10 sm:mt-12">{seats.open ? <SignUpForm /> : <RoomFull />}</div>

            <div className="mt-8 text-center lg:text-left">
              <Link
                href="/ai-plan-session"
                className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-traq-purple transition-colors hover:text-traq-purple-ink"
              >
                <span aria-hidden="true">&larr;</span>
                Back to the session details
              </Link>
            </div>
          </div>

          <div className="mt-10 lg:mt-0 lg:sticky lg:top-28">
            <EventFactsCard seatsRemaining={seats.remaining} />
          </div>
        </div>
      </section>
    </>
  );
}

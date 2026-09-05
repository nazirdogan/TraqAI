import type { Metadata } from 'next';
import Link from 'next/link';
import { AI_PLAN_EVENT as EVENT, eventDateLong } from '@/lib/event';
import PrepForm from './PrepForm';
import EventFactsCard from '../_components/EventFactsCard';

export const metadata: Metadata = {
  title: { absolute: `Your pre-session task · ${EVENT.name}` },
  // For confirmed attendees, reached from their own confirmation. Indexing it
  // would put a form in search results that only twenty people should ever see.
  robots: { index: false, follow: false },
};

export default function PrepPage() {
  return (
    <section className="relative px-5 pb-20 pt-32 sm:px-8 sm:pb-28 sm:pt-40 lg:px-10 lg:pt-44 xl:px-16">
      <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-[1fr_340px] lg:items-start lg:gap-16 xl:gap-20">
        <div className="max-w-2xl">
          <div className="eyebrow eyebrow-accent">{`Before ${eventDateLong()}`}</div>
          <h1 className="mt-4 text-balance text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
            {'Your pre-session task'}
          </h1>
          <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-ink-soft sm:text-base">
            <p>
              {'One workflow, three facts about it, about two minutes. This is what turns the second hour from an exercise about AI into an exercise about your business.'}
            </p>
            <p>
              {'Be straight with the numbers. Nobody is being marked, and a rough honest estimate scores better than a confident invented one.'}
            </p>
            <p className="font-semibold text-ink">
              {'This gets used live, in the room, on the day.'}
            </p>
          </div>

          <div className="mt-10 sm:mt-12">
            <PrepForm />
          </div>

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
          <EventFactsCard />
        </div>
      </div>
    </section>
  );
}

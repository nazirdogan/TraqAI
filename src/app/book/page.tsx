import type { Metadata } from 'next';
import Link from 'next/link';
import BookViewTracker from '@/components/analytics/BookViewTracker';
import { COMPANY } from '@/lib/constants';

export const metadata: Metadata = {
  title: { absolute: 'Book a call · Traq Collective' },
  description:
    'Book a free call with Traq Collective. In one call, we will find where AI can save your team the most time. No deck, no obligation.',
  alternates: { canonical: 'https://traqcollective.com/book' },
};

// ASSET DEPENDENCY (spec section 12): real scheduler link.
// Set NEXT_PUBLIC_BOOKING_URL on Vercel (a Cal.com or Calendly inline embed URL)
// and this page renders the scheduler. Until then it shows a friendly fallback
// that still lets people reach us, so /book is never a dead end.
const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL;

export default function BookPage() {
  return (
    <section className="relative px-5 pb-20 pt-32 sm:px-8 sm:pb-28 sm:pt-40">
      <BookViewTracker />
      <div className="mx-auto max-w-3xl text-center">
        <div className="eyebrow eyebrow-accent">Book a call</div>
        <h1 className="mt-4 text-balance text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl md:text-5xl">
          In one call, we&rsquo;ll find where AI can save your team the most time.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-ink-soft sm:mt-5 sm:text-base md:text-[17px]">
          Pick a time that works for you. No deck, no obligation. We&rsquo;ll come ready to talk
          about your team, your tools, and where AI fits.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-4xl sm:mt-14">
        {BOOKING_URL ? (
          <div className="overflow-hidden rounded-[24px] border border-border-subtle bg-white shadow-card">
            <iframe
              src={BOOKING_URL}
              title="Book a call with Traq Collective"
              className="h-[80vh] min-h-[640px] w-full"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="rounded-[24px] border border-border-subtle bg-bg-subtle p-8 text-center shadow-card sm:p-12">
            {/* TODO: set NEXT_PUBLIC_BOOKING_URL on Vercel to a Cal.com/Calendly
                inline-embed URL. Until then, route bookings through email so we
                never lose a lead. */}
            <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              Let&rsquo;s find a time.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-ink-soft">
              Our live scheduler is being set up. In the meantime, email us and we&rsquo;ll get a
              call in the diary within a day. Tell us a bit about your team and a couple of times
              that suit you.
            </p>
            <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <a
                href={`mailto:${COMPANY.email}?subject=Booking%20a%20call%20with%20Traq`}
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-traq-purple px-5 py-3.5 text-sm font-semibold text-white shadow-card transition-all hover:-translate-y-px hover:bg-traq-purple-ink hover:shadow-cardHover active:scale-[0.98]"
              >
                Email {COMPANY.email}
                <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                  &rarr;
                </span>
              </a>
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2.5 rounded-full border border-border-strong bg-white px-5 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-traq-purple hover:text-traq-purple"
              >
                Use the contact form instead
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="mx-auto mt-10 max-w-4xl text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-traq-purple transition-colors hover:text-traq-purple-ink"
        >
          <span aria-hidden="true">&larr;</span>
          Back to home
        </Link>
      </div>
    </section>
  );
}

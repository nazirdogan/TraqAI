import type { Metadata } from 'next';
import Link from 'next/link';
import PreCallForm from './PreCallForm';

export const metadata: Metadata = {
  title: { absolute: 'Before your call · Traq Collective' },
  description: 'Help us prepare for your call. Five quick questions — takes less than 90 seconds.',
  robots: { index: false, follow: false },
};

export default function PreCallPage() {
  return (
    <section className="relative px-5 pb-20 pt-32 sm:px-8 sm:pb-28 sm:pt-40">
      <div className="mx-auto max-w-2xl">
        <div className="eyebrow eyebrow-accent">Before your call</div>
        <h1 className="mt-4 text-balance text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
          Help us show up prepared.
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-soft sm:text-base">
          Five quick questions so we can make the most of your time. No right or wrong answers —
          just context that helps us come ready.
        </p>

        <div className="mt-10 sm:mt-12">
          <PreCallForm />
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-traq-purple transition-colors hover:text-traq-purple-ink"
          >
            <span aria-hidden="true">&larr;</span>
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}

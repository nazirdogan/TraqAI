import Link from 'next/link';
import { SERVICES } from '@/lib/constants';
import ServiceIcon from '@/components/ui/ServiceIcon';

/**
 * OtherServices — the bottom-of-page cross-link band on each service page.
 * Replaces the old generic "Related / Keep reading" links. It reads the four
 * canonical services from the shared registry and renders the other three
 * (everything except the page you are on) as real service cards, so the set is
 * always correct per page with no hand-maintained lists.
 */
type Props = {
  /** The slug of the current service page, e.g. "ai-training". Omit on non-service pages to show all four. */
  currentSlug?: string;
};

export default function OtherServices({ currentSlug }: Props) {
  const others = SERVICES.filter((s) => s.slug !== currentSlug);
  if (!others.length) return null;
  // A normal service page shows the other three in a 3-col row. The embedded-
  // partner page is not one of the four, so it shows all four in a 4-col row.
  const colClass = others.length >= 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3';

  return (
    <section className="bg-bg-base px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="eyebrow eyebrow-accent">Other services</div>
        <h2 className="section-title mt-3">The rest of what we do</h2>
        <p className="section-sub mt-4">
          Most teams combine two or three of these into one engagement. Here are the others.
        </p>

        <div className={`mt-9 grid grid-cols-1 gap-5 sm:mt-10 sm:gap-6 ${colClass}`}>
          {others.map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}`} className="service-card group h-full">
              <div className="service-icon" aria-hidden="true">
                <ServiceIcon slug={s.slug} />
              </div>
              <h3 className="text-[17px] font-semibold leading-snug tracking-tight text-ink sm:text-lg">
                {s.title}
              </h3>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-soft sm:text-[14.5px]">
                {s.tagline}
              </p>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[14px] font-semibold text-traq-purple transition-colors group-hover:text-traq-purple-ink">
                Explore
                <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                  &rarr;
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

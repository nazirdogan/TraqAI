import Link from 'next/link';

type CtaStripProps = {
  /** Headline. Keep it short and concrete. */
  heading?: string;
  /** One-line supporting copy under the heading. */
  sub?: string;
  /** Primary CTA label. */
  ctaLabel?: string;
  /** Where the primary CTA points. Defaults to /book per the offer flow. */
  ctaHref?: string;
};

/**
 * Reusable "Book a call" band for the Phase 2 SEO pages.
 *
 * Light and flat, reusing the Phase 1 .cta-panel surface (solid pale-purple,
 * hairline border, no gradient). Server component: the CTA is a plain Link, so
 * the strip works on every server-rendered page without client JS. Home-page
 * analytics tracking stays in the client CTABanner; this primitive favours
 * reach and zero runtime over event firing.
 */
export default function CtaStrip({
  heading = 'Find where AI saves your team the most time.',
  sub = 'Book a free call. No deck, no obligation.',
  ctaLabel = 'Book a free call',
  ctaHref = '/book',
}: CtaStripProps) {
  return (
    <section className="relative bg-bg-base px-5 pb-20 pt-12 sm:px-8 sm:pb-28 sm:pt-16">
      <div className="mx-auto max-w-5xl">
        <div className="cta-panel">
          <div className="eyebrow eyebrow-accent">Book a call</div>
          <h2 className="mx-auto mt-4 max-w-2xl text-balance text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-3xl md:text-4xl">
            {heading}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-ink-soft sm:mt-5 sm:text-base md:text-[17px]">
            {sub}
          </p>

          <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3.5">
            <Link
              href={ctaHref}
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-traq-purple px-5 py-3.5 text-sm font-semibold text-white shadow-card transition-all hover:-translate-y-px hover:bg-traq-purple-ink hover:shadow-cardHover active:scale-[0.98]"
            >
              {ctaLabel}
              <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                &rarr;
              </span>
            </Link>
            <a
              href="mailto:hello@traqcollective.com"
              className="inline-flex items-center justify-center gap-2.5 rounded-full border border-border-strong bg-white px-5 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-traq-purple hover:text-traq-purple"
            >
              hello@traqcollective.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

import type { ReactNode } from 'react';
import Link from 'next/link';
import Breadcrumbs from '@/components/page/Breadcrumbs';
import HeroDoodle from '@/components/ui/HeroDoodle';
import type { BreadcrumbItem } from '@/lib/seo/schema';

type PageHeroProps = {
  /** Small uppercase label above the H1. */
  eyebrow: string;
  /** The page H1. */
  h1: string;
  /**
   * The standalone, definition-first answer paragraph (40-60 words).
   * Rendered directly under the H1 so it is the first extractable block on the page.
   */
  intro: string;
  /** Breadcrumb trail. Rendered visibly above the eyebrow; schema is emitted by the page. */
  breadcrumbs?: BreadcrumbItem[];
  /** Primary CTA label. Defaults to "Book a free call". */
  ctaLabel?: string;
  /** Where the primary CTA points. Defaults to /book per the offer flow. */
  ctaHref?: string;
  /** Optional secondary outline link (label + href). */
  secondary?: { label: string; href: string };
  /**
   * Right-column visual. Pass a `motif` to pick the built-in "field notes"
   * HeroDoodle, or pass a custom `visual` node (e.g. a photo) to override it.
   * Shown from lg+ so mobile stays lean.
   */
  motif?: string;
  visual?: ReactNode;
};

/**
 * Shared page hero for the Phase 2 SEO pages.
 *
 * Light, flat, gradient-free, matching the Phase 1 system: eyebrow + H1 +
 * a standalone intro paragraph slot, with a solid-purple "Book a call" CTA.
 * Server component (no client JS); the CTA is a plain Link so it works
 * everywhere without hydration.
 */
export default function PageHero({
  eyebrow,
  h1,
  intro,
  breadcrumbs,
  ctaLabel = 'Book a free call',
  ctaHref = '/book',
  secondary,
  motif = 'notebook',
  visual,
}: PageHeroProps) {
  return (
    <section className="paper-grid relative bg-bg-base px-5 pb-14 pt-32 sm:px-8 sm:pb-16 sm:pt-40">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        {/* Left: copy */}
        <div className="max-w-2xl">
          {breadcrumbs && breadcrumbs.length > 0 ? (
            <Breadcrumbs items={breadcrumbs} className="mb-6" />
          ) : null}

          <p className="eyebrow eyebrow-accent">{eyebrow}</p>

          <h1 className="mt-4 text-balance text-[clamp(28px,4.6vw,40px)] font-bold leading-[1.1] tracking-tight text-ink">
            {h1}
          </h1>

          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-soft sm:text-[17px] [text-wrap:pretty]">
            {intro}
          </p>

          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Link
              href={ctaHref}
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-traq-purple px-7 py-3.5 text-sm font-semibold text-white shadow-card transition-all hover:-translate-y-px hover:bg-traq-purple-ink hover:shadow-cardHover active:scale-[0.98]"
            >
              {ctaLabel}
              <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                &rarr;
              </span>
            </Link>
            {secondary ? (
              <Link
                href={secondary.href}
                className="inline-flex items-center justify-center gap-2.5 rounded-full border border-border-strong bg-white px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-traq-purple hover:text-traq-purple-ink"
              >
                {secondary.label}
              </Link>
            ) : null}
          </div>
        </div>

        {/* Right: visual (custom node, else the per-page field-notes doodle). lg+ only. */}
        <div className="hidden lg:block">{visual ?? <HeroDoodle motif={motif} />}</div>
      </div>
    </section>
  );
}

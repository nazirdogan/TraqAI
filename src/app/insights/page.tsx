import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/page/PageHero';
import CtaStrip from '@/components/page/CtaStrip';
import { BreadcrumbsJsonLd } from '@/components/seo/JsonLd';
import type { BreadcrumbItem } from '@/lib/seo/schema';
import { ARTICLES } from '@/lib/content/insights';

const PATH = '/insights';
const CANONICAL = `https://traqcollective.com${PATH}`;

export const metadata: Metadata = {
  title: 'Insights: practical guides to AI adoption | Traq Collective',
  description:
    'Plain-language guides on getting your team using AI, AI readiness, agentic workflows and AI training. Sourced, practical and written for teams that want results, not theory.',
  alternates: { canonical: CANONICAL },
  keywords: [
    'AI adoption guides',
    'AI readiness',
    'AI training for teams',
    'agentic AI',
    'AI consulting insights',
  ],
  openGraph: {
    title: 'Insights | Traq Collective',
    description:
      'Practical, sourced guides on AI adoption, readiness, training and agentic workflows.',
    url: CANONICAL,
  },
};

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', url: '/' },
  { name: 'Insights', url: PATH },
];

/**
 * Format an ISO date ("2026-06-10") as "10 June 2026", parsed as UTC so the
 * shown date is locale-stable and never shifts by timezone.
 */
function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export default function InsightsIndexPage() {
  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbItems} />

      <PageHero
        eyebrow="Insights"
        h1="Practical guides to getting AI working in your team"
        intro="Insights is our library of sourced, plain-language guides on AI adoption: how to get your team using the tools, how to tell if you are ready, what good training looks like, and how agentic workflows actually run. Written for teams that want results, not theory."
        breadcrumbs={breadcrumbItems}
        secondary={{ label: 'See our services', href: '/services' }}
      />

      <section className="bg-bg-base px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-4xl">
          {ARTICLES.length === 0 ? (
            <div className="rounded-[20px] border border-border-subtle bg-white p-8 text-center shadow-card sm:p-12">
              <h2 className="text-xl font-semibold text-ink sm:text-2xl">Guides are on the way</h2>
              <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-ink-soft sm:text-[16px]">
                We are publishing our first cornerstone guides now. In the meantime, you can see how
                we work or book a free call to find where AI saves your team the most time.
              </p>
              <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/book"
                  className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-traq-purple px-6 py-3.5 text-sm font-semibold text-white shadow-card transition-all hover:-translate-y-px hover:bg-traq-purple-ink hover:shadow-cardHover active:scale-[0.98]"
                >
                  Book a free call
                  <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                    &rarr;
                  </span>
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-2.5 rounded-full border border-border-strong bg-white px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-traq-purple hover:text-traq-purple"
                >
                  See our services
                </Link>
              </div>
            </div>
          ) : (
            <ul className="space-y-4 sm:space-y-5">
              {ARTICLES.map((article) => (
                <li key={article.slug}>
                  <Link
                    href={`/insights/${article.slug}`}
                    className="group block rounded-[20px] border border-border-subtle bg-white p-6 shadow-card transition-colors hover:border-border-strong sm:p-7"
                  >
                    <p className="text-[12px] text-ink-faint">{formatDate(article.dateModified)}</p>
                    <h2 className="mt-2 text-lg font-semibold leading-snug text-ink transition-colors group-hover:text-traq-purple sm:text-xl">
                      {article.h1}
                    </h2>
                    <p className="mt-3 text-[14px] leading-relaxed text-ink-soft sm:text-[15px]">
                      {article.intro}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-traq-purple">
                      Read the guide
                      <span
                        className="transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      >
                        &rarr;
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <CtaStrip />
    </>
  );
}

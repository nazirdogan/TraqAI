import Link from 'next/link';
import Breadcrumbs from '@/components/page/Breadcrumbs';
import FaqBlock from '@/components/page/FaqBlock';
import CtaStrip from '@/components/page/CtaStrip';
import {
  BlogPostingJsonLd,
  BreadcrumbsJsonLd,
  FaqPageJsonLd,
} from '@/components/seo/JsonLd';
import type { BreadcrumbItem, Qa } from '@/lib/seo/schema';
import type { Article } from '@/lib/content/insights';
import ComparisonTable from '@/components/content/ComparisonTable';

/**
 * Format an ISO date ("2026-06-10") as a readable, locale-stable string
 * ("10 June 2026"). Parsed as UTC so the visible date never shifts by timezone.
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

type ArticleLayoutProps = {
  article: Article;
};

/**
 * Shared layout for every /insights guide.
 *
 * Renders the full AEO scaffold from one Article object: breadcrumb, H1, an
 * author byline ("By Nazir Dogan" linking /about) with a visible "Last updated"
 * date, the definition-first intro, query-matched sections, optional comparison
 * tables, cited stats, related internal links, an FAQ block and a Book a call
 * CtaStrip. It also injects the BlogPosting + BreadcrumbList + FAQPage JSON-LD,
 * each mirroring the visible content.
 *
 * Server component (no client JS): the FaqBlock uses native <details>, so the
 * whole article ships zero runtime and lands fully in the HTML for crawlers and
 * AI search.
 */
export default function ArticleLayout({ article }: ArticleLayoutProps) {
  const breadcrumbItems: BreadcrumbItem[] = [
    { name: 'Home', url: '/' },
    { name: 'Insights', url: '/insights' },
    { name: article.h1, url: `/insights/${article.slug}` },
  ];

  const faqQas: Qa[] = article.faqs.map((faq) => ({ q: faq.q, a: faq.a }));

  return (
    <>
      <BlogPostingJsonLd
        headline={article.h1}
        description={article.metaDescription}
        url={`/insights/${article.slug}`}
        datePublished={article.datePublished}
        dateModified={article.dateModified}
        authorName={article.author}
      />
      <BreadcrumbsJsonLd items={breadcrumbItems} />
      <FaqPageJsonLd qas={faqQas} />

      <article>
        <header className="bg-bg-base px-5 pb-10 pt-32 sm:px-8 sm:pb-12 sm:pt-40">
          <div className="mx-auto max-w-3xl">
            <Breadcrumbs items={breadcrumbItems} className="mb-6" />

            <p className="eyebrow eyebrow-accent">Insights</p>

            <h1 className="mt-4 text-balance text-3xl font-bold leading-[1.08] tracking-tight text-ink sm:text-4xl md:text-[2.75rem]">
              {article.h1}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-ink-faint">
              <span>
                By{' '}
                <Link
                  href="/about"
                  className="font-medium text-ink-soft underline-offset-4 transition-colors hover:text-traq-purple hover:underline"
                  rel="author"
                >
                  Nazir Dogan
                </Link>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Last updated:{' '}
                <time dateTime={article.dateModified} className="font-medium text-ink-soft">
                  {formatDate(article.dateModified)}
                </time>
              </span>
            </div>

            <p className="mt-6 text-[15px] leading-relaxed text-ink-soft sm:text-[17px] [text-wrap:pretty]">
              {article.intro}
            </p>
          </div>
        </header>

        <section className="bg-bg-base px-5 pb-16 pt-4 sm:px-8 sm:pb-20">
          <div className="mx-auto max-w-3xl space-y-14 sm:space-y-16">
            {article.bodySections.map((section) => (
              <div key={section.h2}>
                <h2 className="section-title max-w-2xl">{section.h2}</h2>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-soft sm:text-[17px]">
                  {section.body}
                </p>
                {section.points ? (
                  <ul className="mt-6 space-y-3">
                    {section.points.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <span
                          className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-traq-purple"
                          aria-hidden="true"
                        />
                        <span className="text-[15px] leading-relaxed text-ink-soft">{point}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        {article.tables && article.tables.length > 0 ? (
          <section className="bg-bg-subtle px-5 py-16 sm:px-8 sm:py-20">
            <div className="mx-auto max-w-3xl space-y-12 sm:space-y-14">
              {article.tables.map((table) => (
                <ComparisonTable key={table.heading} table={table} />
              ))}
            </div>
          </section>
        ) : null}

        {article.stats && article.stats.length > 0 ? (
          <section className="bg-bg-base px-5 py-16 sm:px-8 sm:py-20">
            <div className="mx-auto max-w-3xl">
              <div className="eyebrow eyebrow-accent">The evidence</div>
              <h2 className="section-title mt-3">What the research shows</h2>
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                {article.stats.map((stat) => (
                  <div
                    key={stat.claim}
                    className="rounded-[18px] border border-border-subtle bg-white p-5 shadow-card sm:p-6"
                  >
                    <div className="text-2xl font-bold tracking-tight text-traq-purple sm:text-3xl">
                      {stat.value}
                    </div>
                    <p className="mt-2 text-[14px] leading-relaxed text-ink-soft sm:text-[15px]">
                      {stat.claim}
                    </p>
                    <p className="mt-3 text-[12px] text-ink-faint">
                      <a
                        href={stat.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline-offset-4 transition-colors hover:text-traq-purple hover:underline"
                      >
                        {stat.source}, {stat.year}
                      </a>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="bg-bg-subtle px-5 py-14 sm:px-8 sm:py-16">
          <div className="mx-auto max-w-3xl">
            <div className="eyebrow eyebrow-accent">Related</div>
            <h2 className="section-title mt-3">Keep reading</h2>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
              {article.related.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center justify-between gap-3 rounded-[18px] border border-border-subtle bg-white px-5 py-5 shadow-card transition-colors hover:border-border-strong"
                >
                  <span className="text-[15px] font-semibold leading-snug text-ink">
                    {link.label}
                  </span>
                  <span
                    className="flex-none text-traq-purple transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </article>

      <FaqBlock qas={faqQas} heading="Common questions" />

      <CtaStrip />
    </>
  );
}

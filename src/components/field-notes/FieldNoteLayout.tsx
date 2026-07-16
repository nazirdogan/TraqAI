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
import type { FieldNote } from '@/lib/content/field-notes';

/**
 * Format an ISO date ("2026-07-16") as "16 July 2026", parsed as UTC so the
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

type FieldNoteLayoutProps = {
  note: FieldNote;
};

/**
 * Shared layout for every /field-notes post. Renders the full AEO scaffold from
 * one FieldNote object: breadcrumb, H1, author byline with a visible "Last
 * updated" date, the definition-first lead, body paragraphs, an optional cited
 * stat, a practical takeaway, related internal links, and an optional FAQ. It
 * also injects BlogPosting + BreadcrumbList (+ FAQPage when FAQs exist) JSON-LD,
 * each mirroring the visible content.
 *
 * Server component (no client JS): the FaqBlock uses native <details>, so the
 * whole note ships zero runtime and lands fully in the HTML for crawlers and AI
 * search.
 */
export default function FieldNoteLayout({ note }: FieldNoteLayoutProps) {
  const breadcrumbItems: BreadcrumbItem[] = [
    { name: 'Home', url: '/' },
    { name: 'Field notes', url: '/field-notes' },
    { name: note.h1, url: `/field-notes/${note.slug}` },
  ];

  const faqQas: Qa[] = (note.faqs ?? []).map((faq) => ({ q: faq.q, a: faq.a }));

  return (
    <>
      <BlogPostingJsonLd
        headline={note.h1}
        description={note.metaDescription}
        url={`/field-notes/${note.slug}`}
        datePublished={note.datePublished}
        dateModified={note.dateModified}
        authorName={note.author}
      />
      <BreadcrumbsJsonLd items={breadcrumbItems} />
      {faqQas.length > 0 ? <FaqPageJsonLd qas={faqQas} /> : null}

      <article>
        <header className="bg-bg-base px-5 pb-8 pt-32 sm:px-8 sm:pb-10 sm:pt-40">
          <div className="mx-auto max-w-3xl">
            <Breadcrumbs items={breadcrumbItems} className="mb-6" />

            <p className="eyebrow eyebrow-accent">Field note</p>

            <h1 className="mt-4 text-balance text-3xl font-bold leading-[1.08] tracking-tight text-ink sm:text-4xl">
              {note.h1}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-ink-faint">
              <span>
                By{' '}
                <Link
                  href="/about"
                  className="font-medium text-ink-soft underline-offset-4 transition-colors hover:text-traq-purple hover:underline"
                  rel="author"
                >
                  {note.author}
                </Link>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Last updated:{' '}
                <time dateTime={note.dateModified} className="font-medium text-ink-soft">
                  {formatDate(note.dateModified)}
                </time>
              </span>
            </div>

            <p className="mt-6 text-[16px] font-medium leading-relaxed text-ink sm:text-[18px] [text-wrap:pretty]">
              {note.dek}
            </p>
          </div>
        </header>

        <section className="bg-bg-base px-5 pb-14 pt-2 sm:px-8 sm:pb-16">
          <div className="mx-auto max-w-3xl">
            <p className="text-[15px] leading-relaxed text-ink-soft sm:text-[17px] [text-wrap:pretty]">
              {note.intro}
            </p>

            <div className="mt-6 space-y-5">
              {note.body.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-[15px] leading-relaxed text-ink-soft sm:text-[17px]"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {note.stat ? (
              <div className="mt-8 rounded-[18px] border border-border-subtle bg-white p-5 shadow-card sm:p-6">
                <div className="text-2xl font-bold tracking-tight text-traq-purple sm:text-3xl">
                  {note.stat.value}
                </div>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-soft sm:text-[15px]">
                  {note.stat.claim}
                </p>
                <p className="mt-3 text-[12px] text-ink-faint">
                  <a
                    href={note.stat.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-4 transition-colors hover:text-traq-purple hover:underline"
                  >
                    {note.stat.source}, {note.stat.year}
                  </a>
                </p>
              </div>
            ) : null}

            <div className="mt-8 rounded-[18px] border-l-4 border-traq-purple bg-bg-subtle px-5 py-5 sm:px-6">
              <p className="eyebrow eyebrow-accent">The takeaway</p>
              <p className="mt-2 text-[15px] font-medium leading-relaxed text-ink sm:text-[16px]">
                {note.takeaway}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-bg-subtle px-5 py-12 sm:px-8 sm:py-14">
          <div className="mx-auto max-w-3xl">
            <div className="eyebrow eyebrow-accent">Related</div>
            <h2 className="section-title mt-3">Go deeper</h2>
            <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              {note.related.map((link) => (
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

      {faqQas.length > 0 ? <FaqBlock qas={faqQas} heading="Common questions" /> : null}

      <CtaStrip />
    </>
  );
}

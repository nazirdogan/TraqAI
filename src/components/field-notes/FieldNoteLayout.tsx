import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/page/Breadcrumbs';
import FaqBlock from '@/components/page/FaqBlock';
import CtaStrip from '@/components/page/CtaStrip';
import FieldNoteDiagramBlock from '@/components/field-notes/FieldNoteDiagram';
import ComparisonTable from '@/components/content/ComparisonTable';
import {
  BlogPostingJsonLd,
  BreadcrumbsJsonLd,
  FaqPageJsonLd,
} from '@/components/seo/JsonLd';
import type { BreadcrumbItem, Qa } from '@/lib/seo/schema';
import { isFieldNoteSection, type FieldNote } from '@/lib/content/field-notes';

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
        imageUrl={note.image?.src}
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
            {note.image ? (
              // Attribution renders visibly, not just in the JSON. Every image
              // here is openly licensed and most of those licences require the
              // credit to be shown, so it is part of the component rather than
              // something a future edit can quietly drop.
              <figure className="mb-8">
                <Image
                  src={note.image.src}
                  alt={note.image.alt}
                  width={note.image.width}
                  height={note.image.height}
                  className="w-full rounded-[18px] border border-border-subtle object-cover"
                  sizes="(min-width: 768px) 768px, 100vw"
                  priority
                />
                <figcaption className="mt-2 text-[12px] text-ink-faint">
                  Photo by{' '}
                  <a
                    href={note.image.creditUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="underline-offset-4 hover:text-traq-purple hover:underline"
                  >
                    {note.image.credit}
                  </a>{' '}
                  via {note.image.source}, licensed under{' '}
                  <a
                    href={note.image.licenseUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow license"
                    className="underline-offset-4 hover:text-traq-purple hover:underline"
                  >
                    {note.image.license}
                  </a>
                  .
                </figcaption>
              </figure>
            ) : null}

            <p className="text-[15px] leading-relaxed text-ink-soft sm:text-[17px] [text-wrap:pretty]">
              {note.intro}
            </p>

            {note.diagram ? <FieldNoteDiagramBlock diagram={note.diagram} /> : null}

            <div className="mt-6 space-y-5">
              {note.body.map((item, index) =>
                isFieldNoteSection(item) ? (
                  // A headed section. The H2 is the extraction handle: AI search
                  // selects the passage under the heading that matches the query,
                  // so heading and paragraphs must ship as one block.
                  <section key={index} className="pt-3 first:pt-0">
                    <h2 className="text-[19px] font-bold leading-snug tracking-tight text-ink sm:text-[22px]">
                      {item.heading}
                    </h2>
                    <div className="mt-3 space-y-5">
                      {item.paragraphs.map((paragraph, pIndex) => (
                        <p
                          key={pIndex}
                          className="text-[15px] leading-relaxed text-ink-soft sm:text-[17px]"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </section>
                ) : (
                  <p
                    key={index}
                    className="text-[15px] leading-relaxed text-ink-soft sm:text-[17px]"
                  >
                    {item}
                  </p>
                )
              )}
            </div>

            {note.tables && note.tables.length > 0 ? (
              <div className="mt-10 space-y-10">
                {note.tables.map((table) => (
                  <ComparisonTable key={table.heading} table={table} />
                ))}
              </div>
            ) : null}

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

            {note.sources && note.sources.length > 0 ? (
              <div className="mt-8 border-t border-border-subtle pt-5">
                <p className="eyebrow">Sources</p>
                <ul className="mt-3 space-y-2">
                  {note.sources.map((source) => (
                    <li key={source.url} className="text-[13px] leading-relaxed text-ink-soft">
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-4 transition-colors hover:text-traq-purple"
                      >
                        {source.label}
                      </a>
                    </li>
                  ))}
                </ul>
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

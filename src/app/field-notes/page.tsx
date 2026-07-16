import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/page/PageHero';
import CtaStrip from '@/components/page/CtaStrip';
import { BreadcrumbsJsonLd } from '@/components/seo/JsonLd';
import type { BreadcrumbItem } from '@/lib/seo/schema';
import { FIELD_NOTES } from '@/lib/content/field-notes';

const PATH = '/field-notes';
const CANONICAL = `https://traqcollective.com${PATH}`;

export const metadata: Metadata = {
  title: 'Field notes: daily AI tips for SMBs | Traq Collective',
  description:
    'Short, practical field notes for small and mid-sized teams putting AI to work: how to adopt it, train people, make it stick, and pick the uses that pay off. Updated regularly.',
  alternates: { canonical: CANONICAL },
  keywords: [
    'AI tips for small business',
    'AI adoption tips',
    'AI for SMBs',
    'how to use AI at work',
    'AI training tips',
  ],
  openGraph: {
    title: 'Field notes | Traq Collective',
    description:
      'Short, practical field notes for teams putting AI to work: adoption, training, best uses, and making it stick.',
    url: CANONICAL,
  },
};

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', url: '/' },
  { name: 'Field notes', url: PATH },
];

/** Format an ISO date ("2026-07-16") as "16 July 2026", parsed as UTC. */
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

export default function FieldNotesIndexPage() {
  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbItems} />

      <PageHero
        eyebrow="Field notes"
        h1="Field notes: putting AI to work, one idea at a time"
        intro="Short, practical notes for small and mid-sized teams adopting AI: how to get people using it, what to train them on, the uses that pay off first, and how to make new habits stick. For the deeper playbooks, see our Insights guides."
        breadcrumbs={breadcrumbItems}
        secondary={{ label: 'Read the guides', href: '/insights' }}
      />

      <section className="bg-bg-base px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-4xl">
          {FIELD_NOTES.length === 0 ? (
            <div className="rounded-[20px] border border-border-subtle bg-white p-8 text-center shadow-card sm:p-12">
              <h2 className="text-xl font-semibold text-ink sm:text-2xl">First notes are on the way</h2>
              <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-ink-soft sm:text-[16px]">
                We are starting our daily field notes now. In the meantime, our Insights guides cover
                the same ground in depth.
              </p>
              <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/insights"
                  className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-traq-purple px-6 py-3.5 text-sm font-semibold text-white shadow-card transition-all hover:-translate-y-px hover:bg-traq-purple-ink hover:shadow-cardHover active:scale-[0.98]"
                >
                  Read the guides
                  <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                    &rarr;
                  </span>
                </Link>
              </div>
            </div>
          ) : (
            <ul className="space-y-4 sm:space-y-5">
              {FIELD_NOTES.map((note) => (
                <li key={note.slug}>
                  <Link
                    href={`/field-notes/${note.slug}`}
                    className="group block rounded-[20px] border border-border-subtle bg-white p-6 shadow-card transition-colors hover:border-border-strong sm:p-7"
                  >
                    <p className="text-[12px] text-ink-faint">{formatDate(note.dateModified)}</p>
                    <h2 className="mt-2 text-lg font-semibold leading-snug text-ink transition-colors group-hover:text-traq-purple sm:text-xl">
                      {note.h1}
                    </h2>
                    <p className="mt-3 text-[14px] leading-relaxed text-ink-soft sm:text-[15px]">
                      {note.dek}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-traq-purple">
                      Read the note
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

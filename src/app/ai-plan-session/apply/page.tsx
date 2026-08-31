import type { Metadata } from 'next';
import Link from 'next/link';
import { OG_IMAGE } from '@/lib/metadata';
import { BreadcrumbsJsonLd } from '@/components/seo/JsonLd';
import type { BreadcrumbItem } from '@/lib/seo/schema';
import ApplicationForm from './ApplicationForm';

const PATH = '/ai-plan-session/apply';
const CANONICAL = `https://traqcollective.com${PATH}`;

const SHORT_DESCRIPTION =
  'Apply for a seat at the 2027 AI Plan session: a free, two hour, in person working session in Dubai, capped at 20 seats. Every application is read personally.';

export const metadata: Metadata = {
  title: 'Apply for a seat: the 2027 AI Plan session',
  description: SHORT_DESCRIPTION,
  alternates: { canonical: CANONICAL },
  // The landing page at /ai-plan-session is the one that gets shared and
  // indexed. This is the form behind it: same subject, no extra content, so
  // indexing it would only split the signal between two near-identical pages.
  robots: { index: false, follow: true },
  openGraph: {
    images: [OG_IMAGE],
    title: 'Apply for a seat: the 2027 AI Plan session | Traq Collective',
    description: SHORT_DESCRIPTION,
    url: CANONICAL,
  },
};

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', url: '/' },
  { name: 'The 2027 AI Plan', url: '/ai-plan-session' },
  { name: 'Apply', url: PATH },
];

export default function AiPlanSessionPage() {
  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbItems} />

      <section className="relative px-5 pb-20 pt-32 sm:px-8 sm:pb-28 sm:pt-40">
        <div className="mx-auto max-w-2xl">
          <div className="eyebrow eyebrow-accent">Dubai · Two hours · In person</div>

          <h1 className="mt-4 text-balance text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
            {'Apply for a seat: the 2027 AI Plan session'}
          </h1>

          <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-ink-soft sm:text-base">
            <p>
              {'A free, two hour, in person working session in Dubai. You’ll leave with a scored, prioritised map of where AI actually saves your business hours and money in 2027, built on your own numbers, not a generic slide deck.'}
            </p>
            <p>
              {'This is not a sales pitch and not a product demo. You will do real work on your own business for two hours. If it makes sense to keep going afterwards, we’ll talk about that separately, not in the room.'}
            </p>
            <p className="font-semibold text-ink">{'Capped at 20 seats.'}</p>
          </div>

          <div className="mt-10 sm:mt-12">
            <ApplicationForm />
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/ai-plan-session"
              className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-traq-purple transition-colors hover:text-traq-purple-ink"
            >
              <span aria-hidden="true">&larr;</span>
              Back to the session details
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

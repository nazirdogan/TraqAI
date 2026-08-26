import type { Metadata } from 'next';
import { OG_IMAGE } from '@/lib/metadata';
import Link from 'next/link';
import PageHero from '@/components/page/PageHero';
import ContentSections from '@/components/page/ContentSections';
import FaqBlock from '@/components/page/FaqBlock';
import CtaStrip from '@/components/page/CtaStrip';
import {
  BreadcrumbsJsonLd,
  FaqPageJsonLd,
  LocalBusinessJsonLd,
  WebPageJsonLd,
} from '@/components/seo/JsonLd';
import { STATIC_REVIEWED_ISO } from '@/lib/seo/reviewed';
import type { BreadcrumbItem, Qa } from '@/lib/seo/schema';

const PATH = '/ai-consulting-uae';
const CANONICAL = `https://traqcollective.com${PATH}`;

export const metadata: Metadata = {
  title: 'AI Consulting for Small Business, UAE',
  description:
    'AI consulting and training in the UAE: in-person workshops in Dubai and Abu Dhabi, an embedded AI partner working with your team, and global delivery.',
  alternates: { canonical: CANONICAL },
  openGraph: {
      images: [OG_IMAGE],
    title: 'AI consulting and training in the UAE | Traq Collective',
    description:
      'In-person AI workshops in Dubai and Abu Dhabi, an embedded AI partner, and remote delivery worldwide.',
    url: CANONICAL,
  },
};

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', url: '/' },
  { name: 'AI consulting in the UAE', url: PATH },
];

const HERO = {
  eyebrow: 'UAE · in-person and remote',
  h1: 'AI consulting and training in the UAE',
  // Standalone, definition-first answer (40-60 words).
  intro:
    'Traq Collective is an AI consulting and training partner based in the UAE. We run in-person workshops for teams in Dubai and Abu Dhabi, embed as your AI partner, and wire AI into the tools you already pay for. Globally fluent and locally embedded, we also deliver remotely worldwide.',
};

type Section = { h2: string; body: string; points?: string[] };

const SECTIONS: Section[] = [
  {
    h2: 'AI training for UAE teams',
    body: 'We run hands-on, role-specific AI workshops on site with your team across Dubai, Abu Dhabi and the wider UAE. People practise on their own work, so they leave able to use AI in their job, not holding a certificate that changes nothing day to day.',
  },
  {
    h2: 'Why local context matters',
    body: 'AI rollout is not just a tooling problem; it is a people-and-process one. Being in the region means we understand how UAE teams actually work, can be in the room for the workshops that need it, and move at your pace, not a head office time zone away.',
  },
  {
    h2: 'How we work with UAE companies',
    body: 'We are not a generic certificate course or a slow enterprise consultancy. We start with a fast, fixed-scope audit, show value early, and embed with your team to make the change stick. You keep everything we build, and you can reach us directly on +971 50 868 7196.',
  },
];

// Traq vs the two alternatives UAE buyers usually weigh. Real table, high citation value.
const COMPARISON: { dimension: string; traq: string; certificate: string; enterprise: string }[] = [
  {
    dimension: 'Format',
    traq: 'In-person UAE workshops plus embedded follow-through',
    certificate: 'Generic online modules, same for everyone',
    enterprise: 'Slide decks and steering committees',
  },
  {
    dimension: 'Who delivers it',
    traq: 'A senior operator who builds with AI daily',
    certificate: 'A pre-recorded instructor you never meet',
    enterprise: 'A junior team on a partner markup',
  },
  {
    dimension: 'Outcome',
    traq: 'Your team using AI on real work by the end',
    certificate: 'A certificate that changes nothing day to day',
    enterprise: 'A strategy you still have to execute yourself',
  },
  {
    dimension: 'Speed to value',
    traq: 'A fixed-scope audit first, value in weeks',
    certificate: 'Self-paced, so most people never finish',
    enterprise: 'Months of discovery before anything ships',
  },
  {
    dimension: 'Cost',
    traq: 'Scoped to the work, priced after a free call',
    certificate: 'Cheap per seat, low return if unused',
    enterprise: 'Large fixed fees and long retainers',
  },
];

const RELATED: { label: string; href: string }[] = [
  { label: 'AI training for teams', href: '/services/ai-training' },
  { label: 'Embedded AI Partner', href: '/fractional-head-of-ai' },
  { label: 'All AI services', href: '/services' },
];

const FAQS: Qa[] = [
  {
    q: 'Do you run in-person AI workshops in Dubai?',
    a: 'Yes. We run in-person, hands-on AI workshops for teams in Dubai, Abu Dhabi and across the UAE. Sessions are built around your team’s real work and the tools you already use, so people leave able to apply AI in their role straight away.',
  },
  {
    q: 'Do you only work in the UAE?',
    a: 'No. We are based in the UAE and embedded locally, but we deliver training, consulting and implementation remotely for teams worldwide. The work is the same wherever your team sits; only the delivery format changes from in-person to remote.',
  },
  {
    q: 'How do I get in touch from the UAE?',
    a: 'Call or message us on +971 50 868 7196, or email hello@traqcollective.com, and we will set up a free call. In that call we find where AI saves your team the most time, with no deck and no obligation.',
  },
];

export default function AiConsultingUaePage() {
  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbItems} />
      <WebPageJsonLd
        name="AI consulting and training in the UAE"
        description="AI consulting and training in the UAE: in-person workshops in Dubai and Abu Dhabi, an embedded AI partner working with your team, and global delivery."
        url="/ai-consulting-uae"
        dateModified={STATIC_REVIEWED_ISO}
      />
      <LocalBusinessJsonLd />
      <FaqPageJsonLd qas={FAQS} />

      <PageHero
        eyebrow={HERO.eyebrow}
        h1={HERO.h1}
        intro={HERO.intro}
        breadcrumbs={breadcrumbItems}
        reviewedIso={STATIC_REVIEWED_ISO}
        motif="uae"
        secondary={{ label: 'See all services', href: '/services' }}
      />

      <ContentSections sections={SECTIONS} />

      {/* Traq vs certificate courses vs enterprise consultancies - comparison table */}
      <section className="bg-bg-subtle px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="eyebrow eyebrow-accent">Compare</div>
          <h2 className="section-title mt-3">
            How does Traq compare with certificate courses and big consultancies?
          </h2>
          <p className="section-sub mt-4">
            UAE teams usually weigh three options. Here is how an embedded partner differs from a
            generic certificate course and a slow enterprise consultancy.
          </p>

          <div className="mt-8 overflow-x-auto rounded-[20px] border border-border-subtle bg-white shadow-card">
            <table className="w-full border-collapse text-left text-[14px] sm:text-[15px]">
              <caption className="sr-only">
                Traq Collective compared with generic certificate courses and enterprise
                consultancies across format, delivery, outcome, speed and cost
              </caption>
              <thead>
                <tr className="border-b border-border-subtle bg-bg-subtle">
                  <th scope="col" className="px-5 py-4 font-semibold text-ink sm:px-6">
                    Consideration
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold text-ink sm:px-6">
                    Traq Collective
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold text-ink sm:px-6">
                    Certificate course
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold text-ink sm:px-6">
                    Enterprise consultancy
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr
                    key={row.dimension}
                    className="border-b border-border-subtle last:border-b-0 align-top"
                  >
                    <th
                      scope="row"
                      className="px-5 py-4 text-left font-semibold text-ink sm:px-6"
                    >
                      {row.dimension}
                    </th>
                    <td className="px-5 py-4 text-ink-soft sm:px-6">{row.traq}</td>
                    <td className="px-5 py-4 text-ink-soft sm:px-6">{row.certificate}</td>
                    <td className="px-5 py-4 text-ink-soft sm:px-6">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-bg-base px-5 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="eyebrow eyebrow-accent">Related</div>
          <h2 className="section-title mt-3">Keep reading</h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
            {RELATED.map((link) => (
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

      <FaqBlock
        qas={FAQS}
        heading="AI consulting in the UAE: common questions"
        intro="Short answers on in-person workshops, remote delivery and getting in touch."
      />

      <CtaStrip
        heading="Bring AI to your UAE team, the practical way."
        sub="Book a free call or reach us on +971 50 868 7196. No deck, no obligation."
      />
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/page/PageHero';
import FaqBlock from '@/components/page/FaqBlock';
import CtaStrip from '@/components/page/CtaStrip';
import {
  BreadcrumbsJsonLd,
  FaqPageJsonLd,
  LocalBusinessJsonLd,
} from '@/components/seo/JsonLd';
import type { BreadcrumbItem, Qa } from '@/lib/seo/schema';

const PATH = '/ai-consulting-uae';
const CANONICAL = `https://traqcollective.com${PATH}`;

export const metadata: Metadata = {
  title: 'AI consulting and training in the UAE',
  description:
    'AI consulting and training in the UAE: in-person workshops in Dubai and Abu Dhabi, a fractional Head of AI embedded with your team, and global delivery. Globally fluent, locally embedded.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'AI consulting and training in the UAE | Traq Collective',
    description:
      'In-person AI workshops in Dubai and Abu Dhabi, fractional Head of AI, and remote delivery worldwide.',
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
    'Traq Collective is an AI consulting and training partner based in the UAE. We run in-person workshops for teams in Dubai and Abu Dhabi, embed as a fractional Head of AI, and wire AI into the tools you already pay for. Globally fluent and locally embedded, we also deliver remotely worldwide.',
};

type Section = { h2: string; body: string; points?: string[] };

const SECTIONS: Section[] = [
  {
    h2: 'AI training for UAE teams',
    body: 'We run hands-on, role-specific AI workshops on site with your team across Dubai, Abu Dhabi and the wider UAE. People practise on their own work, so they leave able to use AI in their job rather than holding a certificate that changes nothing day to day.',
    points: [
      'In-person workshops in Dubai, Abu Dhabi and across the UAE',
      'Role-specific training on the tools your team already pays for',
      'A fractional Head of AI embedded with your leadership',
      'Implementation that wires AI into your real workflows',
    ],
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

const RELATED: { label: string; href: string }[] = [
  { label: 'AI training for teams', href: '/services/ai-training' },
  { label: 'Fractional Head of AI', href: '/fractional-head-of-ai' },
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
      <LocalBusinessJsonLd />
      <FaqPageJsonLd qas={FAQS} />

      <PageHero
        eyebrow={HERO.eyebrow}
        h1={HERO.h1}
        intro={HERO.intro}
        breadcrumbs={breadcrumbItems}
        secondary={{ label: 'See all services', href: '/services' }}
      />

      <section className="bg-bg-base px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl space-y-14 sm:space-y-16">
          {SECTIONS.map((section) => (
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

      <section className="bg-bg-base px-5 pb-16 sm:px-8 sm:pb-20">
        <div className="mx-auto max-w-3xl">
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

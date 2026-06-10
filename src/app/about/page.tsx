import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/page/PageHero';
import CtaStrip from '@/components/page/CtaStrip';
import {
  BreadcrumbsJsonLd,
  OrganizationJsonLd,
  PersonJsonLd,
} from '@/components/seo/JsonLd';
import type { BreadcrumbItem } from '@/lib/seo/schema';

const PATH = '/about';
const CANONICAL = `https://traqcollective.com${PATH}`;

export const metadata: Metadata = {
  title: 'About Traq Collective',
  description:
    'Traq Collective is a founder-led AI enablement partner. We are practitioners, not consultants: we build AI systems and train teams to use them every day, then make ourselves redundant. UAE and global.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'About Traq Collective',
    description:
      'Founder-led AI enablement. Practitioners, not consultants. We build, we train, and we make ourselves redundant.',
    url: CANONICAL,
  },
};

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', url: '/' },
  { name: 'About', url: PATH },
];

const HERO = {
  eyebrow: 'About',
  h1: 'About Traq Collective',
  // Standalone, definition-first answer (40-60 words).
  intro:
    'Traq Collective is a founder-led AI enablement partner. We help teams actually use the AI they already pay for: hands-on training, consulting as a fractional Head of AI, implementation, and agentic systems. We are practitioners, not consultants. We build, we train your people, then we make ourselves redundant. Based in the UAE, working worldwide.',
};

type Section = { h2: string; body: string };

const SECTIONS: Section[] = [
  {
    h2: 'Founder-led, by a practitioner',
    body: 'Traq Collective is led by its founder, Nazir, who builds AI systems and trains teams to use them every day. The work is hands-on and senior: you deal directly with someone who does this for real, not a junior analyst on a markup. That is the difference between advice and capability.',
  },
  {
    h2: 'What we have built',
    body: 'We do not just talk about autonomous AI; we run it. We operate a full autonomous operation end to end for a company we run, where AI agents handle the day-to-day work and escalate only what needs judgement. Everything we build for clients is grounded in what actually holds up in production.',
  },
  {
    h2: 'Practitioners, not consultants',
    body: 'Most AI consulting ends in a deck. We work inside your context and your tools, alongside your team, and we put a number on every engagement: hours saved, tools adopted, work shipped. We would rather show value early than sell a long retainer on a promise.',
  },
  {
    h2: 'We make ourselves redundant',
    body: 'The goal is capability your team keeps, not a dependency on us. We train your people, hand over what we build, and stay as much or as little as you want afterwards. Success is your team running and extending the work on their own.',
  },
];

const RELATED: { label: string; href: string }[] = [
  { label: 'All AI services', href: '/services' },
  { label: 'Fractional Head of AI', href: '/fractional-head-of-ai' },
  { label: 'AI consulting and training in the UAE', href: '/ai-consulting-uae' },
];

export default function AboutPage() {
  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbItems} />
      <OrganizationJsonLd />
      <PersonJsonLd />

      <PageHero
        eyebrow={HERO.eyebrow}
        h1={HERO.h1}
        intro={HERO.intro}
        breadcrumbs={breadcrumbItems}
        secondary={{ label: 'See how we work', href: '/#how-we-work' }}
      />

      <section className="bg-bg-base px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl space-y-14 sm:space-y-16">
          {SECTIONS.map((section) => (
            <div key={section.h2}>
              <h2 className="section-title max-w-2xl">{section.h2}</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-soft sm:text-[17px]">
                {section.body}
              </p>
            </div>
          ))}

          {/* ASSET DEPENDENCY (spec section 12): founder photo + full bio pending.
              Person JSON-LD references /founder/nazir.jpg; swap in the real asset
              and expand this bio when confirmed. Placeholder note kept visible-free
              so the page reads complete in the meantime. */}
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

      <CtaStrip
        heading="Let's find where AI saves your team the most time."
        sub="Book a free call. No deck, no obligation."
      />
    </>
  );
}

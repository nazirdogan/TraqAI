import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/page/PageHero';
import FaqBlock from '@/components/page/FaqBlock';
import CtaStrip from '@/components/page/CtaStrip';
import { BreadcrumbsJsonLd, FaqPageJsonLd, ServiceJsonLd } from '@/components/seo/JsonLd';
import type { BreadcrumbItem, Qa } from '@/lib/seo/schema';

const PATH = '/services/ai-consulting';
const CANONICAL = `https://traqcollective.com${PATH}`;

export const metadata: Metadata = {
  title: 'AI consulting that ends in adoption, not a deck',
  description:
    'AI consulting and strategy that acts as your fractional Head of AI: we audit your tools and workflows, find the highest-leverage uses, and give you a roadmap your team can act on. UAE and global.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'AI consulting and strategy | Traq Collective',
    description:
      'An AI consultant who delivers adoption, not a slide deck. Audit, roadmap, and senior direction embedded with your team.',
    url: CANONICAL,
  },
};

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', url: '/' },
  { name: 'Services', url: '/services' },
  { name: 'Consultation & Strategy', url: PATH },
];

const HERO = {
  eyebrow: 'Services · AI consulting',
  h1: 'AI consulting that ends in adoption, not a deck',
  // Standalone, definition-first answer (40-60 words).
  intro:
    'An AI consultant should leave you with a working capability, not a slide deck. Traq Collective acts as your fractional Head of AI: we audit your tools and workflows, find the uses that save the most time, and give you a prioritised roadmap your team can act on. Then we help you act on it.',
};

type Section = { h2: string; body: string; points?: string[] };

const SECTIONS: Section[] = [
  {
    h2: 'What an AI consultant should actually do',
    body: 'The job is not to recommend tools and disappear. It is to find where AI saves your team real hours, decide what to do first, and set the guardrails so people use it safely. We do that work alongside your team, in your tools, so the plan is grounded in how you actually operate.',
    points: [
      'An AI audit of your tools, workflows and where time is lost',
      'A prioritised roadmap, sequenced by payoff and effort',
      'Vendor and tooling decisions made for your context',
      'Senior direction embedded with your team, not from behind a deck',
    ],
  },
  {
    h2: 'How our AI strategy engagements work',
    body: 'We start with a fast, fixed-scope audit so you see value before any long commitment. From there we set the strategy, agree what we are moving, and put a number on it: hours saved, tools adopted, work shipped. You keep everything we build, and your team learns to run it.',
  },
  {
    h2: 'Consulting or a fractional Head of AI?',
    body: 'A short consulting engagement is right when you need direction and a plan. If you want that senior leadership on an ongoing basis, embedded part-time to set strategy and lead the rollout, that is our fractional Head of AI offer. Many teams start with a consult and move into the embedded role.',
  },
];

const RELATED: { label: string; href: string }[] = [
  { label: 'Fractional Head of AI', href: '/fractional-head-of-ai' },
  { label: 'Implementation & enablement', href: '/services/ai-implementation' },
  { label: 'All AI services', href: '/services' },
];

const FAQS: Qa[] = [
  {
    q: 'How is this different from a fractional Head of AI?',
    a: 'A consulting engagement is scoped and time-bound: audit, strategy and a roadmap. A fractional Head of AI is the same senior leadership delivered on an ongoing, embedded basis, setting direction and leading the rollout part-time. Many teams begin with a consult and move into the embedded role once there is a plan.',
  },
  {
    q: 'What do I get at the end of an AI consulting engagement?',
    a: 'You get a prioritised roadmap grounded in your real tools and workflows: where AI saves the most time, what to do first, which tools to use, and the guardrails to use them safely. Crucially you get a plan your team can act on, with the value already shown, not a deck that gathers dust.',
  },
  {
    q: 'Do you work with UAE companies?',
    a: 'Yes. We are based in the UAE and work with teams across Dubai, Abu Dhabi and the wider region, and we deliver remotely worldwide. You can reach us on +971 50 868 7196 or at hello@traqcollective.com.',
  },
];

export default function AiConsultingPage() {
  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbItems} />
      <ServiceJsonLd
        name="AI consulting and strategy"
        description="AI consulting that acts as your fractional Head of AI: audit, prioritised roadmap, and senior direction embedded with your team. UAE and global."
        url={PATH}
        serviceType="AI consulting"
      />
      <FaqPageJsonLd qas={FAQS} />

      <PageHero
        eyebrow={HERO.eyebrow}
        h1={HERO.h1}
        intro={HERO.intro}
        breadcrumbs={breadcrumbItems}
        secondary={{ label: 'Fractional Head of AI', href: '/fractional-head-of-ai' }}
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
        heading="AI consulting: common questions"
        intro="Short answers on what consulting covers and how it differs from the fractional role."
      />

      <CtaStrip
        heading="Need a plan and senior direction on AI?"
        sub="Book a free call. We will find where AI saves your team the most time. No deck, no obligation."
      />
    </>
  );
}

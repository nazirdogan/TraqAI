import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/page/PageHero';
import FaqBlock from '@/components/page/FaqBlock';
import CtaStrip from '@/components/page/CtaStrip';
import ServiceIcon from '@/components/ui/ServiceIcon';
import { BreadcrumbsJsonLd, FaqPageJsonLd } from '@/components/seo/JsonLd';
import type { BreadcrumbItem, Qa } from '@/lib/seo/schema';

const PATH = '/services';
const CANONICAL = `https://traqcollective.com${PATH}`;

export const metadata: Metadata = {
  title: 'AI consulting services: training, strategy, implementation, agentic AI',
  description:
    'The four ways Traq Collective helps your team use AI: hands-on training, consulting as your embedded AI partner, implementation, and agentic systems. UAE and global.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'AI consulting services | Traq Collective',
    description:
      'Training, consulting and strategy, implementation, and agentic AI. Pick the service that fits where your team is today.',
    url: CANONICAL,
  },
};

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', url: '/' },
  { name: 'Services', url: PATH },
];

// Author this page's content here. No central registry.
const HERO = {
  eyebrow: 'AI training · consulting · implementation',
  h1: 'AI consulting services for teams that already pay for AI',
  // Standalone, definition-first answer (40-60 words).
  intro:
    'Traq Collective offers four services that get your team using AI well: hands-on training, consulting as your embedded AI partner, implementation into the tools you already pay for, and agentic systems that run on their own. Pick one, or combine them across a single engagement. We work in the UAE and worldwide.',
};

type ServiceCard = {
  title: string;
  href: string;
  query: string;
  body: string;
};

const SERVICES: ServiceCard[] = [
  {
    title: 'AI Training',
    href: '/services/ai-training',
    query: 'AI training for teams',
    body: 'Hands-on workshops built around your team’s real work. People leave knowing exactly how to use AI in their role, not just what it is. Role-specific, practical, and measured.',
  },
  {
    title: 'Consultation & Strategy',
    href: '/services/ai-consulting',
    query: 'AI consultant and strategy',
    body: 'We act as your embedded AI partner. We audit your tools and workflows, find the uses that save the most time, and give you a clear roadmap your team can act on.',
  },
  {
    title: 'Implementation & Enablement',
    href: '/services/ai-implementation',
    query: 'AI implementation and adoption',
    body: 'We wire AI into the tools and workflows you already pay for, with guardrails to use it safely. Then we make sure the team actually adopts it.',
  },
  {
    title: 'Agentic AI',
    href: '/services/agentic-ai',
    query: 'AI agents and agentic workflows',
    body: 'We build AI agents and agentic systems that run and improve on their own. We have built a full autonomous operation for a company we run end to end, and we can build yours.',
  },
];

// "Which service fits" comparison. Real table, high citation value.
const COMPARISON: { situation: string; service: string; href: string }[] = [
  {
    situation: 'Your team has the tools but does not use them',
    service: 'AI Training',
    href: '/services/ai-training',
  },
  {
    situation: 'You need a plan and senior direction on AI',
    service: 'Consultation & Strategy',
    href: '/services/ai-consulting',
  },
  {
    situation: 'You know what to do but need it built and adopted',
    service: 'Implementation & Enablement',
    href: '/services/ai-implementation',
  },
  {
    situation: 'You want workflows that run without a person in the loop',
    service: 'Agentic AI',
    href: '/services/agentic-ai',
  },
];

const RELATED: { label: string; href: string }[] = [
  { label: 'Embedded AI Partner', href: '/fractional-head-of-ai' },
  { label: 'AI consulting and training in the UAE', href: '/ai-consulting-uae' },
  { label: 'About Traq Collective', href: '/about' },
];

// Visible FAQ mirrors the FAQPage schema exactly.
const FAQS: Qa[] = [
  {
    q: 'What AI consulting services does Traq Collective offer?',
    a: 'We offer four services: AI training for teams, consultation and strategy as your embedded AI partner, implementation into the tools you already use, and agentic AI systems that run on their own. Most engagements combine two or three of these.',
  },
  {
    q: 'How do I choose the right service?',
    a: 'Start with where your team is. If you have tools but low adoption, begin with training. If you need direction, start with consultation. If you know the plan but lack the build, choose implementation. Unsure? Book a call and we will point you to the right one.',
  },
  {
    q: 'Can I combine more than one service?',
    a: 'Yes. Most teams do. A typical engagement audits your tools, trains your people, then wires AI into daily workflows. We scope it as one plan so the pieces connect and your team ends up owning the capability.',
  },
  {
    q: 'Do you work with teams outside the UAE?',
    a: 'Yes. We run in-person workshops across the UAE and deliver training, consulting, and implementation remotely worldwide. The work is the same wherever your team sits; only the delivery format changes.',
  },
];

export default function ServicesHubPage() {
  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbItems} />
      <FaqPageJsonLd qas={FAQS} />

      <PageHero
        eyebrow={HERO.eyebrow}
        h1={HERO.h1}
        intro={HERO.intro}
        breadcrumbs={breadcrumbItems}
        secondary={{ label: 'See how we work', href: '/#how-we-work' }}
      />

      {/* The four capabilities */}
      <section className="bg-bg-base px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="eyebrow eyebrow-accent">What we do</div>
          <h2 className="section-title mt-3 max-w-2xl">Four ways we help your team use AI</h2>
          <p className="section-sub mt-4">
            Each service stands on its own and links to its own page. Most teams combine two or
            three into one engagement.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6">
            {SERVICES.map((s) => (
              <Link key={s.href} href={s.href} className="service-card group">
                <div className="service-icon" aria-hidden="true">
                  <ServiceIcon slug={s.href.split('/').pop() ?? ''} />
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-ink sm:text-xl">
                  {s.title}
                </h3>
                <p className="mt-3 flex-1 text-[14px] leading-relaxed text-ink-soft sm:text-[15px]">
                  {s.body}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-traq-purple transition-colors group-hover:text-traq-purple-ink">
                  Explore {s.title}
                  <span
                    className="transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    &rarr;
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Which service fits - comparison table */}
      <section className="bg-bg-subtle px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="eyebrow eyebrow-accent">Choosing</div>
          <h2 className="section-title mt-3">Which AI service fits my team?</h2>
          <p className="section-sub mt-4">
            Match where your team is today to the service that moves you forward. If two rows fit,
            we scope them together.
          </p>

          <div className="mt-8 overflow-hidden rounded-[20px] border border-border-subtle bg-white shadow-card">
            <table className="w-full border-collapse text-left text-[14px] sm:text-[15px]">
              <caption className="sr-only">
                Map your situation to the right Traq Collective AI service
              </caption>
              <thead>
                <tr className="border-b border-border-subtle bg-bg-subtle">
                  <th scope="col" className="px-5 py-4 font-semibold text-ink sm:px-6">
                    If this sounds like you
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold text-ink sm:px-6">
                    Start with
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr
                    key={row.href}
                    className="border-b border-border-subtle last:border-b-0 align-top"
                  >
                    <td className="px-5 py-4 text-ink-soft sm:px-6">{row.situation}</td>
                    <td className="px-5 py-4 sm:px-6">
                      <Link
                        href={row.href}
                        className="font-semibold text-traq-purple transition-colors hover:text-traq-purple-ink"
                      >
                        {row.service}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Related pages - internal links, no dead ends */}
      <section className="bg-bg-base px-5 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="eyebrow eyebrow-accent">Related</div>
          <h2 className="section-title mt-3 max-w-2xl">Keep reading</h2>
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
        heading="AI consulting services: common questions"
        intro="Short answers on what each service covers and how to pick one."
      />

      <CtaStrip
        heading="Not sure which service you need? Let's work it out on a call."
        sub="In one call we will find where AI saves your team the most time. No deck, no obligation."
      />
    </>
  );
}

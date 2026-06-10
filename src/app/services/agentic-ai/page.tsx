import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/page/PageHero';
import FaqBlock from '@/components/page/FaqBlock';
import CtaStrip from '@/components/page/CtaStrip';
import { BreadcrumbsJsonLd, FaqPageJsonLd, ServiceJsonLd } from '@/components/seo/JsonLd';
import type { BreadcrumbItem, Qa } from '@/lib/seo/schema';

const PATH = '/services/agentic-ai';
const CANONICAL = `https://traqcollective.com${PATH}`;

export const metadata: Metadata = {
  title: 'Agentic AI and autonomous operations',
  description:
    'Agentic AI: we build AI agents and agentic workflows that run and improve on their own. We run a full autonomous operation end to end for a company, and we can build yours. UAE and global.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'Agentic AI and autonomous operations | Traq Collective',
    description:
      'AI agents and agentic systems that run and improve without a person in the loop. Built with you, not in a black box.',
    url: CANONICAL,
  },
};

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', url: '/' },
  { name: 'Services', url: '/services' },
  { name: 'Agentic AI', url: PATH },
];

const HERO = {
  eyebrow: 'Services · Agentic AI',
  h1: 'Agentic AI and autonomous operations',
  // Standalone, definition-first answer (40-60 words).
  intro:
    'Agentic AI is software that takes a goal and carries out multi-step work on its own, deciding and acting without a person in the loop. Traq Collective builds AI agents and agentic workflows that run and improve themselves. We run a full autonomous operation end to end for a company we operate, and we can build yours.',
};

type Section = { h2: string; body: string; points?: string[] };

// H2s phrased as real search queries for extractability.
const SECTIONS: Section[] = [
  {
    h2: 'What is agentic AI?',
    body: 'A chatbot answers when you ask. An AI agent is given a goal and carries out the steps to reach it: pulling data, making decisions, using tools, and handing off when something needs a person. Agentic workflows chain these agents together so whole processes run without someone driving each step.',
    points: [
      'AI agents that plan and execute multi-step work',
      'Agentic workflows where agents hand off to each other',
      'Autonomous, self-improving operations with people on the exceptions',
      'Built with you, in your context, not in a black box',
    ],
  },
  {
    h2: 'What does an autonomous operation look like in practice?',
    body: 'We do not just advise on this. We run a full autonomous operation end to end for a company we operate, where agents handle the day-to-day work and escalate only what needs judgement. That is the same kind of system we build for clients, grounded in what holds up in production rather than a slide deck.',
  },
  {
    h2: 'How do you build agentic workflows safely?',
    body: 'We start narrow, with one workflow that is well understood and high volume, prove it runs reliably, then expand. You keep visibility and control throughout, with clear guardrails and human checkpoints where they matter, so autonomy never means losing oversight.',
  },
];

// Agentic AI vs traditional automation (RPA / scripts). Real table for high
// citation value on "agentic AI vs automation" and "agents vs RPA" queries.
const COMPARISON: { dimension: string; agentic: string; rpa: string }[] = [
  {
    dimension: 'How work is defined',
    agentic: 'You give it a goal; it decides the steps',
    rpa: 'You script every step in advance',
  },
  {
    dimension: 'Handling the unexpected',
    agentic: 'Reasons through new cases and asks for help when unsure',
    rpa: 'Breaks the moment something falls outside the script',
  },
  {
    dimension: 'Unstructured input',
    agentic: 'Reads emails, documents and chat the way a person would',
    rpa: 'Needs clean, structured data in a fixed format',
  },
  {
    dimension: 'Improvement over time',
    agentic: 'Gets better as you feedback and refine the goals',
    rpa: 'Stays fixed until someone rewrites the script',
  },
  {
    dimension: 'Human role',
    agentic: 'People handle the exceptions and the judgement calls',
    rpa: 'People babysit failures and patch the rules',
  },
];

// Required internal links per the brief: ai-implementation and fractional-head-of-ai.
const RELATED: { label: string; href: string }[] = [
  { label: 'Implementation & enablement', href: '/services/ai-implementation' },
  { label: 'Fractional Head of AI', href: '/fractional-head-of-ai' },
  { label: 'All AI services', href: '/services' },
];

const FAQS: Qa[] = [
  {
    q: 'What is the difference between an AI agent and a chatbot?',
    a: 'A chatbot responds when prompted. An AI agent is given a goal and carries out the steps to reach it on its own, using tools, making decisions, and only escalating when something needs a person. Agentic workflows chain several agents so an entire process runs without someone driving each step.',
  },
  {
    q: 'Have you actually built an autonomous operation?',
    a: 'Yes. We run a full autonomous operation end to end for a company we operate, where AI agents handle the day-to-day work and escalate only what needs judgement. The systems we build for clients are grounded in what holds up in production, not a slide deck.',
  },
  {
    q: 'How is agentic AI different from traditional automation?',
    a: 'Traditional automation follows a script you write in advance and breaks when something falls outside it. Agentic AI takes a goal, reasons through the steps, reads messy real-world input, and asks for help when unsure. It improves as you refine the goals instead of waiting for a rewrite.',
  },
  {
    q: 'How do we stay in control of an autonomous system?',
    a: 'We start narrow, prove reliability on one workflow, then expand. Throughout, you keep visibility and control, with clear guardrails and human checkpoints where they matter. Autonomy handles the routine volume; your people stay on the exceptions and the decisions that need judgement.',
  },
];

export default function AgenticAiPage() {
  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbItems} />
      <ServiceJsonLd
        name="Agentic AI and autonomous operations"
        description="We build AI agents and agentic systems that run and improve on their own. We run a full autonomous operation end to end, and we can build yours. UAE and global."
        url={PATH}
        serviceType="Agentic AI"
      />
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

      {/* Agentic AI vs traditional automation - comparison table */}
      <section className="bg-bg-subtle px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="eyebrow eyebrow-accent">Compare</div>
          <h2 className="section-title mt-3">Agentic AI vs traditional automation</h2>
          <p className="section-sub mt-4">
            How AI agents differ from scripted automation like RPA, across how work gets defined,
            how each handles the unexpected, and where people fit.
          </p>

          <div className="mt-8 overflow-x-auto rounded-[20px] border border-border-subtle bg-white shadow-card">
            <table className="w-full border-collapse text-left text-[14px] sm:text-[15px]">
              <caption className="sr-only">
                Agentic AI compared with traditional scripted automation across how work is defined,
                handling the unexpected, unstructured input, improvement over time and the human role
              </caption>
              <thead>
                <tr className="border-b border-border-subtle bg-bg-subtle">
                  <th scope="col" className="px-5 py-4 font-semibold text-ink sm:px-6">
                    Consideration
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold text-ink sm:px-6">
                    Agentic AI
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold text-ink sm:px-6">
                    Traditional automation (RPA)
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr
                    key={row.dimension}
                    className="border-b border-border-subtle last:border-b-0 align-top"
                  >
                    <th scope="row" className="px-5 py-4 text-left font-semibold text-ink sm:px-6">
                      {row.dimension}
                    </th>
                    <td className="px-5 py-4 text-ink-soft sm:px-6">{row.agentic}</td>
                    <td className="px-5 py-4 text-ink-soft sm:px-6">{row.rpa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-bg-base px-5 py-14 sm:px-8 sm:py-16">
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
        heading="Agentic AI: common questions"
        intro="Short answers on what agents are, what we have built, and how you stay in control."
      />

      <CtaStrip
        heading="Want workflows that run without a person in the loop?"
        sub="Book a free call. We will find the workflow worth automating first. No deck, no obligation."
      />
    </>
  );
}

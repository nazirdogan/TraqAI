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
    'Agentic AI is software that takes goals and carries out multi-step work on its own, deciding and acting without a person in the loop. Traq Collective builds AI agents and agentic systems that run and improve themselves. We run a full autonomous operation end to end for a company we operate, and we can build yours.',
};

type Section = { h2: string; body: string; points?: string[] };

const SECTIONS: Section[] = [
  {
    h2: 'What agentic AI means',
    body: 'A chatbot answers when you ask. An AI agent is given a goal and carries out the steps to reach it: pulling data, making decisions, using tools, and handing off when something needs a human. Agentic systems chain these agents together so whole workflows run without someone driving each step.',
    points: [
      'AI agents that plan and execute multi-step work',
      'Agentic ecosystems where agents hand off to each other',
      'Autonomous, self-improving workflows with humans on the exceptions',
      'Built with you, in your context, not in a black box',
    ],
  },
  {
    h2: 'A system we run end to end',
    body: 'We do not just advise on this. We run a full autonomous operation, end to end, for a company we operate, where agents handle the day-to-day work and escalate only what needs judgement. That is the same kind of system we build for clients, grounded in what actually holds up in production.',
  },
  {
    h2: 'How we build agentic systems with you',
    body: 'We start narrow, with one workflow that is well understood and high volume, prove it runs reliably, then expand. You keep visibility and control throughout, with clear guardrails and human checkpoints where they matter, so autonomy never means losing oversight.',
  },
];

const RELATED: { label: string; href: string }[] = [
  { label: 'Implementation & enablement', href: '/services/ai-implementation' },
  { label: 'Consultation & strategy', href: '/services/ai-consulting' },
  { label: 'All AI services', href: '/services' },
];

const FAQS: Qa[] = [
  {
    q: 'What is the difference between an AI agent and a chatbot?',
    a: 'A chatbot responds when prompted. An AI agent is given a goal and carries out the steps to reach it on its own, using tools, making decisions, and only escalating when something needs a human. Agentic systems chain several agents so an entire workflow runs without someone driving each step.',
  },
  {
    q: 'Have you actually built an autonomous operation?',
    a: 'Yes. We run a full autonomous operation end to end for a company we operate, where AI agents handle the day-to-day work and escalate only what needs judgement. The systems we build for clients are grounded in what holds up in production, not a slide deck.',
  },
  {
    q: 'How do we stay in control of an autonomous system?',
    a: 'We start narrow, prove reliability on one workflow, then expand. Throughout, you keep visibility and control, with clear guardrails and human checkpoints where they matter. Autonomy handles the routine volume; people stay on the exceptions and the decisions that need judgement.',
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

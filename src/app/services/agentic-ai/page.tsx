import type { Metadata } from 'next';
import { OG_IMAGE } from '@/lib/metadata';
import PageHero from '@/components/page/PageHero';
import ContentSections from '@/components/page/ContentSections';
import CompareNotebook from '@/components/page/CompareNotebook';
import OtherServices from '@/components/page/OtherServices';
import FaqBlock from '@/components/page/FaqBlock';
import CtaStrip from '@/components/page/CtaStrip';
import { BreadcrumbsJsonLd, FaqPageJsonLd, ServiceJsonLd } from '@/components/seo/JsonLd';
import type { BreadcrumbItem, Qa } from '@/lib/seo/schema';

const PATH = '/services/agentic-ai';
const CANONICAL = `https://traqcollective.com${PATH}`;

export const metadata: Metadata = {
  title: 'Agentic AI and autonomous operations',
  description:
    'Agentic AI: we build AI agents and workflows that run and improve on their own. We run a full autonomous operation end to end, and we can build yours.',
  alternates: { canonical: CANONICAL },
  openGraph: {
      images: [OG_IMAGE],
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
    body: 'A chatbot answers when you ask; an AI agent takes a goal and carries out the steps to reach it, using tools, making decisions and handing off when something needs a person. Agentic workflows chain these agents together so whole processes run without someone driving each step.',
  },
  {
    h2: 'What does an autonomous operation look like in practice?',
    body: 'We do not just advise on this. We run a full autonomous operation end to end for a company we operate, where agents handle the day-to-day and escalate only what needs judgement, so what we build for you is grounded in production, not a slide deck.',
  },
  {
    h2: 'How do you build agentic workflows safely?',
    body: 'We start narrow, with one well-understood, high-volume workflow, prove it runs reliably, then expand. You keep visibility and control throughout, with clear guardrails and human checkpoints where they matter.',
  },
];

// Agentic AI vs traditional automation (RPA / scripts). Paired contrasts:
// rpa[i] (what doesn't work) sits opposite agentic[i] (what works).
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
        motif="agentic"
        secondary={{ label: 'See all services', href: '/services' }}
      />

      <ContentSections sections={SECTIONS} />

      <CompareNotebook
        title="Agentic AI vs traditional automation"
        intro="How AI agents differ from scripted automation like RPA, across how work gets defined, how each handles the unexpected, and where people fit."
        bad={{ label: 'Traditional automation (RPA)', items: COMPARISON.map((r) => r.rpa) }}
        good={{ label: 'Agentic AI', items: COMPARISON.map((r) => r.agentic) }}
      />

      <FaqBlock
        qas={FAQS}
        heading="Agentic AI: common questions"
        intro="Short answers on what agents are, what we have built, and how you stay in control."
      />

      <CtaStrip
        heading="Want workflows that run without a person in the loop?"
        sub="Book a free call. We will find the workflow worth automating first. No deck, no obligation."
      />

      <OtherServices currentSlug="agentic-ai" />
    </>
  );
}

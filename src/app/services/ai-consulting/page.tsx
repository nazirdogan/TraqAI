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

const PATH = '/services/ai-consulting';
const CANONICAL = `https://traqcollective.com${PATH}`;

export const metadata: Metadata = {
  title: 'AI consulting that ends in adoption',
  description:
    'AI consulting and strategy as your embedded AI partner: we audit your tools and workflows, find the uses that save the most time, and give you a roadmap to act on.',
  alternates: { canonical: CANONICAL },
  openGraph: {
      images: [OG_IMAGE],
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
    'An AI consultant should leave you with a working capability, not a slide deck. Traq Collective acts as your embedded AI partner: we audit your tools and workflows, find the uses that save the most time, and give you a prioritised roadmap your team can act on. Then we help you act on it.',
};

type Section = { h2: string; body: string; points?: string[] };

const SECTIONS: Section[] = [
  {
    h2: 'What does an AI consultant actually do?',
    body: 'A good AI consultant finds where AI saves your team real hours, decides what to do first, and sets the guardrails for safe use, working in your own tools rather than from behind a deck. You get an audit, a prioritised roadmap and senior direction your people can actually run.',
  },
  {
    h2: 'How do Traq AI strategy engagements work?',
    body: 'We start with a fast, fixed-scope audit so you see value before any long commitment, then set the strategy and put a number on it: hours saved, tools adopted, work shipped. You keep everything we build, and your team learns to run it without us.',
  },
  {
    h2: 'Do I need AI consulting or a fractional Head of AI?',
    body: 'Consulting is right when you need direction and a plan. If you want that senior leadership on an ongoing basis, embedded part-time to set strategy and lead the rollout, that is our embedded AI partner engagement, the alternative people search for as a fractional Head of AI.',
  },
];

// AI consultant (Traq) vs AI agency. Paired contrasts: agency[i] (what doesn't
// work for you) sits opposite consultant[i] (what works).
const COMPARISON: { dimension: string; consultant: string; agency: string }[] = [
  {
    dimension: 'What you get',
    consultant: 'A senior operator embedded with your team, plus a plan your people can run',
    agency: 'A project team and deliverables built largely off-site',
  },
  {
    dimension: 'How it is delivered',
    consultant: 'Done with you, in your own tools, so the work fits how you operate',
    agency: 'Done for you, often in a black box you cannot maintain',
  },
  {
    dimension: 'Where the capability lands',
    consultant: 'In your team; we make ourselves redundant on purpose',
    agency: 'With the agency, so you keep paying to keep it running',
  },
  {
    dimension: 'Speed to value',
    consultant: 'A fixed-scope audit shows value in the first few weeks',
    agency: 'Longer discovery and scoping before anything ships',
  },
  {
    dimension: 'Accountability',
    consultant: 'A number on every engagement: hours saved, tools adopted',
    agency: 'Measured by hours billed or features delivered',
  },
];

const FAQS: Qa[] = [
  {
    q: 'How is AI consulting different from a fractional Head of AI?',
    a: 'A consulting engagement is scoped and time-bound: audit, strategy and a roadmap. What people search for as a fractional Head of AI is the same senior leadership on an ongoing basis, which we deliver as an embedded AI partner, setting direction and leading the rollout part-time alongside your team. Many teams begin with a consult and move into the embedded partnership once there is a plan.',
  },
  {
    q: 'What do I get at the end of an AI consulting engagement?',
    a: 'You get a prioritised roadmap grounded in your real tools and workflows: where AI saves the most time, what to do first, which tools to use, and the guardrails to use them safely. You get a plan your team can act on, with the value already shown, instead of a deck that gathers dust.',
  },
  {
    q: 'How is an AI consultant different from an AI agency?',
    a: 'An AI agency builds for you and keeps the capability. We embed with your team and build the capability into your people, so you are not locked into ongoing fees to keep it running. You see value in weeks from a fixed-scope audit, and you own everything we make.',
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
        description="AI consulting that acts as your embedded AI partner: audit, prioritised roadmap, and senior direction working with your team. UAE and global."
        url={PATH}
        serviceType="AI consulting"
      />
      <FaqPageJsonLd qas={FAQS} />

      <PageHero
        eyebrow={HERO.eyebrow}
        h1={HERO.h1}
        intro={HERO.intro}
        breadcrumbs={breadcrumbItems}
        motif="consulting"
        secondary={{ label: 'Embedded AI Partner', href: '/fractional-head-of-ai' }}
      />

      <ContentSections sections={SECTIONS} />

      <CompareNotebook
        title="AI consultant vs AI agency: which do you need?"
        intro="Both can help. The difference is who ends up owning the capability and how fast you see value."
        bad={{ label: 'An AI agency', items: COMPARISON.map((r) => r.agency) }}
        good={{ label: 'An AI consultant (Traq)', items: COMPARISON.map((r) => r.consultant) }}
      />

      <FaqBlock
        qas={FAQS}
        heading="AI consulting: common questions"
        intro="Short answers on what consulting covers and how it compares to an agency or an embedded partner."
      />

      <CtaStrip
        heading="Need a plan and senior direction on AI?"
        sub="Book a free call. We will find where AI saves your team the most time. No deck, no obligation."
      />

      <OtherServices currentSlug="ai-consulting" />
    </>
  );
}

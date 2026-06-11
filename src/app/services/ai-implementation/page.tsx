import type { Metadata } from 'next';
import PageHero from '@/components/page/PageHero';
import ContentSections from '@/components/page/ContentSections';
import CompareNotebook from '@/components/page/CompareNotebook';
import OtherServices from '@/components/page/OtherServices';
import FaqBlock from '@/components/page/FaqBlock';
import CtaStrip from '@/components/page/CtaStrip';
import { BreadcrumbsJsonLd, FaqPageJsonLd, ServiceJsonLd } from '@/components/seo/JsonLd';
import type { BreadcrumbItem, Qa } from '@/lib/seo/schema';

const PATH = '/services/ai-implementation';
const CANONICAL = `https://traqcollective.com${PATH}`;

export const metadata: Metadata = {
  title: 'We wire AI into the tools you already pay for',
  description:
    'AI implementation and adoption: we set up AI inside your real workflows, add the guardrails to use it safely, and make sure your team actually adopts it. Not a handover doc. UAE and global.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'AI implementation and adoption | Traq Collective',
    description:
      'We wire AI into the tools you already pay for, with guardrails, and make sure your team adopts it.',
    url: CANONICAL,
  },
};

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', url: '/' },
  { name: 'Services', url: '/services' },
  { name: 'Implementation & Enablement', url: PATH },
];

const HERO = {
  eyebrow: 'Services · AI implementation',
  h1: 'We wire AI into the tools you already pay for',
  // Standalone, definition-first answer (40-60 words).
  intro:
    'AI implementation is the work of putting AI inside the tools and workflows your team uses every day, with the guardrails to use it safely. Traq Collective sets it up in your real workflows, then makes sure the team actually adopts it. You get a working capability your people own, not a handover doc.',
};

type Section = { h2: string; body: string; points?: string[] };

const SECTIONS: Section[] = [
  {
    h2: 'What AI implementation involves',
    body: 'We connect AI to the systems you already run, so it shows up where the work happens instead of in a separate tab nobody opens. That means the right prompts, access and guardrails for safe, accurate use, plus the adoption support that makes the team actually use it.',
  },
  {
    h2: 'How we make adoption stick',
    body: 'A tool nobody uses is not implemented. We roll out in stages, train people on their real tasks, and measure adoption and hours saved, so the capability holds after we step back.',
  },
  {
    h2: 'From plan to working capability',
    body: 'If you already have a roadmap, we build and embed it; if you do not, we can audit first, then implement. Either way you end up owning what we build, with your team able to run and extend it.',
  },
];

// Embedded AI with adoption vs a one-off setup nobody opens. Paired contrasts:
// handover[i] (what doesn't work) sits opposite embedded[i] (what works).
const COMPARISON: { dimension: string; embedded: string; handover: string }[] = [
  {
    dimension: 'Where AI lives',
    embedded: 'Inside the tools and workflows your team already uses',
    handover: 'In a separate tab people forget to open',
  },
  {
    dimension: 'Adoption',
    embedded: 'Most of the team uses it on real work within weeks',
    handover: 'A keen few try it; the rest never start',
  },
  {
    dimension: 'Safety',
    embedded: 'Guardrails, access and review steps built in',
    handover: 'Ad-hoc use with no rules, so trust drops fast',
  },
  {
    dimension: 'Ownership',
    embedded: 'Your team runs and extends it after we step back',
    handover: 'A doc nobody maintains and a vendor you depend on',
  },
  {
    dimension: 'Proof it worked',
    embedded: 'Adoption and hours saved are measured and reported',
    handover: 'No baseline, so nobody knows if it helped',
  },
];

const FAQS: Qa[] = [
  {
    q: 'Do we need new tools, or can you use what we have?',
    a: 'We start with the tools you already pay for, like ChatGPT, Copilot or Gemini, and wire AI into the workflows around them. We only recommend something new when there is a clear gap and a clear payoff, so you are not stacking up licences your team will not use.',
  },
  {
    q: 'How do you keep AI use safe and accurate?',
    a: 'We build guardrails into the setup: clear prompts and templates, the right access and permissions, and review steps where accuracy matters. People are trained on when to trust output and when to check it, so AI speeds the work up without quietly introducing mistakes.',
  },
  {
    q: 'What happens after implementation?',
    a: 'Your team owns it. We measure adoption and the hours saved, hand over the prompts and workflows, and stay as much or as little as you want. The goal is a capability your people can run and extend on their own, not a dependency on us.',
  },
];

export default function AiImplementationPage() {
  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbItems} />
      <ServiceJsonLd
        name="AI implementation and enablement"
        description="We wire AI into the tools and workflows you already pay for, with guardrails, and make sure your team adopts it. UAE and global."
        url={PATH}
        serviceType="AI implementation"
      />
      <FaqPageJsonLd qas={FAQS} />

      <PageHero
        eyebrow={HERO.eyebrow}
        h1={HERO.h1}
        intro={HERO.intro}
        breadcrumbs={breadcrumbItems}
        motif="implementation"
        secondary={{ label: 'See all services', href: '/services' }}
      />

      <ContentSections sections={SECTIONS} />

      <CompareNotebook
        title="Embedded AI vs a one-off setup nobody adopts"
        intro="What changes when AI is wired into your real workflows and owned by your team, versus a one-time setup handed over in a doc."
        bad={{ label: 'One-off setup & handover', items: COMPARISON.map((r) => r.handover) }}
        good={{ label: 'Embedded, with adoption', items: COMPARISON.map((r) => r.embedded) }}
      />

      <FaqBlock
        qas={FAQS}
        heading="AI implementation: common questions"
        intro="Short answers on tools, safety and what happens after we embed AI."
      />

      <CtaStrip
        heading="Know what to do but need it built and adopted?"
        sub="Book a free call. We will wire AI into your real workflows and make sure the team uses it. No deck, no obligation."
      />

      <OtherServices currentSlug="ai-implementation" />
    </>
  );
}

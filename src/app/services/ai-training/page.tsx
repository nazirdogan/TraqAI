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

const PATH = '/services/ai-training';
const CANONICAL = `https://traqcollective.com${PATH}`;

export const metadata: Metadata = {
  title: 'Employee AI Training, Dubai and Abu Dhabi',
  description:
    'AI training for teams, built around your real work. Role-specific, hands-on workshops that move people from hesitant to confident. In-person across the UAE.',
  alternates: { canonical: CANONICAL },
  openGraph: {
      images: [OG_IMAGE],
    title: 'AI training for teams | Traq Collective',
    description:
      'Hands-on, role-specific AI training built around your team’s real work. UAE in-person and remote worldwide.',
    url: CANONICAL,
  },
};

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', url: '/' },
  { name: 'Services', url: '/services' },
  { name: 'AI Training', url: PATH },
];

const HERO = {
  eyebrow: 'Services · AI training',
  h1: 'AI training for teams that actually use it',
  // Standalone, definition-first answer (40-60 words).
  intro:
    'Good AI training teaches your people to use AI on their own work, not just explains what it is. Traq Collective runs hands-on, role-specific workshops built around your team’s real tasks, so people leave knowing exactly how to apply AI in their job. We deliver in person across the UAE and remotely worldwide.',
};

type Section = { h2: string; body: string; points?: string[] };

const SECTIONS: Section[] = [
  {
    h2: 'What AI training for teams covers',
    body: 'We start from the work your team already does, then teach the AI skills that save the most time on it, with guardrails for safe, accurate use. Sessions are hands-on and role-specific, so a finance lead and a sales rep each leave with directly usable habits, and the capability stays in-house.',
  },
  {
    h2: 'How our workshops work',
    body: 'Each workshop is built for your team, not pulled off a shelf: we learn the work first, run live hands-on sessions, then check in so the new habits hold. Comfort with AI nearly doubles after structured practice, so we design for practice, not slideware.',
  },
  {
    h2: 'AI training in the UAE',
    body: 'We run in-person workshops across Dubai, Abu Dhabi and the wider UAE, and deliver the same training remotely worldwide. The content is built around your context and tools either way; only the delivery format changes.',
  },
];

// Guided AI training vs leaving teams to figure it out alone. Paired contrasts:
// diy[i] (what doesn't work) sits opposite trained[i] (what works).
const COMPARISON: { dimension: string; trained: string; diy: string }[] = [
  {
    dimension: 'Adoption',
    trained: 'Most of the team uses AI on real work within weeks',
    diy: 'A few keen people try it; most never start',
  },
  {
    dimension: 'Relevance',
    trained: 'Built around your roles, tools and actual tasks',
    diy: 'Generic tips from YouTube that rarely fit the job',
  },
  {
    dimension: 'Safety',
    trained: 'Clear guardrails for accuracy, privacy and review',
    diy: 'Ad-hoc use with no rules, so people lose trust fast',
  },
  {
    dimension: 'Time to value',
    trained: 'Hours saved start showing in the first month',
    diy: 'Months of trial and error, often abandoned',
  },
  {
    dimension: 'Staying power',
    trained: 'Habits reinforced with follow-up so they hold',
    diy: 'Early enthusiasm fades once the novelty wears off',
  },
];

const FAQS: Qa[] = [
  {
    q: 'How long does AI training take?',
    a: 'Most teams start with a half-day or full-day workshop, then a short follow-up a few weeks later so the habits stick. Research points to five-plus hours of practice as the tipping point for regular use, so we scope enough hands-on time to get there, not a one-off talk.',
  },
  {
    q: 'Do you train non-technical teams?',
    a: 'Yes. Most of the people we train are not technical. We teach AI on the work they already do, in plain language, with no code required. Finance, sales, operations and admin teams are exactly who benefit most from practical, role-specific training.',
  },
  {
    q: 'Do you run AI training in the UAE?',
    a: 'Yes. We run in-person workshops for teams across Dubai, Abu Dhabi and the wider UAE, and deliver the same training remotely for teams worldwide. The work is the same wherever your team sits; only the delivery format changes.',
  },
];

export default function AiTrainingPage() {
  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbItems} />
      <ServiceJsonLd
        name="AI training for teams"
        description="Hands-on, role-specific AI training built around your team’s real work. Delivered in person across the UAE and remotely worldwide."
        url={PATH}
        serviceType="AI training"
      />
      <FaqPageJsonLd qas={FAQS} />

      <PageHero
        eyebrow={HERO.eyebrow}
        h1={HERO.h1}
        intro={HERO.intro}
        breadcrumbs={breadcrumbItems}
        motif="training"
        secondary={{ label: 'See all services', href: '/services' }}
      />

      <ContentSections sections={SECTIONS} />

      <CompareNotebook
        title="AI training vs leaving your team to figure it out"
        intro="What changes when training is guided and built around your work, versus hoping people pick it up on their own."
        bad={{ label: 'Figuring it out alone', items: COMPARISON.map((r) => r.diy) }}
        good={{ label: 'Guided AI training', items: COMPARISON.map((r) => r.trained) }}
      />

      <FaqBlock
        qas={FAQS}
        heading="AI training: common questions"
        intro="Short answers on how training works and who it is for."
      />

      <CtaStrip
        heading="Want your team using AI by next month?"
        sub="Book a free call. We will scope a workshop around your team’s real work. No deck, no obligation."
      />

      <OtherServices currentSlug="ai-training" />
    </>
  );
}

import type { Metadata } from 'next';
import { OG_IMAGE } from '@/lib/metadata';
import PageHero from '@/components/page/PageHero';
import ContentSections from '@/components/page/ContentSections';
import CompareNotebook from '@/components/page/CompareNotebook';
import OtherServices from '@/components/page/OtherServices';
import FaqBlock from '@/components/page/FaqBlock';
import CtaStrip from '@/components/page/CtaStrip';
import AudienceBands from '@/components/training/AudienceBands';
import TrainingTracks from '@/components/training/TrainingTracks';
import DeliveryPhases from '@/components/training/DeliveryPhases';
import FormatTable from '@/components/training/FormatTable';
import {
  BreadcrumbsJsonLd,
  CourseListJsonLd,
  FaqPageJsonLd,
  ServiceJsonLd,
  WebPageJsonLd,
} from '@/components/seo/JsonLd';
import { TRAINING_TRACKS } from '@/lib/training';
import { TRAINING_REVIEWED_ISO } from '@/lib/seo/reviewed';
import type { BreadcrumbItem, Qa } from '@/lib/seo/schema';

const PATH = '/services/ai-training';
const CANONICAL = `https://traqcollective.com${PATH}`;

export const metadata: Metadata = {
  title: 'AI Training for Teams, Dubai and Abu Dhabi',
  description:
    'Six hands-on AI training tracks: AI strategy and governance, Claude, ChatGPT, Microsoft 365 Copilot, Gemini and AI agents. Built around your team’s real work. In person across the UAE, remote worldwide.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    images: [OG_IMAGE],
    title: 'AI training for teams | Traq Collective',
    description:
      'Six hands-on tracks covering strategy and governance, Claude, ChatGPT, Copilot, Gemini and AI agents, each rebuilt around your team’s real work.',
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
  // Standalone, definition-first answer (40-60 words). Names the tools, because
  // "which product do you actually teach" is the first thing a buyer checks and
  // the old version answered it nowhere on the page.
  intro:
    'Good AI training teaches your people to use AI on their own work, not just what it is. Traq Collective runs six hands-on tracks covering AI strategy and governance, Claude, ChatGPT, Microsoft 365 Copilot, Gemini and AI agents, each rebuilt around your team’s real tasks. In person across the UAE, remote worldwide.',
};

type Section = { h2: string; body: string; points?: string[] };

// What is in the room when we leave. Named deliverables, because "hands-on and
// practical" is what every provider in this market says, and none of them say
// what you are left holding.
const DELIVERABLES: Section[] = [
  {
    h2: 'In their hands the same week',
    body: 'Everyone leaves with working setups rather than notes to action later.',
    points: [
      'A prompt library written for their role, not a generic list',
      'A Project, custom GPT or Skill set up on your business context',
      'Two or three of their own recurring tasks rebuilt and timed',
    ],
  },
  {
    h2: 'For the business',
    body: 'The artefacts leadership needs to make the next decision without another discovery round.',
    points: [
      'A ranked use-case shortlist with hours attached to each one',
      'A draft acceptable-use policy covering tools, data and sign-off',
      'A 30, 60, 90 day plan with owners and the measures you report on',
    ],
  },
  {
    h2: 'So it holds after we leave',
    body: 'One session changes a mood. Keeping the habit takes a bit more than that.',
    points: [
      'A recap pack and the session recording, sent the same week',
      'A named internal champion briefed to answer the follow-up questions',
      'A return session a few weeks later, once the friction has surfaced',
    ],
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
    q: 'Which AI tools do you train on?',
    a: 'Claude, ChatGPT, Microsoft 365 Copilot and Gemini, plus the automation tools that sit around them. We train on what you already pay for: if you hold Microsoft licences we go deep on Copilot, and if you run on Google Workspace we take the Gemini track. Most teams leave with a simple rule for which tool gets which job.',
  },
  {
    q: 'How long does AI training take?',
    a: 'Most teams start with a half-day or full-day workshop, then a short follow-up a few weeks later so the habits stick. Research points to five-plus hours of practice as the tipping point for regular use, so we scope enough hands-on time to get there, not a one-off talk.',
  },
  {
    q: 'What is in an AI strategy and governance session?',
    a: 'It is the leadership track. We work through what AI realistically does for your business, score and rank the use cases worth funding, agree what data can go into which tool, draft an acceptable-use policy in plain language, and finish with a 12-month roadmap carrying owners, budget and the measures you will report on.',
  },
  {
    q: 'Do you train non-technical teams?',
    a: 'Yes. Most of the people we train are not technical. We teach AI on the work they already do, in plain language, with no code required. Finance, sales, operations and admin teams are exactly who benefit most from practical, role-specific training.',
  },
  {
    q: 'Can you build a track around our own tools and processes?',
    a: 'Yes, and most engagements end up there. The six tracks are a spine, not a script. Before delivery we survey the people attending and look at how a few real tasks get done today, then rebuild the agenda around that. If your work lives in a tool we have not listed, we still train on it.',
  },
  {
    q: 'What size group works best?',
    a: 'Hands-on tracks run best between four and twenty-five people, because everyone needs to be doing the work rather than watching someone else do it. The 90-minute leadership taster scales to a couple of hundred. For a whole-company rollout we run the same track several times instead of putting everyone in one room.',
  },
  {
    q: 'Do you run AI training in the UAE?',
    a: 'Yes. We run in-person workshops for teams across Dubai, Abu Dhabi and the wider UAE, and deliver the same training remotely for teams worldwide. The work is the same wherever your team sits; only the delivery format changes.',
  },
];

// Each track becomes a Course in the catalogue schema, anchored to its own
// section on this page so an engine can cite the exact track.
const COURSES = TRAINING_TRACKS.map((track) => ({
  name: track.name,
  description: track.summary,
  url: `${PATH}#${track.slug}`,
  workloadIso: track.workloadIso,
}));

export default function AiTrainingPage() {
  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbItems} />
      <ServiceJsonLd
        name="AI training for teams"
        description="Six hands-on AI training tracks covering AI strategy and governance, Claude, ChatGPT, Microsoft 365 Copilot, Gemini and AI agents, each built around your team’s real work. Delivered in person across the UAE and remotely worldwide."
        url={PATH}
        serviceType="AI training"
      />
      <CourseListJsonLd courses={COURSES} />
      <WebPageJsonLd
        name="AI training for teams"
        description="The Traq Collective AI training catalogue: six tracks, their modules, the delivery model, and the formats and group sizes each runs in."
        url={PATH}
        dateModified={TRAINING_REVIEWED_ISO}
      />
      <FaqPageJsonLd qas={FAQS} />

      <PageHero
        eyebrow={HERO.eyebrow}
        h1={HERO.h1}
        intro={HERO.intro}
        breadcrumbs={breadcrumbItems}
        motif="training"
        reviewedIso={TRAINING_REVIEWED_ISO}
        secondary={{ label: 'See the six tracks', href: '#tracks' }}
      />

      <AudienceBands />

      <TrainingTracks />

      <DeliveryPhases />

      <ContentSections
        eyebrow="Deliverables"
        heading="What your team walks away with"
        intro="Not a certificate. The working setups, the decision artefacts, and the follow-up that stops it fading."
        sections={DELIVERABLES}
      />

      <FormatTable />

      <CompareNotebook
        title="AI training vs leaving your team to figure it out"
        intro="What changes when training is guided and built around your work, versus hoping people pick it up on their own."
        bad={{ label: 'Figuring it out alone', items: COMPARISON.map((r) => r.diy) }}
        good={{ label: 'Guided AI training', items: COMPARISON.map((r) => r.trained) }}
      />

      <FaqBlock
        qas={FAQS}
        heading="AI training: common questions"
        intro="Short answers on the tracks, the tools, the group sizes and how delivery works."
      />

      <CtaStrip
        heading="Want your team using AI by next month?"
        sub="Book a free call. We will scope a track around your team’s real work. No deck, no obligation."
      />

      <OtherServices currentSlug="ai-training" />
    </>
  );
}

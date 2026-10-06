import type { Metadata } from 'next';
import { OG_IMAGE } from '@/lib/metadata';
import Link from 'next/link';
import PageHero from '@/components/page/PageHero';
import ContentSections from '@/components/page/ContentSections';
import OtherServices from '@/components/page/OtherServices';
import FaqBlock from '@/components/page/FaqBlock';
import CtaStrip from '@/components/page/CtaStrip';
import {
  BreadcrumbsJsonLd,
  FaqPageJsonLd,
  ServiceJsonLd,
  WebPageJsonLd,
} from '@/components/seo/JsonLd';
import { STATIC_REVIEWED_ISO } from '@/lib/seo/reviewed';
import type { BreadcrumbItem, Qa } from '@/lib/seo/schema';

const PATH = '/ai-for-contractors';
const CANONICAL = `https://traqcollective.com${PATH}`;

// Industry landing page for contracting, fit-out and interior design firms.
// Deliberately not in the navbar: it exists to be found by search and AI
// answer engines, and is linked from the footer, sitemap and llms.txt. Training
// leads; implementation is a short secondary section. Use cases are typical
// examples, not client results, so there are no invented numbers.
export const metadata: Metadata = {
  title: 'AI training for contractors, fit-out and interior firms',
  description:
    'Practical AI training for contracting, fit-out and interior design firms. Cut the time spent on tendering, estimating, design coordination and FF&E, using the tools you already have.',
  alternates: { canonical: CANONICAL },
  keywords: [
    'AI for contractors',
    'AI training for contractors',
    'AI for fit-out companies',
    'AI for interior design firms',
    'AI for tendering',
    'AI for estimating',
    'AI for construction companies',
  ],
  openGraph: {
    images: [OG_IMAGE],
    title: 'AI training for contractors | Traq Collective',
    description:
      'Hands-on AI training for contracting, fit-out and interior design teams, built on the tools you already use, so tenders, estimates and FF&E take less time.',
    url: CANONICAL,
  },
};

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', url: '/' },
  { name: 'AI for contractors', url: PATH },
];

const HERO = {
  eyebrow: 'Built for contracting, fit-out and interior firms',
  h1: 'AI training for contractors',
  // Definition-first, 40-60 words. No em dash.
  intro:
    'Traq Collective trains contracting, fit-out and interior design teams to use AI on the work that eats their week: tendering, estimating, design coordination, FF&E schedules and procurement. We teach your people on the tools you already pay for, so you save time without new software or a big IT project.',
};

type Section = { h2: string; body: string; points?: string[] };

// The time sinks, framed as typical use cases (not client results).
const USE_CASES: Section[] = [
  {
    h2: 'Tendering and bid responses',
    body: 'Tender packs are long, repetitive and due fast. We train your team to use AI to read through tender documents, pull out the requirements, build a compliance checklist and draft method statements and cover letters from your past bids, so people spend their time on the pricing and the strategy.',
    points: [
      'Summarise a tender pack and flag the clauses that matter',
      'Draft first versions of method statements from your own past bids',
      'Check a response against the requirements before it goes out',
    ],
  },
  {
    h2: 'Estimating and quantity take-off support',
    body: 'AI does not replace an estimator, and we are clear about that in the training. It does speed up the surrounding work: reading specifications, comparing subcontractor quotes line by line, spotting scope gaps and tidying the assumptions and exclusions, with an estimator checking every number.',
    points: [
      'Compare subcontractor quotes against scope and spot gaps',
      'Draft assumptions, exclusions and clarifications',
      'Turn spec text into a clean checklist for the estimator to price',
    ],
  },
  {
    h2: 'Design coordination and RFIs',
    body: 'Design teams and site teams lose hours to RFIs, submittals and chasing answers. We show your people how to use AI to draft clear RFIs, summarise long comment threads and meeting notes, track open items and keep a consistent record of what was decided and why.',
    points: [
      'Draft and tidy RFIs and submittal cover notes',
      'Turn meeting recordings and notes into action lists',
      'Summarise design comment threads into one decision log',
    ],
  },
  {
    h2: 'FF&E schedules and procurement',
    body: 'FF&E packages mean specifications, supplier quotes, lead times and approvals across hundreds of items. We train procurement and design teams to use AI to structure schedules, compare supplier offers, write clean specification sheets and prepare chasing emails, keeping a person in charge of every order.',
    points: [
      'Standardise product descriptions and specification sheets',
      'Compare supplier quotes and lead times side by side',
      'Draft supplier follow-ups and approval requests',
    ],
  },
  {
    h2: 'Site reports, handover and client communication',
    body: 'Progress reports, snag lists, handover documents and client updates are all writing and summarising work. We show your team how to turn rough site notes into consistent reports and plain-language client updates in minutes instead of an evening.',
    points: [
      'Turn site notes and photos into consistent weekly reports',
      'Draft client updates in a clear, professional tone',
      'Organise snag lists and handover document checklists',
    ],
  },
];

const SECTIONS: Section[] = [
  {
    h2: 'Why contractors are looking at AI now',
    body: 'Contracting margins are tight and the admin load is heavy. Most firms do not need a bespoke system. They need estimators, designers, project managers and procurement staff who know how to use the AI tools they already have, on their own documents, safely. The saving is time: hours back every week on work that follows a pattern.',
  },
  {
    h2: 'Training first, on the tools you already have',
    body: 'We lead with hands-on, role-specific training. Estimators, designers and project managers each work on their own real tasks, using tools like Microsoft 365, Google Workspace, ChatGPT or Claude, whichever you already pay for. People leave with habits and prompts that fit their job, not a generic overview of AI.',
    points: [
      'Role-specific sessions for estimators, designers, PMs and procurement',
      'Your own documents and examples, with guardrails for confidential data',
      'A shared prompt library your team keeps using after we leave',
    ],
  },
  {
    h2: 'Implementation, when you are ready for it',
    body: 'Once your team is confident, some firms want AI built into how they work: shared templates, standard workflows and connections between the tools they use. We offer this as a second step, scoped to what your team has proven useful in training, rather than a large build up front.',
  },
];

const PROCESS: Section[] = [
  {
    h2: '1. Find the time sinks',
    body: 'A short audit with your team to find the tasks that take the most time and follow a repeatable pattern.',
  },
  {
    h2: '2. Train by role',
    body: 'Hands-on workshops where each role practises on its own real work, with clear rules on what not to put into AI.',
  },
  {
    h2: '3. Make it stick',
    body: 'Prompt libraries, follow-up sessions and a simple way to measure the hours your team gets back.',
  },
];

const FAQS: Qa[] = [
  {
    q: 'How can contractors use AI for tendering?',
    a: 'Contractors use AI to read through tender documents, extract the requirements, build a compliance checklist, and draft method statements and cover letters from past bids. A person still prices the job and reviews every submission. The gain is that the reading and first-draft writing take hours instead of days.',
  },
  {
    q: 'Can AI help with estimating?',
    a: 'Yes, around the estimate rather than in place of the estimator. AI helps compare subcontractor quotes, spot scope gaps, read specifications and draft assumptions and exclusions. The numbers and the judgement stay with your estimator, who checks everything.',
  },
  {
    q: 'Can fit-out and interior design firms use AI for FF&E?',
    a: 'Yes. AI can standardise product descriptions, structure FF&E schedules, compare supplier quotes and lead times, and draft chasing emails. A designer or procurement lead stays in control of every specification and order.',
  },
  {
    q: 'Do we need new software?',
    a: 'No. Our training is built on the tools your team already pays for, such as Microsoft 365, Google Workspace, ChatGPT or Claude. We teach your people to get more from them, so there is no new system to buy or roll out.',
  },
  {
    q: 'Is it safe to use AI with tender and client documents?',
    a: 'It can be, with the right setup and rules. We cover which tools and plans protect your data, what should never be pasted into a public AI tool, and how to set a simple usage policy, so your team knows exactly where the line is.',
  },
  {
    q: 'Do you offer in-person training in the UAE?',
    a: 'Yes. We are based in the UAE and run in-person sessions in Dubai and Abu Dhabi, and we deliver remotely worldwide. Contact us at hello@traqcollective.com or on +971 50 868 7196.',
  },
];

export default function AiForContractorsPage() {
  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbItems} />
      <WebPageJsonLd
        name="AI training for contractors, fit-out and interior design firms"
        description="Hands-on AI training for contracting, fit-out and interior design teams: tendering, estimating, design coordination and FF&E, using the tools you already have."
        url={PATH}
        dateModified={STATIC_REVIEWED_ISO}
      />
      <ServiceJsonLd
        name="AI training for contractors"
        description="Hands-on, role-specific AI training for contracting, fit-out and interior design firms, covering tendering, estimating, design coordination, FF&E and site reporting, built on the tools the team already uses. UAE and global."
        url={PATH}
        serviceType="AI training"
      />
      <FaqPageJsonLd qas={FAQS} />

      <PageHero
        eyebrow={HERO.eyebrow}
        h1={HERO.h1}
        intro={HERO.intro}
        breadcrumbs={breadcrumbItems}
        reviewedIso={STATIC_REVIEWED_ISO}
        motif="contracting"
        secondary={{ label: 'See AI training', href: '/services/ai-training' }}
      />

      <ContentSections sections={SECTIONS} />

      <ContentSections
        sections={USE_CASES}
        eyebrow="Typical use cases"
        heading="Where contractors get time back"
        intro="Examples of the work we train contracting, fit-out and interior teams to speed up. Every output is checked by a person."
      />

      <ContentSections
        sections={PROCESS}
        eyebrow="How it works"
        heading="From audit to habits that stick"
        footnote={
          <>
            Read more about{' '}
            <Link
              href="/services/ai-training"
              className="font-semibold text-traq-purple underline-offset-4 hover:underline"
            >
              our AI training
            </Link>{' '}
            and{' '}
            <Link
              href="/services/ai-implementation"
              className="font-semibold text-traq-purple underline-offset-4 hover:underline"
            >
              implementation
            </Link>
            .
          </>
        }
      />

      <FaqBlock
        qas={FAQS}
        heading="AI for contractors: common questions"
        intro="Short answers on tendering, estimating, FF&E, data safety and working with UAE teams."
      />

      <CtaStrip
        heading="Want your team to get hours back every week?"
        sub="Book a free call. We will look at where your tendering, estimating and FF&E time goes. No deck, no obligation."
      />

      <OtherServices />
    </>
  );
}

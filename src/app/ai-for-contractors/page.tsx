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
    'Traq Collective trains contracting, fit-out and interior design teams to use AI on the paperwork that eats their week: tender returns, subcontractor comparatives, RFIs, submittals, FF&E schedules and site reporting. We teach your people on the tools you already pay for, with clear rules for confidential project data.',
};

type Section = { h2: string; body: string; points?: string[] };

// Written from the seat of the person who owns AI inside a contracting firm:
// real document types, real handoffs, human sign-off on anything contractual.
// Typical use cases, not client results, so no invented numbers.
const USE_CASES: Section[] = [
  {
    h2: 'Tender returns and pre-qualification',
    body: 'An ITT or PQQ lands with a short deadline and a long document set. We train your bid team to use AI to extract the requirements and evaluation criteria, build a compliance matrix, and draft method statements, the programme narrative and prelims text from your own past tender returns. Your commercial lead still owns the price, the qualifications and the sign-off.',
    points: [
      'Summarise the ITT and flag onerous clauses, qualifications and unusual terms',
      'Build a compliance matrix against the evaluation criteria',
      'Draft first-pass method statements and project team CVs from past returns',
    ],
  },
  {
    h2: 'Estimating and subcontractor comparatives',
    body: 'AI does not replace take-off or the estimator, and we say so in the room. It speeds up the work around the BOQ: reading the specification, building the subcontractor enquiry, levelling returned quotes against scope, flagging gaps and exclusions, and drafting assumptions, clarifications and provisional sum notes. Every rate and quantity is checked by an estimator.',
    points: [
      'Level subcontractor quotes against scope and surface gaps and exclusions',
      'Turn spec clauses into an enquiry checklist for each trade package',
      'Draft assumptions, exclusions and clarifications for the tender return',
    ],
  },
  {
    h2: 'Design coordination, RFIs and submittals',
    body: 'Design teams and site teams lose hours to RFIs, shop drawing and material submittals, and chasing consultants for responses. We show your people how to use AI to draft clear, referenced RFIs, check a submittal against the specification, summarise comment threads into a decision log and keep the RFI and submittal registers consistent, so the design intent and what was agreed stay traceable.',
    points: [
      'Draft RFIs with the drawing, spec and clause references in place',
      'Compare a material submittal against the specification before it is issued',
      'Turn coordination meeting minutes into an action and decision log',
    ],
  },
  {
    h2: 'FF&E schedules and procurement',
    body: 'FF&E packages mean hundreds of items across specification, supplier quotes, samples, lead times and approvals. We train design and procurement teams to use AI to structure the FF&E schedule, standardise product data sheets, compare supplier quotes and lead times, flag long-lead items against the programme, and draft supplier chasers. A designer or procurement lead approves every substitution and purchase order.',
    points: [
      'Standardise item descriptions and product data across the FF&E schedule',
      'Compare supplier quotes, lead times and approved-equal proposals',
      'Flag long-lead items that threaten the programme and draft the chasers',
    ],
  },
  {
    h2: 'Variations, valuations and contract admin',
    body: 'Change is where margin is won or lost, and it is mostly writing and records. We train project and commercial teams to use AI to draft variation and change order notices, assemble the contemporaneous record behind an extension of time claim, and prepare the narrative for interim valuations. Anything contractual is reviewed by the person who owns the contract.',
    points: [
      'Draft variation notices from instructions, emails and site records',
      'Assemble a dated chronology to support an EOT or loss and expense claim',
      'Prepare the narrative that sits behind an interim valuation',
    ],
  },
  {
    h2: 'Site reporting, snagging and handover',
    body: 'Daily and weekly reports, inspection requests, NCRs, snag lists and the handover pack are all structured writing from rough inputs. We show site teams how to turn notes and photos into consistent progress reports, organise the snag list by trade and location, and compile the O&M manual and as-built checklist for handover and the defects liability period.',
    points: [
      'Turn site notes and photos into a consistent weekly progress report',
      'Sort and chase the snag list by trade, location and priority',
      'Build the handover checklist and O&M manual index',
    ],
  },
];

const SECTIONS: Section[] = [
  {
    h2: 'Why contractors are looking at AI now',
    body: 'Contracting margins are tight and the document load is heavy: tender returns, comparatives, registers, valuations and reports, all on deadlines. Most firms do not need a bespoke system. They need estimators, designers, project managers, procurement and site teams who can use the AI tools they already have on their own documents, safely. The gain is hours back every week on work that follows a pattern.',
  },
  {
    h2: 'Training first, on the tools you already have',
    body: 'We lead with hands-on, role-specific training. Estimators, bid managers, designers, project managers, procurement and site engineers each work on their own real tasks, in Microsoft 365, Google Workspace, ChatGPT or Claude, whichever you already pay for. People leave with prompts and habits that fit their job, not a generic overview of AI.',
    points: [
      'Role-specific sessions for each seat in the project team',
      'Your own document types, with guardrails for confidential data',
      'A shared prompt library your team keeps using after we leave',
    ],
  },
  {
    h2: 'Owning AI properly: governance for a contracting firm',
    body: 'Someone has to own AI in the business, and in contracting that means more than picking a tool. We help you set it up as an operating model: a register of approved use cases, which tools and plans are allowed, what client and tender data can never leave the approved environment, who reviews AI output before it reaches a client, subcontractor or the contract file, and how you measure hours saved per tender and per project.',
    points: [
      'Approved tools and a data classification for tender, client and commercial information',
      'Review gates: a named person signs off anything contractual or priced',
      'A use case register and a simple measure of hours saved',
    ],
  },
  {
    h2: 'Implementation, when you are ready for it',
    body: 'Once your team is confident, some firms want AI built into how they work: standard templates, shared project workspaces and connections between the tools they already use. We offer this as a second step, scoped to what your team has proven useful in training, rather than a large build up front.',
  },
];

const PROCESS: Section[] = [
  {
    h2: '1. Map the document flow',
    body: 'A short audit across bid, commercial, design, procurement and site to find the tasks that take the most hours and follow a repeatable pattern.',
  },
  {
    h2: '2. Train by role',
    body: 'Hands-on workshops where each role practises on its own real documents, with clear rules on what stays out of AI and who signs off.',
  },
  {
    h2: '3. Make it stick',
    body: 'Prompt libraries, follow-up sessions and a simple measure of the hours your team gets back on each tender and project.',
  },
];

const FAQS: Qa[] = [
  {
    q: 'How can contractors use AI for tendering?',
    a: 'Contractors use AI to read an ITT or PQQ, extract the requirements and evaluation criteria, build a compliance matrix, and draft method statements, programme narrative and team CVs from past tender returns. The commercial lead still owns the price, the qualifications and the sign-off. The gain is that the reading and first-draft writing take hours instead of days.',
  },
  {
    q: 'Can AI help with estimating and subcontractor quotes?',
    a: 'Yes, around the estimate rather than in place of the estimator. AI helps level subcontractor quotes against scope, spot gaps and exclusions, read specifications and draft assumptions and clarifications. Take-off, rates and quantities stay with your estimator, who checks everything.',
  },
  {
    q: 'Can fit-out and interior design firms use AI for FF&E?',
    a: 'Yes. AI can standardise product data, structure FF&E schedules, compare supplier quotes and lead times, flag long-lead items against the programme, and draft chasers. A designer or procurement lead approves every substitution and purchase order.',
  },
  {
    q: 'Who should own AI in a contracting company?',
    a: 'One named person, usually from operations, commercial or digital, should own it: approving tools, setting the data rules, running a use case register and measuring hours saved. They do not need to be technical. We train that person and the project teams together, so ownership and day-to-day use are set up at the same time.',
  },
  {
    q: 'Do we need new software?',
    a: 'No. Our training is built on the tools your team already pays for, such as Microsoft 365, Google Workspace, ChatGPT or Claude. We teach your people to get more from them, so there is no new system to buy or roll out.',
  },
  {
    q: 'Is it safe to use AI with tender, client and commercial documents?',
    a: 'It can be, with the right plan and rules. We cover which tools and plans protect your data, what should never be pasted into a public AI tool, how to respect client NDAs and confidentiality clauses, and how to write a simple usage policy, so your team knows exactly where the line is.',
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
        description="Hands-on AI training for contracting, fit-out and interior design teams: tendering, estimating, design coordination, FF&E and contract admin, using the tools you already have."
        url={PATH}
        dateModified={STATIC_REVIEWED_ISO}
      />
      <ServiceJsonLd
        name="AI training for contractors"
        description="Hands-on, role-specific AI training for contracting, fit-out and interior design firms, covering tendering, estimating, design coordination, FF&E, contract admin and site reporting, built on the tools the team already uses. UAE and global."
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
        intro="Examples of the work we train contracting, fit-out and interior teams to speed up. Every output is checked by the person who owns it."
      />

      <ContentSections
        sections={PROCESS}
        eyebrow="How it works"
        heading="From document flow to habits that stick"
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
        intro="Short answers on tendering, estimating, FF&E, who owns AI, data safety and working with UAE teams."
      />

      <CtaStrip
        heading="Want your team to get hours back every week?"
        sub="Book a free call. We will look at where your tendering, estimating and FF&E time goes. No deck, no obligation."
      />

      <OtherServices />
    </>
  );
}

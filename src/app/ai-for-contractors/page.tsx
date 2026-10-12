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
// real document types, human sign-off on anything contractual. Typical use
// cases, not client results, so no invented numbers. Kept short on purpose:
// each card is a one-line outcome plus two terms a contractor will recognise.
const USE_CASES: Section[] = [
  {
    h2: 'Tender returns and PQQs',
    body: 'Read the ITT, build the compliance matrix and draft the first pass of method statements.',
    points: ['Flag onerous clauses and qualifications', 'Reuse past tender returns'],
  },
  {
    h2: 'Estimating and comparatives',
    body: 'Level subcontractor quotes against scope. The estimator still owns every rate and quantity.',
    points: ['Spot gaps and exclusions', 'Draft assumptions and clarifications'],
  },
  {
    h2: 'RFIs and submittals',
    body: 'Faster, cleaner coordination between design, consultants and site.',
    points: ['Draft referenced RFIs', 'Check submittals against the spec'],
  },
  {
    h2: 'FF&E and procurement',
    body: 'Structure the schedule, compare supplier quotes and keep long-lead items on the programme.',
    points: ['Standardise product data', 'Draft supplier chasers'],
  },
  {
    h2: 'Variations and contract admin',
    body: 'Turn instructions and site records into notices and a dated record behind any claim.',
    points: ['Draft variation notices', 'Build the EOT chronology'],
  },
  {
    h2: 'Site reports and handover',
    body: 'Rough notes and photos become consistent reports, snag lists and handover packs.',
    points: ['Weekly progress reports', 'Snag list and O&M index'],
  },
];

const SECTIONS: Section[] = [
  {
    h2: 'Why contractors are looking at AI now',
    body: 'Tight margins and a heavy document load. The gain is hours back every week on work that follows a pattern.',
  },
  {
    h2: 'Training first, on the tools you have',
    body: 'Role-specific, hands-on sessions in Microsoft 365, Google Workspace, ChatGPT or Claude, on your own documents.',
  },
  {
    h2: 'Owning AI properly',
    body: 'Approved tools, data rules for tender and client information, and a named person who signs off anything contractual.',
  },
  {
    h2: 'Implementation, when ready',
    body: 'Once your team is confident, we build templates and workflows around what training proved useful.',
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

      <ContentSections sections={SECTIONS} wide columns={4} />

      <ContentSections
        sections={USE_CASES}
        wide
        eyebrow="Typical use cases"
        heading="Where contractors get time back"
        intro="Examples of the work we train contracting, fit-out and interior teams to speed up. Every output is checked by the person who owns it."
      />

      <ContentSections
        sections={PROCESS}
        wide
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

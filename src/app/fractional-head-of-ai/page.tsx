import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/page/PageHero';
import ContentSections from '@/components/page/ContentSections';
import CompareNotebook from '@/components/page/CompareNotebook';
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

const PATH = '/fractional-head-of-ai';
const CANONICAL = `https://traqcollective.com${PATH}`;

// Slug and metadata keep the "fractional Head of AI / Chief AI Officer" terms so
// the page still captures that search. The visible lead and identity are the
// Embedded AI Partner offer; the terms appear as a definition, FAQ and schema,
// never as how we describe ourselves.
export const metadata: Metadata = {
  title: 'Embedded AI partner: a better fit than a fractional Head of AI',
  description:
    'Looking for a fractional Head of AI or Chief AI Officer? Traq Collective gives you senior AI leadership as an embedded partner: strategy, vendor decisions, rollout and guardrails, working with your team and accountable to outcomes. UAE and global.',
  alternates: { canonical: CANONICAL },
  keywords: [
    'fractional Head of AI',
    'Chief AI Officer',
    'embedded AI partner',
    'AI transformation partner',
    'AI consulting partner',
  ],
  openGraph: {
    title: 'Your embedded AI partner | Traq Collective',
    description:
      'A better fit than a fractional Head of AI or Chief AI Officer: senior AI leadership delivered as an embedded partner who works with your team, not for it.',
    url: CANONICAL,
  },
};

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', url: '/' },
  { name: 'Embedded AI Partner', url: PATH },
];

const HERO = {
  eyebrow: 'Flagship engagement',
  h1: 'Your embedded AI partner',
  // Capture + reframe (40-60 words). Captures the search, then reframes to the
  // partner offer. No em dash.
  intro:
    'Looking for a fractional Head of AI or Chief AI Officer? Here is a better fit. Traq Collective embeds as your AI partner: we set the strategy, choose the tools, lead the rollout and put guardrails in place, working alongside your team and accountable to outcomes. You get senior AI leadership without adding a full-time hire.',
};

type Section = { h2: string; body: string; points?: string[] };

const SECTIONS: Section[] = [
  {
    h2: 'What is a fractional Head of AI, and do you need one?',
    body: 'A fractional Head of AI is how people search for senior, part-time AI leadership: someone who sets the strategy, picks the tools, leads the rollout and owns the guardrails. We deliver exactly that, but as a partner rather than an employee, so you get the seniority without a headcount, a job title or a year-long hire to manage.',
  },
  {
    h2: 'What an embedded AI partner does',
    body: 'We work with you, not for you: sitting alongside your team in your own tools, setting the direction together, and prioritising the work that pays off first. We stay accountable to outcomes, not a new role on your org chart, and you keep everything we build.',
  },
  {
    h2: 'What it costs and how engagements work',
    body: 'We do not publish prices, because the right scope depends on your team and goals. We start with a fast, fixed-scope audit so you see value first, then move into the partnership at a cadence that fits, following a clear path from audit to trained team to embedded, measured AI by day 90.',
  },
];

// Hiring a Head of AI vs an embedded AI partner. Intercepts the
// "do I need to hire one?" crowd. Paired contrasts: hire[i] (what doesn't work)
// sits opposite partner[i] (what works).
const COMPARISON: { dimension: string; partner: string; hire: string }[] = [
  {
    dimension: 'Time to value',
    partner: 'Days. We embed and start in week one, value shown in the first weeks',
    hire: 'Months of search, hiring and onboarding before any output',
  },
  {
    dimension: 'Cost',
    partner: 'A scoped engagement, sized to the work and flexible',
    hire: 'A full executive salary, benefits and equity, every year',
  },
  {
    dimension: 'Risk',
    partner: 'A fixed-scope audit proves value before any long commitment',
    hire: 'A permanent bet on one hire before you know the fit',
  },
  {
    dimension: 'Flexibility',
    partner: 'Scale the cadence up or down as your needs change',
    hire: 'A fixed headcount and overhead, hard to unwind',
  },
  {
    dimension: 'Capability stays in your team',
    partner: 'We build it into your people and make ourselves redundant',
    hire: 'Capability tied to one person who may move on',
  },
];

const FAQS: Qa[] = [
  {
    q: 'Do I need to hire a Chief AI Officer or Head of AI?',
    a: 'Usually not yet. Most mid-market teams do not have a full year of full-time AI work, so a permanent executive hire is expensive leadership you cannot keep busy. An embedded AI partner gives you the same senior direction and rollout, working with your team part-time, with the capability left in your people. Hire the role later if the volume of work justifies it.',
  },
  {
    q: 'How much does an embedded AI partner cost?',
    a: 'Far less than a full-time hire. You pay for a scoped, part-time engagement rather than a six-figure salary, benefits and equity. We start with a fixed-scope audit so you see the value first, then agree a cadence that fits your needs. Book a call and we will scope it to your situation.',
  },
  {
    q: 'How is this different from a consultant?',
    a: 'A consultant typically hands you a plan and leaves. An embedded AI partner owns the outcome with you: we set strategy, lead the rollout, train your team and stay accountable for adoption, working alongside you part-time. It is leadership and delivery, not just advice on a slide.',
  },
  {
    q: 'Do you work with UAE companies?',
    a: 'Yes. We are based in the UAE and work with teams across Dubai, Abu Dhabi and the wider region, and we deliver remotely worldwide. You can reach us on +971 50 868 7196 or at hello@traqcollective.com.',
  },
];

export default function FractionalHeadOfAiPage() {
  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbItems} />
      <WebPageJsonLd
        name="Embedded AI partner: a better fit than a fractional Head of AI"
        description="Senior AI leadership as an embedded partner: strategy, vendor decisions, rollout and guardrails, without a full-time executive hire."
        url="/fractional-head-of-ai"
        dateModified={STATIC_REVIEWED_ISO}
      />
      <ServiceJsonLd
        name="Embedded AI Partner"
        description="Senior AI leadership delivered as an embedded partner: strategy, vendor decisions, rollout and guardrails, working with your team and accountable to outcomes. A better fit than a fractional Head of AI or Chief AI Officer. UAE and global."
        url={PATH}
        serviceType="AI transformation partner"
      />
      <FaqPageJsonLd qas={FAQS} />

      <PageHero
        eyebrow={HERO.eyebrow}
        h1={HERO.h1}
        intro={HERO.intro}
        breadcrumbs={breadcrumbItems}
        reviewedIso={STATIC_REVIEWED_ISO}
        motif="embedded"
        secondary={{ label: 'See how we work', href: '/#how-we-work' }}
      />

      <ContentSections
        sections={SECTIONS}
        footnote={
          <>
            See the{' '}
            <Link
              href="/#ways-to-work"
              className="font-semibold text-traq-purple underline-offset-4 hover:underline"
            >
              three ways to work
            </Link>{' '}
            for how engagements are structured.
          </>
        }
      />

      <CompareNotebook
        title="Hiring a Head of AI vs an embedded AI partner"
        intro="Both give you senior AI leadership. The difference is how fast you see value, how much you spend, the risk you take on, and where the capability ends up."
        bad={{ label: 'Hiring a Head of AI', items: COMPARISON.map((r) => r.hire) }}
        good={{ label: 'An embedded AI partner', items: COMPARISON.map((r) => r.partner) }}
      />

      <FaqBlock
        qas={FAQS}
        heading="Embedded AI partner: common questions"
        intro="Short answers on whether to hire a Head of AI, what an embedded partner costs, and working with UAE teams."
      />

      <CtaStrip
        heading="Want senior AI leadership without a full-time hire?"
        sub="Book a free call. We will scope an embedded partnership to your team. No deck, no obligation."
      />

      <OtherServices />
    </>
  );
}

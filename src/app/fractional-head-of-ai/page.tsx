import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/page/PageHero';
import ContentSections from '@/components/page/ContentSections';
import FaqBlock from '@/components/page/FaqBlock';
import CtaStrip from '@/components/page/CtaStrip';
import { BreadcrumbsJsonLd, FaqPageJsonLd, ServiceJsonLd } from '@/components/seo/JsonLd';
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
    body: 'A fractional Head of AI is how people search for senior, part-time AI leadership: someone who sets the strategy, decides which tools to back, leads the rollout and puts guardrails in place. We deliver exactly that, but as a partner, not an employee. We work with your team to build the capability, then leave it with them. You get the seniority without a headcount, a job title or a year-long hire to manage.',
    points: [
      'Sets the AI strategy and sequences the work by payoff',
      'Makes vendor and tooling decisions for your context',
      'Leads training and rollout so adoption actually happens',
      'Owns guardrails, safe use and outcomes you can measure',
    ],
  },
  {
    h2: 'What an embedded AI partner does',
    body: 'We work with you, not for you. We sit alongside your team in your own tools, set the direction together, and prioritise the work that pays off first. We are your partner and consultants, accountable to outcomes, not a new role on your org chart. You keep everything we build, and your team learns to run it without us.',
  },
  {
    h2: 'What it costs and how engagements work',
    body: 'We do not publish prices, because the right scope depends on your team and goals. We start with a fast, fixed-scope audit so you see value before any long commitment, then move into the embedded partnership at a cadence that fits. We agree what we are moving and put a number on it. You keep everything we build, and we take on a limited number of partners each quarter so every team gets senior attention.',
  },
  {
    h2: 'What you get in the first 90 days',
    body: 'Our engagement follows a clear path: audit and map where AI saves the most time, train your team on the workflows that matter, then implement and embed AI into daily work with guardrails. By day 90 we measure adoption and impact and your team owns the capability.',
  },
];

// Hiring a Head of AI vs an embedded AI partner. Intercepts the
// "do I need to hire one?" crowd. Real table, high citation value.
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

const RELATED: { label: string; href: string }[] = [
  { label: 'Consultation & strategy', href: '/services/ai-consulting' },
  { label: 'AI consulting and training in the UAE', href: '/ai-consulting-uae' },
  { label: 'About Traq Collective', href: '/about' },
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

      {/* Intercept: hiring a Head of AI vs an embedded AI partner - comparison table */}
      <section className="bg-bg-subtle px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="eyebrow eyebrow-accent">Compare</div>
          <h2 className="section-title mt-3">
            Hiring a Head of AI vs an embedded AI partner
          </h2>
          <p className="section-sub mt-4">
            Both give you senior AI leadership. The difference is how fast you see value, how much
            you spend, the risk you take on, and where the capability ends up.
          </p>

          <div className="mt-8 overflow-x-auto rounded-[20px] border border-border-subtle bg-white shadow-card">
            <table className="w-full border-collapse text-left text-[14px] sm:text-[15px]">
              <caption className="sr-only">
                Hiring a full-time Head of AI compared with an embedded AI partner across time to
                value, cost, risk, flexibility and whether the capability stays in your team
              </caption>
              <thead>
                <tr className="border-b border-border-subtle bg-bg-subtle">
                  <th scope="col" className="px-5 py-4 font-semibold text-ink sm:px-6">
                    Consideration
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold text-ink sm:px-6">
                    Embedded AI partner (Traq)
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold text-ink sm:px-6">
                    Hiring a Head of AI
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr
                    key={row.dimension}
                    className="border-b border-border-subtle last:border-b-0 align-top"
                  >
                    <th
                      scope="row"
                      className="px-5 py-4 text-left font-semibold text-ink sm:px-6"
                    >
                      {row.dimension}
                    </th>
                    <td className="px-5 py-4 text-ink-soft sm:px-6">{row.partner}</td>
                    <td className="px-5 py-4 text-ink-soft sm:px-6">{row.hire}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-bg-base px-5 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-5xl">
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
        heading="Embedded AI partner: common questions"
        intro="Short answers on whether to hire a Head of AI, what an embedded partner costs, and working with UAE teams."
      />

      <CtaStrip
        heading="Want senior AI leadership without a full-time hire?"
        sub="Book a free call. We will scope an embedded partnership to your team. No deck, no obligation."
      />
    </>
  );
}

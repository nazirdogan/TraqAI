import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/page/PageHero';
import FaqBlock from '@/components/page/FaqBlock';
import CtaStrip from '@/components/page/CtaStrip';
import { BreadcrumbsJsonLd, FaqPageJsonLd, ServiceJsonLd } from '@/components/seo/JsonLd';
import type { BreadcrumbItem, Qa } from '@/lib/seo/schema';

const PATH = '/fractional-head-of-ai';
const CANONICAL = `https://traqcollective.com${PATH}`;

export const metadata: Metadata = {
  title: 'A fractional Head of AI for your business',
  description:
    'A fractional Head of AI gives you senior AI leadership part-time: strategy, vendor decisions, rollout and guardrails, for a fraction of a full-time hire. Traq Collective embeds with your team. UAE and global.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'Fractional Head of AI | Traq Collective',
    description:
      'Senior AI leadership, part-time and embedded: strategy, rollout and guardrails for a fraction of a full-time hire.',
    url: CANONICAL,
  },
};

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', url: '/' },
  { name: 'Fractional Head of AI', url: PATH },
];

const HERO = {
  eyebrow: 'Flagship offer',
  h1: 'A fractional Head of AI for your business',
  // Standalone, definition-first answer (40-60 words).
  intro:
    'A fractional Head of AI is a senior AI leader who works with you part-time. You get the strategy, vendor decisions, rollout plan and guardrails of a full-time hire for a fraction of the cost. Traq Collective embeds with your team, sets the AI direction, prioritises the work that pays off first, and leads the rollout.',
};

type Section = { h2: string; body: string; points?: string[] };

const SECTIONS: Section[] = [
  {
    h2: 'What does a fractional Head of AI do?',
    body: 'The role owns your AI direction end to end, part-time. We set strategy, decide which tools to back, lead the rollout across teams, and put the guardrails in place so people use AI safely. You get senior accountability for outcomes without carrying a full-time executive salary.',
    points: [
      'Sets the AI strategy and the order of work by payoff',
      'Makes vendor and tooling decisions for your context',
      'Leads training and rollout so adoption actually happens',
      'Owns guardrails, safe use and measurable outcomes',
    ],
  },
  {
    h2: 'Fractional vs full-time Head of AI',
    body: 'A full-time Head of AI is a senior salary, months of recruiting, and a year-plus commitment before you know the fit. A fractional Head of AI gives you the same seniority part-time, starting in days and scaled to what you actually need. Most mid-market teams do not have a full year of full-time AI work yet, so they would pay for leadership they cannot keep busy. The table below compares the two side by side.',
  },
  {
    h2: 'What it costs and how engagements work',
    body: 'We do not publish prices, because the right scope depends on your team and goals. We start with a fast, fixed-scope audit so you see value before any long commitment, then move into the embedded role at a cadence that fits. We agree what we are moving and put a number on it. You keep everything we build, and we take on a limited number of partners each quarter so every team gets senior attention.',
  },
  {
    h2: 'What you get in the first 90 days',
    body: 'Our engagement follows a clear path: audit and map where AI saves the most time, train your team on the workflows that matter, then implement and embed AI into daily work with guardrails. By day 90 we measure adoption and impact and your team owns the capability.',
  },
];

// Fractional vs full-time hire. Real table, high citation value.
const COMPARISON: { dimension: string; fractional: string; fullTime: string }[] = [
  {
    dimension: 'Cost',
    fractional: 'A fraction of a full-time salary, scoped to the work',
    fullTime: 'Full executive salary, benefits and equity',
  },
  {
    dimension: 'Time to start',
    fractional: 'Days. We embed and start in week one',
    fullTime: 'Months of search, hiring and onboarding',
  },
  {
    dimension: 'Experience',
    fractional: 'A senior operator who has done this across teams',
    fullTime: 'One hire; depth depends on who you can attract',
  },
  {
    dimension: 'Commitment',
    fractional: 'Flexible cadence; scale up or down as needs change',
    fullTime: 'A permanent headcount and fixed overhead',
  },
  {
    dimension: 'Outcome',
    fractional: 'Capability your team keeps; we make ourselves redundant',
    fullTime: 'Capability tied to one person who may move on',
  },
];

const RELATED: { label: string; href: string }[] = [
  { label: 'Consultation & strategy', href: '/services/ai-consulting' },
  { label: 'AI consulting and training in the UAE', href: '/ai-consulting-uae' },
  { label: 'About Traq Collective', href: '/about' },
];

const FAQS: Qa[] = [
  {
    q: 'How much does a fractional Head of AI cost?',
    a: 'Far less than a full-time hire. You pay for a scoped, part-time engagement rather than a six-figure salary, benefits and equity. We start with a fixed-scope audit so you see the value first, then agree a cadence that fits your needs. Book a call and we will scope it to your situation.',
  },
  {
    q: 'How is it different from a consultant?',
    a: 'A consultant typically hands you a plan and leaves. A fractional Head of AI owns the outcome: we set strategy, lead the rollout, train your team and stay accountable for adoption, embedded part-time. It is leadership and delivery, not just advice on a slide.',
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
        name="Fractional Head of AI"
        description="Senior AI leadership delivered part-time and embedded: strategy, vendor decisions, rollout and guardrails for a fraction of a full-time hire. UAE and global."
        url={PATH}
        serviceType="Fractional Head of AI"
      />
      <FaqPageJsonLd qas={FAQS} />

      <PageHero
        eyebrow={HERO.eyebrow}
        h1={HERO.h1}
        intro={HERO.intro}
        breadcrumbs={breadcrumbItems}
        secondary={{ label: 'See how we work', href: '/#how-we-work' }}
      />

      <section className="bg-bg-base px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl space-y-14 sm:space-y-16">
          {SECTIONS.map((section) => (
            <div key={section.h2}>
              <h2 className="section-title max-w-2xl">{section.h2}</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-soft sm:text-[17px]">
                {section.body}
              </p>
              {section.points ? (
                <ul className="mt-6 space-y-3">
                  {section.points.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <span
                        className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-traq-purple"
                        aria-hidden="true"
                      />
                      <span className="text-[15px] leading-relaxed text-ink-soft">{point}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {section.h2 === 'What it costs and how engagements work' ? (
                <p className="mt-6 text-[15px] leading-relaxed text-ink-soft sm:text-[17px]">
                  See the{' '}
                  <Link
                    href="/#ways-to-work"
                    className="font-semibold text-traq-purple underline-offset-4 hover:underline"
                  >
                    three ways to work
                  </Link>{' '}
                  for how engagements are structured.
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      {/* Fractional vs full-time - comparison table */}
      <section className="bg-bg-subtle px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="eyebrow eyebrow-accent">Compare</div>
          <h2 className="section-title mt-3">
            Fractional vs full-time Head of AI: side-by-side
          </h2>
          <p className="section-sub mt-4">
            Both give you senior AI leadership. The difference is cost, speed, and how much risk you
            take on before you know it is working.
          </p>

          <div className="mt-8 overflow-x-auto rounded-[20px] border border-border-subtle bg-white shadow-card">
            <table className="w-full border-collapse text-left text-[14px] sm:text-[15px]">
              <caption className="sr-only">
                Fractional Head of AI compared with a full-time hire across cost, time to start,
                experience, commitment and outcome
              </caption>
              <thead>
                <tr className="border-b border-border-subtle bg-bg-subtle">
                  <th scope="col" className="px-5 py-4 font-semibold text-ink sm:px-6">
                    Consideration
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold text-ink sm:px-6">
                    Fractional Head of AI
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold text-ink sm:px-6">
                    Full-time hire
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
                    <td className="px-5 py-4 text-ink-soft sm:px-6">{row.fractional}</td>
                    <td className="px-5 py-4 text-ink-soft sm:px-6">{row.fullTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-bg-base px-5 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-3xl">
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
        heading="Fractional Head of AI: common questions"
        intro="Short answers on cost, how it differs from consulting, and working with UAE teams."
      />

      <CtaStrip
        heading="Want senior AI leadership without a full-time hire?"
        sub="Book a free call. We will scope a fractional engagement to your team. No deck, no obligation."
      />
    </>
  );
}

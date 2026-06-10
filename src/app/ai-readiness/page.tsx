import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/page/PageHero';
import FaqBlock from '@/components/page/FaqBlock';
import CtaStrip from '@/components/page/CtaStrip';
import { BreadcrumbsJsonLd, FaqPageJsonLd } from '@/components/seo/JsonLd';
import type { BreadcrumbItem, Qa } from '@/lib/seo/schema';
import { IMPACT_METRICS } from '@/lib/constants';
import AssessmentForm from './AssessmentForm';

const PATH = '/ai-readiness';
const CANONICAL = `https://traqcollective.com${PATH}`;

export const metadata: Metadata = {
  title: 'AI readiness assessment: is your company ready? (free)',
  description:
    'A free AI readiness assessment for teams. Answer nine quick questions across tools, team confidence, training, leadership buy-in and use-case clarity, then get your band (Early, Building or Ready) and tailored next steps in two minutes.',
  alternates: { canonical: CANONICAL },
  keywords: [
    'AI readiness assessment',
    'is my company AI ready',
    'AI readiness checklist',
    'AI maturity assessment',
    'AI adoption assessment',
  ],
  openGraph: {
    title: 'Free AI readiness assessment | Traq Collective',
    description:
      'See how ready your team is for AI in two minutes. Get your band and tailored next steps across tools, confidence, training, leadership and use cases.',
    url: CANONICAL,
  },
};

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', url: '/' },
  { name: 'AI Readiness Assessment', url: PATH },
];

const HERO = {
  eyebrow: 'Free assessment · 2 minutes',
  h1: 'Is your company ready for AI?',
  // Definition-first, standalone, 40-60 words. The first extractable block.
  intro:
    'An AI readiness assessment measures how prepared your team is to put AI to work. This free scorecard asks nine quick questions across five dimensions: tools in place, team confidence, training done, leadership buy-in and use-case clarity. You get a band, Early, Building or Ready, plus next steps you can act on.',
};

// Why this matters: three verified stats, reused verbatim from IMPACT_METRICS so
// the source, link and year are never invented or drifted. We pull the BYO-AI,
// training-tipping-point and training-as-#1-need stats, which map directly to
// the assessment dimensions.
const STAT_KEYS = ['78%', '79% vs 67%', '48%'] as const;
const READINESS_STATS = STAT_KEYS.map(
  (value) => IMPACT_METRICS.find((m) => m.value === value)!,
);

const RELATED: { label: string; href: string }[] = [
  { label: 'AI readiness: how to tell if your company is ready (checklist)', href: '/insights/ai-readiness-checklist' },
  { label: 'How to actually get your team using AI', href: '/insights/how-to-get-your-team-using-ai' },
  { label: 'Consultation and strategy as your AI partner', href: '/services/ai-consulting' },
];

const FAQS: Qa[] = [
  {
    q: 'What is an AI readiness assessment?',
    a: 'It is a short, structured check of how prepared your team is to use AI well. This one scores you across five dimensions: the tools you already pay for, how confident your team feels, whether they have had training, how bought-in leadership is, and how clear you are on where AI saves time. You get a band and next steps in about two minutes.',
  },
  {
    q: 'How long does the assessment take?',
    a: 'About two minutes. There are nine multiple-choice questions and no long forms. You see your result, your score by dimension and your next steps on screen straight away, and we email you a fuller plan if you want it.',
  },
  {
    q: 'What do the Early, Building and Ready bands mean?',
    a: 'Early means the tools are new to your team and little is wired in yet. Building means some people use AI and leadership is interested, but use is not yet consistent. Ready means tools are in place, your team is confident and leadership backs it, so the work is depth and governance. Each band comes with tailored next steps.',
  },
  {
    q: 'Is the AI readiness assessment free?',
    a: 'Yes, it is completely free. You get your band, your score by dimension and your next steps on screen, and a tailored plan by email if you share your details. There is no obligation and we will never share your information.',
  },
  {
    q: 'What happens after I get my results?',
    a: 'You can act on the next steps yourself, read the guides we link to, or book a free call. On the call we look at your result together and find where AI can save your team the most time. No deck, no obligation.',
  },
];

export default function AiReadinessPage() {
  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbItems} />
      <FaqPageJsonLd qas={FAQS} />

      <PageHero
        eyebrow={HERO.eyebrow}
        h1={HERO.h1}
        intro={HERO.intro}
        breadcrumbs={breadcrumbItems}
        ctaLabel="Start the assessment"
        ctaHref="#assessment"
        secondary={{ label: 'Book a free call', href: '/book' }}
      />

      {/* Brief intro to what the tool does and how to read the result. */}
      <section className="bg-bg-base px-5 pb-6 pt-2 sm:px-8 sm:pb-8">
        <div className="mx-auto max-w-2xl">
          <p className="text-[15px] leading-relaxed text-ink-soft sm:text-[17px]">
            Most teams have paid for AI tools their people barely touch. This
            assessment tells you where you stand and what to do next. Answer
            honestly about the average across your team, not your best person,
            and you will get a more useful result. Nothing is stored unless you
            ask us to email your plan.
          </p>
        </div>
      </section>

      <section id="assessment" className="scroll-mt-28 bg-bg-base px-5 pb-16 pt-6 sm:px-8 sm:pb-20">
        <AssessmentForm />
      </section>

      {/* Why this matters - three cited industry stats. */}
      <section className="bg-bg-subtle px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="eyebrow eyebrow-accent">Why readiness matters</div>
          <h2 className="section-title mt-3">Why a readiness check is worth two minutes</h2>
          <p className="section-sub mt-4">
            Readiness is mostly about people and habits, not the tools themselves.
            The research backs that up.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
            {READINESS_STATS.map((stat) => (
              <div
                key={stat.value}
                className="flex flex-col rounded-[20px] border border-border-subtle bg-white p-5 shadow-card sm:p-6"
              >
                <span className="text-3xl font-bold tracking-tight text-traq-purple sm:text-4xl">
                  {stat.value}
                </span>
                <span className="mt-2 text-[15px] font-semibold text-ink">
                  {stat.label}
                </span>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
                  {stat.description}
                </p>
                <a
                  href={stat.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 text-[12px] font-medium text-ink-faint underline-offset-2 transition-colors hover:text-traq-purple hover:underline"
                >
                  Source: {stat.source}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related reading - internal links. */}
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
        heading="AI readiness assessment: common questions"
        intro="Short answers on what the assessment measures, how long it takes, and what the bands mean."
      />

      <CtaStrip
        heading="Want to talk through your result?"
        sub="Book a free call. We will look at your band together and find where AI saves your team the most time. No deck, no obligation."
      />
    </>
  );
}

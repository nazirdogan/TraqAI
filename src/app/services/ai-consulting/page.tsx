import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/page/PageHero';
import FaqBlock from '@/components/page/FaqBlock';
import CtaStrip from '@/components/page/CtaStrip';
import { BreadcrumbsJsonLd, FaqPageJsonLd, ServiceJsonLd } from '@/components/seo/JsonLd';
import type { BreadcrumbItem, Qa } from '@/lib/seo/schema';

const PATH = '/services/ai-consulting';
const CANONICAL = `https://traqcollective.com${PATH}`;

export const metadata: Metadata = {
  title: 'AI consulting that ends in adoption, not a deck',
  description:
    'AI consulting and strategy that acts as your fractional Head of AI: we audit your tools and workflows, find the uses that save the most time, and give you a roadmap your team can act on. UAE and global.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'AI consulting and strategy | Traq Collective',
    description:
      'An AI consultant who delivers adoption, not a slide deck. Audit, roadmap, and senior direction embedded with your team.',
    url: CANONICAL,
  },
};

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', url: '/' },
  { name: 'Services', url: '/services' },
  { name: 'Consultation & Strategy', url: PATH },
];

const HERO = {
  eyebrow: 'Services · AI consulting',
  h1: 'AI consulting that ends in adoption, not a deck',
  // Standalone, definition-first answer (40-60 words).
  intro:
    'An AI consultant should leave you with a working capability, not a slide deck. Traq Collective acts as your fractional Head of AI: we audit your tools and workflows, find the uses that save the most time, and give you a prioritised roadmap your team can act on. Then we help you act on it.',
};

type Section = { h2: string; body: string; points?: string[] };

const SECTIONS: Section[] = [
  {
    h2: 'What does an AI consultant actually do?',
    body: 'A good AI consultant finds where AI saves your team real hours, decides what to do first, and sets the guardrails so people use it safely. The job is not to name a few tools and leave. We do this work alongside your team, in your own tools, so the plan fits how you actually operate.',
    points: [
      'An AI audit of your tools, workflows and where time is lost',
      'A prioritised roadmap, sequenced by payoff and effort',
      'Vendor and tooling decisions made for your context',
      'Senior direction embedded with your team, not from behind a deck',
    ],
  },
  {
    h2: 'How do Traq AI strategy engagements work?',
    body: 'We start with a fast, fixed-scope audit so you see value before any long commitment. From there we set the strategy, agree what we are moving first, and put a number on it: hours saved, tools adopted, work shipped. You keep everything we build, and your team learns to run it without us.',
  },
  {
    h2: 'Do I need AI consulting or a fractional Head of AI?',
    body: 'A short consulting engagement is right when you need direction and a plan. If you want that senior leadership on an ongoing basis, embedded part-time to set strategy and lead the rollout, that is our fractional Head of AI offer. Many teams start with a consult and move into the embedded role once there is a plan.',
  },
];

// AI consultant vs AI agency: the core "who should I hire" comparison.
// Real table, high citation value for "AI consultant vs AI agency" queries
// and reinforces the practitioner wedge from the spec.
const COMPARISON: { dimension: string; consultant: string; agency: string }[] = [
  {
    dimension: 'What you get',
    consultant: 'A senior operator embedded with your team, plus a plan your people can run',
    agency: 'A project team and deliverables built largely off-site',
  },
  {
    dimension: 'How it is delivered',
    consultant: 'Done with you, in your own tools, so the work fits how you operate',
    agency: 'Done for you, often in a black box you cannot maintain',
  },
  {
    dimension: 'Where the capability lands',
    consultant: 'In your team; we make ourselves redundant on purpose',
    agency: 'With the agency, so you keep paying to keep it running',
  },
  {
    dimension: 'Speed to value',
    consultant: 'A fixed-scope audit shows value in the first few weeks',
    agency: 'Longer discovery and scoping before anything ships',
  },
  {
    dimension: 'Accountability',
    consultant: 'A number on every engagement: hours saved, tools adopted',
    agency: 'Measured by hours billed or features delivered',
  },
];

const RELATED: { label: string; href: string }[] = [
  { label: 'Fractional Head of AI', href: '/fractional-head-of-ai' },
  { label: 'Implementation & enablement', href: '/services/ai-implementation' },
  { label: 'All AI services', href: '/services' },
];

const FAQS: Qa[] = [
  {
    q: 'How is AI consulting different from a fractional Head of AI?',
    a: 'A consulting engagement is scoped and time-bound: audit, strategy and a roadmap. A fractional Head of AI is the same senior leadership delivered on an ongoing, embedded basis, setting direction and leading the rollout part-time. Many teams begin with a consult and move into the embedded role once there is a plan.',
  },
  {
    q: 'What do I get at the end of an AI consulting engagement?',
    a: 'You get a prioritised roadmap grounded in your real tools and workflows: where AI saves the most time, what to do first, which tools to use, and the guardrails to use them safely. You get a plan your team can act on, with the value already shown, instead of a deck that gathers dust.',
  },
  {
    q: 'How is an AI consultant different from an AI agency?',
    a: 'An AI agency builds for you and keeps the capability. We embed with your team and build the capability into your people, so you are not locked into ongoing fees to keep it running. You see value in weeks from a fixed-scope audit, and you own everything we make.',
  },
  {
    q: 'Do you work with UAE companies?',
    a: 'Yes. We are based in the UAE and work with teams across Dubai, Abu Dhabi and the wider region, and we deliver remotely worldwide. You can reach us on +971 50 868 7196 or at hello@traqcollective.com.',
  },
];

export default function AiConsultingPage() {
  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbItems} />
      <ServiceJsonLd
        name="AI consulting and strategy"
        description="AI consulting that acts as your fractional Head of AI: audit, prioritised roadmap, and senior direction embedded with your team. UAE and global."
        url={PATH}
        serviceType="AI consulting"
      />
      <FaqPageJsonLd qas={FAQS} />

      <PageHero
        eyebrow={HERO.eyebrow}
        h1={HERO.h1}
        intro={HERO.intro}
        breadcrumbs={breadcrumbItems}
        secondary={{ label: 'Fractional Head of AI', href: '/fractional-head-of-ai' }}
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
            </div>
          ))}
        </div>
      </section>

      {/* AI consultant vs AI agency - comparison table (high citation value) */}
      <section className="bg-bg-subtle px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="eyebrow eyebrow-accent">Compare</div>
          <h2 className="section-title mt-3">AI consultant vs AI agency: which do you need?</h2>
          <p className="section-sub mt-4">
            Both can help. The difference is who ends up owning the capability and how fast you see
            value.
          </p>

          <div className="mt-8 overflow-x-auto rounded-[20px] border border-border-subtle bg-white shadow-card">
            <table className="w-full border-collapse text-left text-[14px] sm:text-[15px]">
              <caption className="sr-only">
                An AI consultant compared with an AI agency across what you get, how it is delivered,
                where the capability lands, speed to value and accountability
              </caption>
              <thead>
                <tr className="border-b border-border-subtle bg-bg-subtle">
                  <th scope="col" className="px-5 py-4 font-semibold text-ink sm:px-6">
                    Consideration
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold text-ink sm:px-6">
                    AI consultant (Traq)
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold text-ink sm:px-6">
                    AI agency
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr
                    key={row.dimension}
                    className="border-b border-border-subtle last:border-b-0 align-top"
                  >
                    <th scope="row" className="px-5 py-4 text-left font-semibold text-ink sm:px-6">
                      {row.dimension}
                    </th>
                    <td className="px-5 py-4 text-ink-soft sm:px-6">{row.consultant}</td>
                    <td className="px-5 py-4 text-ink-soft sm:px-6">{row.agency}</td>
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
        heading="AI consulting: common questions"
        intro="Short answers on what consulting covers and how it compares to an agency or the fractional role."
      />

      <CtaStrip
        heading="Need a plan and senior direction on AI?"
        sub="Book a free call. We will find where AI saves your team the most time. No deck, no obligation."
      />
    </>
  );
}

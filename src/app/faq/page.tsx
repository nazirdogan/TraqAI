import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/page/PageHero';
import FaqBlock from '@/components/page/FaqBlock';
import CtaStrip from '@/components/page/CtaStrip';
import { BreadcrumbsJsonLd, FaqPageJsonLd } from '@/components/seo/JsonLd';
import type { BreadcrumbItem, Qa } from '@/lib/seo/schema';

const PATH = '/faq';
const CANONICAL = `https://traqcollective.com${PATH}`;

export const metadata: Metadata = {
  title: 'AI training and consulting FAQ',
  description:
    'Answers to common questions about AI training, consulting, a fractional Head of AI, implementation, agentic AI, working in the UAE, pricing, and what makes Traq Collective different.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'FAQ | Traq Collective',
    description:
      'Common questions on AI training, consulting, a fractional Head of AI, implementation, agentic AI, UAE delivery, and pricing.',
    url: CANONICAL,
  },
};

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', url: '/' },
  { name: 'FAQ', url: PATH },
];

const HERO = {
  eyebrow: 'Frequently asked questions',
  h1: 'AI training and consulting: your questions answered',
  // Standalone, definition-first answer (40-60 words).
  intro:
    'Traq Collective helps your team actually use the AI you already pay for. We run hands-on training, embed as your AI partner, wire AI into your real workflows, and build agentic systems. Below are honest answers to what people ask before they book a call, from pricing to how we work in the UAE.',
};

/**
 * Grouped long-tail Q&As across the whole offering. Each answer is a standalone
 * 40-60 word block. Every category H3 is phrased as a real search query.
 *
 * The visible content here and the FAQPage JSON-LD must stay identical: the
 * `ALL_FAQS` array is built from these groups and passed straight to the
 * FaqPage builder, so the schema mirrors what a reader and a crawler both see.
 */
type FaqGroup = { category: string; qas: Qa[] };

const FAQ_GROUPS: FaqGroup[] = [
  {
    category: 'AI training',
    qas: [
      {
        q: 'How long does AI training for a team take?',
        a: 'A focused workshop runs from a half day to two days, built around your team’s real work. Most teams see the tipping point to regular use after about five hours of structured training. We then stay close for a few weeks so the habits stick, rather than running one session and leaving.',
      },
      {
        q: 'Do you train non-technical teams?',
        a: 'Yes. Most people we train are not technical: operations, sales, finance, marketing and support teams. We teach AI through the tasks you already do, so people leave knowing exactly how to use it in their role. No jargon, no coding, just practical sessions tied to your day-to-day work.',
      },
    ],
  },
  {
    category: 'Consulting and strategy',
    qas: [
      {
        q: 'What does an AI consultant actually do?',
        a: 'A good AI consultant audits your tools and workflows, finds the highest-payoff uses, and gives you a clear roadmap. We go further than advice. We help you choose tools, train your people, and wire AI into real work, then stay accountable for whether your team adopts it. The plan ends in use, not a slide deck.',
      },
      {
        q: 'How is a fractional Head of AI different from a consultant?',
        a: 'A consultant usually hands you a plan and leaves. What people search for as a fractional Head of AI is ongoing ownership of the outcome, which we deliver as an embedded AI partner: we set the strategy, make the tooling decisions, lead the rollout, train your team and stay accountable for adoption, working with you part-time. You get senior AI leadership and delivery, not a new hire and not just advice you act on alone.',
      },
    ],
  },
  {
    category: 'Fractional Head of AI',
    qas: [
      {
        q: 'How much does a fractional Head of AI cost?',
        a: 'Far less than a full-time hire. We deliver this as an embedded AI partner, so you pay for a scoped, part-time engagement instead of a six-figure salary, benefits and equity. We start with a fixed-scope audit so you see value before any long commitment, then agree a cadence that fits. Book a call and we will scope it to your situation.',
      },
      {
        q: 'When does a company need a fractional Head of AI?',
        a: 'When you have bought AI tools but adoption has stalled, or you keep starting AI projects that never reach daily use. If you do not yet have a full year of full-time AI work, an embedded AI partner gives you that senior direction part-time, working with your team, without paying for a full-time hire you cannot keep busy.',
      },
    ],
  },
  {
    category: 'Implementation and adoption',
    qas: [
      {
        q: 'What does AI implementation include?',
        a: 'We wire AI into the tools and workflows you already pay for, with the guardrails to use it safely. That covers setup, prompts and templates for your real tasks, light automation where it helps, and the change work to get the team using it. We measure adoption so you can see it landing.',
      },
      {
        q: 'Why is my team not using the AI tools we pay for?',
        a: 'Usually because nobody showed them how it fits their actual job, and they have no time to work it out. People try a tool once, see no clear win, and go back to the old way. We fix that by training on your real tasks and embedding AI into the workflows people use every day.',
      },
    ],
  },
  {
    category: 'Agentic AI',
    qas: [
      {
        q: 'What is agentic AI and how does it differ from a chatbot?',
        a: 'A chatbot answers when you prompt it. An agentic system takes a goal and carries out multi-step work on its own: pulling data, making decisions, and acting across tools with guardrails. We build agents and autonomous workflows, including a full operation we run end to end for a company, and we can build yours.',
      },
      {
        q: 'Can you build a custom AI agent for our business?',
        a: 'Yes. We design agents around a specific job, such as triaging enquiries, processing documents, or running a recurring workflow without manual steps. We build with you, set clear guardrails, and keep a human in the loop where it matters. Your team owns and understands the system, never a black box.',
      },
    ],
  },
  {
    category: 'Working in the UAE',
    qas: [
      {
        q: 'Do you offer AI training and consulting in the UAE?',
        a: 'Yes. We are based in the UAE and run in-person workshops across Dubai, Abu Dhabi and the wider region. Local context matters: we know the tools, languages and compliance realities here. You can reach us on +971 50 868 7196 or at hello@traqcollective.com to plan a session.',
      },
      {
        q: 'Do you only work with companies in the UAE?',
        a: 'No. The UAE is our base and a clear strength, but we work with teams worldwide and deliver remotely. Globally fluent, locally embedded. Wherever you are, you get the same hands-on approach: train your people, wire AI into real work, and leave the capability with your team.',
      },
    ],
  },
  {
    category: 'Pricing and engagements',
    qas: [
      {
        q: 'How does Traq Collective price its work?',
        a: 'We do not publish fixed prices, because the right scope depends on your team and goals. We start with a fast, fixed-scope audit so you know what you are getting and see value early. From there we agree a clear deliverable with a number on it. You keep everything we build.',
      },
    ],
  },
  {
    category: 'What makes Traq different',
    qas: [
      {
        q: 'What makes Traq Collective different from other AI consultancies?',
        a: 'We are practitioners who embed in your workflows, not a slow consultancy selling decks or a generic certificate course. We do the work with you, leave the capability in your team, and put a number on every engagement. Our anti-dependency promise is simple: we make ourselves redundant.',
      },
    ],
  },
];

// Flatten to a single ordered list. This is the exact set rendered visibly
// below and emitted as FAQPage JSON-LD, so the two always match.
const ALL_FAQS: Qa[] = FAQ_GROUPS.flatMap((group) => group.qas);

// The headline accordion shows the questions people ask most. Each one is
// pulled by exact question text from the same set above, so it stays part of
// the mirrored FAQPage content.
const HEADLINE_QUESTIONS = [
  'How much does a fractional Head of AI cost?',
  'Why is my team not using the AI tools we pay for?',
  'Do you offer AI training and consulting in the UAE?',
  'What makes Traq Collective different from other AI consultancies?',
];

const HEADLINE_FAQS: Qa[] = HEADLINE_QUESTIONS.map((question) => {
  const match = ALL_FAQS.find((qa) => qa.q === question);
  if (!match) throw new Error(`Headline FAQ not found: ${question}`);
  return match;
});

const RELATED: { label: string; href: string }[] = [
  { label: 'AI training for teams', href: '/services/ai-training' },
  { label: 'Your embedded AI partner', href: '/fractional-head-of-ai' },
  { label: 'AI consulting and training in the UAE', href: '/ai-consulting-uae' },
];

export default function FaqPage() {
  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbItems} />
      <FaqPageJsonLd qas={ALL_FAQS} />

      <PageHero
        eyebrow={HERO.eyebrow}
        h1={HERO.h1}
        intro={HERO.intro}
        breadcrumbs={breadcrumbItems}
        secondary={{ label: 'See our services', href: '/services' }}
      />

      {/* Full grouped Q&A. Every answer is a standalone 40-60 word block, and
          every heading is phrased as a real query. This is the visible mirror
          of the FAQPage JSON-LD above. */}
      <section className="bg-bg-base px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl space-y-14 sm:space-y-16">
          {FAQ_GROUPS.map((group) => (
            <div key={group.category}>
              <h2 className="section-title max-w-2xl">{group.category}</h2>
              <div className="mt-6 space-y-8">
                {group.qas.map((qa) => (
                  <div key={qa.q}>
                    <h3 className="text-[17px] font-semibold leading-snug text-ink sm:text-lg">
                      {qa.q}
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-ink-soft sm:text-[17px]">
                      {qa.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-bg-base px-5 pb-14 sm:px-8 sm:pb-16">
        <div className="mx-auto max-w-3xl">
          <div className="eyebrow eyebrow-accent">Related</div>
          <h2 className="section-title mt-3">Read more on the pages people ask about</h2>
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
        qas={HEADLINE_FAQS}
        heading="The questions people ask most"
        intro="Quick answers on pricing, adoption, UAE delivery, and what makes us different."
      />

      <CtaStrip
        heading="Still have a question? Let us answer it on a call."
        sub="Book a free call. We will look at where AI can save your team the most time. No deck, no obligation."
      />
    </>
  );
}

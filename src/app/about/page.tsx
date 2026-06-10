import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/page/PageHero';
import FaqBlock from '@/components/page/FaqBlock';
import CtaStrip from '@/components/page/CtaStrip';
import {
  BreadcrumbsJsonLd,
  FaqPageJsonLd,
  OrganizationJsonLd,
  PersonJsonLd,
} from '@/components/seo/JsonLd';
import type { BreadcrumbItem, Qa } from '@/lib/seo/schema';

const PATH = '/about';
const CANONICAL = `https://traqcollective.com${PATH}`;

export const metadata: Metadata = {
  title: 'About Traq Collective | Founder-led AI enablement',
  description:
    'Traq Collective is a founder-led AI enablement partner run by Nazir. We are practitioners, not consultants: we build AI systems, run an autonomous operation end to end, and train teams to use AI every day. UAE and global.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'About Traq Collective | Founder-led AI enablement',
    description:
      'Founder-led AI enablement by Nazir. Practitioners, not consultants. We build, we run it, we train your team, then we make ourselves redundant.',
    url: CANONICAL,
  },
};

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', url: '/' },
  { name: 'About', url: PATH },
];

const HERO = {
  eyebrow: 'About',
  h1: 'About Traq Collective.',
  // Standalone, definition-first answer (40-60 words).
  intro:
    'Traq Collective is a founder-led AI enablement partner run by Nazir. We help teams actually use the AI they already pay for: hands-on training, consulting as a fractional Head of AI, implementation, and agentic systems. We are practitioners, not consultants. We build it, run it, train your people, then make ourselves redundant. Based in the UAE, working worldwide.',
};

type Section = { h2: string; body: string; points?: string[] };

const SECTIONS: Section[] = [
  {
    h2: 'Who is behind Traq Collective?',
    body: 'Traq Collective is led by its founder, Nazir, who builds AI systems and trains teams to use them every day. The work is hands-on and senior, so you deal directly with someone who does this for real rather than a junior analyst on a markup. Nazir brings a builder background across automation, software and applied AI, and the same hands he uses to ship client work he uses on his own operation first.',
  },
  {
    h2: 'What has Nazir built?',
    body: 'We run autonomous AI, we do not only talk about it. Nazir built and operates a full autonomous operation end to end for a company he owns, where AI agents handle the day-to-day work and escalate only what needs human judgement. That operation is our proving ground. Everything we recommend to a client has already held up in production on something we run ourselves.',
  },
  {
    h2: 'Why practitioners, not consultants?',
    body: 'Most AI consulting ends in a deck and an invoice. We work inside your context and your tools, alongside your team, and we put a number on every engagement: hours saved, tools adopted, work shipped. We would rather show value in the first weeks than sell a long retainer on a promise. If we cannot move a real number, we say so.',
    points: [
      'You work directly with the person doing the build, not a middle layer',
      'Every engagement starts with what AI can actually move for you',
      'We measure adoption and hours saved, not slides delivered',
      'Recommendations are tested on our own operation before yours',
    ],
  },
  {
    h2: 'What is the anti-dependency promise?',
    body: 'The goal is capability your team keeps, not a dependency on us. We train your people, hand over what we build with documentation, and stay as much or as little as you want afterwards. Success is your team running and extending the work on their own. A consultant who has to stay forever has failed at the actual job, which is making you capable.',
  },
];

// Practitioners vs traditional consultants. Real table, high citation value and
// the on-page anchor for the "practitioners, not consultants" belief.
const COMPARISON: { dimension: string; traq: string; typical: string }[] = [
  {
    dimension: 'What you get',
    traq: 'Working AI systems and a team that can run them',
    typical: 'A strategy deck and a list of recommendations',
  },
  {
    dimension: 'Who does the work',
    traq: 'The founder who builds and runs AI directly',
    typical: 'A junior analyst on a senior-rate markup',
  },
  {
    dimension: 'Proof',
    traq: 'An autonomous operation we run end to end ourselves',
    typical: 'Case studies and frameworks from elsewhere',
  },
  {
    dimension: 'How success is measured',
    traq: 'Hours saved, tools adopted, work shipped',
    typical: 'Deliverables filed and hours billed',
  },
  {
    dimension: 'End state',
    traq: 'Your team owns it; we make ourselves redundant',
    typical: 'An open retainer and ongoing dependency',
  },
];

const RELATED: { label: string; href: string }[] = [
  { label: 'All AI services', href: '/services' },
  { label: 'Fractional Head of AI', href: '/fractional-head-of-ai' },
  { label: 'AI consulting and training in the UAE', href: '/ai-consulting-uae' },
];

const FAQS: Qa[] = [
  {
    q: 'Who runs Traq Collective?',
    a: 'Traq Collective is founder-led by Nazir, who builds AI systems and trains teams to use them every day. You work directly with the person doing the build, not a junior analyst on a markup. The hands that ship client work run our own autonomous operation first.',
  },
  {
    q: 'What does "practitioners, not consultants" actually mean?',
    a: 'It means we build and run AI ourselves before we advise you on it. We work inside your tools alongside your team and put a number on every engagement: hours saved, tools adopted, work shipped. We would rather show value in the first weeks than sell a long retainer on a promise.',
  },
  {
    q: 'What has Nazir built with AI?',
    a: 'Nazir built and runs a full autonomous operation end to end for a company he owns, where AI agents handle the day-to-day work and escalate only what needs judgement. That operation is our proving ground, so everything we recommend has already held up in production on something we run.',
  },
  {
    q: 'Will I be locked into an ongoing retainer?',
    a: 'No. The goal is capability your team keeps, not a dependency on us. We train your people, hand over what we build with documentation, and stay as much or as little as you want afterwards. A consultant who has to stay forever has failed at the actual job.',
  },
  {
    q: 'Do you work with companies outside the UAE?',
    a: 'Yes. We are based in the UAE and run in-person work across Dubai and Abu Dhabi, and we deliver remotely with teams worldwide. You can reach us on +971 50 868 7196 or at hello@traqcollective.com to talk through your situation.',
  },
];

export default function AboutPage() {
  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbItems} />
      <OrganizationJsonLd />
      <PersonJsonLd />
      <FaqPageJsonLd qas={FAQS} />

      <PageHero
        eyebrow={HERO.eyebrow}
        h1={HERO.h1}
        intro={HERO.intro}
        breadcrumbs={breadcrumbItems}
        secondary={{ label: 'See how we work', href: '/#how-we-work' }}
      />

      {/* Founder block. Photo + extended bio are pending assets (spec section 12);
          the Person JSON-LD references /founder/nazir.jpg. The placeholder below is
          marked visibly so the page reads complete and is swapped when confirmed. */}
      <section className="bg-bg-base px-5 pb-4 pt-4 sm:px-8 sm:pb-6 sm:pt-6">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col gap-5 rounded-[20px] border border-border-subtle bg-white p-6 shadow-card sm:flex-row sm:items-center sm:gap-7 sm:p-7">
            <div
              className="flex h-20 w-20 flex-none items-center justify-center rounded-full border border-dashed border-border-strong bg-bg-subtle text-[13px] font-semibold text-ink-faint sm:h-24 sm:w-24"
              aria-hidden="true"
            >
              Photo
            </div>
            <div>
              <p className="text-base font-semibold text-ink sm:text-lg">Nazir</p>
              <p className="mt-1 text-[14px] leading-relaxed text-ink-soft sm:text-[15px]">
                Founder, AI enablement partner. Builds AI systems, runs an autonomous operation end
                to end, and trains teams to use AI every day.
              </p>
              <p className="mt-2 text-[12px] font-medium uppercase tracking-wide text-ink-faint">
                Founder photo and full bio coming soon
              </p>
            </div>
          </div>
        </div>
      </section>

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
              {section.h2 === 'Why practitioners, not consultants?' ? (
                <p className="mt-6 text-[15px] leading-relaxed text-ink-soft sm:text-[17px]">
                  See the work itself across{' '}
                  <Link
                    href="/services"
                    className="font-semibold text-traq-purple underline-offset-4 hover:underline"
                  >
                    our AI services
                  </Link>{' '}
                  and the{' '}
                  <Link
                    href="/fractional-head-of-ai"
                    className="font-semibold text-traq-purple underline-offset-4 hover:underline"
                  >
                    fractional Head of AI
                  </Link>{' '}
                  engagement.
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      {/* Practitioners vs traditional consultants - comparison table */}
      <section className="bg-bg-subtle px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="eyebrow eyebrow-accent">Compare</div>
          <h2 className="section-title mt-3">
            How is Traq different from a traditional AI consultant?
          </h2>
          <p className="section-sub mt-4">
            Both can write you a strategy. The difference is whether the work gets built, who builds
            it, and whether your team can run it without us.
          </p>

          <div className="mt-8 overflow-x-auto rounded-[20px] border border-border-subtle bg-white shadow-card">
            <table className="w-full border-collapse text-left text-[14px] sm:text-[15px]">
              <caption className="sr-only">
                Traq Collective compared with a traditional AI consultant across what you get, who
                does the work, proof, how success is measured and the end state
              </caption>
              <thead>
                <tr className="border-b border-border-subtle bg-bg-subtle">
                  <th scope="col" className="px-5 py-4 font-semibold text-ink sm:px-6">
                    Consideration
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold text-ink sm:px-6">
                    Traq Collective
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold text-ink sm:px-6">
                    Typical AI consultant
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr
                    key={row.dimension}
                    className="border-b border-border-subtle align-top last:border-b-0"
                  >
                    <th scope="row" className="px-5 py-4 text-left font-semibold text-ink sm:px-6">
                      {row.dimension}
                    </th>
                    <td className="px-5 py-4 text-ink-soft sm:px-6">{row.traq}</td>
                    <td className="px-5 py-4 text-ink-soft sm:px-6">{row.typical}</td>
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
        heading="About Traq Collective: common questions"
        intro="Short answers on who runs Traq, what we have built, and how we work."
      />

      <CtaStrip
        heading="Want to work with a practitioner, not a slide deck?"
        sub="Book a free call. We will look at where AI saves your team the most time. No deck, no obligation."
      />
    </>
  );
}

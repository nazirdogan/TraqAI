import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/page/PageHero';
import FaqBlock from '@/components/page/FaqBlock';
import CtaStrip from '@/components/page/CtaStrip';
import { BreadcrumbsJsonLd, FaqPageJsonLd, ServiceJsonLd } from '@/components/seo/JsonLd';
import type { BreadcrumbItem, Qa } from '@/lib/seo/schema';

const PATH = '/services/ai-implementation';
const CANONICAL = `https://traqcollective.com${PATH}`;

export const metadata: Metadata = {
  title: 'We wire AI into the tools you already pay for',
  description:
    'AI implementation and adoption: we set up AI inside your real workflows, add the guardrails to use it safely, and make sure your team actually adopts it. Not a handover doc. UAE and global.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'AI implementation and adoption | Traq Collective',
    description:
      'We wire AI into the tools you already pay for, with guardrails, and make sure your team adopts it.',
    url: CANONICAL,
  },
};

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', url: '/' },
  { name: 'Services', url: '/services' },
  { name: 'Implementation & Enablement', url: PATH },
];

const HERO = {
  eyebrow: 'Services · AI implementation',
  h1: 'We wire AI into the tools you already pay for',
  // Standalone, definition-first answer (40-60 words).
  intro:
    'AI implementation is the work of putting AI inside the tools and workflows your team uses every day, with the guardrails to use it safely. Traq Collective sets it up in your real workflows, then makes sure the team actually adopts it. You get a working capability your people own, not a handover doc.',
};

type Section = { h2: string; body: string; points?: string[] };

const SECTIONS: Section[] = [
  {
    h2: 'What AI implementation involves',
    body: 'We connect AI to the systems you already run, so it shows up where the work happens instead of in a separate tab nobody opens. That means the right prompts, the right access, and the guardrails that keep output accurate and safe, all built into your existing tools.',
    points: [
      'AI wired into the tools and workflows you already pay for',
      'Prompts, templates and guardrails for safe, accurate use',
      'Access and permissions set up so the right people can use it',
      'Adoption support so the team uses it, not a handover doc',
    ],
  },
  {
    h2: 'How we make adoption stick',
    body: 'A tool nobody uses is not implemented. We roll out in stages, train the people who will use it on their real tasks, and stay close while the habits form. We measure adoption and the hours saved, then adjust, so the capability holds after we step back.',
  },
  {
    h2: 'From plan to working capability',
    body: 'If you already have a roadmap, we build and embed it. If you do not, we can audit first through our consulting and strategy service, then implement. Either way you end up owning what we build, with your team able to run and extend it.',
  },
];

const RELATED: { label: string; href: string }[] = [
  { label: 'Consultation & strategy', href: '/services/ai-consulting' },
  { label: 'Agentic AI', href: '/services/agentic-ai' },
  { label: 'All AI services', href: '/services' },
];

const FAQS: Qa[] = [
  {
    q: 'Do we need new tools, or can you use what we have?',
    a: 'We start with the tools you already pay for, like ChatGPT, Copilot or Gemini, and wire AI into the workflows around them. We only recommend something new when there is a clear gap and a clear payoff, so you are not stacking up licences your team will not use.',
  },
  {
    q: 'How do you keep AI use safe and accurate?',
    a: 'We build guardrails into the setup: clear prompts and templates, the right access and permissions, and review steps where accuracy matters. People are trained on when to trust output and when to check it, so AI speeds the work up without quietly introducing mistakes.',
  },
  {
    q: 'What happens after implementation?',
    a: 'Your team owns it. We measure adoption and the hours saved, hand over the prompts and workflows, and stay as much or as little as you want. The goal is a capability your people can run and extend on their own, not a dependency on us.',
  },
];

export default function AiImplementationPage() {
  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbItems} />
      <ServiceJsonLd
        name="AI implementation and enablement"
        description="We wire AI into the tools and workflows you already pay for, with guardrails, and make sure your team adopts it. UAE and global."
        url={PATH}
        serviceType="AI implementation"
      />
      <FaqPageJsonLd qas={FAQS} />

      <PageHero
        eyebrow={HERO.eyebrow}
        h1={HERO.h1}
        intro={HERO.intro}
        breadcrumbs={breadcrumbItems}
        secondary={{ label: 'See all services', href: '/services' }}
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

      <section className="bg-bg-base px-5 pb-16 sm:px-8 sm:pb-20">
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
        heading="AI implementation: common questions"
        intro="Short answers on tools, safety and what happens after we embed AI."
      />

      <CtaStrip
        heading="Know what to do but need it built and adopted?"
        sub="Book a free call. We will wire AI into your real workflows and make sure the team uses it. No deck, no obligation."
      />
    </>
  );
}

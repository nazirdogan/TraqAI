import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/page/PageHero';
import FaqBlock from '@/components/page/FaqBlock';
import CtaStrip from '@/components/page/CtaStrip';
import { BreadcrumbsJsonLd, FaqPageJsonLd, ServiceJsonLd } from '@/components/seo/JsonLd';
import type { BreadcrumbItem, Qa } from '@/lib/seo/schema';

const PATH = '/services/ai-training';
const CANONICAL = `https://traqcollective.com${PATH}`;

export const metadata: Metadata = {
  title: 'AI training for teams that actually use it',
  description:
    'AI training for teams and companies, built around your real work. Role-specific, hands-on workshops that move people from hesitant to confident. Delivered in-person across the UAE and remotely worldwide.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'AI training for teams | Traq Collective',
    description:
      'Hands-on, role-specific AI training built around your team’s real work. UAE in-person and remote worldwide.',
    url: CANONICAL,
  },
};

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', url: '/' },
  { name: 'Services', url: '/services' },
  { name: 'AI Training', url: PATH },
];

const HERO = {
  eyebrow: 'Services · AI training',
  h1: 'AI training for teams that actually use it',
  // Standalone, definition-first answer (40-60 words).
  intro:
    'Good AI training teaches your people to use AI on their own work, not just explains what it is. Traq Collective runs hands-on, role-specific workshops built around your team’s real tasks, so people leave knowing exactly how to apply AI in their job. We deliver in person across the UAE and remotely worldwide.',
};

type Section = { h2: string; body: string; points?: string[] };

const SECTIONS: Section[] = [
  {
    h2: 'What AI training for teams covers',
    body: 'We start from the work your team already does, then teach the AI skills that save the most time on it. Sessions are practical and specific to each role, so a finance lead and a sales rep leave with different, directly usable habits.',
    points: [
      'Role-specific prompts and workflows for the tools you already pay for',
      'Hands-on practice on your team’s real tasks, not generic demos',
      'Guardrails for safe, accurate use so people trust the output',
      'Capability that stays in-house after we leave',
    ],
  },
  {
    h2: 'How our workshops work',
    body: 'Each workshop is built for your team, not pulled off a shelf. We learn the work first, run live hands-on sessions, then check in so the new habits hold. Research shows comfort with AI nearly doubles after structured training, and people who get more than five hours of practice become regular users at far higher rates, so we design for practice, not slideware.',
  },
  {
    h2: 'AI training in the UAE',
    body: 'We run in-person AI workshops for teams across Dubai, Abu Dhabi and the wider UAE, and deliver the same training remotely for teams anywhere. The content is built around your context and tools either way; only the delivery format changes.',
  },
];

const RELATED: { label: string; href: string }[] = [
  { label: 'All AI services', href: '/services' },
  { label: 'Consultation & strategy', href: '/services/ai-consulting' },
  { label: 'AI consulting and training in the UAE', href: '/ai-consulting-uae' },
];

const FAQS: Qa[] = [
  {
    q: 'How long does AI training take?',
    a: 'Most teams start with a half-day or full-day workshop, then a short follow-up a few weeks later so the habits stick. Research points to five-plus hours of practice as the tipping point for regular use, so we scope enough hands-on time to get there, not a one-off talk.',
  },
  {
    q: 'Do you train non-technical teams?',
    a: 'Yes. Most of the people we train are not technical. We teach AI on the work they already do, in plain language, with no code required. Finance, sales, operations and admin teams are exactly who benefit most from practical, role-specific training.',
  },
  {
    q: 'Do you run AI training in the UAE?',
    a: 'Yes. We run in-person workshops for teams across Dubai, Abu Dhabi and the wider UAE, and deliver the same training remotely for teams worldwide. The work is the same wherever your team sits; only the delivery format changes.',
  },
];

export default function AiTrainingPage() {
  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbItems} />
      <ServiceJsonLd
        name="AI training for teams"
        description="Hands-on, role-specific AI training built around your team’s real work. Delivered in person across the UAE and remotely worldwide."
        url={PATH}
        serviceType="AI training"
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
        heading="AI training: common questions"
        intro="Short answers on how training works and who it is for."
      />

      <CtaStrip
        heading="Want your team using AI by next month?"
        sub="Book a free call. We will scope a workshop around your team’s real work. No deck, no obligation."
      />
    </>
  );
}

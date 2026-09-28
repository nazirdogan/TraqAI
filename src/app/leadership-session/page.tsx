import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/page/Breadcrumbs';
import FaqBlock from '@/components/page/FaqBlock';
import {
  BreadcrumbsJsonLd,
  FaqPageJsonLd,
  ServiceJsonLd,
  WebPageJsonLd,
} from '@/components/seo/JsonLd';
import { COMPANY } from '@/lib/constants';
import { OG_IMAGE } from '@/lib/metadata';
import type { BreadcrumbItem, Qa } from '@/lib/seo/schema';

/**
 * The leadership session: a half or full day at the client's office, sold to
 * owner-led UAE firms. Written to be forwarded: an HR or L&D lead sends the
 * link, and the owner has to get the point from the hero alone.
 *
 * No prices on the page, per the disclosure rule. The fee is confirmed on the
 * scoping call.
 *
 * The CTA is an email, not /book. /book is the 20 minute AI Intro and its
 * scheduler is still dead, so sending a forwarded owner there would land them
 * on the wrong call with a fallback. The email arrives pre-filled with the
 * three things the scoping call needs.
 */

const PATH = '/leadership-session';
const CANONICAL = `https://traqcollective.com${PATH}`;
const REVIEWED_ISO = '2026-09-28';

const TITLE = 'AI leadership workshop for UAE teams';
const DESCRIPTION =
  'A hands-on AI session for UAE leadership teams. Each leader brings a real task and leaves with it working, plus a clear plan. Book a 15-minute call.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  keywords: [
    'AI training for leadership Dubai',
    'corporate AI workshop UAE',
    'AI training for companies Dubai',
  ],
  openGraph: {
    images: [OG_IMAGE],
    title: `${TITLE} | Traq Collective`,
    description: DESCRIPTION,
    url: CANONICAL,
    type: 'website',
  },
};

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', url: '/' },
  { name: 'Leadership session', url: PATH },
];

const SCOPING_HREF = `mailto:${COMPANY.email}?subject=${encodeURIComponent(
  'Leadership session: 15-minute scoping call',
)}&body=${encodeURIComponent(
  [
    'Hi Nazir,',
    '',
    "We'd like to book a 15-minute scoping call for the leadership session.",
    '',
    'Company:',
    'Roughly how many leaders would attend:',
    'Half day or full day (or not sure yet):',
    'Two or three times that suit for the call:',
    '',
    'Thanks,',
  ].join('\n'),
)}`;

const CTA_PRIMARY =
  'group inline-flex items-center justify-center gap-2.5 rounded-full bg-traq-purple px-7 py-3.5 text-sm font-semibold text-white shadow-card transition-all hover:-translate-y-px hover:bg-traq-purple-ink hover:shadow-cardHover active:scale-[0.98]';

const CTA_LABEL = 'Book a 15-minute scoping call';

const PROBLEM_QUOTES = [
  "We bought licences and nobody really uses them. A few people paste things into ChatGPT, and that's it.",
  "I've been asked to sort out AI training, but I don't know what good looks like, or how to get it signed off.",
  "I don't know what our staff are putting into these tools, and client documents are confidential.",
];

const CHANGES: { title: string; body: string }[] = [
  {
    title: 'Your own work, not demos.',
    body: 'Before the session, each leader sends one real task: a tender review, a client proposal, a job description, a monthly report. The session is built around those tasks. Everyone leaves with at least one working prompt or workflow.',
  },
  {
    title: 'Safe from day one.',
    body: 'You agree the ground rules in the room: which tools, which documents, and who checks what. AI checks, people decide. Your IT lead gets a clear setup, not a surprise.',
  },
  {
    title: 'A plan with a number on it.',
    body: 'The session ends with a named next step, the one or two workflows worth building first, and what they should save. Leadership decides from evidence, not a sales pitch.',
  },
];

const STEPS: { title: string; body: string }[] = [
  {
    title: '15-minute scoping call.',
    body: 'We agree who attends, half day or full day, and what the business needs from it.',
  },
  {
    title: 'Each leader sends one task.',
    body: 'A short form, a week before. This is what makes the session work.',
  },
  {
    title: 'The session, at your office.',
    body: 'Two thirds hands-on. Half day 3.5 hours, full day 7 hours, up to 10 to 15 people.',
  },
  {
    title: 'Your next step, in writing, within 48 hours.',
    body: 'What to do next, and a proposal if you want us to do it with you.',
  },
];

/**
 * Testimonials render only once a real, permitted quote is filled in. Slot 1
 * is the Summertown GM or owner (not before 5 Oct, and only with written
 * permission); slot 2 is an HR or L&D lead. Empty slots render nothing, so the
 * page never shows a bracketed placeholder.
 */
type Testimonial = { quote: string; name: string; role: string };
const TESTIMONIALS: Testimonial[] = [];

const FAQS: Qa[] = [
  {
    q: "Our team isn't technical. Is this too advanced?",
    a: 'No. The session starts from the work people already do, not from the technology. If someone can write an email, they can do this.',
  },
  {
    q: 'What about our confidential documents?',
    a: "Nothing goes into a tool you haven't approved. We agree which documents are allowed before the session, use business accounts only, and you can bring anonymised or past examples.",
  },
  {
    q: 'We already have Copilot or ChatGPT. Why do we need this?',
    a: 'Most firms have the licences and few people use them well. The session uses the tools you already pay for, on your real work, so they start earning their cost.',
  },
  {
    q: 'Is this a sales pitch for a bigger project?',
    a: 'It stands on its own: everyone leaves with something working and a written plan. If you want help with the next step, the session fee is credited against it. If not, you keep the plan.',
  },
  {
    q: 'How quickly can we run it?',
    a: "Usually within two to three weeks of the scoping call, depending on your team's calendar. Tasks are collected a week before.",
  },
];

function ScopingCta({ className = '' }: { className?: string }) {
  return (
    <a href={SCOPING_HREF} className={`${CTA_PRIMARY} ${className}`}>
      {CTA_LABEL}
      <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
        &rarr;
      </span>
    </a>
  );
}

export default function LeadershipSessionPage() {
  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbItems} />
      <WebPageJsonLd
        name="AI leadership session for UAE teams"
        description={DESCRIPTION}
        url={PATH}
        dateModified={REVIEWED_ISO}
      />
      <ServiceJsonLd
        name="AI leadership session"
        description="A hands-on half or full day AI session for leadership teams at owner-led UAE firms. Each leader brings one real task and leaves with it working, plus a written plan for the rest of the business."
        url={PATH}
        serviceType="Corporate AI training"
      />
      <FaqPageJsonLd qas={FAQS} />

      {/* Hero. The owner who opens a forwarded link reads this and nothing else,
          so the headline, the promise and the button carry the whole page. */}
      <section className="paper-grid relative bg-bg-base px-5 pb-16 pt-32 sm:px-8 sm:pb-20 sm:pt-40">
        <div className="mx-auto max-w-5xl">
          <Breadcrumbs items={breadcrumbItems} className="mb-6" />
          <p className="eyebrow eyebrow-accent">Leadership session · Half day or full day</p>
          <h1 className="mt-4 text-balance text-[clamp(32px,5.2vw,52px)] font-bold leading-[1.06] tracking-tight text-ink">
            Your leadership team, using AI on real work, in one afternoon
          </h1>
          <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-ink-soft sm:text-[18px] [text-wrap:pretty]">
            A hands-on session for owner-led UAE firms. Each leader brings one real task, and
            leaves with it working, plus a clear plan for the rest of the business.
          </p>
          <div className="mt-8">
            <ScopingCta className="w-full sm:w-auto" />
          </div>
          <p className="mt-8 max-w-2xl border-l-2 border-traq-purple pl-4 text-[14px] leading-relaxed text-ink-soft sm:text-[15px]">
            Built on the method behind a programme where one person built an app frontend in
            under 12 hours, work that normally takes two or three people.
          </p>
        </div>
      </section>

      {/* Problem */}
      <section className="border-t border-border-subtle bg-bg-subtle px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="eyebrow eyebrow-accent">Sound familiar?</div>
          <h2 className="section-title max-w-3xl">
            &ldquo;Everyone says AI. Nobody shows us what it does for our business.&rdquo;
          </h2>
          <div className="mt-10 grid gap-4 sm:mt-12 md:grid-cols-3">
            {PROBLEM_QUOTES.map((quote) => (
              <blockquote
                key={quote}
                className="m-0 rounded-[20px] border border-border-subtle bg-white p-6 text-[15px] leading-relaxed text-ink shadow-card"
              >
                <span aria-hidden="true" className="block text-[28px] leading-none text-traq-purple">
                  &ldquo;
                </span>
                <p className="mt-2">{quote}</p>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* What changes */}
      <section className="bg-bg-base px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="eyebrow eyebrow-accent">What changes</div>
          <h2 className="section-title">From talking about AI to using it on Monday</h2>
          <div className="mt-10 grid gap-8 sm:mt-12 md:grid-cols-3 md:gap-10">
            {CHANGES.map((item, i) => (
              <div key={item.title} className="border-t border-border-strong pt-5">
                <p className="text-[12px] font-semibold tabular-nums text-traq-purple">0{i + 1}</p>
                <h3 className="mt-2 text-[18px] font-semibold leading-snug tracking-tight text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border-subtle bg-bg-subtle px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="eyebrow eyebrow-accent">How it works</div>
          <h2 className="section-title">Four steps, from a call to a written plan</h2>
          <ol className="mt-10 flex flex-col gap-3 sm:mt-12">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className="flex gap-5 rounded-[20px] border border-border-subtle bg-white p-5 shadow-card sm:p-6"
              >
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-traq-purple text-[14px] font-semibold text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-[16px] font-semibold leading-snug text-ink sm:text-[17px]">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-[15px] leading-relaxed text-ink-soft">
            Fixed price for the half day or full day, confirmed on the scoping call. The full fee is
            credited against a longer programme if you go ahead within 30 days.
          </p>
        </div>
      </section>

      {/* Proof. A named result rather than a logo bar. */}
      <section className="bg-bg-base px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="eyebrow eyebrow-accent">Proof</div>
          <h2 className="section-title">What the method does on real work</h2>

          <div className="mt-10 rounded-[24px] border border-border-subtle bg-white p-7 shadow-card sm:mt-12 sm:p-10">
            <p className="text-[12px] font-semibold uppercase tracking-widest text-ink-faint">
              Case study · Velociti, delivered with Day Seven
            </p>
            <p className="mt-4 text-balance text-[clamp(22px,3vw,30px)] font-bold leading-tight tracking-tight text-ink">
              One person built an app frontend in under 12 hours.
            </p>
            <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">
              Work that normally takes two or three people.
            </p>
          </div>

          {TESTIMONIALS.length > 0 ? (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {TESTIMONIALS.map((t) => (
                <figure
                  key={t.name}
                  className="m-0 rounded-[20px] border border-border-subtle bg-bg-subtle p-6 sm:p-7"
                >
                  <blockquote className="m-0 text-[16px] leading-relaxed text-ink">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-4 text-[14px] text-ink-soft">
                    <span className="font-semibold text-ink">{t.name}</span>, {t.role}
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : null}

          <div className="mt-12 grid items-center gap-6 sm:grid-cols-[120px_1fr] sm:gap-8">
            <div className="h-[120px] w-[120px] overflow-hidden rounded-[20px] border border-border-subtle bg-white shadow-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/nazir-session.jpg"
                alt="Nazir Dogan running an AI session"
                className="h-full w-full object-cover"
              />
            </div>
            <p className="max-w-2xl text-[15px] leading-relaxed text-ink-soft sm:text-[16px]">
              Delivered by <span className="font-semibold text-ink">Nazir Dogan</span>, who led AI
              enablement sessions across EMEA and the Americas at a global hotel group, and builds
              what he teaches.{' '}
              <Link
                href="/about"
                className="font-semibold text-traq-purple underline-offset-4 hover:underline"
              >
                More about Traq Collective
              </Link>
            </p>
          </div>
        </div>
      </section>

      <FaqBlock qas={FAQS} heading="Questions leadership teams ask first" />

      {/* Final call to action */}
      <section className="relative bg-bg-base px-5 pb-20 pt-12 sm:px-8 sm:pb-28 sm:pt-16">
        <div className="mx-auto max-w-5xl">
          <div className="cta-panel">
            <div className="eyebrow eyebrow-accent">Book a scoping call</div>
            <h2 className="mx-auto mt-4 max-w-2xl text-balance text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-3xl md:text-4xl">
              Every month you wait, your team keeps doing by hand what AI already does well.
            </h2>
            <div className="mt-7 flex justify-center sm:mt-9">
              <ScopingCta className="w-full sm:w-auto" />
            </div>
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-ink-soft">
              A 15-minute call, no obligation. You&rsquo;ll know by the end of it whether this fits
              your team.
            </p>
            <p className="mt-3 text-[13px] text-ink-faint">
              Or call or WhatsApp {COMPANY.phone}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

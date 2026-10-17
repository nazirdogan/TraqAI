import type { Metadata } from 'next';
import Image, { getImageProps } from 'next/image';
import { Check, ChevronDown, X } from 'lucide-react';
import {
  DATE_LABEL,
  HOST_PHOTO,
  KEEP_PATH,
  PRICE_LABEL,
  SESSION_SUBHEAD,
  SESSION_TITLE,
  sessionFinished,
  timeTriple,
} from '@/lib/keep-session';
import { BookButton, KeepFooter, KeepHeader } from './_components/ui';
import StickyBar from './_components/StickyBar';

// Static, regenerated every five minutes, so the button turns into the
// "session has finished" line shortly after the session ends without any
// client-side date check (and the layout shift that would come with one).
export const revalidate = 300;

const TITLE = 'The Person They Keep · Live AI-at-work session';
const URL = `https://traqcollective.com${KEEP_PATH}`;
const OG = {
  url: 'https://traqcollective.com/keep/og-image.jpg',
  width: 1200,
  height: 630,
  alt: 'The Person They Keep. Saturday 24 October, live on Zoom, £19.',
};

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: SESSION_SUBHEAD,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: SESSION_SUBHEAD, url: URL, type: 'website', siteName: 'Traq Collective', images: [OG] },
  twitter: { card: 'summary_large_image', title: TITLE, description: SESSION_SUBHEAD, images: [{ url: OG.url, width: OG.width, height: OG.height, alt: OG.alt }] },
};

const HERO_ALT =
  'Illustration of Jo, an office worker, alone at a desk in an empty office at dawn. A staff portal shows 30 days left and 78% replaceable.';

const CARDS = [
  {
    src: '/keep/card-work-brief.webp',
    alt: 'The work brief: role, task, context, rules and output, with context marked as the part most people skip.',
  },
  {
    src: '/keep/card-data-rules.webp',
    alt: "Data rules: what's fine to put into AI anywhere, what needs a company-approved tool, and what never goes in.",
  },
  {
    src: '/keep/card-before-after.webp',
    alt: "Jo's Monday report from Episode 1: two hours down to 22 minutes, with all 24 numbers checked.",
  },
];

/**
 * The hero art-directed with <picture>: portrait under 768px, landscape from
 * 768px up. Both carry their own width and height, so the browser reserves the
 * right box for whichever one it picks and nothing shifts as it loads. The
 * staff-portal widget is baked into the top-left of both, so no text is laid
 * over the image; the copy sits below it.
 */
function HeroImage() {
  const common = { alt: HERO_ALT, priority: true, quality: 80 };
  const { props: desktop } = getImageProps({ ...common, src: '/keep/hero-jo.webp', width: 1600, height: 900, sizes: '(min-width: 1088px) 1024px, 100vw' });
  const { props: mobile } = getImageProps({ ...common, src: '/keep/hero-jo-mobile.webp', width: 1080, height: 1350, sizes: '100vw' });
  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={desktop.srcSet} sizes={desktop.sizes} width={1600} height={900} />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt arrives through the spread props */}
      <img {...mobile} className="h-auto w-full md:rounded-2xl" />
    </picture>
  );
}

const LEAVE_WITH = [
  'One of your own work tasks done properly with an AI assistant, using a five-part work brief.',
  'A checking habit, so you can trust the result before it goes to anyone.',
  'A one-page data rules sheet: what is fine to put into AI, what needs a business account, what never goes in.',
  'A written before-and-after you can show a manager, in your own words and numbers.',
];

const STEPS = [
  'Why AI rollouts stall at work: fear, time and ownership.',
  'Build your work brief live on a real task of your own.',
  'Run it, then check the output properly.',
  'Learn the data rules.',
  'Find your first win and write the before-and-after.',
  'Questions, and what to do next.',
];

const FAQ: { q: string; a: string }[] = [
  { q: 'Do I need a paid AI tool?', a: 'No. Bring any AI assistant you already use, free or from work.' },
  {
    q: 'Is it safe to use my work material?',
    a: 'Use practice material or your own non-confidential tasks. Part of the session is learning exactly what must never go in.',
  },
  { q: 'What if I can’t attend live?', a: 'You get the replay.' },
  { q: 'Refunds?', a: 'Tickets are non-refundable. If you can’t make it live, the replay is yours.' },
  {
    q: 'What happens after?',
    a: 'At the end you’ll hear about the weekly live call and community in The AI Operator. It’s optional.',
  },
];

const H2 = 'text-[28px] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[34px]';
const WRAP = 'mx-auto max-w-3xl px-5 sm:px-8';

export default function KeepPage() {
  const finished = sessionFinished();
  const meta = `${timeTriple()} · ${PRICE_LABEL} · Replay included`;

  return (
    <>
      <KeepHeader />

      {/* 1. Hero */}
      <section id="hero" className="bg-white pb-16 sm:pb-24 md:pt-10">
        <div className="mx-auto max-w-5xl md:px-8">
          <HeroImage />
        </div>
        <div className={`${WRAP} pt-10 sm:pt-14`}>
          <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-traq-purple-ink">
            Live on Zoom · {DATE_LABEL}
          </p>
          <h1 className="mt-4 text-[44px] font-semibold leading-[1.05] tracking-[-0.03em] text-ink sm:text-[64px]">
            {SESSION_TITLE}
          </h1>
          <p className="mt-5 max-w-2xl text-[19px] leading-8 text-ink-soft sm:text-[21px]">{SESSION_SUBHEAD}</p>
          <p className="mt-5 text-[15px] font-medium leading-7 text-ink">{meta}</p>
          <div className="mt-8">
            <BookButton className="w-full sm:w-auto" />
            {finished ? null : (
              <p className="mt-3 text-[14px] leading-6 text-ink-faint">
                Tickets are non-refundable. Can’t make it live? You get the replay.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 2. What you leave with */}
      <section aria-labelledby="leave-with" className="border-t border-border-subtle bg-bg-subtle py-16 sm:py-20">
        <div className={WRAP}>
          <h2 id="leave-with" className={H2}>What you leave with</h2>
          {/* Under 768px a scroll-snap row with the next card peeking in; a
              three-column grid from 768px up. Focusable so keyboard users can
              scroll it. */}
          <ul
            tabIndex={0}
            aria-label="What you leave with, illustrated"
            className="-mx-5 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden"
          >
            {CARDS.map((c) => (
              <li key={c.src} className="w-[80%] flex-none snap-center md:w-auto">
                <Image
                  src={c.src}
                  alt={c.alt}
                  width={1080}
                  height={1080}
                  sizes="(min-width: 768px) 30vw, 80vw"
                  className="h-auto w-full rounded-2xl border border-border-subtle"
                />
              </li>
            ))}
          </ul>
          <ul className="mt-10 space-y-5">
            {LEAVE_WITH.map((item) => (
              <li key={item} className="flex gap-3 text-[17px] leading-7 text-ink-soft">
                <Check className="mt-1 h-5 w-5 flex-none text-traq-purple" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. Timeline */}
      <section aria-labelledby="two-hours" className="bg-white py-16 sm:py-20">
        <div className={WRAP}>
          <h2 id="two-hours" className={H2}>What happens in the two hours</h2>
          <ol className="relative mt-8 space-y-6 border-l-2 border-traq-tint pl-8">
            {STEPS.map((step, i) => (
              <li key={step} className="relative text-[17px] leading-7 text-ink-soft">
                <span
                  aria-hidden="true"
                  className="absolute -left-[49px] top-0 flex h-8 w-8 items-center justify-center rounded-full bg-traq-purple text-[14px] font-semibold text-white"
                >
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 4. For / not for */}
      <section aria-labelledby="who" className="border-t border-border-subtle bg-bg-subtle py-16 sm:py-20">
        <div className={WRAP}>
          <h2 id="who" className="sr-only">Who it’s for</h2>
          <Image
            src="/keep/jo-before-after.webp"
            alt="Jo slumped at the kitchen table late at night, then calm at the office desk the next morning."
            width={1600}
            height={800}
            sizes="(min-width: 768px) 704px, 100vw"
            className="mb-6 h-auto w-full rounded-2xl"
          />
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-border-subtle bg-white p-6">
              <h3 className="flex items-center gap-2 text-[18px] font-semibold text-ink">
                <Check className="h-5 w-5 text-traq-purple" aria-hidden="true" /> For
              </h3>
              <p className="mt-3 text-[16px] leading-7 text-ink-soft">
                People who work in a team and want to be the one who uses AI well, not the one waiting to see what happens.
              </p>
            </div>
            <div className="rounded-2xl border border-border-subtle bg-white p-6">
              <h3 className="flex items-center gap-2 text-[18px] font-semibold text-ink">
                <X className="h-5 w-5 text-ink-faint" aria-hidden="true" /> Not for
              </h3>
              <p className="mt-3 text-[16px] leading-7 text-ink-soft">
                Anyone looking for tool news, prompt hacks or a guarantee. No honest session can promise nothing will change; this one helps
                you move early and show your work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Host */}
      <section aria-labelledby="host" className="bg-white py-16 sm:py-20">
        <div className={`${WRAP} flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8`}>
          {HOST_PHOTO ? (
            <Image
              src={HOST_PHOTO}
              alt="Naz, your host"
              width={112}
              height={112}
              sizes="112px"
              className="h-28 w-28 flex-none rounded-full object-cover"
            />
          ) : (
            <div aria-hidden="true" className="h-28 w-28 flex-none rounded-full bg-traq-tint" />
          )}
          <div>
            <h2 id="host" className={H2}>About your host</h2>
            <p className="mt-4 text-[17px] leading-8 text-ink-soft">
              I’m Naz. I came from hotel revenue management at Hilton, not engineering. I run AI training and rollouts in the UAE, through
              my own firm and alongside Day Seven, for teams from a hotel investment group to an interiors firm.
            </p>
          </div>
        </div>
      </section>

      {/* 6. FAQ: native disclosure widgets, keyboard and screen-reader accessible with no script. */}
      <section aria-labelledby="faq" className="border-t border-border-subtle bg-bg-subtle py-16 sm:py-20">
        <div className={WRAP}>
          <h2 id="faq" className={H2}>Questions</h2>
          <div className="mt-8 divide-y divide-border-subtle rounded-2xl border border-border-subtle bg-white">
            {FAQ.map(({ q, a }) => (
              <details key={q} className="group">
                <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[17px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
                  {q}
                  <ChevronDown
                    className="h-5 w-5 flex-none text-ink-faint transition-transform group-open:rotate-180 motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                </summary>
                <p className="px-5 pb-5 text-[16px] leading-7 text-ink-soft">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Final call to action */}
      <section id="final-cta" aria-labelledby="final" className="bg-white py-16 sm:py-24">
        <div className={`${WRAP} text-center`}>
          <h2 id="final" className="text-[36px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[48px]">
            {SESSION_TITLE}
          </h2>
          <p className="mt-4 text-[16px] font-medium leading-7 text-ink">Live on Zoom · {DATE_LABEL}</p>
          <p className="mt-1 text-[15px] leading-7 text-ink-soft">{meta}</p>
          <div className="mt-8">
            <BookButton className="w-full sm:w-auto" />
          </div>
        </div>
      </section>

      <KeepFooter />
      {finished ? null : <StickyBar heroId="hero" finalId="final-cta" />}
    </>
  );
}

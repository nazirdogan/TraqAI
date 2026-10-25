import type { Metadata } from 'next';
import Image from 'next/image';
import { Check, ChevronDown } from 'lucide-react';
import {
  BUILD_AI_PATH,
  DATE_LABEL,
  PRICE_LABEL,
  SESSION_SUBHEAD,
  SESSION_TITLE,
  sessionFinished,
  usTimes,
} from '@/lib/build-ai-session';
import { BookButton, BuildAiFooter, BuildAiHeader } from './_components/ui';
import StickyBar from './_components/StickyBar';

// Static, regenerated every five minutes, so the button turns into the
// "session has finished" line shortly after the session ends.
export const revalidate = 300;

const TITLE = `${SESSION_TITLE} · Live session for business owners`;
const URL = `https://traqcollective.com${BUILD_AI_PATH}`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: SESSION_SUBHEAD,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: SESSION_SUBHEAD, url: URL, type: 'website', siteName: 'Traq Collective' },
  twitter: { card: 'summary_large_image', title: TITLE, description: SESSION_SUBHEAD },
};

const LEAVE_WITH = [
  'A plain picture of what AI is, how it works, and what it can and can’t do for a business like yours.',
  'One problem worth solving, written down: where your time and money actually go.',
  'One working AI tool built for that problem, by you, during the session.',
  'A one-page plan for the next 30 days: what to set up, what to measure, and how to keep your data safe.',
];

const PLAN: { time: string; block: string; what: string; leave: string }[] = [
  {
    time: '7:00–7:10',
    block: 'Welcome',
    what: 'Who we are, what Traq does, and what you’ll have by 9pm. You open a free ChatGPT or Claude account in another tab.',
    leave: 'A tool open and ready',
  },
  {
    time: '7:10–7:30',
    block: 'What AI actually is',
    what: 'How it works at a basic level: it predicts likely words from patterns in huge amounts of text. What it’s good at, where it goes wrong, and the difference between chatting with AI, automating a task, and an AI agent. The myths: it won’t run your business for you, it makes mistakes, and you need to be careful what data you paste in.',
    leave: 'A plain picture of what AI can and can’t do',
  },
  {
    time: '7:30–7:55',
    block: 'Find your problem',
    what: 'Four questions, answered in a worksheet and the chat. What are your actual problems? Where does your time go, and where are you wasting money? Where do you feel held back? What’s your bottleneck? You pick one task to fix tonight.',
    leave: 'One problem worth solving, written down',
  },
  {
    time: '7:55–8:40',
    block: 'Build along',
    what: 'We build three common fixes live and you build your own version alongside us. 1) Replies and quotes: a reusable prompt for estimates, customer emails and follow-ups. 2) Inquiries and missed calls: a simple capture-and-reply flow. 3) Admin: scheduling, documents and summaries. Examples come from the businesses in the room.',
    leave: 'One working tool for your own problem',
  },
  {
    time: '8:40–8:55',
    block: 'Your 30-day plan',
    what: 'What to set up this week, what to measure, and when doing it yourself stops making sense. Data safety: no customer or patient details in public tools.',
    leave: 'A one-page plan',
  },
  {
    time: '8:55–9:00',
    block: 'Q&A and your next steps',
    what: 'Your open questions, answered, and what to do first tomorrow morning.',
    leave: 'One clear next step',
  },
];

const FAQ: { q: string; a: string }[] = [
  { q: 'Do I need to be technical?', a: 'No. If you can send an email, you can follow along. Everything is shown step by step.' },
  { q: 'Do I need a paid AI tool?', a: 'No. A free ChatGPT or Claude account is enough. We’ll open one together in the first ten minutes.' },
  { q: 'Do I have to build along?', a: 'It’s up to you. You can build alongside us or just watch and take notes. Either way you leave with the plan.' },
  {
    q: 'How do I join?',
    a: 'After you book, you’ll get a calendar invite for the session at the email you paid with. The joining link is emailed to you before it starts.',
  },
  { q: 'What kind of business is this for?', a: 'Owners of small and growing businesses: trades, clinics, agencies, local services and anyone who runs on quotes, calls, emails and admin.' },
];

const H2 = 'text-[28px] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[34px]';
const WRAP = 'mx-auto max-w-3xl px-5 sm:px-8';

export default function BuildAiPage() {
  const finished = sessionFinished();
  const meta = `${DATE_LABEL} · ${usTimes()}`;

  return (
    <>
      <BuildAiHeader />

      {/* 1. Hero */}
      <section id="hero" className="bg-white pb-16 pt-12 sm:pb-24 sm:pt-20">
        <div className={WRAP}>
          <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-traq-purple-ink">
            Live online · {DATE_LABEL} · 7pm ET
          </p>
          <h1 className="mt-4 text-[44px] font-semibold leading-[1.05] tracking-[-0.03em] text-ink sm:text-[64px]">
            {SESSION_TITLE}
          </h1>
          <p className="mt-5 max-w-2xl text-[19px] leading-8 text-ink-soft sm:text-[21px]">{SESSION_SUBHEAD}</p>
          <p className="mt-5 text-[15px] font-medium leading-7 text-ink">
            {meta} · 2 hours · {PRICE_LABEL}
          </p>
          <div className="mt-8">
            <BookButton className="w-full sm:w-auto" />
            {finished ? null : (
              <p className="mt-3 text-[14px] leading-6 text-ink-faint">
                Everyone leaves with one thing working and a plan for the next 30 days.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 2. What you leave with */}
      <section aria-labelledby="leave-with" className="border-t border-border-subtle bg-bg-subtle py-16 sm:py-20">
        <div className={WRAP}>
          <h2 id="leave-with" className={H2}>What you leave with</h2>
          <ul className="mt-8 space-y-5">
            {LEAVE_WITH.map((item) => (
              <li key={item} className="flex gap-3 text-[17px] leading-7 text-ink-soft">
                <Check className="mt-1 h-5 w-5 flex-none text-traq-purple" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. Session plan: a table from 768px up, stacked cards below it. */}
      <section aria-labelledby="plan" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <h2 id="plan" className={H2}>The session plan</h2>
          <p className="mt-4 max-w-2xl text-[17px] leading-7 text-ink-soft">
            Two hours, live. All times Eastern.
          </p>

          <div className="mt-8 hidden overflow-hidden rounded-2xl border border-border-subtle md:block">
            <table className="w-full border-collapse text-left text-[15px] leading-6">
              <thead className="bg-bg-subtle text-[13px] font-semibold uppercase tracking-[0.06em] text-ink-faint">
                <tr>
                  <th scope="col" className="w-[110px] px-5 py-4">Time (ET)</th>
                  <th scope="col" className="w-[170px] px-5 py-4">Block</th>
                  <th scope="col" className="px-5 py-4">What happens</th>
                  <th scope="col" className="w-[210px] px-5 py-4">You leave this block with</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {PLAN.map((row) => (
                  <tr key={row.block} className="align-top">
                    <td className="whitespace-nowrap px-5 py-5 font-medium tabular-nums text-ink">{row.time}</td>
                    <th scope="row" className="px-5 py-5 font-semibold text-ink">{row.block}</th>
                    <td className="px-5 py-5 text-ink-soft">{row.what}</td>
                    <td className="px-5 py-5 font-medium text-traq-purple-ink">{row.leave}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ol className="mt-8 space-y-4 md:hidden">
            {PLAN.map((row) => (
              <li key={row.block} className="rounded-2xl border border-border-subtle bg-white p-5">
                <p className="text-[13px] font-semibold tabular-nums text-traq-purple-ink">{row.time} ET</p>
                <h3 className="mt-1 text-[18px] font-semibold text-ink">{row.block}</h3>
                <p className="mt-2 text-[15px] leading-6 text-ink-soft">{row.what}</p>
                <p className="mt-3 flex gap-2 text-[15px] font-medium leading-6 text-ink">
                  <Check className="mt-0.5 h-5 w-5 flex-none text-traq-purple" aria-hidden="true" />
                  {row.leave}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 4. Host */}
      <section aria-labelledby="host" className="border-t border-border-subtle bg-bg-subtle py-16 sm:py-20">
        <div className={`${WRAP} flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8`}>
          <Image
            src="/nazir.jpg"
            alt="Naz, your host"
            width={112}
            height={112}
            sizes="112px"
            className="h-28 w-28 flex-none rounded-full object-cover"
          />
          <div>
            <h2 id="host" className={H2}>About your host</h2>
            <p className="mt-4 text-[17px] leading-8 text-ink-soft">
              I’m Naz, founder of Traq Collective. I came to AI from hotel revenue management at Hilton, not engineering. Today we
              build AI into real businesses, from an interiors firm to a hotel investment group, and this session is the same work
              done with you, on your own problem.
            </p>
          </div>
        </div>
      </section>

      {/* 5. FAQ: native disclosure widgets, keyboard and screen-reader accessible with no script. */}
      <section aria-labelledby="faq" className="bg-white py-16 sm:py-20">
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

      {/* 6. Final call to action */}
      <section id="final-cta" aria-labelledby="final" className="border-t border-border-subtle bg-bg-subtle py-16 sm:py-24">
        <div className={`${WRAP} text-center`}>
          <h2 id="final" className="text-[36px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[48px]">
            {SESSION_TITLE}
          </h2>
          <p className="mt-4 text-[16px] font-medium leading-7 text-ink">Live online · 2 hours · {PRICE_LABEL}</p>
          <p className="mt-1 text-[15px] leading-7 text-ink-soft">{meta}</p>
          <div className="mt-8">
            <BookButton className="w-full sm:w-auto" />
          </div>
        </div>
      </section>

      <BuildAiFooter />
      {finished ? null : <StickyBar heroId="hero" finalId="final-cta" />}
    </>
  );
}

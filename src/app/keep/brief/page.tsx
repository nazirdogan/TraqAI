import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { KEEP_PATH, PRICE_LABEL, SESSION_TITLE, clockIn } from '@/lib/keep-session';
import { KeepFooter, KeepHeader } from '../_components/ui';
import CopyTemplate from './CopyTemplate';

const TITLE = 'The Work Brief · Free template';
const DESCRIPTION = 'Fill this in before you ask AI for anything.';
const URL = `https://traqcollective.com${KEEP_PATH}/brief`;
const OG = {
  url: 'https://traqcollective.com/keep/og-image.jpg',
  width: 1200,
  height: 630,
  alt: 'The Person They Keep. Saturday 24 October, live on Zoom, £19.',
};

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  robots: { index: false, follow: false },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, type: 'website', siteName: 'Traq Collective', images: [OG] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [OG] },
};

// This page's own palette: off-white ground, near-black ink, one purple.
// Purple on the ground is 5.2:1 and white on purple 6.5:1, both above AA.
const GROUND = 'bg-[#E3E6DE]';
const INK = 'text-[#18191B]';
const ACCENT = 'text-[#6B3ECF]';

const PARTS: { label: string; question: string; note?: string; example: string; skipped?: boolean }[] = [
  { label: 'ROLE', question: 'Who should the assistant act as?', example: 'a careful analyst who writes for a busy manager.' },
  { label: 'TASK', question: 'What is the one thing you want done?', example: 'turn this week’s sales figures into a one-page Monday report.' },
  {
    label: 'CONTEXT',
    question: 'What does it need to know?',
    note: 'Most people skip this, and it is why answers come back generic.',
    example: 'who reads it, what they care about, what happened last week, anything unusual.',
    skipped: true,
  },
  { label: 'RULES', question: 'What must it include or avoid?', example: 'use only the figures provided, flag anything missing, no jargon.' },
  { label: 'OUTPUT', question: 'What should come back, and in what shape?', example: '5 bullets and one table, under 250 words.' },
];

const PLAIN_TEXT = ['THE WORK BRIEF', '', ...PARTS.flatMap((p, i) => [`${i + 1}. ${p.label}: ${p.question}`, ''])].join('\n').trim() + '\n';

export default function KeepBriefPage() {
  return (
    // The negative margin covers the body's mobile padding (kept for the
    // sticky bar on other pages) so the off-white runs to the bottom.
    <div className={`${GROUND} ${INK} -mb-24 pb-24 lg:mb-0 lg:pb-0`}>
      <KeepHeader className="border-[#CDD1C6] bg-[#E3E6DE]" />

      <article className="mx-auto max-w-2xl px-5 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-16">
        <p className={`text-[13px] font-semibold uppercase tracking-[0.1em] ${ACCENT}`}>From Episode 1 of Replaced</p>
        <h1 className="mt-3 text-[44px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[60px]">The Work Brief</h1>
        <p className="mt-4 text-[19px] leading-8 text-[#3A3C40]">Fill this in before you ask AI for anything.</p>

        <Image
          src="/keep/card-work-brief.webp"
          alt="The work brief: role, task, context, rules and output, with context marked as the part most people skip."
          width={1080}
          height={1080}
          priority
          sizes="(min-width: 672px) 608px, calc(100vw - 40px)"
          className="mt-8 h-auto w-full rounded-2xl"
        />

        <ol className="mt-10 space-y-4">
          {PARTS.map((p, i) => (
            <li
              key={p.label}
              className={`relative rounded-2xl bg-white p-5 sm:p-6 ${p.skipped ? 'border-2 border-[#6B3ECF]' : 'border border-[#D3D7CC]'}`}
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#18191B] text-[13px] font-semibold text-white" aria-hidden="true">
                  {i + 1}
                </span>
                <h2 className="rounded-md bg-[#6B3ECF] px-2 py-0.5 text-[13px] font-bold tracking-[0.08em] text-white">{p.label}</h2>
                {p.skipped ? (
                  <span className="rounded-full border border-[#6B3ECF] px-2.5 py-0.5 text-[12px] font-semibold text-[#6B3ECF]">Most people skip this</span>
                ) : null}
              </div>
              <p className="mt-3 text-[18px] font-semibold leading-7">{p.question}</p>
              {p.note ? <p className="mt-1 text-[16px] leading-7 text-[#3A3C40]">{p.note}</p> : null}
              <p className="mt-2 text-[16px] leading-7 text-[#3A3C40]">
                <span className="font-semibold text-[#18191B]">Example:</span> {p.example}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-8">
          <CopyTemplate text={PLAIN_TEXT} />
        </div>

        <section aria-labelledby="before-send" className="mt-10 rounded-2xl border border-[#D3D7CC] bg-white p-5 sm:p-6">
          <h2 id="before-send" className="text-[18px] font-semibold">Before you send it anywhere</h2>
          <p className="mt-2 text-[16px] leading-7 text-[#3A3C40]">Check every number against the source. The assistant drafts; you are accountable.</p>
        </section>

        <section aria-labelledby="data-rule" className="mt-4 rounded-2xl bg-[#18191B] p-5 text-white sm:p-6">
          <h2 id="data-rule" className="text-[18px] font-semibold">Data rule</h2>
          <p className="mt-2 text-[16px] leading-7 text-[#E3E6DE]">
            Never paste anything you would not be comfortable showing a stranger unless your company has approved that tool for it.
          </p>
        </section>

        <section aria-labelledby="learn" className="mt-12 border-t border-[#CDD1C6] pt-10">
          <h2 id="learn" className="text-[24px] font-semibold leading-tight">Want to learn it properly?</h2>
          <p className="mt-3 text-[17px] leading-7 text-[#3A3C40]">
            {SESSION_TITLE}, live on Zoom, Saturday 24 Oct, {clockIn('Asia/Dubai')} Dubai. {PRICE_LABEL}.
          </p>
          <Link
            href={KEEP_PATH}
            className="mt-6 inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#6B3ECF] px-8 py-4 text-[16px] font-semibold text-white transition-colors hover:bg-[#5A31B5]"
          >
            See the session
          </Link>
        </section>
      </article>

      <KeepFooter className="border-[#CDD1C6] bg-[#E3E6DE] [&>div]:text-[#4A4C50]" />
    </div>
  );
}

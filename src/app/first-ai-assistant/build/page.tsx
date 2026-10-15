import type { Metadata } from 'next';
import { headers } from 'next/headers';
import FaqBlock from '@/components/page/FaqBlock';
import type { Qa } from '@/lib/seo/schema';
import {
  BUILD,
  BUILD_NAME,
  FAA_PATH,
  LINKS,
  PRICES,
  buildIsOver,
  buildSku,
  currencyFor,
  dayLabelLong,
  launchPriceOpen,
  money,
  price,
  timeTriple,
} from '@/lib/first-ai-assistant';
import LocalTime from '../_components/LocalTime';
import { BTN, BriefMock, CurrencySwitch, FunnelFooter, FunnelHeader, OfferCards, SectionHead } from '../_components/ui';

export const dynamic = 'force-dynamic';

const TITLE = 'Build Your AI Assistant, Live: a 3-hour online build for beginners';
export const metadata: Metadata = {
  title: TITLE,
  description: 'Three hours online with Naz. Connect Claude to your own email and calendar and leave with a morning briefing, reply drafts in your voice, meeting prep and an evening close-out.',
  alternates: { canonical: `https://traqcollective.com${FAA_PATH}/build` },
};

const LEAVE_WITH: { t: string; b: string }[] = [
  { t: 'A morning briefing', b: 'Your meetings with prep notes, the emails that need you, and what slipped yesterday, on one page. One click every morning, or on a schedule while Claude is open on your computer.' },
  { t: 'Reply drafts in your voice', b: 'It learns from a handful of your real sent emails, so drafts sound like you. You approve every send.' },
  { t: 'Meeting prep', b: 'Before a call: who they are, what you last discussed, and what is still open.' },
  { t: 'An evening close-out', b: 'What got done, what slipped, and tomorrow’s top three.' },
  { t: 'Your own setup files', b: 'The exact instructions I use, adapted to your role, so you can change them later without me.' },
];

const RUN: { time: string; t: string; b: string }[] = [
  { time: '0:00', t: 'Set up together', b: 'Claude Pro, the privacy settings, and connecting your email and calendar. Everyone moves at the same pace.' },
  { time: '0:45', t: 'Your morning briefing', b: 'Built on your real inbox and calendar, then tuned until it is useful.' },
  { time: '1:30', t: 'Your voice', b: 'Teach it how you write, then let it draft three real replies.' },
  { time: '2:15', t: 'Meeting prep and close-out', b: 'Two more routines, then a run-through of a full day.' },
  { time: '2:45', t: 'Questions and fixes', b: 'Anyone stuck gets unstuck before we finish.' },
];

const FAQS: Qa[] = [
  { q: 'What do I need?', a: 'A laptop (not a phone), Claude Pro at about $20 a month paid to Anthropic, and Gmail or Google Workspace. Microsoft 365 at work also works once your IT admin approves the Claude connection. Personal Outlook and Hotmail accounts are not supported yet. If you are not sure, email hello@traqcollective.com before you book.' },
  { q: 'I am a complete beginner. Is that OK?', a: 'Yes. This is built for beginners. Seats are capped at fifteen so I can help everyone, and there are two group office hours afterwards for anything that did not stick.' },
  { q: 'Does it really run every morning on its own?', a: 'Claude can run it on a schedule while the Claude app is open on your computer. If your laptop is closed, your briefing is one click away when you open it. I show you both.' },
  { q: 'What if I cannot make it live?', a: 'You get the replay and the setup files, and you can bring questions to the office hours. It is better live, though, because I can fix things on your screen.' },
  { q: 'Can I get a refund?', a: 'You can cancel for a full refund any time before the build starts by emailing hello@traqcollective.com. Once it has started, the cancellation right ends, which checkout asks you to confirm. The full policy is linked at the bottom of the page.' },
  { q: 'Is my data safe?', a: 'Anthropic says it does not train its models on your Gmail, Drive or Calendar connector data, and we switch off the setting that would let your chats be used for training. You decide what Claude can see, it drafts rather than sends, and you can disconnect it at any time.' },
];

export default function Page({ searchParams }: { searchParams: { cur?: string } }) {
  const cur = currencyFor(headers().get('x-vercel-ip-country'), searchParams.cur);
  const sku = buildSku();
  const over = buildIsOver();
  const launch = launchPriceOpen();

  return (
    <div className="bg-bg-base">
      <FunnelHeader chip={`${BUILD.capacity} seats`} />

      <section className="px-5 pb-14 pt-10 sm:px-8 sm:pt-14">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-traq-purple">Live online · three hours · {BUILD.capacity} seats</p>
            <h1 className="mt-3 text-[38px] font-semibold leading-[1.05] tracking-tight text-ink sm:text-[52px]">{BUILD_NAME}</h1>
            <p className="mt-5 max-w-xl text-[18px] leading-8 text-ink-soft">
              Three hours with me, online. You connect Claude to your own email and calendar, and you leave with your own assistant working: a morning briefing,
              replies in your voice, meeting prep and an evening close-out.
            </p>
            <p className="mt-5 text-[16px] font-semibold text-ink">
              {dayLabelLong(BUILD.startIso)} · {timeTriple(BUILD.startIso)}
            </p>
            <p className="text-[13px] text-ink-faint">
              <LocalTime iso={BUILD.startIso} />
            </p>
            {over ? (
              <p className="mt-6 rounded-xl bg-traq-tint px-4 py-3 text-[15px] text-traq-purple-ink">This round has finished. The 1:1 setup is still open below.</p>
            ) : (
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a className={BTN} href={LINKS[sku][cur]}>
                  Save my seat for {price(sku, cur)}
                </a>
                {launch ? <span className="text-[14px] text-ink-faint">Launch price until Fri 23 Oct, then {money(PRICES.build_std[cur], cur)}</span> : null}
              </div>
            )}
            <div className="mt-3">
              <CurrencySwitch cur={cur} path={`${FAA_PATH}/build`} />
            </div>
          </div>
          <BriefMock />
        </div>
      </section>

      <section className="bg-bg-subtle px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHead eyebrow="You leave with" title="Your own assistant, working" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LEAVE_WITH.map((x) => (
              <div key={x.t} className="rounded-[20px] border border-border-subtle bg-white p-6 shadow-card">
                <h3 className="text-[18px] font-semibold text-ink">{x.t}</h3>
                <p className="mt-2 text-[15px] leading-6 text-ink-soft">{x.b}</p>
              </div>
            ))}
            <div className="rounded-[20px] border border-traq-purple/30 bg-traq-tint p-6">
              <h3 className="text-[18px] font-semibold text-traq-purple-ink">Plus</h3>
              <p className="mt-2 text-[15px] leading-6 text-ink-soft">The replay, a 14-day support group, and two group office hours (Sun 25 and Tue 27 Oct) for anything that did not stick.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <SectionHead eyebrow="The three hours" title="How it runs" />
          <ol className="mt-8 space-y-4">
            {RUN.map((r) => (
              <li key={r.time} className="flex gap-4 rounded-[18px] border border-border-subtle bg-white p-5 shadow-card">
                <span className="w-14 flex-none text-[15px] font-semibold text-traq-purple">{r.time}</span>
                <span>
                  <span className="block text-[16px] font-semibold text-ink">{r.t}</span>
                  <span className="block text-[15px] leading-6 text-ink-soft">{r.b}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-bg-subtle px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHead eyebrow="Choose how" title="Build it live, or have it built with you" />
          <div className="mt-3">
            <CurrencySwitch cur={cur} path={`${FAA_PATH}/build`} />
          </div>
          <div className="mt-10">
            <OfferCards cur={cur} showVip={false} />
          </div>
          <p className="mt-6 text-[14px] leading-6 text-ink-soft">
            <strong className="text-ink">The full cost:</strong> the build is {price(sku, cur)} once. You also need Claude Pro, about $20 a month, paid to Anthropic.
          </p>
        </div>
      </section>

      <FaqBlock qas={FAQS} heading="Before you book" />
      <FunnelFooter />
    </div>
  );
}

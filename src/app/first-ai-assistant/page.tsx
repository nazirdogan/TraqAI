import type { Metadata } from 'next';
import Image from 'next/image';
import { headers } from 'next/headers';
import { CalendarDays, Clock, ShieldCheck, Video } from 'lucide-react';
import FaqBlock from '@/components/page/FaqBlock';
import type { Qa } from '@/lib/seo/schema';
import {
  BUILD,
  FAA_NAME,
  FAA_PATH,
  PROOF,
  VSL_POSTER,
  VSL_SRC,
  currencyFor,
  dayLabel,
  openSessions,
  price,
  buildSku,
  timeTriple,
} from '@/lib/first-ai-assistant';
import RegisterForm, { type SessionOption } from './_components/RegisterForm';
import LocalTime from './_components/LocalTime';
import { BTN, BriefMock, CurrencySwitch, FunnelFooter, FunnelHeader, OfferCards, SectionHead } from './_components/ui';

export const dynamic = 'force-dynamic';

const TITLE = 'Your First AI Assistant: a free live session for AI beginners';
const DESCRIPTION =
  'Sixty minutes, online, in plain English. See how AI can brief you every morning, sort your inbox and prep your meetings, with nothing sent without you. Hosted by Naz at Traq Collective.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `https://traqcollective.com${FAA_PATH}` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `https://traqcollective.com${FAA_PATH}`, type: 'website', images: ['/nazir-session.jpg'] },
};

const COUNTRY_NAMES: Record<string, string> = {
  GB: 'United Kingdom',
  AE: 'United Arab Emirates',
  US: 'United States',
  IE: 'Ireland',
  SA: 'Saudi Arabia',
  QA: 'Qatar',
  CA: 'Canada',
  AU: 'Australia',
  DE: 'Germany',
  NL: 'Netherlands',
  FR: 'France',
};

const SEE: { title: string; body: string }[] = [
  { title: 'The three jobs AI does brilliantly for you today', body: 'And the two it still gets wrong, so you know where to trust it and where to check it.' },
  { title: 'A morning briefing, built live from zero', body: 'Your meetings, the emails that actually need you, and what slipped yesterday, on one page. You watch every step.' },
  { title: 'How to keep your emails and data private', body: 'The settings that matter, what the AI can and cannot see, and why mine only drafts.' },
  { title: 'Your first seven days', body: 'A simple plan you can follow on your own, one small win a day.' },
];

const FAQS: Qa[] = [
  { q: 'Is it really free?', a: 'Yes. The session costs nothing and you do not need a card. At the end I will tell you about the paid live build for anyone who wants their assistant set up with me. There is no pressure to buy anything.' },
  { q: 'I am not technical. Will I keep up?', a: 'Yes. This is built for beginners. If you can send an email, you can follow it. I explain every step in plain English and I do not use jargon without explaining it.' },
  { q: 'Which AI do you use, and why?', a: 'Claude, made by Anthropic. It connects to Gmail, Google Calendar and Microsoft 365, it writes well, and its privacy settings are clear. I show you the same ideas so you can use them with other tools too.' },
  { q: 'Do I need to buy anything for the free session?', a: 'No. Just join on Google Meet from a laptop if you can. To build your own assistant afterwards you would need Claude Pro, which is about $20 a month paid to Anthropic, not to me.' },
  { q: 'Is it safe to let AI near my email?', a: 'Anthropic says it does not train its models on your Gmail, Drive or Calendar connector data, and you can switch off the setting that lets your chats be used for training. Claude asks before it sends anything, and in the setup I teach it only drafts. You choose what it can reach and can disconnect it in two clicks. I walk through all of this in the session.' },
  { q: 'Does it work with Outlook?', a: 'With Microsoft 365 at work, yes, once your IT admin approves the connection. Personal Outlook and Hotmail accounts are not supported yet. Gmail and Google Workspace work straight away.' },
  { q: 'Will there be a replay?', a: 'Yes. Everyone who signs up gets the replay by email within 24 hours. VIP Pass holders keep it, with the slides, for 7 days.' },
  { q: 'Who is this not for?', a: 'Developers who already build with AI, and anyone looking for a get-rich-quick AI business. This is about making AI useful in your own working day.' },
];

export default function Page({ searchParams }: { searchParams: { cur?: string } }) {
  const h = headers();
  const country = h.get('x-vercel-ip-country');
  const cur = currencyFor(country, searchParams.cur);
  const sessions: SessionOption[] = openSessions().map((s) => ({
    id: s.id,
    day: dayLabel(s.startIso),
    times: timeTriple(s.startIso),
    startIso: s.startIso,
  }));
  const next = sessions[0];

  return (
    <div className="bg-bg-base">
      <FunnelHeader chip="Free live session" />

      {/* Hero */}
      <section className="px-5 pb-14 pt-10 sm:px-8 sm:pt-14">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-traq-purple">Free live session for AI beginners · online</p>
            <h1 className="mt-3 text-[38px] font-semibold leading-[1.05] tracking-tight text-ink sm:text-[54px]">{FAA_NAME}</h1>
            <p className="mt-5 max-w-xl text-[18px] leading-8 text-ink-soft">
              In one hour, see how AI can brief you every morning, sort your inbox and prep your meetings. Plain English, no tech skills, and nothing gets sent
              without you.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5 text-[14px] text-ink">
              <span className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-white px-3.5 py-2">
                <CalendarDays className="h-4 w-4 text-traq-purple" aria-hidden="true" />
                {sessions.length ? sessions.map((s) => s.day).join(' or ') : 'Next round soon'}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-white px-3.5 py-2">
                <Clock className="h-4 w-4 text-traq-purple" aria-hidden="true" />
                22:00 Dubai · 19:00 UK · 60 min
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-white px-3.5 py-2">
                <Video className="h-4 w-4 text-traq-purple" aria-hidden="true" />
                Google Meet
              </span>
            </div>
            {next ? (
              <p className="mt-3 text-[13px] text-ink-faint">
                <LocalTime iso={next.startIso} prefix={`${next.day}: that's`} />
              </p>
            ) : null}

            <div className="mt-8">
              {VSL_SRC ? (
                <video className="aspect-video w-full rounded-[22px] border border-border-subtle bg-black shadow-cardHover" src={VSL_SRC} poster={VSL_POSTER} controls playsInline preload="metadata" />
              ) : (
                <BriefMock />
              )}
            </div>
          </div>

          <div className="lg:sticky lg:top-6 lg:self-start">
            <RegisterForm sessions={sessions} defaultCountry={country ? COUNTRY_NAMES[country] : undefined} />
          </div>
        </div>
      </section>

      {/* What you'll see */}
      <section className="bg-bg-subtle px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHead eyebrow="In the hour" title="What you will see" sub="Live, on my screen, with time for your questions." />
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {SEE.map((s, i) => (
              <div key={s.title} className="rounded-[20px] border border-border-subtle bg-white p-6 shadow-card">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-traq-purple text-[14px] font-semibold text-white">{i + 1}</span>
                <h3 className="mt-4 text-[18px] font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-6 text-ink-soft">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-[20px] border border-traq-purple/30 bg-traq-tint p-6">
            <h3 className="text-[18px] font-semibold text-traq-purple-ink">And at the end: the one setting almost everyone gets wrong</h3>
            <p className="mt-2 text-[15px] leading-6 text-ink-soft">It is the reason AI writes like a robot. Change it, and it starts writing like you.</p>
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHead
            eyebrow="What is possible with AI right now"
            title="This is not the future. People are doing it today."
            sub="Published studies, not promises. Each number links to its source."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROOF.map((p) => (
              <div key={p.stat} className="flex flex-col rounded-[20px] border border-border-subtle bg-white p-6 shadow-card">
                <div className="text-[36px] font-semibold leading-none text-traq-purple">{p.stat}</div>
                <p className="mt-3 text-[15px] leading-6 text-ink-soft">{p.line}</p>
                <a className="mt-auto pt-4 text-[12px] text-ink-faint underline underline-offset-2" href={p.href} target="_blank" rel="noopener noreferrer">
                  {p.source}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who + safety */}
      <section className="bg-bg-subtle px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
          <div className="rounded-[22px] border border-border-subtle bg-white p-7 shadow-card">
            <SectionHead eyebrow="Is this for me?" title="Built for beginners" />
            <ul className="mt-6 space-y-3 text-[15px] leading-6 text-ink-soft">
              <li>• Founders and small-business owners whose inbox runs their day</li>
              <li>• Accountants, lawyers, consultants and agents juggling clients</li>
              <li>• Senior people who feel AI moved fast and want to catch up properly</li>
              <li>• Anyone who tried ChatGPT once and did not see what the fuss was about</li>
            </ul>
            <p className="mt-5 text-[14px] text-ink-faint">Not for developers, and not a get-rich-quick AI business course.</p>
          </div>
          <div className="rounded-[22px] border border-border-subtle bg-white p-7 shadow-card">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-traq-purple" aria-hidden="true" />
              <div className="eyebrow eyebrow-accent">Is it safe?</div>
            </div>
            <h2 className="section-title mt-3">You stay in control</h2>
            <ul className="mt-6 space-y-3 text-[15px] leading-6 text-ink-soft">
              <li>• We use Claude, made by Anthropic. Anthropic says it does not train its models on your Gmail, Drive or Calendar connector data.</li>
              <li>• Set up my way, it drafts. You read, edit and press send. Claude asks before sending anything by default.</li>
              <li>• You choose what it can see, and you can disconnect it in two clicks.</li>
              <li>• I show you the one privacy setting to switch off on day one.</li>
            </ul>
            <a
              className="mt-5 inline-block text-[12px] text-ink-faint underline underline-offset-2"
              href="https://support.claude.com/en/articles/10166901-use-google-workspace-connectors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Anthropic: using the Google Workspace connectors
            </a>
          </div>
        </div>
      </section>

      {/* Host */}
      <section className="px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[280px_1fr]">
          <Image src="/nazir-session.jpg" alt="Naz, founder of Traq Collective" width={560} height={560} className="aspect-square w-full max-w-[280px] rounded-[24px] object-cover shadow-card" />
          <div>
            <div className="eyebrow eyebrow-accent">Your host</div>
            <h2 className="section-title mt-3">Hi, I&apos;m Naz</h2>
            <p className="mt-4 text-[16px] leading-7 text-ink-soft">
              I founded Traq Collective in Dubai, and I train teams at companies in the UAE and the UK to use AI in their actual day-to-day work. Before that I
              spent years in hotel revenue management at Hilton, so I know what a full inbox and a back-to-back calendar feel like.
            </p>
            <p className="mt-3 text-[16px] leading-7 text-ink-soft">
              Every morning my own assistant reads four inboxes and four calendars and hands me one page. In this session I show you how to start yours.
            </p>
          </div>
        </div>
      </section>

      {/* Go further */}
      <section className="bg-bg-subtle px-5 py-16 sm:px-8 sm:py-20" id="go-further">
        <div className="mx-auto max-w-6xl">
          <SectionHead
            eyebrow="Want to go further?"
            title="Get it built, not just explained"
            sub="Optional. The free session is complete on its own. These are for anyone who wants more, and you do not need to attend the free session first."
          />
          <div className="mt-3">
            <CurrencySwitch cur={cur} path={FAA_PATH} />
          </div>
          <div className="mt-10">
            <OfferCards cur={cur} />
          </div>
          <p className="mt-6 text-[14px] leading-6 text-ink-soft">
            <strong className="text-ink">The full cost, in one line:</strong> the free session is free. The live build is {price(buildSku(), cur)} once. To run your
            assistant you also need Claude Pro, about $20 a month, paid to Anthropic. Nothing else.
          </p>
        </div>
      </section>

      <FaqBlock qas={FAQS} heading="Questions people ask" />

      <section className="px-5 py-16 text-center sm:px-8">
        <h2 className="section-title">One hour. Plain English. Your first AI assistant.</h2>
        <p className="section-sub mx-auto mt-4">
          {sessions.length ? `${sessions.map((s) => s.day).join(' or ')}, 22:00 Dubai · 19:00 UK.` : 'The live build is on '}
          {sessions.length ? '' : `${dayLabel(BUILD.startIso)}.`}
        </p>
        <a className={`${BTN} mt-8`} href={sessions.length ? '#register' : '#go-further'}>
          {sessions.length ? 'Save my free seat' : 'See the live build'}
        </a>
      </section>

      <FunnelFooter />

      {/* Mobile sticky call to action */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border-subtle bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <a className={`${BTN} w-full`} href={sessions.length ? '#register' : '#go-further'}>
          {sessions.length ? 'Save my free seat' : 'See the live build'}
        </a>
      </div>
    </div>
  );
}

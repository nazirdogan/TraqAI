import type { Metadata } from 'next';
import Image from 'next/image';
import { headers } from 'next/headers';
import { Check, ShieldCheck, X } from 'lucide-react';
import type { Qa } from '@/lib/seo/schema';
import {
  BUILD,
  FAA_PATH,
  PROOF,
  TESTIMONIALS,
  VSL_POSTER,
  VSL_SRC,
  buildSku,
  currencyFor,
  dayLabel,
  dayLabelLong,
  openSessions,
  price,
  timeIn,
  timeTriple,
} from '@/lib/first-ai-assistant';
import RegisterForm, { type SessionOption } from './_components/RegisterForm';
import LocalTime from './_components/LocalTime';
import Countdown from './_components/Countdown';
import InboxToBrief from './_components/InboxToBrief';
import VoiceToggle from './_components/VoiceToggle';
import { BTN, CurrencySwitch, FunnelFooter, FunnelHeader, OfferCards } from './_components/ui';

export const dynamic = 'force-dynamic';

const TITLE = 'Your First AI Assistant: a free live session for AI beginners';
const DESCRIPTION =
  'Watch an AI assistant get built live: it reads your inbox and calendar and hands you one page every morning. Free, 60 minutes, plain English. Hosted by Naz at Traq Collective.';

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

const HOUR: { when: string; title: string; body: string }[] = [
  { when: '0–10 min', title: 'What AI is brilliant at, and what it still gets wrong', body: 'The three jobs worth handing over today, and the two you should always check.' },
  { when: '10–30 min', title: 'I build the morning page live, from an empty chat', body: 'Connect the inbox and calendar, write the instructions, run it. You watch every click.' },
  { when: '30–40 min', title: 'Keeping your data private', body: 'What it can see, what it can’t, and the settings I switch on before anything else.' },
  { when: '40–50 min', title: 'Your first seven days', body: 'One small win a day, so it’s part of your routine by next week.' },
  { when: '50–60 min', title: 'The one setting, then your questions', body: 'The change that makes it write like you instead of a robot. Most people never open it.' },
];

const FAQS: Qa[] = [
  { q: 'Is it really free?', a: 'Yes. No card, nothing to buy. At the end I mention the paid live build once, for anyone who wants their assistant set up with me. You can ignore it and still leave knowing how to do it yourself.' },
  { q: 'I’m not technical. Will I keep up?', a: 'Yes. It’s built for beginners. If you can send an email, you can follow it. I explain every step in plain English.' },
  { q: 'Which AI do you use, and why?', a: 'Claude, made by Anthropic. It connects to Gmail, Google Calendar and Microsoft 365, it writes well, and its privacy settings are clear. The ideas carry over to other tools too.' },
  { q: 'Do I need to buy anything to build my own afterwards?', a: 'To run your own assistant you’d need Claude Pro, about $20 a month, paid to Anthropic, not to me. For the free session you need nothing: just join on Google Meet, ideally from a laptop.' },
  { q: 'Is it safe to let AI near my email?', a: 'Anthropic says it doesn’t train its models on your Gmail, Drive or Calendar connector data, and you can switch off the setting that lets your chats be used for training. Claude asks before it sends anything, and in the setup I teach it only drafts. You choose what it can reach and can disconnect it in two clicks.' },
  { q: 'Does it work with Outlook?', a: 'With Microsoft 365 at work, yes, once your IT admin approves the connection. Personal Outlook and Hotmail accounts aren’t supported yet. Gmail and Google Workspace work straight away.' },
  { q: 'What if I can’t make it live?', a: 'Sign up anyway. Everyone gets the replay by email, up for 48 hours. VIP Pass holders keep it, with the slides, for 7 days.' },
  { q: 'Who is this not for?', a: 'Developers who already build with AI, and anyone after a get-rich-quick AI business. This is about making AI useful in your own working day.' },
];

function Cta({ label = 'Save my free seat', href = '#register', light = false }: { label?: string; href?: string; light?: boolean }) {
  return (
    <a
      href={href}
      className={
        light
          ? 'inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-[15px] font-semibold text-traq-deep shadow-card transition-transform hover:-translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
          : BTN
      }
    >
      {label}
    </a>
  );
}

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
  const open = sessions.length > 0;
  const proof = PROOF.filter((p) => p.stat !== '+34%');
  const ctaHref = open ? '#register' : '#go-further';
  const ctaLabel = open ? 'Save my free seat' : 'See the live build';

  return (
    <div className="bg-bg-base">
      {/* Countdown bar */}
      {next ? (
        <div className="sticky top-0 z-40 bg-traq-deep text-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-2.5 text-[13px] sm:px-8 sm:text-[14px]">
            <p className="min-w-0 truncate">
              <span className="font-semibold">Free live session</span>
              <span className="hidden sm:inline">
                {' '}
                on {dayLabelLong(next.startIso)}, {timeIn(next.startIso, 'Europe/London')} UK / {timeIn(next.startIso, 'Asia/Dubai')} Dubai
              </span>
            </p>
            <div className="flex flex-none items-center gap-4">
              <Countdown iso={next.startIso} className="font-semibold tabular-nums text-white" />
              <a href="#register" className="hidden rounded-full bg-white px-4 py-1.5 text-[13px] font-semibold text-traq-deep hover:bg-traq-tint sm:inline-block">
                Save my seat
              </a>
            </div>
          </div>
        </div>
      ) : null}

      <FunnelHeader />

      {/* Hero: one column, so the VSL is the first thing on screen */}
      <section className="px-5 pb-16 pt-8 sm:px-8 sm:pt-10">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="text-[44px] font-extrabold leading-[0.98] tracking-[-0.035em] text-ink sm:text-[60px] lg:whitespace-nowrap lg:text-[64px] xl:text-[76px]">
            117 emails in.
            <br className="lg:hidden" />
            <span className="hidden lg:inline"> </span>
            One page out.
          </h1>
          <p className="mx-auto mt-4 max-w-5xl text-[15px] leading-6 text-ink-soft sm:text-[18px] sm:leading-8">
            Join me live for an hour and watch me build an AI assistant that reads your inbox and calendar, then hands you one page every morning: what’s on,
            what needs you, and what you forgot. Free, in plain English.
          </p>
          <a
            href={ctaHref}
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-traq-purple px-6 py-3.5 text-[16px] font-semibold text-white shadow-card hover:bg-traq-deep sm:hidden"
          >
            {open ? 'Save your free seat' : ctaLabel}
          </a>

          <div className="mx-auto mt-6 max-w-4xl sm:mt-8">
            {VSL_SRC ? (
              <video className="aspect-video w-full rounded-[22px] border border-border-subtle bg-black object-cover shadow-cardHover" src={VSL_SRC} poster={VSL_POSTER} controls playsInline preload="metadata" />
            ) : (
              <>
                <InboxToBrief />
                <p className="mt-2 text-[12px] text-ink-faint">117 is the average number of emails a worker receives a day (Microsoft Work Trend Index, 2025).</p>
              </>
            )}
          </div>

          <ul className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-x-6 gap-y-2.5 text-[15px] text-ink">
            {['No code, nothing to install', 'It drafts, you press send', 'Gmail, Google Workspace or Microsoft 365'].map((t) => (
              <li key={t} className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 flex-none text-traq-purple" aria-hidden="true" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
          {next ? (
            <p className="mt-4 text-[14px] text-ink-faint">
              {sessions.map((s) => s.day).join(' or ')}, 60 minutes on Google Meet. <LocalTime iso={next.startIso} prefix="The first one is" />
            </p>
          ) : null}

          <div id="register" className="mx-auto mt-10 max-w-xl scroll-mt-20 text-left">
            <RegisterForm sessions={sessions} defaultCountry={country ? COUNTRY_NAMES[country] : undefined} />
          </div>
        </div>
      </section>

      {/* What it hands you */}
      <section className="border-t border-border-subtle px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="max-w-3xl text-[34px] font-extrabold leading-[1.05] tracking-[-0.025em] text-ink sm:text-[48px]">
            What it takes off your plate.
          </h2>
          <div className="mt-14 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h3 className="text-[24px] font-bold text-ink">Replies that sound like you</h3>
              <p className="mt-3 max-w-md text-[17px] leading-8 text-ink-soft">
                It drafts the replies that need you, in your words. Most people stop using AI because it writes like a robot. That’s one setting, and I show
                you it at the end of the session.
              </p>
            </div>
            <VoiceToggle />
          </div>
          <div className="mt-16 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="lg:order-2">
              <h3 className="text-[24px] font-bold text-ink">Two minutes of prep before every meeting</h3>
              <p className="mt-3 max-w-md text-[17px] leading-8 text-ink-soft">
                It reads your recent emails with the person you’re about to meet and gives you the short version: where things stand, what you owe them, what to
                ask.
              </p>
            </div>
            <div className="note-card lg:order-1">
              <p className="text-[13px] font-semibold text-traq-purple">13:30 Client call: prep note</p>
              <ul className="mt-3 space-y-2 text-[15px] leading-7 text-ink">
                <li>Last contact: Tuesday. They asked to move the start date to November.</li>
                <li>You owe them: the revised quote (promised by Friday).</li>
                <li>Ask: who signs off on their side, and is the budget confirmed?</li>
              </ul>
              <p className="font-hand mt-4 text-[21px] text-traq-purple">read it in the lift on the way up</p>
            </div>
          </div>
          <div className="mt-16 text-center">
            <Cta href={ctaHref} label={ctaLabel} />
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="bg-bg-subtle px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="max-w-3xl text-[30px] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink sm:text-[40px]">Not hype. Measured.</h2>
          <p className="mt-3 max-w-2xl text-[16px] leading-7 text-ink-soft">Published studies, each linked to its source. No promises about your results.</p>
          <div className="mt-10 grid divide-y divide-border-strong border-y border-border-strong md:grid-cols-3 md:divide-x md:divide-y-0">
            {proof.map((p) => (
              <div key={p.stat} className="py-8 md:px-8 md:first:pl-0 md:last:pr-0">
                <div className="text-[56px] font-extrabold leading-none tracking-[-0.03em] text-traq-purple">{p.stat}</div>
                <p className="mt-4 text-[16px] leading-7 text-ink-soft">{p.line}</p>
                <a className="mt-3 inline-block text-[13px] text-ink-faint underline underline-offset-2" href={p.href} target="_blank" rel="noopener noreferrer">
                  {p.source}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The hour */}
      <section className="px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-[34px] font-extrabold leading-[1.05] tracking-[-0.025em] text-ink sm:text-[48px]">The hour, roughly as it runs</h2>
            <p className="mt-4 max-w-sm text-[17px] leading-8 text-ink-soft">Live on my screen, questions welcome throughout. Camera optional.</p>
            <div className="mt-8 hidden lg:block">
              <Cta href={ctaHref} label={ctaLabel} />
            </div>
          </div>
          <ol className="relative border-l-2 border-traq-tint pl-8">
            {HOUR.map((s) => (
              <li key={s.when} className="relative pb-9 last:pb-0">
                <span className="absolute -left-[41px] top-1.5 h-4 w-4 rounded-full border-4 border-white bg-traq-purple ring-2 ring-traq-tint" aria-hidden="true" />
                <p className="text-[14px] font-semibold tabular-nums text-traq-purple">{s.when}</p>
                <h3 className="mt-1 text-[20px] font-bold leading-snug text-ink">{s.title}</h3>
                <p className="mt-1.5 text-[16px] leading-7 text-ink-soft">{s.body}</p>
              </li>
            ))}
          </ol>
          <div className="lg:hidden">
            <Cta href={ctaHref} label={ctaLabel} />
          </div>
        </div>
      </section>

      {/* For you / safe */}
      <section className="bg-bg-subtle px-5 py-20 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-[30px] font-extrabold tracking-[-0.02em] text-ink sm:text-[36px]">Come if…</h2>
            <ul className="mt-6 space-y-3.5 text-[16px] leading-7 text-ink">
              {[
                'You run a business and your inbox runs your day',
                'You’re an accountant, lawyer, consultant or agent juggling clients',
                'You’re senior, AI moved fast, and you want to catch up properly',
                'You tried ChatGPT once and didn’t see what the fuss was about',
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <Check className="mt-1 h-5 w-5 flex-none text-traq-purple" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
            <h3 className="mt-10 text-[20px] font-bold text-ink">Skip it if…</h3>
            <ul className="mt-4 space-y-3 text-[16px] leading-7 text-ink-soft">
              {['You already build with AI as a developer', 'You want a get-rich-quick AI business'].map((t) => (
                <li key={t} className="flex gap-3">
                  <X className="mt-1 h-5 w-5 flex-none text-ink-faint" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[26px] border border-border-subtle bg-white p-7 shadow-card sm:p-9">
            <ShieldCheck className="h-8 w-8 text-traq-purple" aria-hidden="true" />
            <h2 className="mt-4 text-[30px] font-extrabold tracking-[-0.02em] text-ink sm:text-[36px]">You stay in control</h2>
            <ul className="mt-6 space-y-4 text-[16px] leading-7 text-ink-soft">
              <li>We use Claude, made by Anthropic. Anthropic says it doesn’t train its models on your Gmail, Drive or Calendar connector data.</li>
              <li>Set up my way, it drafts. You read, edit and press send. Claude asks before sending anything by default.</li>
              <li>You choose what it can see, and you can disconnect it in two clicks.</li>
              <li>I show you the privacy settings to switch on, on day one.</li>
            </ul>
            <a
              className="mt-6 inline-block text-[13px] text-ink-faint underline underline-offset-2"
              href="https://support.claude.com/en/articles/10166901-use-google-workspace-connectors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Source: Anthropic, using the Google Workspace connectors
            </a>
          </div>
        </div>
      </section>

      {/* Host */}
      <section className="px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-5xl items-start gap-10 md:grid-cols-[300px_1fr] md:gap-14">
          <div className="relative">
            <Image
              src="/nazir-session.jpg"
              alt="Naz, founder of Traq Collective"
              width={600}
              height={600}
              className="aspect-[4/5] w-full max-w-[300px] rounded-[26px] object-cover shadow-cardHover"
            />
            <p className="font-hand mt-3 -rotate-2 text-[22px] text-traq-purple">ex-hotel revenue manager</p>
          </div>
          <div>
            <h2 className="text-[34px] font-extrabold leading-[1.05] tracking-[-0.025em] text-ink sm:text-[46px]">I didn’t come from tech.</h2>
            <div className="mt-6 space-y-4 text-[17px] leading-8 text-ink-soft">
              <p>
                I’m Naz. I joined Hilton’s graduate scheme straight from university and spent years in hotel revenue management, first in London, then in Dubai.
                Full inbox, back-to-back calendar, numbers due by nine.
              </p>
              <p>
                When AI arrived, I watched clever, experienced people avoid it. Not because they couldn’t use it. Because they were nervous of getting it wrong,
                and nobody showed them where to start safely.
              </p>
              <p>
                So now I do that. I run Traq Collective in Dubai, and I train teams at companies in the UAE and the UK to use AI in their actual work.
              </p>
              <p className="text-ink">
                Every morning, my own assistant reads four inboxes and four calendars and hands me one page. In this hour I’ll show you how to start yours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why free */}
      <section className="bg-traq-deep px-5 py-20 text-white sm:px-8 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-[34px] font-extrabold leading-[1.05] tracking-[-0.025em] sm:text-[48px]">If it’s this useful, why is it free?</h2>
          <div className="mt-6 space-y-4 text-[18px] leading-8 text-white/85">
            <p>Because the hour stands on its own. You’ll leave knowing how to set this up yourself.</p>
            <p>
              And some people would rather I set it up with them. That’s what the paid live build and the one-to-one are for. I mention them once, at the end.
              No hard sell, no pressure, and no card needed to join.
            </p>
          </div>
          {open ? (
            <div className="mt-10">
              <Cta light />
            </div>
          ) : null}
        </div>
      </section>

      {/* Go further */}
      <section className="px-5 py-20 sm:px-8 sm:py-24" id="go-further">
        <div className="mx-auto max-w-6xl">
          <h2 className="max-w-3xl text-[34px] font-extrabold leading-[1.05] tracking-[-0.025em] text-ink sm:text-[48px]">Want it set up, not just shown?</h2>
          <p className="mt-4 max-w-2xl text-[17px] leading-8 text-ink-soft">
            Optional. You don’t need to come to the free session first, and the free session is complete without these.
          </p>
          <div className="mt-3">
            <CurrencySwitch cur={cur} path={FAA_PATH} />
          </div>
          <div className="mt-10">
            <OfferCards cur={cur} />
          </div>
          <p className="mt-6 text-[14px] leading-6 text-ink-soft">
            <strong className="text-ink">The full cost, in one line:</strong> the free session is free. The live build is {price(buildSku(), cur)} once. To run
            your assistant you also need Claude Pro, about $20 a month, paid to Anthropic. Nothing else.
          </p>
        </div>
      </section>

      {/* Testimonials (shown only once real quotes exist) */}
      {TESTIMONIALS.length ? (
        <section className="bg-bg-subtle px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-[30px] font-extrabold tracking-[-0.02em] text-ink sm:text-[40px]">What people said after</h2>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <figure key={t.quote} className="border-l-2 border-traq-purple pl-5">
                  <blockquote className="text-[17px] leading-8 text-ink">“{t.quote}”</blockquote>
                  <figcaption className="mt-3 text-[14px] text-ink-faint">
                    {t.name}, {t.role}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* FAQ */}
      <section className="bg-bg-subtle px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-[30px] font-extrabold tracking-[-0.02em] text-ink sm:text-[40px]">Questions people ask</h2>
          <div className="mt-8 divide-y divide-border-strong border-y border-border-strong">
            {FAQS.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-semibold text-ink marker:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-traq-purple">
                  {f.q}
                  <span className="flex-none text-[22px] font-normal text-traq-purple transition-transform group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[16px] leading-7 text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Recap */}
      <section className="px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-[34px] font-extrabold leading-[1.05] tracking-[-0.025em] text-ink sm:text-[48px]">One hour. Plain English. Your first AI assistant.</h2>
          <dl className="mx-auto mt-10 grid max-w-3xl gap-x-10 gap-y-5 text-[16px] sm:grid-cols-[auto_1fr]">
            <dt className="font-semibold text-ink">When</dt>
            <dd className="text-ink-soft">
              {open ? sessions.map((s) => `${s.day}, ${s.times}`).join('; or ') : `The free sessions have finished. The live build is on ${dayLabel(BUILD.startIso)}.`}
            </dd>
            <dt className="font-semibold text-ink">Where</dt>
            <dd className="text-ink-soft">Google Meet. A laptop is best, camera optional.</dd>
            <dt className="font-semibold text-ink">Cost</dt>
            <dd className="text-ink-soft">Free. No card.</dd>
            <dt className="font-semibold text-ink">Can’t make it?</dt>
            <dd className="text-ink-soft">Sign up anyway. The replay comes to your inbox, up for 48 hours.</dd>
          </dl>
          <div className="mt-10 flex flex-col items-center gap-3">
            <Cta href={ctaHref} label={ctaLabel} />
            {next ? <Countdown iso={next.startIso} className="text-[14px] font-medium tabular-nums text-ink-faint" /> : null}
          </div>
        </div>
      </section>

      <FunnelFooter />

      {/* Mobile sticky call to action */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border-subtle bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <a className={`${BTN} w-full`} href={open ? '#register' : '#go-further'}>
          {ctaLabel}
        </a>
      </div>
      <div className="h-20 lg:hidden" aria-hidden="true" />
    </div>
  );
}

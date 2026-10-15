import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { CheckCircle2 } from 'lucide-react';
import {
  BUILD,
  BUILD_NAME,
  FAA_PATH,
  FREE_SESSIONS,
  LINKS,
  OFFICE_HOURS,
  SETUP_BOOKING_URL,
  VIP_QA_MINUTES,
  addMinutes,
  currencyFor,
  dayLabel,
  dayLabelLong,
  googleCalendarUrl,
  price,
  timeTriple,
  KIT_KEY,
} from '@/lib/first-ai-assistant';
import { BTN, BTN_GHOST, FunnelFooter, FunnelHeader } from '../_components/ui';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Welcome: your next steps', robots: { index: false, follow: false } };

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[22px] border border-border-subtle bg-white p-6 shadow-card sm:p-8">
      <h2 className="text-[20px] font-semibold text-ink">{title}</h2>
      <div className="mt-3 space-y-3 text-[15px] leading-7 text-ink-soft">{children}</div>
    </div>
  );
}

function BuildDetails() {
  return (
    <>
      <Card title={`Your seat: ${BUILD_NAME}`}>
        <p>
          <strong className="text-ink">{dayLabelLong(BUILD.startIso)}</strong>, {timeTriple(BUILD.startIso)}. Three hours on Google Meet.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            className={BTN}
            target="_blank"
            rel="noopener noreferrer"
            href={googleCalendarUrl({ title: BUILD_NAME, startIso: BUILD.startIso, endIso: BUILD.endIso, details: `Join: ${BUILD.meetUrl}`, location: BUILD.meetUrl })}
          >
            Add to Google Calendar
          </a>
          <a className={BTN_GHOST} href="/api/first-ai-assistant/ics?s=build">
            Outlook / Apple calendar
          </a>
        </div>
        <p>
          Join link: <a className="font-semibold text-traq-purple underline" href={BUILD.meetUrl}>{BUILD.meetUrl.replace('https://', '')}</a>
        </p>
      </Card>
      <Card title="Before Saturday (10 minutes)">
        <ol className="list-decimal space-y-2 pl-5">
          <li>Subscribe to Claude Pro at claude.ai (about $20 a month, paid to Anthropic) and install the Claude desktop app.</li>
          <li>Check you can sign in to the email and calendar you want to connect: Gmail, Google Workspace, or Microsoft 365 at work.</li>
          <li>On Microsoft 365, ask your IT admin to approve the Claude connector before the day. If that is you and you are not sure how, reply to my email and I will help.</li>
          <li>Pick five emails you have sent recently that sound like you. We use them to teach it your voice.</li>
          <li>Join from a laptop, not a phone, ideally with a second screen or the Meet on a tablet.</li>
        </ol>
      </Card>
      <Card title="Office hours (for anything that did not stick)">
        <ul className="space-y-1">
          {OFFICE_HOURS.map((o) => (
            <li key={o.startIso}>
              {dayLabel(o.startIso)}, {timeTriple(o.startIso)}: <a className="font-semibold text-traq-purple underline" href={o.meetUrl}>{o.meetUrl.replace('https://', '')}</a>
            </li>
          ))}
        </ul>
        <p>You will also get the replay, the setup files and the invite to the 14-day support group by email.</p>
      </Card>
    </>
  );
}

function SetupDetails() {
  return (
    <Card title="Book your 1:1 setup">
      <p>Choose a 75-minute slot that suits you. Before 28 October there are four slots; pick the earliest one you can.</p>
      <a className={BTN} href={SETUP_BOOKING_URL} target="_blank" rel="noopener noreferrer">
        Choose my slot
      </a>
      <p>Before the call: subscribe to Claude Pro (about $20 a month, paid to Anthropic), install the Claude desktop app, and if you are on Microsoft 365 at work, ask your IT admin to approve the Claude connector.</p>
    </Card>
  );
}

function VipDetails({ cur }: { cur: ReturnType<typeof currencyFor> }) {
  return (
    <>
      <Card title="Your VIP Q&A">
        <p>Straight after your free session, on its own link, for {VIP_QA_MINUTES} minutes. Bring your own inbox and your own questions.</p>
        <ul className="space-y-1">
          {FREE_SESSIONS.map((s) => {
            const start = addMinutes(s.startIso, 60);
            return (
              <li key={s.id}>
                {dayLabel(s.startIso)} session: Q&A at {timeTriple(start)},{' '}
                <a className="font-semibold text-traq-purple underline" href={s.vipMeetUrl}>{s.vipMeetUrl.replace('https://', '')}</a>
              </li>
            );
          })}
        </ul>
      </Card>
      <Card title="Your Starter Kit">
        <p>Thirty copy-and-paste prompts by role, the setup checklist and the voice guide. Bookmark it.</p>
        <a className={BTN} href={`${FAA_PATH}/kit?k=${KIT_KEY}`}>
          Open the Starter Kit
        </a>
      </Card>
      <Card title="Your VIP price on the live build">
        <p>
          {BUILD_NAME}, {dayLabel(BUILD.startIso)}, {timeTriple(BUILD.startIso)}. Your price: <strong className="text-ink">{price('build_vip', cur)}</strong>.
        </p>
        <a className={BTN} href={LINKS.build_vip[cur]}>
          Save my seat at the VIP price
        </a>
      </Card>
    </>
  );
}

export default function Page({ searchParams }: { searchParams: { p?: string; cur?: string } }) {
  const p = searchParams.p ?? '';
  const cur = currencyFor(headers().get('x-vercel-ip-country'), searchParams.cur);
  const isBuild = p === 'build' || p === 'build_std' || p === 'build_vip' || p === 'bundle';
  const isSetup = p === 'setup' || p === 'bundle';
  const isVip = p === 'vip';

  return (
    <div className="bg-bg-base">
      <FunnelHeader chip="Payment received" />
      <section className="px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-traq-purple" aria-hidden="true" />
            <h1 className="mt-4 text-[34px] font-semibold leading-tight text-ink sm:text-[42px]">Thank you. You are all set.</h1>
            <p className="mt-3 text-[16px] text-ink-soft">Your receipt is on its way from Stripe. Everything you need is below, and in your inbox within the hour.</p>
          </div>
          <div className="mt-10 space-y-5">
            {isVip ? <VipDetails cur={cur} /> : null}
            {isBuild ? <BuildDetails /> : null}
            {isSetup ? <SetupDetails /> : null}
            {!isVip && !isBuild && !isSetup ? (
              <Card title="Next steps">
                <p>Your details are on their way by email. Questions: hello@traqcollective.com.</p>
              </Card>
            ) : null}
            {isBuild || isSetup ? (
              <Card title="Your Starter Kit">
                <p>Included with your purchase: thirty prompts by role, the setup checklist and the voice guide.</p>
                <a className={BTN_GHOST} href={`${FAA_PATH}/kit?k=${KIT_KEY}`}>
                  Open the Starter Kit
                </a>
              </Card>
            ) : null}
          </div>
          <p className="mt-8 text-center text-[14px] text-ink-faint">Anything not right? Email hello@traqcollective.com and I will sort it.</p>
        </div>
      </section>
      <FunnelFooter />
    </div>
  );
}

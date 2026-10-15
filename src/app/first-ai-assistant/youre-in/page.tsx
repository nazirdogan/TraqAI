import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { CheckCircle2 } from 'lucide-react';
import {
  FAA_NAME,
  FAA_PATH,
  FREE_SESSION_MINUTES,
  LINKS,
  addMinutes,
  currencyFor,
  dayLabelLong,
  googleCalendarUrl,
  price,
  sessionById,
  timeTriple,
} from '@/lib/first-ai-assistant';
import LocalTime from '../_components/LocalTime';
import { BTN, BTN_GHOST, CurrencySwitch, FunnelFooter, FunnelHeader, OfferCards } from '../_components/ui';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "You're in: Your First AI Assistant",
  robots: { index: false, follow: false },
};

const VIP_VALUE: { item: string; worth: string }[] = [
  { item: 'Private 25-minute Q&A with Naz, straight after the session, on its own link', worth: 'Ask about your own inbox, your own job' },
  { item: 'The AI Assistant Starter Kit: 30 copy-and-paste prompts for founders, professional services and senior leaders', worth: 'Use them the same night' },
  { item: 'The one-page setup checklist for Gmail, Google Workspace and Microsoft 365', worth: 'Skip the trial and error' },
  { item: 'Replay and slides for 7 days (everyone else gets 48 hours)', worth: 'Rewatch the build at your pace' },
  { item: 'The VIP price on the live build', worth: 'Saves more than the pass costs' },
];

export default function Page({ searchParams }: { searchParams: { s?: string; n?: string; cur?: string } }) {
  const session = sessionById(searchParams.s);
  const name = (searchParams.n ?? '').slice(0, 40);
  const cur = currencyFor(headers().get('x-vercel-ip-country'), searchParams.cur);
  const path = `${FAA_PATH}/youre-in?s=${searchParams.s ?? ''}&n=${encodeURIComponent(name)}`;

  return (
    <div className="bg-bg-base">
      <FunnelHeader chip="Seat saved" />

      <section className="px-5 pb-12 pt-10 sm:px-8 sm:pt-14">
        <div className="mx-auto max-w-3xl text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-traq-purple" aria-hidden="true" />
          <h1 className="mt-4 text-[34px] font-semibold leading-tight text-ink sm:text-[44px]">{name ? `${name}, you're in.` : "You're in."}</h1>
          {session ? (
            <>
              <p className="mt-4 text-[18px] leading-8 text-ink-soft">
                {FAA_NAME} is live on <strong className="text-ink">{dayLabelLong(session.startIso)}</strong>, {timeTriple(session.startIso)}.
              </p>
              <p className="mt-1 text-[14px] text-ink-faint">
                <LocalTime iso={session.startIso} />
              </p>
              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  className={BTN}
                  href={googleCalendarUrl({
                    title: `${FAA_NAME} (free live session)`,
                    startIso: session.startIso,
                    endIso: addMinutes(session.startIso, FREE_SESSION_MINUTES),
                    details: `Join on Google Meet: ${session.meetUrl}`,
                    location: session.meetUrl,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Add to Google Calendar
                </a>
                <a className={BTN_GHOST} href={`/api/first-ai-assistant/ics?s=${session.id}`}>
                  Outlook / Apple calendar
                </a>
              </div>
              <p className="mt-5 text-[15px] text-ink-soft">
                Your join link: <a className="font-semibold text-traq-purple underline underline-offset-2" href={session.meetUrl}>{session.meetUrl.replace('https://', '')}</a>. It is also in
                your inbox now, with reminders the day before, three hours before and five minutes before.
              </p>
            </>
          ) : (
            <p className="mt-4 text-[18px] text-ink-soft">Your confirmation and join link are in your inbox.</p>
          )}
          <p className="mt-4 text-[13px] text-ink-faint">Cannot see the email? Check your promotions or spam folder and mark it as safe, so the reminders reach you.</p>
        </div>
      </section>

      {/* VIP: optional, below the confirmation, never in front of it. */}
      <section className="bg-bg-subtle px-5 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-[24px] border-2 border-traq-purple bg-white p-7 shadow-cardHover sm:p-9">
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-traq-purple">Optional · only before the session starts</p>
            <h2 className="mt-2 text-[28px] font-semibold leading-tight text-ink">Make the most of your hour with the VIP Pass</h2>
            <p className="mt-3 text-[16px] leading-7 text-ink-soft">The free session is complete on its own. The VIP Pass is for anyone who wants their own questions answered and the tools to start the same night.</p>
            <ul className="mt-6 divide-y divide-border-subtle rounded-2xl border border-border-subtle">
              {VIP_VALUE.map((v) => (
                <li key={v.item} className="flex flex-col gap-1 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                  <span className="text-[15px] leading-6 text-ink">{v.item}</span>
                  <span className="text-[13px] font-medium text-traq-purple-ink sm:text-right">{v.worth}</span>
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
              <p className="text-[30px] font-semibold text-ink">{price('vip', cur)}</p>
              <a className={`${BTN} w-full sm:w-auto`} href={LINKS.vip[cur]}>
                Add the VIP Pass for {price('vip', cur)}
              </a>
            </div>
            <div className="mt-3">
              <CurrencySwitch cur={cur} path={path} />
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="section-title text-center">Rather have it built with you?</h2>
          <p className="section-sub mx-auto mt-4 text-center">You do not need to wait for the free session to book either of these.</p>
          <div className="mt-10">
            <OfferCards cur={cur} showVip={false} />
          </div>
        </div>
      </section>

      <FunnelFooter />
    </div>
  );
}

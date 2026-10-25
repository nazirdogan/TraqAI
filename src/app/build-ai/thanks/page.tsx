import type { Metadata } from 'next';
import { DATE_LABEL, SESSION_TITLE, googleCalendarUrl, usTimes } from '@/lib/build-ai-session';
import { BTN, BuildAiFooter, BuildAiHeader } from '../_components/ui';
import Confirm from './Confirm';

export const metadata: Metadata = {
  title: { absolute: `You’re in · ${SESSION_TITLE}` },
  robots: { index: false, follow: false },
};

export default function BuildAiThanksPage({ searchParams }: { searchParams: { session_id?: string } }) {
  const sessionId = typeof searchParams.session_id === 'string' ? searchParams.session_id : null;
  return (
    <>
      <BuildAiHeader />
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-2xl px-5 sm:px-8">
          <h1 className="text-[44px] font-semibold leading-[1.05] tracking-[-0.03em] text-ink sm:text-[56px]">You’re in.</h1>
          <p className="mt-5 text-[18px] leading-8 text-ink-soft">
            {SESSION_TITLE}, {DATE_LABEL}. {usTimes()}.
          </p>
          <p className="mt-4 text-[18px] leading-8 text-ink-soft">
            A calendar invite is on its way to the email you paid with, and your joining link follows by email before the
            session. Add it to your calendar now so you don’t miss it.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a href={googleCalendarUrl()} target="_blank" rel="noopener noreferrer" className={BTN}>
              Add to Google Calendar
            </a>
            <a
              href="/build-ai/session.ics"
              download="build-ai-into-your-business.ics"
              className="inline-flex min-h-[44px] items-center text-[16px] font-semibold text-traq-purple-ink underline underline-offset-4"
            >
              Apple or Outlook calendar
            </a>
          </div>
          <div className="mt-12 rounded-2xl border border-border-subtle bg-bg-subtle p-6">
            <h2 className="text-[18px] font-semibold text-ink">Before Thursday</h2>
            <ul className="mt-3 space-y-2 text-[16px] leading-7 text-ink-soft">
              <li>Set up a free ChatGPT or Claude account, so it’s ready to open in another tab.</li>
              <li>Think about where your week goes: quotes, calls, emails, admin. We’ll pick one problem to fix together.</li>
            </ul>
          </div>
          <p className="mt-8 text-[15px] leading-7 text-ink-faint">
            Questions? Email{' '}
            <a className="font-medium text-traq-purple-ink underline underline-offset-2" href="mailto:hello@traqcollective.com">
              hello@traqcollective.com
            </a>
            .
          </p>
          <Confirm sessionId={sessionId} />
        </div>
      </section>
      <BuildAiFooter />
    </>
  );
}

import type { Metadata } from 'next';
import { SESSION_TITLE, TEMPLATE_URL } from '@/lib/keep-session';
import { BTN, KeepFooter, KeepHeader } from '../_components/ui';
import Confirm from '../_components/Confirm';

export const metadata: Metadata = {
  title: { absolute: `You’re in · ${SESSION_TITLE}` },
  robots: { index: false, follow: false },
};

export default function KeepThanksPage({ searchParams }: { searchParams: { session_id?: string } }) {
  const sessionId = typeof searchParams.session_id === 'string' ? searchParams.session_id : null;
  return (
    <>
      <KeepHeader />
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-2xl px-5 sm:px-8">
          <h1 className="text-[44px] font-semibold leading-[1.05] tracking-[-0.03em] text-ink sm:text-[56px]">You’re in.</h1>
          <p className="mt-5 text-[18px] leading-8 text-ink-soft">
            Your Zoom link arrives by email before Saturday. Add the session to your calendar now so you don’t miss it.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a href="/keep/session.ics" download="the-person-they-keep.ics" className={BTN}>
              Add to calendar
            </a>
            {TEMPLATE_URL ? (
              <a
                href={TEMPLATE_URL}
                className="inline-flex min-h-[44px] items-center text-[16px] font-semibold text-traq-purple-ink underline underline-offset-4"
              >
                Get the free work brief template
              </a>
            ) : null}
          </div>
          <Confirm sessionId={sessionId} />
        </div>
      </section>
      <KeepFooter />
    </>
  );
}

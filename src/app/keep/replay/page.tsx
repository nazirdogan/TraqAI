import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ACCESS_KEY, REPLAY_URL, SESSION_TITLE } from '@/lib/keep-session';
import { BTN, KeepFooter, KeepHeader } from '../_components/ui';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { absolute: `Replay · ${SESSION_TITLE}` },
  robots: { index: false, follow: false },
};

export default function KeepReplayPage({ searchParams }: { searchParams: { k?: string } }) {
  if (searchParams.k !== ACCESS_KEY) notFound();

  return (
    <>
      <KeepHeader />
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-2xl px-5 sm:px-8">
          <h1 className="text-[36px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[48px]">Your replay</h1>
          {REPLAY_URL ? (
            <>
              <p className="mt-5 text-[18px] leading-8 text-ink-soft">The full recording of {SESSION_TITLE}.</p>
              <a href={REPLAY_URL} className={`${BTN} mt-8`}>
                Watch the replay
              </a>
            </>
          ) : (
            <p className="mt-5 text-[18px] leading-8 text-ink-soft">
              The recording is being prepared and will be on this page within a day of the session. Your email link brings you back here.
            </p>
          )}
        </div>
      </section>
      <KeepFooter />
    </>
  );
}

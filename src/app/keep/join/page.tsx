import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { ACCESS_KEY, SESSION_TITLE, ZOOM_URL, dayIn, sessionFinished, timeTriple } from '@/lib/keep-session';
import { KeepFooter, KeepHeader } from '../_components/ui';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { absolute: `Join · ${SESSION_TITLE}` },
  robots: { index: false, follow: false },
};

/**
 * Every join link in the buyer emails lands here and is sent on to Zoom, so
 * the meeting link can be set (or changed) after the emails are scheduled.
 * After the session it points to the replay page instead.
 */
export default function KeepJoinPage({ searchParams }: { searchParams: { k?: string } }) {
  if (searchParams.k !== ACCESS_KEY) notFound();
  if (sessionFinished()) redirect(`/keep/replay?k=${ACCESS_KEY}`);
  if (ZOOM_URL) redirect(ZOOM_URL);

  return (
    <>
      <KeepHeader />
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-2xl px-5 sm:px-8">
          <h1 className="text-[36px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[48px]">Your Zoom link opens here</h1>
          <p className="mt-5 text-[18px] leading-8 text-ink-soft">
            {SESSION_TITLE} is live on {dayIn('Asia/Dubai')}, {timeTriple()}. The meeting link is not up yet. Come back to this page,
            or use the link in your reminder emails, and it will take you straight into Zoom.
          </p>
        </div>
      </section>
      <KeepFooter />
    </>
  );
}

import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import {
  BUILD,
  BUILD_KEY,
  BUILD_NAME,
  BUILD_REPLAY_UNTIL_ISO,
  FAA_NAME,
  FAA_PATH,
  FREE_REPLAY_HOURS_FROM_START,
  REPLAYS,
  VIP_REPLAY_HOURS_FROM_START,
  addMinutes,
  buildIsOver,
  currencyFor,
  dayLabel,
  dayLabelLong,
  replayEmbedUrl,
  sessionById,
  timeTriple,
} from '@/lib/first-ai-assistant';
import { BTN, FunnelFooter, FunnelHeader, OfferCards } from '../_components/ui';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Replay', robots: { index: false, follow: false } };

function Shell({ chip, title, children }: { chip: string; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-bg-base">
      <FunnelHeader chip={chip} />
      <section className="px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-center text-[30px] font-semibold leading-tight text-ink sm:text-[40px]">{title}</h1>
          <div className="mt-8">{children}</div>
        </div>
      </section>
      <FunnelFooter />
    </div>
  );
}

function Video({ id }: { id: string }) {
  return (
    <div className="overflow-hidden rounded-[22px] border border-border-subtle bg-black shadow-cardHover">
      <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
        <iframe
          src={replayEmbedUrl(id)}
          title="Session replay"
          allow="autoplay; fullscreen"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
}

/**
 * Replay page. ?s=mon19 | wed21 for the free sessions (open to everyone for 48
 * hours, 7 days with ?v=1 from the VIP kit), ?s=build&k=... for build buyers.
 */
export default function Page({ searchParams }: { searchParams: { s?: string; k?: string; v?: string; cur?: string } }) {
  const now = Date.now();
  const cur = currencyFor(headers().get('x-vercel-ip-country'), searchParams.cur);

  if (searchParams.s === 'build') {
    if (searchParams.k !== BUILD_KEY) notFound();
    const id = REPLAYS.build;
    if (now > Date.parse(BUILD_REPLAY_UNTIL_ISO)) {
      return (
        <Shell chip="Replay" title="This replay has closed">
          <p className="text-center text-[16px] text-ink-soft">Need something from it? Email hello@traqcollective.com and I will help.</p>
        </Shell>
      );
    }
    return (
      <Shell chip="Build replay" title={BUILD_NAME}>
        {id ? (
          <Video id={id} />
        ) : (
          <p className="text-center text-[16px] leading-7 text-ink-soft">
            The replay goes up here by the morning after the build. Bookmark this page.
          </p>
        )}
        <p className="mt-5 text-center text-[14px] text-ink-faint">Yours until {dayLabelLong(BUILD_REPLAY_UNTIL_ISO)}.</p>
      </Shell>
    );
  }

  const s = sessionById(searchParams.s);
  if (!s) notFound();
  const vip = searchParams.v === '1';
  const start = Date.parse(s.startIso);
  const closesIso = addMinutes(s.startIso, (vip ? VIP_REPLAY_HOURS_FROM_START : FREE_REPLAY_HOURS_FROM_START) * 60);
  const id = REPLAYS[s.id];
  const offers = !buildIsOver() ? (
    <div className="mt-12">
      <h2 className="text-center text-[24px] font-semibold text-ink">Want it set up on your own inbox?</h2>
      <p className="mx-auto mt-2 max-w-2xl text-center text-[15px] leading-7 text-ink-soft">
        {BUILD_NAME}: {dayLabel(BUILD.startIso)}, {timeTriple(BUILD.startIso)}. Three hours, fifteen seats.
      </p>
      <div className="mt-6">
        <OfferCards cur={cur} showVip={false} />
      </div>
    </div>
  ) : null;

  if (now < start + 60 * 60_000) {
    return (
      <Shell chip="Replay" title="The replay goes up after the session">
        <p className="text-center text-[16px] leading-7 text-ink-soft">
          {FAA_NAME} is live on {dayLabelLong(s.startIso)}, {timeTriple(s.startIso)}. It is better live.
        </p>
        <div className="mt-6 text-center">
          <a className={BTN} href={`${FAA_PATH}#register`}>Save my free seat</a>
        </div>
      </Shell>
    );
  }

  if (now > Date.parse(closesIso)) {
    return (
      <Shell chip="Replay" title="This replay has closed">
        <p className="text-center text-[16px] leading-7 text-ink-soft">The free replay was up for 48 hours. VIP Pass holders keep it for 7 days.</p>
        {offers}
      </Shell>
    );
  }

  return (
    <Shell chip={vip ? 'VIP replay' : 'Free replay'} title={`${FAA_NAME}: the replay`}>
      {id ? (
        <>
          <Video id={id} />
          <p className="mt-4 text-center text-[14px] text-ink-faint">
            Up until {dayLabel(closesIso)}, {timeTriple(closesIso)}.
          </p>
        </>
      ) : (
        <p className="text-center text-[16px] leading-7 text-ink-soft">
          The recording is being processed and goes up here within 24 hours of the session. Bookmark this page and check back.
        </p>
      )}
      {offers}
    </Shell>
  );
}

'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { track } from '@/components/analytics/Analytics';
import { captureAttribution, getAttribution } from '@/lib/attribution';

/**
 * The scheduler embed.
 *
 * Two jobs beyond rendering an iframe.
 *
 * First, it carries the assessment result into the booking. Someone arriving
 * from a landing page has just answered nine questions, and the call should
 * open with those answers on screen rather than spending ten minutes
 * re-establishing what they already told us. Score and band ride in as Calendly
 * prefill, and the gclid rides in as a UTM so a booking can be tied back to the
 * click that paid for it.
 *
 * Second, it listens for Calendly's `event_scheduled` message so the booking
 * itself fires a conversion. A pageview of /book is not a booking, and bidding
 * on the wrong one of those two is how an account learns the wrong thing.
 */

type Props = { bookingUrl: string };

/** Calendly posts messages of the shape { event: 'calendly.event_scheduled' }. */
function isCalendlyScheduled(data: unknown): boolean {
  if (data === null || typeof data !== 'object') return false;
  const event = (data as { event?: unknown }).event;
  return event === 'calendly.event_scheduled';
}

export default function BookingEmbed({ bookingUrl }: Props) {
  const searchParams = useSearchParams();
  const [booked, setBooked] = useState(false);
  const firedRef = useRef(false);

  const score = searchParams.get('score');
  const band = searchParams.get('band');

  useEffect(() => {
    captureAttribution();
  }, []);

  const src = useMemo(() => {
    let url: URL;
    try {
      url = new URL(bookingUrl);
    } catch {
      return bookingUrl;
    }

    // Calendly reads a1..aN for the scheduling form's custom questions, and
    // hides its own cookie banner inside an embed.
    if (score && band) {
      url.searchParams.set(
        'a1',
        `AI readiness score ${score}/27, band ${band}. Answers were submitted with the assessment.`,
      );
    }

    const a = getAttribution();
    if (a.gclid) url.searchParams.set('utm_content', a.gclid);
    if (a.utmSource) url.searchParams.set('utm_source', a.utmSource);
    if (a.utmMedium) url.searchParams.set('utm_medium', a.utmMedium);
    if (a.utmCampaign) url.searchParams.set('utm_campaign', a.utmCampaign);
    if (a.landingPath) url.searchParams.set('utm_term', a.landingPath);

    return url.toString();
  }, [bookingUrl, score, band]);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      // Only Calendly's own origin may claim a booking happened.
      if (!/^https:\/\/([a-z0-9-]+\.)?calendly\.com$/.test(e.origin)) return;
      if (!isCalendlyScheduled(e.data)) return;
      if (firedRef.current) return;
      firedRef.current = true;
      setBooked(true);
      track('call_booked', {
        score: score ? Number(score) : undefined,
        band: band ?? undefined,
        gclid: getAttribution().gclid,
      });
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [score, band]);

  return (
    <>
      {score && band ? (
        <div className="mb-5 rounded-2xl border border-border-subtle bg-traq-tint px-5 py-4 text-left">
          <p className="text-[10.5px] font-semibold uppercase tracking-widest text-traq-purple-ink">
            Your assessment is attached
          </p>
          <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">
            You scored{' '}
            <span className="font-semibold text-ink tabular-nums">{score} of 27</span>, band{' '}
            <span className="font-semibold text-ink capitalize">{band}</span>. We will open the
            call with your answers rather than starting from scratch.
          </p>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-[24px] border border-border-subtle bg-white shadow-card">
        <iframe
          src={src}
          title="Book a call with Traq Collective"
          className="h-[80vh] min-h-[640px] w-full"
          loading="lazy"
        />
      </div>

      {booked ? (
        <p className="mt-4 text-center text-[14px] font-medium text-ink-soft" role="status">
          Booked. A calendar invite is on its way to your inbox.
        </p>
      ) : null}
    </>
  );
}

'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { track } from '@/components/analytics/Analytics';
import { captureAttribution, getAttribution } from '@/lib/attribution';
import { COMPANY } from '@/lib/constants';

/**
 * The scheduler embed.
 *
 * Three jobs beyond rendering an iframe.
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
 *
 * Third, it notices when the scheduler does not come up, and says so. On
 * 1 September 2026 the Calendly event type rendered completely blank, so /book
 * served an empty white box for an unknown number of days: no scheduler, no
 * error, no way to reach us, and nothing in the analytics to show it. The whole
 * paid funnel terminated in that box. The embed now proves itself alive and
 * degrades to email when it cannot.
 */

type Props = { bookingUrl: string };

/**
 * How long to give Calendly before offering a way round it.
 *
 * A healthy embed announces itself almost immediately, so this only has to
 * clear a slow connection rather than a slow scheduler. The fallback is
 * additive, the iframe stays on the page, so erring generous costs nothing but
 * erring short would show a needless notice.
 */
const EMBED_HEALTH_TIMEOUT_MS = 9000;

/** Calendly posts messages of the shape { event: 'calendly.event_scheduled' }. */
function isCalendlyScheduled(data: unknown): boolean {
  if (data === null || typeof data !== 'object') return false;
  const event = (data as { event?: unknown }).event;
  return event === 'calendly.event_scheduled';
}

/**
 * Any message from Calendly at all.
 *
 * In embed mode Calendly announces itself on load with `profile_page_viewed`
 * and `event_type_viewed` long before anyone books, so the first message of any
 * kind is the proof of life. Silence is the failure signal.
 */
function isCalendlyMessage(data: unknown): boolean {
  if (data === null || typeof data !== 'object') return false;
  const event = (data as { event?: unknown }).event;
  return typeof event === 'string' && event.startsWith('calendly.');
}

function isCalendlyOrigin(origin: string): boolean {
  return /^https:\/\/([a-z0-9-]+\.)?calendly\.com$/.test(origin);
}

export default function BookingEmbed({ bookingUrl }: Props) {
  const searchParams = useSearchParams();
  const [booked, setBooked] = useState(false);
  const [embedSilent, setEmbedSilent] = useState(false);
  const firedRef = useRef(false);
  const heardRef = useRef(false);

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

    /**
     * Declare the embed.
     *
     * Calendly only runs its embedded experience, and only posts the events
     * this component depends on, when it is told it is embedded. Without these
     * two the iframe is just their standalone page in a box, and
     * `event_scheduled` never arrives, so the conversion never fires however
     * many people book.
     */
    url.searchParams.set('embed_type', 'Inline');
    if (typeof window !== 'undefined') {
      url.searchParams.set('embed_domain', window.location.hostname);
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
      // Only Calendly's own origin may claim anything about this embed.
      if (!isCalendlyOrigin(e.origin)) return;

      if (isCalendlyMessage(e.data)) {
        heardRef.current = true;
        setEmbedSilent(false);
      }

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

  /**
   * The health check.
   *
   * Fires one GA4 event when the scheduler never speaks, so the next outage
   * shows up as a number rather than as a quiet month of no bookings.
   */
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (heardRef.current) return;
      setEmbedSilent(true);
      track('booking_embed_unavailable', { bookingUrl });
    }, EMBED_HEALTH_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [bookingUrl]);

  const mailto = useCallback(() => {
    const subject = encodeURIComponent('Booking an AI Intro with Traq');
    const body = encodeURIComponent(
      score && band
        ? `Hello, I would like to book the 20 minute AI Intro. My AI readiness score was ${score}/27, band ${band}.`
        : 'Hello, I would like to book the 20 minute AI Intro.',
    );
    return `mailto:${COMPANY.email}?subject=${subject}&body=${body}`;
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

      {/* Not lazy any more. The iframe sits below the fold, so lazy loading let
          the health check below time out before Calendly had been asked for
          anything, which would report an outage on a page that was merely
          scrolled slowly. It is the only thing on the route worth loading. */}
      <div className="overflow-hidden rounded-[24px] border border-border-subtle bg-white shadow-card">
        <iframe
          src={src}
          title="AI Intro with Traq Collective"
          className="h-[80vh] min-h-[640px] w-full"
        />
      </div>

      {booked ? (
        <p className="mt-4 text-center text-[14px] font-medium text-ink-soft" role="status">
          Booked. A calendar invite is on its way to your inbox.
        </p>
      ) : null}

      {/* Shown only when Calendly has said nothing at all. The iframe stays put:
          if the scheduler is merely slow, this is a spare route out rather than
          a replacement, and it costs a false positive nothing. */}
      {embedSilent && !booked ? (
        <div
          className="mt-5 rounded-[20px] border border-border-subtle bg-bg-subtle p-6 text-center sm:p-7"
          role="status"
        >
          <h2 className="text-[17px] font-bold leading-snug tracking-tight text-ink">
            Scheduler not loading? Book it by email instead.
          </h2>
          <p className="mx-auto mt-2.5 max-w-md text-[14px] leading-relaxed text-ink-soft">
            Tell us a bit about your team and a couple of times that suit you, and we will get
            your 20 minute AI Intro in the diary within a day.
          </p>
          <div className="mt-5 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <a
              href={mailto()}
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-traq-purple px-5 py-3.5 text-sm font-semibold text-white shadow-card transition-all hover:-translate-y-px hover:bg-traq-purple-ink hover:shadow-cardHover active:scale-[0.98]"
            >
              Email {COMPANY.email}
              <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                &rarr;
              </span>
            </a>
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center gap-2.5 rounded-full border border-border-strong bg-white px-5 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-traq-purple hover:text-traq-purple"
            >
              Open the scheduler in a new tab
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}

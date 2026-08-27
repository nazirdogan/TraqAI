/**
 * Click attribution.
 *
 * Google appends a `gclid` to every ad click when auto-tagging is on. Without
 * storing it against the lead there is no way to tie a signed engagement back
 * to the click that produced it, so a deal that closes ninety days later is
 * invisible to the ad account and Smart Bidding never gets the signal.
 *
 * The id is read once on the landing page and kept for the session, because the
 * assessment finishes on the same page but the booking happens on /book, and
 * the query string does not survive that hop.
 */

const KEY = 'traq_attribution';

export type Attribution = {
  gclid?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  /** First page of the session, so we know which landing page earned the lead. */
  landingPath?: string;
};

function read(): Attribution {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    // Private mode, or storage disabled. Attribution is a nice-to-have, never
    // a reason to break the form.
    return {};
  }
}

/**
 * Capture attribution from the current URL, once per session.
 *
 * Later pageviews inside the same session must not overwrite the original
 * click: a visitor who lands on an ad and then navigates to /book would
 * otherwise arrive with an empty gclid and wipe the real one.
 */
export function captureAttribution(): Attribution {
  if (typeof window === 'undefined') return {};

  const existing = read();
  if (existing.gclid || existing.utmSource) return existing;

  const params = new URLSearchParams(window.location.search);
  const next: Attribution = {
    gclid: params.get('gclid') ?? undefined,
    utmSource: params.get('utm_source') ?? undefined,
    utmMedium: params.get('utm_medium') ?? undefined,
    utmCampaign: params.get('utm_campaign') ?? undefined,
    utmContent: params.get('utm_content') ?? undefined,
    utmTerm: params.get('utm_term') ?? undefined,
    landingPath: window.location.pathname,
  };

  // Nothing worth keeping: an organic visit should not create a record that
  // then blocks a later ad click in the same session.
  if (!next.gclid && !next.utmSource) return existing;

  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return next;
}

/** The stored attribution, if any. Safe to call anywhere. */
export function getAttribution(): Attribution {
  return read();
}

/**
 * A single readable line for the team email, e.g.
 * "google / cpc · campaign 123 · gclid Cj0KCQ...".
 */
export function attributionSummary(a: Attribution): string | undefined {
  const parts: string[] = [];
  if (a.utmSource || a.utmMedium) {
    parts.push([a.utmSource, a.utmMedium].filter(Boolean).join(' / '));
  }
  if (a.utmCampaign) parts.push(`campaign ${a.utmCampaign}`);
  if (a.utmTerm) parts.push(`term ${a.utmTerm}`);
  if (a.gclid) parts.push(`gclid ${a.gclid}`);
  return parts.length ? parts.join(' · ') : undefined;
}

/**
 * Touches: the leads that never fill in a form.
 *
 * Google Ads sent five real leads in October 2026 and only one of them reached
 * the lead sheet. The rest booked straight into Calendly, rang the number on
 * the page or emailed, and none of those paths wrote a row. With no row there
 * is no gclid, and with no gclid the deal can never be uploaded back to the
 * account as an offline conversion. So Smart Bidding learned from the cheap
 * thing it could see, free assessment completions, and not from the calls that
 * actually produced pipeline.
 *
 * A touch is the smallest record that closes that gap: the kind of contact, the
 * time, and the click that paid for it. The booking or the call itself arrives
 * by its own route (a Calendly email, a ringing phone), and the timestamp is
 * what lets the two be matched by hand in the sheet afterwards.
 *
 * This module has no imports on purpose, so its rules can be pinned with
 * Node's own test runner: `node --test src/lib/intake/touch.test.ts`.
 */

export const TOUCH_KINDS = ['calendly_booking', 'phone_click', 'whatsapp_click'] as const;
export type TouchKind = (typeof TOUCH_KINDS)[number];

export function isTouchKind(value: unknown): value is TouchKind {
  return typeof value === 'string' && (TOUCH_KINDS as readonly string[]).includes(value);
}

/**
 * Which kind of contact a link starts, if any.
 *
 * Covers every way the site can link to the phone or WhatsApp today and the
 * obvious ways it might tomorrow, so a new button added to a page is counted
 * without anyone remembering to wire it up.
 */
export function classifyContactLink(href: string | null | undefined): TouchKind | null {
  if (!href) return null;
  const h = href.trim().toLowerCase();
  if (h.startsWith('tel:')) return 'phone_click';
  if (h.startsWith('whatsapp:')) return 'whatsapp_click';
  if (/^https?:\/\/(www\.)?(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)\//.test(h)) {
    return 'whatsapp_click';
  }
  return null;
}

/**
 * A gclid is URL-safe base64 of a known rough length. Anything else is a
 * typo, a test string or someone poking the endpoint, and must not become a
 * row that Google Ads later rejects on import.
 */
export function isPlausibleGclid(value: string | null | undefined): boolean {
  if (!value) return false;
  return /^[A-Za-z0-9_-]{20,200}$/.test(value);
}

export type TouchClick = {
  gclid?: string;
  utmSource?: string;
};

/**
 * Whether a touch is worth a row in the lead sheet.
 *
 * A booking always is: it is a real lead whatever brought it in, and the sheet
 * is where the pipeline is worked. A phone or WhatsApp tap is only worth a row
 * when it carries paid or tagged attribution. An organic visitor tapping the
 * number leaves nothing to attribute, and a row per tap would bury the leads
 * that matter under noise.
 */
export function shouldRecordTouch(kind: TouchKind, click: TouchClick | undefined): boolean {
  if (kind === 'calendly_booking') return true;
  if (!click) return false;
  return isPlausibleGclid(click.gclid) || Boolean(click.utmSource && click.utmSource.trim());
}

/**
 * Whether a request plausibly came from our own pages.
 *
 * The endpoint takes no secret, because a browser cannot keep one. Checking
 * the Origin header against the host it was sent to will not stop a determined
 * script, but it does stop the drive-by cross-site posts that would otherwise
 * fill the sheet with junk, and it costs a real visitor nothing.
 */
export function isSameSiteOrigin(origin: string | null, host: string | null): boolean {
  if (!origin || !host) return false;
  let originHost: string;
  try {
    originHost = new URL(origin).host.toLowerCase();
  } catch {
    return false;
  }
  const h = host.toLowerCase();
  if (originHost === h) return true;
  // www and the apex are the same site.
  const strip = (s: string) => s.replace(/^www\./, '');
  return strip(originHost) === strip(h);
}

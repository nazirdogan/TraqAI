import { getAttribution } from '@/lib/attribution';
import type { TouchKind } from '@/lib/intake/touch';

/**
 * Send a touch to /api/intake/touch from the browser.
 *
 * sendBeacon first, because a tap on a tel: or WhatsApp link hands the page to
 * another app immediately and an ordinary fetch can be cancelled mid-flight.
 * A keepalive fetch is the fallback for browsers without it. Never throws: a
 * lost touch must not get in the way of the call or booking it describes.
 */
export function sendTouch(
  kind: TouchKind,
  extra?: { score?: number; band?: string },
): void {
  if (typeof window === 'undefined') return;
  try {
    const a = getAttribution();
    const payload = JSON.stringify({
      kind,
      path: window.location.pathname,
      click: {
        gclid: a.gclid,
        utmSource: a.utmSource,
        utmMedium: a.utmMedium,
        utmCampaign: a.utmCampaign,
        utmContent: a.utmContent,
        utmTerm: a.utmTerm,
        landingPath: a.landingPath,
      },
      ...(extra ?? {}),
    });

    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const sent = navigator.sendBeacon('/api/intake/touch', payload);
      if (sent) return;
    }
    void fetch('/api/intake/touch', {
      method: 'POST',
      body: payload,
      keepalive: true,
      headers: { 'content-type': 'text/plain' },
    }).catch(() => undefined);
  } catch {
    /* a lost touch is acceptable; a broken call button is not */
  }
}

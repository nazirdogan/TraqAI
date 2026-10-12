'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { captureAttribution, getAttribution } from '@/lib/attribution';
import { classifyContactLink } from '@/lib/intake/touch';
import { sendTouch } from '@/lib/touch-client';

/**
 * GA4 + Google Ads conversion tracking (env-gated).
 *
 * The whole analytics layer is gated on NEXT_PUBLIC_GA_ID. With the var unset
 * (local dev, preview branches, or before the GA property is ready) the
 * <Analytics /> component renders no scripts and track() is a safe no-op, so
 * nothing breaks and no script loads. Set NEXT_PUBLIC_GA_ID on Vercel
 * production (e.g. "G-XXXXXXXXXX") to switch it on.
 *
 * NEXT_PUBLIC_GADS_ID ("AW-XXXXXXXXX") is separate and optional. GA4 can import
 * conversions into Google Ads on its own, but that path lands 24 to 48 hours
 * late and cannot do enhanced conversions. In an account buying tens of clicks
 * a month, recovering a couple of cookie-dropped conversions is the difference
 * between Smart Bidding having enough data and not, so both tags fire.
 *
 * NOTE: both vars are NEXT_PUBLIC_, so they are inlined at build time. Setting
 * them on Vercel does nothing until a redeploy.
 */

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GADS_ID = process.env.NEXT_PUBLIC_GADS_ID;

type GtagParams = Record<string, unknown>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Loads GA4 and, when configured, the Google Ads tag.
 *
 * The attribution capture runs unconditionally, before and regardless of any
 * tag. A gclid arriving on a landing page has to be stored whether or not GA
 * is switched on, because it is the form submission that needs it, not the
 * analytics script.
 */
export default function Analytics() {
  useEffect(() => {
    captureAttribution();
  }, []);

  /**
   * Count taps on the phone number and WhatsApp, site-wide.
   *
   * Leads that ring instead of filling in a form were invisible: nothing fired
   * and nothing was stored, so a paid click that turned into a phone call left
   * no trace. One listener on the document catches every such link on every
   * page, including ones added later, without each button having to remember.
   * It fires a GA4 event (import it into Google Ads as a secondary action) and
   * stores a touch row with the gclid, so the call can be matched to its click
   * in the lead sheet by its time.
   */
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as Element | null;
      const link = target?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!link) return;
      const kind = classifyContactLink(link.getAttribute('href'));
      if (!kind) return;
      track(kind, {
        link_location: link.closest('footer') ? 'footer' : window.location.pathname,
        gclid: getAttribution().gclid,
      });
      sendTouch(kind);
    }
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  if (!GA_ID) return null;

  return (
    <>
      <Script
        id="ga4-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
          ${GADS_ID ? `gtag('config', '${GADS_ID}', { allow_enhanced_conversions: true });` : ''}
        `}
      </Script>
    </>
  );
}

/**
 * Fire a GA4 event. No-ops when gtag is absent (GA disabled or not yet
 * loaded), so callers never need to guard the call themselves.
 */
export function track(event: string, params?: GtagParams): void {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', event, params ?? {});
}

/**
 * Supply the identifier for enhanced conversions.
 *
 * Google hashes the address in the browser before it is sent; the raw value
 * never leaves the page. Call this immediately before the conversion event on
 * any form where an email is in hand, which is every one of ours.
 */
export function setEnhancedConversionData(email: string): void {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;
  if (!GADS_ID || !email) return;
  window.gtag('set', 'user_data', { email: email.trim().toLowerCase() });
}

/**
 * Fire a Google Ads conversion directly, in addition to the GA4 event.
 *
 * `label` is the conversion label from the Google Ads action, so a full
 * send_to reads "AW-123456789/AbC-D_efGh". No-ops entirely when
 * NEXT_PUBLIC_GADS_ID is unset, which is the state until the tag is created.
 */
export function trackAdsConversion(label: string, params?: GtagParams): void {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;
  if (!GADS_ID) return;
  window.gtag('event', 'conversion', {
    send_to: `${GADS_ID}/${label}`,
    ...(params ?? {}),
  });
}

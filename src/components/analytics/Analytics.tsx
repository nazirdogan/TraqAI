'use client';

import Script from 'next/script';

/**
 * GA4 + conversion tracking (env-gated).
 *
 * The whole analytics layer is gated on NEXT_PUBLIC_GA_ID. With the var unset
 * (local dev, preview branches, or before the GA property is ready) the
 * <Analytics /> component renders nothing and track() is a safe no-op, so
 * nothing breaks and no script loads. Set NEXT_PUBLIC_GA_ID on Vercel
 * production (e.g. "G-XXXXXXXXXX") to switch it on.
 *
 * ASSET DEPENDENCY (spec section 12): the GA4 measurement id from Nazir.
 */

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

type GtagParams = Record<string, unknown>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Loads GA4 via next/script. Renders nothing when NEXT_PUBLIC_GA_ID is unset.
 */
export default function Analytics() {
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
        `}
      </Script>
    </>
  );
}

/**
 * Fire a conversion event. No-ops when gtag is absent (GA disabled or not yet
 * loaded), so callers never need to guard the call themselves.
 */
export function track(event: string, params?: GtagParams): void {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', event, params ?? {});
}

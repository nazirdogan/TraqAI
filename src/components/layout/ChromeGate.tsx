'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/**
 * ChromeGate
 *
 * Hides the sitewide chrome (navbar, footer, sticky mobile CTA) on paid-search
 * landing pages.
 *
 * Those pages are built to a single conversion, and every navigation is a
 * chance to leave: the only ways off an /lp page are converting or closing the
 * tab. Rather than give the landing pages their own root layout (which would
 * mean moving all 60-odd existing routes into a route group), the chrome
 * decides for itself whether to render, the same way MobileCtaBar already
 * hides itself on /book.
 *
 * The children stay server components. They are rendered on the server and
 * passed through, so wrapping Footer here does not pull it into the client
 * bundle.
 */

/** Route prefixes that render without sitewide chrome. */
const BARE_PREFIXES = ['/lp/'];

export function isBareRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  return BARE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export default function ChromeGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (isBareRoute(pathname)) return null;
  return <>{children}</>;
}

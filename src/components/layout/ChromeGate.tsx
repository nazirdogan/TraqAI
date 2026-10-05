'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/**
 * ChromeGate
 *
 * Hides the sitewide chrome (navbar, footer, sticky mobile CTA) on any route
 * listed in BARE_PREFIXES.
 *
 * The paid-search landing pages (/lp/) used to be listed here, built to a
 * single conversion with no way off the page. They are now an extension of the
 * main site instead: visitors can click the logo home, browse the services and
 * book from the normal navigation. The list is empty on purpose and the
 * mechanism stays, so a page can be made bare again by adding its prefix.
 *
 * The children stay server components. They are rendered on the server and
 * passed through, so wrapping Footer here does not pull it into the client
 * bundle.
 */

/** Route prefixes that render without sitewide chrome. */
const BARE_PREFIXES: string[] = [];

export function isBareRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  return BARE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export default function ChromeGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (isBareRoute(pathname)) return null;
  return <>{children}</>;
}

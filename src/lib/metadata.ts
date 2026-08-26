import type { Metadata } from 'next';

const SITE_URL = 'https://traqcollective.com';
const SITE_NAME = 'Traq Collective';
// 165 chars is roughly where Google truncates a description in the SERP, and
// this one is the sitewide default, so it was the longest on the site at 234.
const DESCRIPTION =
  'Your embedded AI partner: hands-on training, consulting, implementation and agentic infrastructure. We make the AI you already pay for actually work. UAE and global.';

/**
 * Strip a trailing " | Traq Collective" from a content title.
 *
 * The metadata template below already appends `| Traq Collective` to every %s,
 * but field notes and insight guides were authored with the brand baked into
 * their `title`, so the rendered <title> read "... | Traq Collective | Traq
 * Collective" on every one of them. Normalising at the metadata boundary fixes
 * the whole back catalogue and stays correct whichever way new content is
 * written, so nothing has to be migrated.
 *
 * The "Collective" half is optional because some notes were authored with the
 * brand truncated to fit the 70-char schema cap, which produced "... | Traq |
 * Traq Collective" in production. Matching both shapes catches those too.
 */
export function stripBrandSuffix(title: string): string {
  return title.replace(/\s*\|\s*Traq(?:\s+Collective)?\s*$/i, '').trim() || title;
}

/** Title with the brand applied exactly once. For og:title, which has no template. */
export function brandedTitle(title: string): string {
  return `${stripBrandSuffix(title)} | ${SITE_NAME}`;
}

/**
 * The default share image.
 *
 * Exported because Next does NOT deep-merge `openGraph`: a route that sets its
 * own `openGraph` block replaces the root's outright, images included. That is
 * why 62 of 66 pages shipped with no og:image at all. Every route that defines
 * an `openGraph` must therefore spread this in explicitly.
 */
export const OG_IMAGE = {
  url: `${SITE_URL}/og/default`,
  width: 1200,
  height: 630,
  alt: 'Traq Collective: AI training, consulting and implementation',
};

export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | AI training, consulting and implementation`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    'AI training',
    'AI consultant',
    'embedded AI partner',
    'AI transformation partner',
    'fractional Head of AI',
    'Chief AI Officer',
    'AI implementation',
    'AI training UAE',
    'AI training Dubai',
    'AI consultant UAE',
    'AI enablement',
    'agentic AI',
    'Traq Collective',
  ],
  authors: [{ name: 'Traq Collective' }],
  creator: 'Traq Collective',
  publisher: 'Traq Collective',
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | AI training, consulting and implementation`,
    description: DESCRIPTION,
    locale: 'en_US',
    // A real 1200x630 card, rendered by the /og/default route handler. The old
    // value pointed at /logos/wordmark-purple.png and declared it 1200x630 when
    // the file is actually 1888x696, so LinkedIn and X letterboxed or dropped
    // it. Set explicitly rather than via the `opengraph-image` file convention:
    // that convention is skipped on any route defining its own `openGraph`,
    // which left 58 of 66 pages with no og:image at all.
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    images: [`${SITE_URL}/og/default`],
    // No `title` or `description` here. Page metadata sets `title` and
    // `description` but rarely `twitter.*`, and a value at this level becomes
    // the inherited default, so every page shipped the same generic card. Left
    // unset, Next fills both from each page's own title and description.
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  robots: {
    index: true,
    follow: true,
  },
};

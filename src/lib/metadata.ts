import type { Metadata } from 'next';

const SITE_URL = 'https://traqcollective.com';
const SITE_NAME = 'Traq Collective';
const DESCRIPTION =
  'Traq Collective is your embedded AI partner: hands-on training, consulting and strategy, implementation, and agentic infrastructure. We work with your team, not for it, to make the AI you already pay for actually work. UAE and global.';

/**
 * Strip a trailing " | Traq Collective" from a content title.
 *
 * The metadata template below already appends `| Traq Collective` to every %s,
 * but field notes and insight guides were authored with the brand baked into
 * their `title`, so the rendered <title> read "... | Traq Collective | Traq
 * Collective" on every one of them. Normalising at the metadata boundary fixes
 * the whole back catalogue and stays correct whichever way new content is
 * written, so nothing has to be migrated.
 */
export function stripBrandSuffix(title: string): string {
  return title.replace(/\s*\|\s*Traq Collective\s*$/i, '').trim() || title;
}

/** Title with the brand applied exactly once. For og:title, which has no template. */
export function brandedTitle(title: string): string {
  return `${stripBrandSuffix(title)} | ${SITE_NAME}`;
}

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
    images: [
      {
        url: '/logos/wordmark-purple.png',
        width: 1200,
        height: 630,
        alt: 'Traq Collective',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: DESCRIPTION,
    images: ['/logos/wordmark-purple.png'],
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

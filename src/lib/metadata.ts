import type { Metadata } from 'next';

const SITE_URL = 'https://traqcollective.com';
const SITE_NAME = 'Traq Collective';
const DESCRIPTION =
  'Traq Collective helps your team actually use the AI you already pay for: hands-on training, consulting as your fractional Head of AI, implementation, and agentic infrastructure. UAE and global.';

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
    'fractional Head of AI',
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
        url: '/logos/wordmark-white.png',
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
    images: ['/logos/wordmark-white.png'],
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

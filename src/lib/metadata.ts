import type { Metadata } from 'next';

const SITE_URL = 'https://traqcollective.com';
const SITE_NAME = 'Traq Collective';
const DESCRIPTION =
  'Traq Collective is your embedded AI partner: hands-on training, consulting and strategy, implementation, and agentic infrastructure. We work with your team, not for it, to make the AI you already pay for actually work. UAE and global.';

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

import type { Metadata } from 'next';

const SITE_URL = 'https://traqcollective.com';
const SITE_NAME = 'Traq Collective';
const DESCRIPTION =
  'Traq Collective wires AI into how your business actually works — combining AI integration, process automation, data intelligence and digital presence into one delivery partner.';

export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | ${DESCRIPTION.split(' — ')[0]}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    'AI integration',
    'AI automation',
    'workflow automation',
    'data intelligence',
    'custom AI development',
    'secure AI',
    'business websites',
    'Traq Collective',
  ],
  authors: [{ name: 'Traq Collective' }],
  creator: 'Traq Collective',
  publisher: 'Traq Collective',
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — AI integration, automation and digital presence`,
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

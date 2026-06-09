import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import JsonLd from '@/components/seo/JsonLd';
import { baseMetadata } from '@/lib/metadata';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = baseMetadata;

// Organization schema (sitewide). sameAs socials are a placeholder until the
// official handles are confirmed; swap in real profile URLs when available.
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Traq Collective',
  url: 'https://traqcollective.com',
  logo: 'https://traqcollective.com/logos/wordmark-purple.png',
  description:
    'Traq Collective helps your team actually use the AI you already pay for: hands-on training, consulting as your fractional Head of AI, implementation, and agentic infrastructure.',
  sameAs: [
    // TODO: replace with confirmed official profiles.
    'https://www.linkedin.com/company/traq-collective',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+971 50 868 7196',
    email: 'hello@traqcollective.com',
    contactType: 'customer service',
    areaServed: ['AE', 'Worldwide'],
    availableLanguage: ['English'],
  },
};

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-bg-base font-sans text-ink antialiased">
        <JsonLd data={organizationSchema} />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Navbar />
        <main id="main" className="relative">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from 'next';
import { Inter, Caveat } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileCtaBar from '@/components/layout/MobileCtaBar';
import ChatWidget from '@/components/layout/ChatWidget';
import ChromeGate from '@/components/layout/ChromeGate';
import JsonLd from '@/components/seo/JsonLd';
import Analytics from '@/components/analytics/Analytics';
import { baseMetadata } from '@/lib/metadata';
import { organization } from '@/lib/seo/schema';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// Hand-drawn accent font. Used ONLY for small margin notes and doodle labels
// (the subtle "notebook" motif) via the .font-hand utility — never for body or
// headings, which stay on Inter.
const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-hand',
  display: 'swap',
  weight: ['500', '600', '700'],
});

export const metadata: Metadata = baseMetadata;

// Organization schema (sitewide). Emitted once here via the shared builder so
// the @id-bearing canonical node ('#organization') exists for the whole site.
// Other pages reference it by @id (e.g. Service.provider, Person.worksFor)
// rather than re-declaring the entity.
const organizationSchema = organization();

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${caveat.variable}`}>
      {/* Bottom padding on mobile reserves space for the sticky MobileCtaBar so
          it never covers the footer; cleared at lg where the bar is hidden. */}
      <body className="bg-bg-base font-sans text-ink antialiased pb-24 lg:pb-0">
        <Analytics />
        <JsonLd data={organizationSchema} />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <ChromeGate>
          <Navbar />
        </ChromeGate>
        <main id="main" className="relative">
          {children}
        </main>
        <ChromeGate>
          <Footer />
          <MobileCtaBar />
          <ChatWidget />
        </ChromeGate>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import JsonLd from '@/components/seo/JsonLd';
import Analytics from '@/components/analytics/Analytics';
import { baseMetadata } from '@/lib/metadata';
import { organization } from '@/lib/seo/schema';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
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
    <html lang="en" className={inter.variable}>
      <body className="bg-bg-base font-sans text-ink antialiased">
        <Analytics />
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

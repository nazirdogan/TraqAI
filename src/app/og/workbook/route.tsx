/**
 * Share card for the workbook lead magnets.
 *
 * The four workbooks are standalone HTML files in /public served at clean URLs
 * through `rewrites()`, so they cannot use Next metadata at all. They are handed
 * out over DM and social, which is exactly where an og:image earns its keep.
 */
import { ogCard } from '@/lib/og-card';

export const runtime = 'edge';

export function GET() {
  return ogCard({
    eyebrow: 'Free workbook',
    headline: 'Ten minutes. One honest score. A plan you can act on.',
    footerRight: 'traqcollective.com/workbook',
  });
}

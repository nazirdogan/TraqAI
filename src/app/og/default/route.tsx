/** Sitewide share card. Referenced explicitly from baseMetadata. */
import { ogCard } from '@/lib/og-card';

export const runtime = 'edge';

export function GET() {
  return ogCard({
    headline: 'Make the AI you already pay for actually work.',
    sub: 'Hands-on training, consulting, implementation and agentic infrastructure.',
    footerRight: 'Dubai & Abu Dhabi · Global delivery',
  });
}

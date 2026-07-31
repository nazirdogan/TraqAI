/**
 * When the static marketing pages were last genuinely reviewed.
 *
 * One hand-maintained constant feeds both the sitemap's `lastmod` and the
 * `dateModified` in each page's WebPage JSON-LD, so the two can never disagree.
 * Deliberately not `new Date()`: a date that rebuilds itself every deploy is a
 * claim that the copy changed when it did not, which is both untrue and a weak,
 * gameable freshness signal.
 *
 * Bump this when the static pages materially change.
 */
export const STATIC_REVIEWED_ISO = '2026-07-16';

/** The same instant as a Date, for MetadataRoute.Sitemap's `lastModified`. */
export const STATIC_REVIEWED_DATE = new Date(`${STATIC_REVIEWED_ISO}T00:00:00Z`);

/** "16 July 2026", for the visible "Last updated" line. Parsed as UTC so it never shifts. */
export function formatReviewed(iso: string = STATIC_REVIEWED_ISO): string {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

import type { MetadataRoute } from 'next';
import { ARTICLES } from '@/lib/content/insights';
import { FIELD_NOTES } from '@/lib/content/field-notes';
import { STATIC_REVIEWED_DATE, TRAINING_REVIEWED_ISO } from '@/lib/seo/reviewed';

const SITE_URL = 'https://traqcollective.com';

/**
 * Stable last-modified date for the static marketing pages, shared with the
 * WebPage JSON-LD on those same pages so `lastmod` and `dateModified` cannot
 * drift apart. Guides and field notes carry their own real per-item dates.
 */
const STATIC_LASTMOD = STATIC_REVIEWED_DATE;

function isoToDate(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Guides: real dateModified per article so lastmod is truthful.
  const articleRoutes: MetadataRoute.Sitemap = ARTICLES.map((article) => ({
    url: `${SITE_URL}/insights/${article.slug}`,
    lastModified: isoToDate(article.dateModified),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Field notes: real dateModified per note.
  const fieldNoteRoutes: MetadataRoute.Sitemap = FIELD_NOTES.map((note) => ({
    url: `${SITE_URL}/field-notes/${note.slug}`,
    lastModified: isoToDate(note.dateModified),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  // The field-notes index tracks the newest note's date (or the build date when
  // the feed is still empty).
  const fieldNotesIndexLastMod = FIELD_NOTES[0]
    ? isoToDate(FIELD_NOTES[0].dateModified)
    : STATIC_LASTMOD;

  return [
    { url: `${SITE_URL}/`, lastModified: STATIC_LASTMOD, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/book`, lastModified: STATIC_LASTMOD, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/services`, lastModified: STATIC_LASTMOD, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/services/ai-training`, lastModified: isoToDate(TRAINING_REVIEWED_ISO), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/services/ai-consulting`, lastModified: STATIC_LASTMOD, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/services/ai-implementation`, lastModified: STATIC_LASTMOD, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/services/agentic-ai`, lastModified: STATIC_LASTMOD, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/fractional-head-of-ai`, lastModified: STATIC_LASTMOD, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/ai-consulting-uae`, lastModified: STATIC_LASTMOD, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: STATIC_LASTMOD, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/faq`, lastModified: STATIC_LASTMOD, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/ai-readiness`, lastModified: STATIC_LASTMOD, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/insights`, lastModified: articleRoutes[0]?.lastModified ?? STATIC_LASTMOD, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/field-notes`, lastModified: fieldNotesIndexLastMod, changeFrequency: 'daily', priority: 0.7 },
    { url: `${SITE_URL}/workbook`, lastModified: STATIC_LASTMOD, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/workbook/upskill`, lastModified: STATIC_LASTMOD, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/workbook/start`, lastModified: STATIC_LASTMOD, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/workbook/consultant`, lastModified: STATIC_LASTMOD, changeFrequency: 'monthly', priority: 0.6 },
    ...articleRoutes,
    ...fieldNoteRoutes,
    { url: `${SITE_URL}/privacy`, lastModified: STATIC_LASTMOD, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: STATIC_LASTMOD, changeFrequency: 'yearly', priority: 0.3 },
  ];
}

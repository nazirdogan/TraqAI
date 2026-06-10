/**
 * /insights article registry.
 *
 * One typed Article object per guide. The registry exports an ordered array
 * (newest-first display order is the page's concern, this is authoring order)
 * plus a getBySlug lookup used by the [slug] route. Keep articles as plain data
 * so the same object drives the page body, the BlogPosting schema, the FAQPage
 * schema and the /insights index.
 *
 * AEO rules every article must follow (see the Phase 3 plan + spec §7.3):
 * - intro is a definition-first, standalone 40-60 word answer block
 * - bodySections use H2/H3 phrased as real search queries
 * - cite >= 3 stats with source + url + year (reuse IMPACT_METRICS sources)
 * - faqs mirror a visible FaqBlock and the FAQPage JSON-LD
 * - related links point to 2-3 real internal pages
 * - dates: datePublished and dateModified are ISO strings
 */

/** A single cited statistic. Reuse the verified IMPACT_METRICS sources. */
export type ArticleStat = {
  /** Plain-language claim the stat backs up. */
  claim: string;
  /** The headline figure, e.g. "78%". */
  value: string;
  /** Publisher / study name, e.g. "Microsoft Work Trend Index". */
  source: string;
  /** Link to the source. */
  url: string;
  /** Publication year, e.g. "2024". */
  year: string;
};

/** One body section. body is a single paragraph; points renders an optional list. */
export type ArticleSection = {
  /** H2 phrased as a real search query where possible. */
  h2: string;
  /** The section answer paragraph. Lead with a direct, standalone answer. */
  body: string;
  /** Optional bullet list rendered under the body. */
  points?: string[];
};

/** A comparison table. Rendered as a real <table>; high AI-citation value. */
export type ArticleTable = {
  /** Heading above the table. */
  heading: string;
  /** Short supporting line under the heading. */
  intro?: string;
  /** Accessible caption describing the comparison. */
  caption: string;
  /** Column headers, including the row-label column first. */
  columns: string[];
  /** Each row: first cell is the row label, the rest are cells. */
  rows: string[][];
};

export type ArticleFaq = { q: string; a: string };

export type ArticleRelatedLink = { label: string; href: string };

export type Article = {
  /** URL slug: /insights/{slug}. */
  slug: string;
  /** Document <title> / SEO title. */
  title: string;
  /** Meta description. */
  metaDescription: string;
  /** The primary query this guide targets. */
  targetQuery: string;
  /** The page H1. */
  h1: string;
  /** ISO date string, e.g. "2026-06-10". */
  datePublished: string;
  /** ISO date string, e.g. "2026-06-10". */
  dateModified: string;
  /** Author display name. */
  author: 'Nazir Dogan';
  /** Definition-first, standalone 40-60 word intro. The first extractable block. */
  intro: string;
  /** Ordered body sections. */
  bodySections: ArticleSection[];
  /** Optional comparison tables rendered as real <table>s. */
  tables?: ArticleTable[];
  /** Cited stats (>= 3), each with source + url + year. */
  stats?: ArticleStat[];
  /** FAQs mirrored into a visible FaqBlock and FAQPage JSON-LD. */
  faqs: ArticleFaq[];
  /** 2-3 internal related links. */
  related: ArticleRelatedLink[];
};

/**
 * Ordered list of published articles. Cornerstone guides and comparison pages
 * are added in the following Phase 3 tasks; the index and [slug] route are
 * written to be empty-safe so this can start as an empty array.
 */
export const ARTICLES: Article[] = [];

/** Look up an article by slug. Returns undefined when not found. */
export function getBySlug(slug: string): Article | undefined {
  return ARTICLES.find((article) => article.slug === slug);
}

/** All article slugs, for generateStaticParams. */
export function getAllSlugs(): string[] {
  return ARTICLES.map((article) => article.slug);
}

/**
 * Zod schema for /insights guides authored as JSON.
 *
 * The cornerstone guides live as typed objects in index.ts. The daily content
 * agent's weekly guides arrive instead as JSON files in content/insights/, and
 * this schema validates them into the exact same Article shape before they are
 * merged into the ARTICLES registry. A malformed guide throws at build time.
 *
 * Keep this schema in lockstep with the Article type in index.ts.
 */
import { z } from 'zod';

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be an ISO date, e.g. 2026-07-16');

const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be lowercase kebab-case');

const articleStat = z.object({
  claim: z.string().min(1),
  value: z.string().min(1),
  source: z.string().min(1),
  url: z.string().url(),
  year: z.string().regex(/^\d{4}$/),
});

const articleSection = z.object({
  h2: z.string().min(1),
  body: z.string().min(1),
  points: z.array(z.string().min(1)).optional(),
});

const articleTable = z.object({
  heading: z.string().min(1),
  intro: z.string().min(1).optional(),
  caption: z.string().min(1),
  columns: z.array(z.string().min(1)).min(2),
  rows: z.array(z.array(z.string()).min(2)).min(1),
});

const articleFaq = z.object({
  q: z.string().min(1),
  a: z.string().min(1),
});

const articleRelated = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

export const articleSchema = z.object({
  slug,
  title: z.string().min(1),
  metaDescription: z.string().min(1).max(200),
  targetQuery: z.string().min(1),
  h1: z.string().min(1),
  datePublished: isoDate,
  dateModified: isoDate,
  author: z.literal('Nazir Dogan'),
  intro: z.string().min(1),
  bodySections: z.array(articleSection).min(3),
  tables: z.array(articleTable).optional(),
  stats: z.array(articleStat).min(3).optional(),
  faqs: z.array(articleFaq).min(1),
  related: z.array(articleRelated).min(1),
});

/**
 * Field note content contract.
 *
 * A "field note" is a short, dated post in the /field-notes feed: a single
 * useful idea for an SMB adopting AI (a tip, a tool breakdown, or a piece of
 * news reframed for teams). The daily content agent writes these as JSON files
 * in content/field-notes/, and this Zod schema is the gate: a malformed note
 * fails the build, so nothing broken ever ships.
 *
 * Keep the shape close to the /insights Article type so both feeds read the
 * same and both stay AEO-friendly (definition-first lead, cited stat, internal
 * links, FAQ mirrored to schema).
 */
import { z } from 'zod';

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be an ISO date, e.g. 2026-07-16');

const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be lowercase kebab-case');

/** A single cited statistic. Every stat MUST carry a real, resolvable source. */
export const fieldNoteStatSchema = z.object({
  claim: z.string().min(1),
  value: z.string().min(1),
  source: z.string().min(1),
  url: z.string().url(),
  year: z.string().regex(/^\d{4}$/),
});

export const fieldNoteFaqSchema = z.object({
  q: z.string().min(1),
  a: z.string().min(1),
});

/**
 * An openly-licensed lead image, already downloaded into /public/field-notes/.
 *
 * Every field is required, including the licence and the creator. This is a
 * commercial site, so an image without provenance is a liability, not a
 * decoration: the schema refuses to let one ship rather than trusting whoever
 * added it to remember the attribution. `src` must be a local path because
 * hotlinking someone else's host is both rude and fragile.
 */
export const fieldNoteImageSchema = z.object({
  /** Local path under /public, e.g. "/field-notes/my-slug.jpg". */
  src: z.string().regex(/^\/field-notes\/[a-z0-9-]+\.(jpg|jpeg|png|webp)$/i),
  /** Real alt text describing the image. Never the post title. */
  alt: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  /** Creator name, as the licence requires it to be given. */
  credit: z.string().min(1),
  creditUrl: z.string().url(),
  /** Human-readable licence, e.g. "CC BY 4.0" or "CC0". */
  license: z.string().min(1),
  licenseUrl: z.string().url(),
  /** Where it was found, e.g. "Openverse". */
  source: z.string().min(1),
});

export const fieldNoteRelatedSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

/**
 * A body section: a question-shaped heading plus the paragraphs under it.
 *
 * AI search engines extract passages, not pages, and they pick the passage
 * sitting under the heading that best matches the query. A note written as a
 * flat run of paragraphs gives them nothing to select, so headings here are the
 * difference between being read and being cited. Phrase each one the way a
 * person would actually ask it.
 */
export const fieldNoteSectionSchema = z.object({
  heading: z.string().min(1),
  paragraphs: z.array(z.string().min(1)).min(1),
});

export const fieldNoteSchema = z.object({
  /** URL slug: /field-notes/{slug}. */
  slug,
  /** Document <title> / SEO title. */
  title: z.string().min(1).max(70),
  /** The page H1. */
  h1: z.string().min(1),
  /** Meta description. */
  metaDescription: z.string().min(1).max(200),
  /** The primary query this note targets. */
  targetQuery: z.string().min(1),
  /** Cluster tags: adoption, training, best-uses, making-it-stick, tools, news. */
  tags: z.array(z.string().min(1)).min(1),
  /** ISO date strings. */
  datePublished: isoDate,
  dateModified: isoDate,
  /** Author display name. Fixed to the founder. */
  author: z.literal('Nazir Dogan'),
  /** One-line standfirst shown under the H1. */
  dek: z.string().min(1),
  /** Definition-first, standalone 40-60 word lead. The first extractable block. */
  intro: z.string().min(1),
  /**
   * Body content. Each entry is either a bare paragraph (one clear idea) or a
   * section with a query-shaped heading. Prefer sections: they are what makes a
   * note extractable. Bare strings stay legal so older notes keep validating.
   */
  body: z.array(z.union([z.string().min(1), fieldNoteSectionSchema])).min(1),
  /** The single practical "do this next" line. */
  takeaway: z.string().min(1),
  /** Optional cited stat with source + url + year. */
  stat: fieldNoteStatSchema.optional(),
  /** Optional openly-licensed lead image. Omit rather than force a bad match. */
  image: fieldNoteImageSchema.optional(),
  /** 2-3 internal related links (a guide and a service). */
  related: z.array(fieldNoteRelatedSchema).min(1),
  /** Optional FAQs, mirrored into FAQPage JSON-LD when present. */
  faqs: z.array(fieldNoteFaqSchema).optional(),
});

export type FieldNote = z.infer<typeof fieldNoteSchema>;
export type FieldNoteStat = z.infer<typeof fieldNoteStatSchema>;
export type FieldNoteFaq = z.infer<typeof fieldNoteFaqSchema>;
export type FieldNoteImage = z.infer<typeof fieldNoteImageSchema>;
export type FieldNoteSection = z.infer<typeof fieldNoteSectionSchema>;
export type FieldNoteBodyItem = FieldNote['body'][number];

/** Narrow a body entry to a headed section. */
export function isFieldNoteSection(item: FieldNoteBodyItem): item is FieldNoteSection {
  return typeof item !== 'string';
}

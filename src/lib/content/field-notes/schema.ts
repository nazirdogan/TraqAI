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

/* ------------------------------------------------------------------ *
 * Diagrams
 *
 * Two types only, both rendered as HTML rather than SVG so a long label
 * wraps inside its box instead of spilling out of it. Lengths are capped
 * here rather than trusted: the daily agent writes these unattended, and a
 * caption that is one word too long should fail the build, not ship squashed.
 *
 * A diagram is always optional. Attaching one to a post with no sequence or
 * no contrast to show is the same mistake as a decorative stock photo.
 * ------------------------------------------------------------------ */

export const fieldNoteFlowStepSchema = z.object({
  /** Short imperative, e.g. "Map the process". */
  label: z.string().min(1).max(28),
  /** One supporting clause, e.g. "As it really runs, not the flowchart". */
  detail: z.string().min(1).max(52),
});

export const fieldNoteFlowSchema = z.object({
  type: z.literal('flow'),
  /** Describes the sequence. Read out to screen readers, not shown as a heading. */
  title: z.string().min(1).max(90),
  steps: z.array(fieldNoteFlowStepSchema).min(3).max(4),
  /** Optional line under the diagram. Say something the picture does not. */
  caption: z.string().max(120).optional(),
});

export const fieldNoteBeforeAfterRowSchema = z.object({
  label: z.string().min(1).max(22),
  before: z.number().nonnegative(),
  after: z.number().nonnegative(),
  /** Shown after the number, e.g. "hours". Omit for a bare count. */
  unit: z.string().max(12).optional(),
  /**
   * How the quantity is drawn. Dots suit small counts you can take in at a
   * glance; a bar suits durations and anything larger. Both are derived from
   * the numbers, so the picture can never disagree with the data.
   */
  as: z.enum(['dots', 'bar']).default('dots'),
});

export const fieldNoteBeforeAfterSchema = z
  .object({
    type: z.literal('before-after'),
    title: z.string().min(1).max(90),
    rows: z.array(fieldNoteBeforeAfterRowSchema).min(2).max(3),
    /** The point of the whole diagram: what each state means for the reader. */
    beforeVerdict: z.string().min(1).max(48),
    afterVerdict: z.string().min(1).max(48),
    caption: z.string().max(120).optional(),
  })
  .superRefine((value, ctx) => {
    value.rows.forEach((row, index) => {
      if (row.as !== 'dots') return;
      // Nine dots in a row stops being countable at a glance, which is the only
      // reason to use dots at all. Past that the row wants a bar.
      const tooMany = row.before > 8 || row.after > 8;
      const notWhole = !Number.isInteger(row.before) || !Number.isInteger(row.after);
      if (tooMany || notWhole) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['rows', index, 'as'],
          message: 'dots need whole numbers of 8 or fewer; use "as": "bar" instead',
        });
      }
    });
  });

export const fieldNoteDiagramSchema = z.union([
  fieldNoteFlowSchema,
  fieldNoteBeforeAfterSchema,
]);

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
  /** Optional diagram. Omit unless the post genuinely has a sequence or a contrast. */
  diagram: fieldNoteDiagramSchema.optional(),
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
export type FieldNoteDiagram = z.infer<typeof fieldNoteDiagramSchema>;
export type FieldNoteFlow = z.infer<typeof fieldNoteFlowSchema>;
export type FieldNoteBeforeAfter = z.infer<typeof fieldNoteBeforeAfterSchema>;
export type FieldNoteBodyItem = FieldNote['body'][number];

/** Narrow a body entry to a headed section. */
export function isFieldNoteSection(item: FieldNoteBodyItem): item is FieldNoteSection {
  return typeof item !== 'string';
}

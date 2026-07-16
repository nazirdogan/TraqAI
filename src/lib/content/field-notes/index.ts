/**
 * /field-notes registry (server-only).
 *
 * Reads every JSON file in content/field-notes/, validates it against
 * fieldNoteSchema, and exposes the notes newest-first. This is the read side of
 * the daily content agent's write surface: the agent drops a validated JSON
 * file, this loader picks it up at build time, and the pages, sitemap and
 * llms.txt all render from it. An invalid file throws here and fails the build
 * on purpose, so nothing malformed reaches production.
 *
 * Do not import this from a client component: it uses the filesystem.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fieldNoteSchema, type FieldNote } from './schema';

const FIELD_NOTES_DIR = join(process.cwd(), 'content', 'field-notes');

/** Read + validate every note once, at module load (build time). */
function loadFieldNotes(): FieldNote[] {
  let files: string[];
  try {
    files = readdirSync(FIELD_NOTES_DIR).filter((f) => f.endsWith('.json'));
  } catch {
    // Directory absent (e.g. before the first note ships): treat as empty.
    return [];
  }

  const notes = files.map((file) => {
    const raw = readFileSync(join(FIELD_NOTES_DIR, file), 'utf8');
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      throw new Error(`content/field-notes/${file} is not valid JSON: ${String(err)}`);
    }
    const result = fieldNoteSchema.safeParse(parsed);
    if (!result.success) {
      throw new Error(
        `content/field-notes/${file} failed validation:\n${result.error.toString()}`,
      );
    }
    return result.data;
  });

  // Newest first by dateModified, then by slug for a stable tiebreak.
  return notes.sort((a, b) => {
    if (a.dateModified !== b.dateModified) {
      return a.dateModified < b.dateModified ? 1 : -1;
    }
    return a.slug < b.slug ? 1 : -1;
  });
}

export const FIELD_NOTES: FieldNote[] = loadFieldNotes();

/** Look up a note by slug. Returns undefined when not found. */
export function getFieldNoteBySlug(slug: string): FieldNote | undefined {
  return FIELD_NOTES.find((note) => note.slug === slug);
}

/** All note slugs, for generateStaticParams. */
export function getAllFieldNoteSlugs(): string[] {
  return FIELD_NOTES.map((note) => note.slug);
}

export type { FieldNote } from './schema';

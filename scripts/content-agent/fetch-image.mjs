#!/usr/bin/env node
/**
 * Find and download an openly-licensed lead image for a field note.
 *
 *   node scripts/content-agent/fetch-image.mjs <slug> "<search terms>"
 *
 * Prints a ready-to-paste `image` block for the note's JSON, or exits 2 if
 * nothing suitable was found. Exit 2 is a normal outcome, not a failure: a post
 * with no image is fine, a post with a wrong or unlicensed image is not.
 *
 * Source is Openverse (openverse.org), which indexes openly-licensed media and,
 * unlike a general image search, returns the licence and the creator with every
 * result. No API key is needed for anonymous use.
 *
 * Licensing rules enforced here, because this is a commercial site:
 *   - only licences that permit commercial use AND modification
 *   - share-alike (by-sa, by-nc-sa) is excluded: it can oblige us to license
 *     the surrounding page under the same terms, which we are not doing
 *   - the creator, licence and source are recorded and rendered visibly
 *
 * The image is downloaded into /public so nothing is hotlinked from a host we
 * do not control.
 */
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(HERE, '..', '..', 'public', 'field-notes');

/** Permit commercial use and modification, and never share-alike. */
const ALLOWED = new Set(['cc0', 'pdm', 'by']);
const MIN_WIDTH = 900;
const TIMEOUT_MS = 20000;

const [slug, ...terms] = process.argv.slice(2);
const query = terms.join(' ').trim();

if (!slug || !query) {
  console.error('Usage: fetch-image.mjs <slug> "<search terms>"');
  process.exit(1);
}
if (!/^[a-z0-9-]+$/.test(slug)) {
  console.error('slug must be lowercase kebab-case');
  process.exit(1);
}

async function get(url, asBuffer = false) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: ctl.signal,
      headers: { 'User-Agent': 'traqcollective.com content agent (hello@traqcollective.com)' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return asBuffer ? Buffer.from(await res.arrayBuffer()) : res.json();
  } finally {
    clearTimeout(timer);
  }
}

const api = new URL('https://api.openverse.org/v1/images/');
api.searchParams.set('q', query);
api.searchParams.set('license', [...ALLOWED].join(','));
api.searchParams.set('license_type', 'commercial,modification');
api.searchParams.set('page_size', '20');
api.searchParams.set('mature', 'false');

let results;
try {
  ({ results } = await get(api.toString()));
} catch (err) {
  console.error(`Openverse search failed: ${err.message}. Publish without an image.`);
  process.exit(2);
}

const candidate = (results ?? []).find(
  (r) =>
    r.url &&
    ALLOWED.has(String(r.license).toLowerCase()) &&
    Number(r.width) >= MIN_WIDTH &&
    Number(r.height) > 0 &&
    r.creator &&
    r.license_url
);

if (!candidate) {
  console.error(
    `No suitably licensed image for "${query}" (need >=${MIN_WIDTH}px, CC0/PDM/BY). Publish without one.`
  );
  process.exit(2);
}

const ext = (candidate.filetype || 'jpg').toLowerCase().replace('jpeg', 'jpg');
if (!['jpg', 'png', 'webp'].includes(ext)) {
  console.error(`Unsupported filetype "${ext}". Publish without an image.`);
  process.exit(2);
}

let bytes;
try {
  bytes = await get(candidate.url, true);
} catch (err) {
  console.error(`Download failed: ${err.message}. Publish without an image.`);
  process.exit(2);
}

if (!existsSync(PUBLIC_DIR)) mkdirSync(PUBLIC_DIR, { recursive: true });
const filename = `${slug}.${ext}`;
writeFileSync(join(PUBLIC_DIR, filename), bytes);

const licenseLabel = `CC ${String(candidate.license).toUpperCase()}${
  candidate.license_version ? ` ${candidate.license_version}` : ''
}`.replace('CC CC0', 'CC0').replace('CC PDM', 'Public Domain Mark');

console.log(
  JSON.stringify(
    {
      src: `/field-notes/${filename}`,
      alt: `TODO: describe what is actually in this image, do not reuse the post title`,
      width: Number(candidate.width),
      height: Number(candidate.height),
      credit: candidate.creator,
      creditUrl: candidate.creator_url || candidate.foreign_landing_url,
      license: licenseLabel,
      licenseUrl: candidate.license_url,
      source: 'Openverse',
    },
    null,
    2
  )
);
console.error(`\nSaved public/field-notes/${filename} (${(bytes.length / 1024).toFixed(0)}KB)`);
console.error('Replace the alt text before publishing.');

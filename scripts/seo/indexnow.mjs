/**
 * Submit the sitemap's URLs to IndexNow.
 *
 * Why this exists: a Search Console URL inspection on 2026-08-26 found that
 * most of the site was not in Google's index at all, including the /insights
 * and /field-notes index pages and every article tested. Discovery, not
 * ranking, is the binding constraint.
 *
 * IndexNow is the one push-notification channel available without an OAuth
 * connection: it needs only a key hosted on the domain. Bing, Yandex, Seznam
 * and Naver read it, and Bing is what Copilot searches. Google does NOT
 * participate, so this complements the Search Console sitemap submission
 * rather than replacing it.
 *
 * Usage:
 *   node scripts/seo/indexnow.mjs            # submit every sitemap URL
 *   node scripts/seo/indexnow.mjs --dry-run  # print the payload, send nothing
 *   node scripts/seo/indexnow.mjs <url> ...  # submit specific URLs only
 *
 * The key file must already be live at https://<host>/<key>.txt before this
 * will be accepted, so deploy before running it.
 */
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const HOST = 'traqcollective.com';
const ORIGIN = `https://${HOST}`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

/** The key is whichever <32-hex>.txt file sits in /public. One source of truth. */
function findKey() {
  const pub = join(process.cwd(), 'public');
  const keys = readdirSync(pub).filter((f) => /^[0-9a-f]{8,128}\.txt$/.test(f));
  if (keys.length !== 1) {
    throw new Error(
      `Expected exactly one IndexNow key file in /public, found ${keys.length}: ${keys.join(', ')}`,
    );
  }
  return keys[0].replace(/\.txt$/, '');
}

async function sitemapUrls() {
  const res = await fetch(`${ORIGIN}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap fetch failed: ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const explicit = args.filter((a) => a.startsWith('http'));

const key = findKey();
const urlList = explicit.length ? explicit : await sitemapUrls();

// Guard: IndexNow rejects a payload whose URLs are not all on the declared host.
const foreign = urlList.filter((u) => new URL(u).host !== HOST);
if (foreign.length) {
  throw new Error(`URLs not on ${HOST}: ${foreign.slice(0, 3).join(', ')}`);
}

const payload = {
  host: HOST,
  key,
  keyLocation: `${ORIGIN}/${key}.txt`,
  urlList,
};

console.log(`IndexNow: ${urlList.length} URLs, key ${key.slice(0, 8)}...`);
console.log(`  keyLocation ${payload.keyLocation}`);

if (dryRun) {
  console.log('  --dry-run, nothing sent');
  console.log(`  first 3: ${urlList.slice(0, 3).join(', ')}`);
  process.exit(0);
}

// Verify the key is actually reachable before submitting; a 404 here is the
// single most common reason IndexNow silently rejects a batch.
const keyCheck = await fetch(payload.keyLocation);
const keyBody = keyCheck.ok ? (await keyCheck.text()).trim() : null;
if (keyBody !== key) {
  throw new Error(
    `Key file not serving correctly at ${payload.keyLocation} ` +
      `(status ${keyCheck.status}, body ${JSON.stringify(keyBody)}). Deploy first.`,
  );
}
console.log('  key file verified live');

const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(payload),
});

// 200 and 202 both mean accepted. 202 means "key validation pending".
const body = await res.text();
console.log(`  -> HTTP ${res.status} ${res.statusText} ${body ? `| ${body.slice(0, 200)}` : ''}`);
if (![200, 202].includes(res.status)) process.exitCode = 1;

#!/usr/bin/env node
/**
 * SEO/GEO backlog report.
 *
 *   node scripts/seo/report.mjs            full report
 *   node scripts/seo/report.mjs next       just the next thing to write
 *   node scripts/seo/report.mjs outreach   just the off-domain backlog
 *   node scripts/seo/report.mjs --json     machine-readable, for the content agent
 *
 * Cross-checks the target-query backlog against what is actually published in
 * content/insights and content/field-notes, so "assigned" cannot quietly drift
 * from reality. A query pointing at a slug that no longer exists is reported as
 * broken rather than counted as covered.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');

const read = (p) => JSON.parse(readFileSync(p, 'utf8'));
const queries = read(join(HERE, 'target-queries.json'));
const outreach = read(join(HERE, 'outreach-targets.json'));
const pipeline = read(join(HERE, 'topic-pipeline.json'));

/** Refill the pipeline before it gets this low. About three weeks of runway. */
const QUEUE_FLOOR = 20;

/**
 * Pick the next daily topic, rotating clusters.
 *
 * Naive first-queued order would ship six `tools` posts in a row, which reads as
 * a content farm to a human and as thin repetition to a search engine. So the
 * next topic is the earliest queued one belonging to whichever cluster has gone
 * longest without publishing. Ties fall back to pipeline order, which keeps the
 * choice deterministic and reviewable.
 */
function nextDailyTopic(topics) {
  const queued = topics.filter((t) => t.status === 'queued');
  if (!queued.length) return null;

  // Lower number = published longer ago. Never-published clusters sort first.
  const lastUsed = new Map();
  topics.forEach((t, i) => {
    if (t.status === 'published') lastUsed.set(t.cluster, i);
  });

  return queued
    .map((t, i) => ({ t, staleness: lastUsed.has(t.cluster) ? lastUsed.get(t.cluster) : -1, i }))
    .sort((a, b) => a.staleness - b.staleness || a.i - b.i)[0].t;
}

/** Every slug actually published, by feed. */
function publishedSlugs() {
  const out = new Set();
  for (const [dir, prefix] of [
    ['content/insights', '/insights/'],
    ['content/field-notes', '/field-notes/'],
  ]) {
    const abs = join(ROOT, dir);
    if (!existsSync(abs)) continue;
    for (const f of readdirSync(abs).filter((f) => f.endsWith('.json'))) {
      try {
        out.add(prefix + read(join(abs, f)).slug);
      } catch {
        /* malformed files are the build's problem, not this report's */
      }
    }
  }
  return out;
}

/**
 * An assignment is only real if it resolves. Route paths (/services/...) are
 * accepted as-is because they are code, not content files; content paths are
 * verified against what is on disk.
 */
function resolveAssignment(assignedTo, slugs) {
  if (!assignedTo) return { state: 'unassigned' };
  const isContent = assignedTo.startsWith('/insights/') || assignedTo.startsWith('/field-notes/');
  if (!isContent) return { state: 'route' };
  return slugs.has(assignedTo) ? { state: 'ok' } : { state: 'broken' };
}

const slugs = publishedSlugs();
const rows = queries.queries.map((q) => ({ ...q, resolved: resolveAssignment(q.assignedTo, slugs) }));

const openWork = rows
  .filter((q) => q.status === 'open' || q.resolved.state === 'broken')
  .sort((a, b) => a.priority - b.priority);

const args = process.argv.slice(2);
const mode = args.find((a) => !a.startsWith('--')) ?? 'full';

const dailyTopic = nextDailyTopic(pipeline.topics);
const queuedCount = pipeline.topics.filter((t) => t.status === 'queued').length;

if (args.includes('--json')) {
  console.log(
    JSON.stringify(
      {
        lastAudited: queries.lastAudited,
        daily: { next: dailyTopic, queued: queuedCount, refillNeeded: queuedCount < QUEUE_FLOOR },
        next: openWork[0] ?? null,
        open: openWork,
        broken: rows.filter((q) => q.resolved.state === 'broken'),
        outreachBlocked: outreach.targets.filter((t) => t.status === 'blocked'),
      },
      null,
      2
    )
  );
  process.exit(0);
}

if (mode === 'daily') {
  if (!dailyTopic) {
    console.log('\n  PIPELINE EMPTY. Refill scripts/seo/topic-pipeline.json before writing.\n');
    process.exit(1);
  }
  console.log(`\n  TODAY: ${dailyTopic.workingTitle}`);
  console.log(`    id      ${dailyTopic.id}`);
  console.log(`    cluster ${dailyTopic.cluster} · ${dailyTopic.format}`);
  console.log(`    query   ${dailyTopic.targetQuery}`);
  console.log(`\n  ${queuedCount} topics queued (${(queuedCount / 7).toFixed(1)} weeks of runway).`);
  if (queuedCount < QUEUE_FLOOR) console.log('  REFILL THE PIPELINE SOON.');
  console.log('');
  process.exit(0);
}

const bar = (s) => `\n${s}\n${'─'.repeat(s.length)}`;
const label = { open: 'OPEN', partial: 'PARTIAL', published: 'DONE', 'off-domain': 'OFF-DOMAIN' };

if (mode === 'full') {
  console.log(bar('Daily blog pipeline'));
  console.log(`\n  next: ${dailyTopic ? dailyTopic.workingTitle : 'PIPELINE EMPTY'}`);
  if (dailyTopic) console.log(`        ${dailyTopic.cluster} · ${dailyTopic.format}`);
  console.log(`  queued: ${queuedCount} (${(queuedCount / 7).toFixed(1)} weeks)`);
  if (queuedCount < QUEUE_FLOOR) console.log('  REFILL THE PIPELINE SOON.');

  const byCluster = {};
  for (const t of pipeline.topics) {
    byCluster[t.cluster] ??= { queued: 0, published: 0 };
    if (t.status === 'queued') byCluster[t.cluster].queued++;
    if (t.status === 'published') byCluster[t.cluster].published++;
  }
  console.log('\n  coverage by cluster (published/queued):');
  for (const [c, n] of Object.entries(byCluster)) {
    console.log(`    ${c.padEnd(24)} ${n.published}/${n.queued}`);
  }
}

if (mode === 'full' || mode === 'next') {
  console.log(bar(`Target queries (last audited ${queries.lastAudited})`));

  if (!openWork.length) {
    console.log('  Backlog clear. Re-run the SERP audit and add new targets.');
  } else {
    const next = openWork[0];
    console.log(`\n  NEXT: ${next.query}`);
    console.log(`    cluster ${next.cluster} · ${next.intent} · wants a ${next.pageType}`);
    console.log(`    ${next.note}`);
    if (next.evidence?.winners?.length) {
      console.log(`    currently winning: ${next.evidence.winners.slice(0, 5).join(', ')}`);
    } else {
      console.log('    NOT YET SERP-CHECKED. Check what ranks before writing.');
    }
  }

  if (mode === 'next') process.exit(0);

  console.log(bar('Full backlog'));
  for (const q of rows.sort((a, b) => a.priority - b.priority)) {
    const flag = q.resolved.state === 'broken' ? ' !! assigned slug missing' : '';
    const at = q.assignedTo ? ` -> ${q.assignedTo}` : '';
    console.log(`  P${q.priority} [${label[q.status] ?? q.status}] ${q.query}${at}${flag}`);
  }

  const unchecked = rows.filter((q) => !q.evidence?.checked);
  if (unchecked.length) {
    console.log(`\n  ${unchecked.length} target(s) have never been SERP-checked:`);
    unchecked.forEach((q) => console.log(`    - ${q.query}`));
  }
}

if (mode === 'full' || mode === 'outreach') {
  console.log(bar('Off-domain backlog'));
  const order = { blocked: 0, open: 1, 'in-progress': 2, done: 3 };
  for (const t of [...outreach.targets].sort(
    (a, b) => a.priority - b.priority || (order[a.status] ?? 9) - (order[b.status] ?? 9)
  )) {
    const owner = t.ownedBy === 'nazir' ? ' (NAZIR ONLY)' : '';
    console.log(`  P${t.priority} [${t.status.toUpperCase()}] ${t.name}${owner}`);
    console.log(`      ${t.action}`);
    if (t.blocker) console.log(`      blocked by: ${t.blocker}`);
  }

  const nazir = outreach.targets.filter((t) => t.ownedBy === 'nazir' && t.status !== 'done');
  console.log(`\n  ${nazir.length} item(s) cannot be automated and are waiting on Nazir.`);
}

console.log('');

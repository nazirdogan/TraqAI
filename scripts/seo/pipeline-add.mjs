#!/usr/bin/env node
/**
 * Append new topics to the daily pipeline, with dedupe.
 *
 *   node scripts/seo/pipeline-add.mjs '[{"cluster":"agents","workingTitle":"...","targetQuery":"...","format":"how-to"}, ...]'
 *   cat topics.json | node scripts/seo/pipeline-add.mjs -
 *
 * The agent generates candidate topics on its weekly run and pipes them here
 * rather than editing the JSON by hand. This script is the gate: it assigns
 * ids, validates the shape, and refuses anything that duplicates a queued
 * topic, an already-published topic, or a slug in the content ledger.
 *
 * Dedupe is deliberately strict on targetQuery. Two posts answering the same
 * query compete with each other and split whatever authority the page earns,
 * which is worse than publishing one of them.
 *
 * Exit codes: 0 added (or nothing new to add), 1 bad input.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const PIPELINE = join(HERE, 'topic-pipeline.json');

const VALID_FORMATS = ['explainer', 'how-to', 'comparison', 'opinion'];

/** Loose match so "Claude vs ChatGPT" and "claude vs chatgpt?" collide. */
const norm = (s) => String(s ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

function readInput() {
  const arg = process.argv[2];
  if (!arg) {
    console.error('Usage: pipeline-add.mjs \'<json array>\'  |  pipeline-add.mjs -');
    process.exit(1);
  }
  const raw = arg === '-' ? readFileSync(0, 'utf8') : arg;
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    console.error(`Input is not valid JSON: ${err.message}`);
    process.exit(1);
  }
  if (!Array.isArray(parsed)) {
    console.error('Input must be a JSON array of topic objects.');
    process.exit(1);
  }
  return parsed;
}

/** Every targetQuery already spoken for, from the pipeline and the ledger. */
function existingQueries(pipeline) {
  const taken = new Set(pipeline.topics.map((t) => norm(t.targetQuery)));

  const ledgerPath = join(ROOT, 'content', '_ledger.json');
  if (existsSync(ledgerPath)) {
    try {
      const ledger = JSON.parse(readFileSync(ledgerPath, 'utf8'));
      for (const entry of ledger.published ?? []) {
        if (entry.targetQuery) taken.add(norm(entry.targetQuery));
      }
    } catch {
      /* a malformed ledger is the publish script's problem, not ours */
    }
  }

  for (const dir of ['content/field-notes', 'content/insights']) {
    const abs = join(ROOT, dir);
    if (!existsSync(abs)) continue;
    for (const f of readdirSync(abs).filter((f) => f.endsWith('.json'))) {
      try {
        taken.add(norm(JSON.parse(readFileSync(join(abs, f), 'utf8')).targetQuery));
      } catch {
        /* ignore */
      }
    }
  }
  return taken;
}

const pipeline = JSON.parse(readFileSync(PIPELINE, 'utf8'));
const incoming = readInput();
const taken = existingQueries(pipeline);
const knownClusters = Object.keys(pipeline.clusters);

let nextId = Math.max(0, ...pipeline.topics.map((t) => Number(t.id.replace('tp-', '')) || 0));
const added = [];
const rejected = [];

for (const raw of incoming) {
  const { cluster, workingTitle, targetQuery, format } = raw ?? {};

  if (!cluster || !workingTitle || !targetQuery || !format) {
    rejected.push([workingTitle ?? '(no title)', 'missing a required field']);
    continue;
  }
  if (!knownClusters.includes(cluster)) {
    rejected.push([workingTitle, `unknown cluster "${cluster}"`]);
    continue;
  }
  if (!VALID_FORMATS.includes(format)) {
    rejected.push([workingTitle, `format must be one of ${VALID_FORMATS.join(', ')}`]);
    continue;
  }
  if (String(targetQuery).includes('—') || String(workingTitle).includes('—')) {
    rejected.push([workingTitle, 'contains an em-dash']);
    continue;
  }
  if (taken.has(norm(targetQuery))) {
    rejected.push([workingTitle, 'targetQuery already covered or queued']);
    continue;
  }

  taken.add(norm(targetQuery));
  nextId += 1;
  const topic = {
    id: `tp-${String(nextId).padStart(3, '0')}`,
    cluster,
    workingTitle: String(workingTitle).trim(),
    targetQuery: String(targetQuery).trim(),
    format,
    status: 'queued',
    publishedAs: null,
  };
  pipeline.topics.push(topic);
  added.push(topic);
}

if (added.length) {
  writeFileSync(PIPELINE, `${JSON.stringify(pipeline, null, 2)}\n`, 'utf8');
}

for (const [title, why] of rejected) console.log(`  rejected: ${title} (${why})`);
for (const t of added) console.log(`  added ${t.id} [${t.cluster}] ${t.workingTitle}`);

const queued = pipeline.topics.filter((t) => t.status === 'queued').length;
console.log(`\n  ${added.length} added, ${rejected.length} rejected. ${queued} now queued.`);

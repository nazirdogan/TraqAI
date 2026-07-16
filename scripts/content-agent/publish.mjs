#!/usr/bin/env node
/**
 * publish.mjs — the deterministic rails for the daily content agent.
 *
 * The brain (agent.md) has already researched, drafted, self-critiqued, and
 * written validated JSON into content/ (or decided to write nothing). This
 * script does the rest, deterministically, and is the ONLY thing that ships:
 *
 *   1. Kill switch  — if paused, email and stop. Nothing else runs.
 *   2. Change check — if content/ has no changes, email "skipped" and stop.
 *   3. Build-gate   — typecheck + lint + next build. No green, no ship.
 *   4. On failure   — revert the content changes, email the error, exit 1.
 *   5. On success   — record the run in the ledger, commit, push, email.
 *
 * Because the build runs before the push, and Vercel never promotes a failed
 * build, a bad post cannot reach production.
 *
 * Usage:
 *   node scripts/content-agent/publish.mjs --mode daily-note --summary "..."
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { sendAlert } from './lib/email.mjs';

const ROOT = process.cwd();
const LEDGER = join(ROOT, 'content', '_ledger.json');
const PAUSE_FLAG = join(ROOT, 'content', '_paused');

function arg(name, fallback = '') {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

function sh(cmd, opts = {}) {
  return execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: 'pipe', ...opts });
}

/**
 * Push the current branch. If GITHUB_TOKEN is set in the environment (the cloud
 * routine's secret), push over an authenticated URL built at runtime; the token
 * is read from env, never hardcoded, and scrubbed from any error output. If no
 * token is present, fall back to the checkout's ambient git credentials.
 */
function pushChanges(branch) {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.CONTENT_REPO || 'nazirdogan/TraqAI';
  if (!token) {
    sh(`git push origin ${branch}`);
    return;
  }
  const url = `https://x-access-token:${token}@github.com/${repo}.git`;
  try {
    execSync(`git push ${url} HEAD:${branch}`, { cwd: ROOT, stdio: 'pipe' });
  } catch (err) {
    const raw = String(err.stderr || err.stdout || err.message || err);
    throw new Error(`git push failed: ${raw.split(token).join('***')}`);
  }
}

const MODE = arg('mode', 'daily-note');
const SUMMARY = arg('summary', 'content update');
const today = new Date().toISOString().slice(0, 10);

async function main() {
  // 1. Kill switch.
  if (process.env.CONTENT_BOT_ENABLED === 'false' || existsSync(PAUSE_FLAG)) {
    await sendAlert({
      subject: `[Traq content agent] Paused — ${today}`,
      text: 'The content agent is paused (CONTENT_BOT_ENABLED=false or content/_paused present). Nothing published.',
    });
    console.log('Paused. Exiting.');
    return;
  }

  // 2. Change check. Stage content only; the agent must not touch anything else.
  sh('git add content/');
  const staged = sh('git diff --cached --name-only -- content/').trim();
  if (!staged) {
    await sendAlert({
      subject: `[Traq content agent] Skipped — ${today}`,
      text: `Mode: ${MODE}. The agent chose not to publish today (nothing cleared the quality bar, or no new topic). No changes made.`,
    });
    console.log('No content changes. Skipped.');
    return;
  }

  // 3. Build-gate.
  const steps = [
    ['typecheck', 'npm run typecheck'],
    ['lint', 'npm run lint'],
    ['build', 'npm run build'],
  ];
  for (const [label, cmd] of steps) {
    try {
      console.log(`> ${label}`);
      sh(cmd, { stdio: 'inherit' });
    } catch (err) {
      // 4. Revert content changes and alert. Nothing ships.
      const detail = (err.stdout || '') + (err.stderr || '') || String(err);
      try {
        sh('git reset -- content/');
        sh('git checkout -- content/');
        sh('git clean -fd content/');
      } catch {
        /* best effort */
      }
      await sendAlert({
        subject: `[Traq content agent] Build FAILED, nothing shipped — ${today}`,
        text: `Mode: ${MODE}\nStaged files:\n${staged}\n\nThe ${label} step failed, so the content was reverted and nothing was published. The live site is untouched.\n\nError tail:\n${detail.slice(-2000)}`,
      });
      console.error(`Build-gate failed at ${label}. Reverted. Exiting 1.`);
      process.exit(1);
    }
  }

  // 5a. Record the run in the ledger (not build-relevant, so safe to add now).
  try {
    const ledger = JSON.parse(readFileSync(LEDGER, 'utf8'));
    ledger.runs = ledger.runs || [];
    ledger.runs.push({
      date: today,
      mode: MODE,
      action: 'publish',
      files: staged.split('\n'),
      build: 'passed',
    });
    writeFileSync(LEDGER, `${JSON.stringify(ledger, null, 2)}\n`);
    sh('git add content/_ledger.json');
  } catch (err) {
    console.warn(`[ledger] could not update: ${String(err)}`);
  }

  // 5b. Commit + push. Vercel auto-deploys from the pushed branch.
  const branch = sh('git rev-parse --abbrev-ref HEAD').trim();
  sh(`git -c user.name="Traq Content Agent" -c user.email="hello@traqcollective.com" commit -m ${JSON.stringify(
    `content(${MODE}): ${SUMMARY}`,
  )}`);
  pushChanges(branch);

  await sendAlert({
    subject: `[Traq content agent] Published — ${today}`,
    text: `Mode: ${MODE}\n${SUMMARY}\n\nFiles:\n${staged}\n\nBuild passed and the change was pushed to ${branch}. Vercel is deploying it now.`,
  });
  console.log('Published and pushed.');
}

main().catch(async (err) => {
  await sendAlert({
    subject: `[Traq content agent] Run ERROR — ${today}`,
    text: `The publish step threw before completing:\n${String(err)}`,
  });
  console.error(err);
  process.exit(1);
});

/**
 * One-off: give every field note sibling links to other field notes.
 *
 * Before this ran, 31 of 32 notes had exactly one inbound internal link (from
 * the /field-notes index). Every note's `related` block pointed "up" to an
 * insight guide or a service page and never sideways to another note, so the
 * feed had no internal topology at all: no clusters, no crawl paths between
 * posts, and nothing telling a search or AI crawler which notes belong together.
 *
 * The pairings below are curated by topic rather than derived from tag overlap.
 * Tags are coarse (18 notes share "tools"), so an automatic match would have
 * produced plausible-looking but useless pairs. Every note gains two or three
 * siblings and every note is a target at least once, so nothing stays orphaned.
 *
 * Safe to re-run: existing hrefs are never duplicated.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DIR = join(process.cwd(), 'content/field-notes');

/** Display label for each note when linked from another note. */
const LABELS = {
  'the-five-hour-rule-for-ai-training': 'The five-hour rule for AI training',
  'microsoft-365-copilot-pricing-for-small-business':
    'What Microsoft bundling Copilot changes',
  'where-small-teams-should-start-with-ai': 'Where a small team should start with AI',
  'turning-off-ai-in-microsoft-teams-meetings': 'Turning AI off mid-meeting in Teams',
  'claude-for-small-business-explained': 'Claude for Small Business, explained',
  'what-makes-someone-an-advanced-ai-user': 'What makes someone an advanced AI user',
  'how-to-make-ai-usage-stick-after-training': 'How to make AI usage stick after training',
  'openai-chatgpt-for-small-business-explained': 'ChatGPT for Small Business, explained',
  'gusto-cofounder-ai-teammate-for-small-business': "Gusto's AI teammate for payroll tasks",
  'how-many-small-businesses-use-ai-in-2026': 'How many small businesses use AI in 2026',
  'zapier-human-in-the-loop-for-ai-agents': "Zapier's Human in the Loop, explained",
  'claude-record-a-skill-explained': "Claude's Record a Skill, explained",
  'canva-code-2-for-small-business': 'What Canva Code 2.0 means for a small business',
  'what-ai-can-and-cannot-do-for-small-business': 'What AI can and cannot do for a small business',
  'gemini-diagrams-in-google-docs': 'Gemini diagrams inside Google Docs',
  'how-to-run-an-ai-training-session-for-staff': 'How to run an AI training session for staff',
  'where-ai-belongs-in-a-workflow': 'Where AI belongs in a workflow',
  'what-chatgpt-projects-are-for': 'What ChatGPT Projects are actually for',
  'claude-vs-chatgpt-for-business': 'Claude vs ChatGPT for business',
  'quickbooks-online-price-increase-2026': 'Why QuickBooks Online got more expensive',
  'which-ai-tool-for-which-job': 'Which AI tool to use for which job',
  'what-is-an-ai-agent-for-business': 'What is an AI agent for a small business?',
  'chatgpt-business-premium-seats-2026': 'Is ChatGPT Business Premium worth $125 a seat?',
  'what-to-automate-first-in-a-small-business': 'What to automate first in a small business',
  'how-to-map-a-business-process': 'How to map a business process',
  'google-sheets-canvas-for-small-business': 'Google Sheets canvas, explained',
  'ai-strategy-on-a-small-budget': 'How to build an AI strategy on a small budget',
  'how-to-choose-ai-use-cases': 'How to choose AI use cases that actually work',
  'chatgpt-computer-history-privacy-for-small-business':
    "ChatGPT's Computer History feature",
  'fix-the-process-before-automating-it': 'Fix the process before you automate it',
  'ask-gemini-in-google-chat-for-small-business': "Google Chat's Gemini panel is changing",
  'ai-vs-automation-vs-agent': "AI, automation and an agent: what's different",
};

/** slug -> sibling slugs, grouped into real topic clusters. */
const SIBLINGS = {
  // Training, and making it stick
  'the-five-hour-rule-for-ai-training': [
    'how-to-make-ai-usage-stick-after-training',
    'what-makes-someone-an-advanced-ai-user',
  ],
  'what-makes-someone-an-advanced-ai-user': [
    'the-five-hour-rule-for-ai-training',
    'how-to-make-ai-usage-stick-after-training',
  ],
  'how-to-make-ai-usage-stick-after-training': [
    'the-five-hour-rule-for-ai-training',
    'how-to-run-an-ai-training-session-for-staff',
  ],
  'how-to-run-an-ai-training-session-for-staff': [
    'the-five-hour-rule-for-ai-training',
    'how-to-make-ai-usage-stick-after-training',
    'claude-record-a-skill-explained',
  ],

  // Process first, then automate
  'fix-the-process-before-automating-it': [
    'how-to-map-a-business-process',
    'what-to-automate-first-in-a-small-business',
  ],
  'how-to-map-a-business-process': [
    'fix-the-process-before-automating-it',
    'what-to-automate-first-in-a-small-business',
  ],
  'what-to-automate-first-in-a-small-business': [
    'how-to-map-a-business-process',
    'fix-the-process-before-automating-it',
  ],
  'how-to-choose-ai-use-cases': [
    'what-to-automate-first-in-a-small-business',
    'where-ai-belongs-in-a-workflow',
  ],
  'where-ai-belongs-in-a-workflow': [
    'fix-the-process-before-automating-it',
    'what-to-automate-first-in-a-small-business',
  ],

  // What an agent actually is
  'ai-vs-automation-vs-agent': [
    'what-is-an-ai-agent-for-business',
    'zapier-human-in-the-loop-for-ai-agents',
  ],
  'what-is-an-ai-agent-for-business': [
    'ai-vs-automation-vs-agent',
    'zapier-human-in-the-loop-for-ai-agents',
    'gusto-cofounder-ai-teammate-for-small-business',
  ],
  'zapier-human-in-the-loop-for-ai-agents': [
    'what-is-an-ai-agent-for-business',
    'ai-vs-automation-vs-agent',
    'gusto-cofounder-ai-teammate-for-small-business',
  ],
  'gusto-cofounder-ai-teammate-for-small-business': [
    'what-is-an-ai-agent-for-business',
    'zapier-human-in-the-loop-for-ai-agents',
  ],

  // Picking a tool
  'which-ai-tool-for-which-job': [
    'claude-vs-chatgpt-for-business',
    'what-chatgpt-projects-are-for',
  ],
  'claude-vs-chatgpt-for-business': [
    'which-ai-tool-for-which-job',
    'claude-for-small-business-explained',
  ],
  'claude-for-small-business-explained': [
    'claude-vs-chatgpt-for-business',
    'openai-chatgpt-for-small-business-explained',
    'claude-record-a-skill-explained',
  ],
  'openai-chatgpt-for-small-business-explained': [
    'chatgpt-business-premium-seats-2026',
    'what-chatgpt-projects-are-for',
  ],
  'what-chatgpt-projects-are-for': [
    'openai-chatgpt-for-small-business-explained',
    'which-ai-tool-for-which-job',
  ],
  'claude-record-a-skill-explained': [
    'claude-for-small-business-explained',
    'how-to-run-an-ai-training-session-for-staff',
  ],
  'canva-code-2-for-small-business': [
    'which-ai-tool-for-which-job',
    'google-sheets-canvas-for-small-business',
  ],

  // Starting out, and the wider picture
  'where-small-teams-should-start-with-ai': [
    'how-to-choose-ai-use-cases',
    'ai-strategy-on-a-small-budget',
    'how-many-small-businesses-use-ai-in-2026',
  ],
  'ai-strategy-on-a-small-budget': [
    'where-small-teams-should-start-with-ai',
    'how-to-choose-ai-use-cases',
    'how-many-small-businesses-use-ai-in-2026',
  ],
  'what-ai-can-and-cannot-do-for-small-business': [
    'where-ai-belongs-in-a-workflow',
    'how-to-choose-ai-use-cases',
  ],
  'how-many-small-businesses-use-ai-in-2026': [
    'where-small-teams-should-start-with-ai',
    'what-ai-can-and-cannot-do-for-small-business',
  ],

  // What a seat costs
  'chatgpt-business-premium-seats-2026': [
    'openai-chatgpt-for-small-business-explained',
    'microsoft-365-copilot-pricing-for-small-business',
    'quickbooks-online-price-increase-2026',
  ],
  'microsoft-365-copilot-pricing-for-small-business': [
    'chatgpt-business-premium-seats-2026',
    'which-ai-tool-for-which-job',
    'quickbooks-online-price-increase-2026',
  ],
  'quickbooks-online-price-increase-2026': [
    'chatgpt-business-premium-seats-2026',
    'microsoft-365-copilot-pricing-for-small-business',
  ],

  // Google Workspace
  'gemini-diagrams-in-google-docs': [
    'google-sheets-canvas-for-small-business',
    'ask-gemini-in-google-chat-for-small-business',
  ],
  'google-sheets-canvas-for-small-business': [
    'gemini-diagrams-in-google-docs',
    'canva-code-2-for-small-business',
  ],
  'ask-gemini-in-google-chat-for-small-business': [
    'gemini-diagrams-in-google-docs',
    'google-sheets-canvas-for-small-business',
  ],

  // Data and control
  'chatgpt-computer-history-privacy-for-small-business': [
    'turning-off-ai-in-microsoft-teams-meetings',
    'openai-chatgpt-for-small-business-explained',
  ],
  'turning-off-ai-in-microsoft-teams-meetings': [
    'chatgpt-computer-history-privacy-for-small-business',
    'microsoft-365-copilot-pricing-for-small-business',
  ],
};

/**
 * Append entries to the "related" array by editing the raw text.
 *
 * Reserialising with JSON.stringify would work but reflows every compact array
 * in the file (`"tags": ["tools", "news"]` becomes three lines), burying two
 * added links in a 500-line diff. These files are hand- and agent-authored with
 * no formatter to normalise them, so the edit is made in place instead.
 */
function appendRelated(text, additions) {
  const key = '\n  "related": [';
  const start = text.indexOf(key);
  if (start === -1) throw new Error('no "related" array found');

  // Walk to the matching close bracket, ignoring brackets inside strings.
  let i = start + key.length - 1;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (; i < text.length; i += 1) {
    const ch = text[i];
    if (escaped) { escaped = false; continue; }
    if (ch === '\\') { escaped = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === '[') depth += 1;
    else if (ch === ']') { depth -= 1; if (depth === 0) break; }
  }
  if (depth !== 0) throw new Error('unbalanced "related" array');

  const block = additions
    .map((a) => `    {\n      ${JSON.stringify('label')}: ${JSON.stringify(a.label)},\n      ${JSON.stringify('href')}: ${JSON.stringify(a.href)}\n    }`)
    .join(',\n');

  // `i` sits on the closing "]". Everything before it is the last entry plus a
  // newline and the array's indent, so splice in a comma and the new entries.
  const head = text.slice(0, i).replace(/\s*$/, '');
  return `${head},\n${block}\n  ${text.slice(i)}`;
}

let changed = 0;
const missing = [];

for (const file of readdirSync(DIR).filter((f) => f.endsWith('.json'))) {
  const path = join(DIR, file);
  const raw = readFileSync(path, 'utf8');
  const note = JSON.parse(raw);
  const siblings = SIBLINGS[note.slug];
  if (!siblings) {
    missing.push(note.slug);
    continue;
  }

  const existing = new Set(note.related.map((r) => r.href));
  const additions = [];
  for (const slug of siblings) {
    const href = `/field-notes/${slug}`;
    if (existing.has(href)) continue;
    const label = LABELS[slug];
    if (!label) throw new Error(`No label for sibling ${slug} (referenced by ${note.slug})`);
    additions.push({ label, href });
    existing.add(href);
  }
  if (!additions.length) continue;

  const next = appendRelated(raw, additions);
  // Parse-check before writing: a broken splice must never reach disk.
  const parsed = JSON.parse(next);
  if (parsed.related.length !== note.related.length + additions.length) {
    throw new Error(`related count wrong for ${note.slug}`);
  }
  writeFileSync(path, next);
  changed += 1;
}

if (missing.length) {
  console.error(`No sibling mapping for: ${missing.join(', ')}`);
  process.exitCode = 1;
}
console.log(`Updated ${changed} field notes.`);

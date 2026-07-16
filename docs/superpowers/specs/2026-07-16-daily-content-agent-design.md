# Traq Daily Content Agent: design spec

**Date:** 2026-07-16
**Status:** Approved, in build
**Repo:** nazirdogan/TraqAI (branch `main` auto-deploys to Vercel project `traqcollective`)

## Goal

A self-contained agent that runs once a day in the cloud (works with the laptop closed), researches genuinely useful AI content for SMBs, writes on-brand AEO-structured content, verifies it, and publishes to traqcollective.com by committing to the repo. It exists to end the "everything dated 2026-06-10" freshness problem and to compound the site's SEO and GEO over time.

## Approved decisions

- **Output model:** Hybrid. Daily short "field note" in a new `/field-notes` feed; one new evergreen `/insights` guide per week; a monthly refresh of an existing guide.
- **Autonomy:** Fully autonomous (publishes live daily, no human approval gate). Guardrails are therefore load-bearing.
- **Runtime:** Claude Code scheduled cloud agent (approach A). Daily routine, commits to the repo, Vercel auto-deploys.
- **Alerts:** Email only, via Resend (already wired into the site), to the founder's inbox.

## Architecture

Two clean halves (isolated judgment vs deterministic I/O):

1. **The brain (Claude, following `scripts/content-agent/agent.md`).** Research, select, draft, self-critique. Produces validated JSON content files only. Never edits app code.
2. **The rails (`scripts/content-agent/publish.mjs`).** Deterministic: kill-switch check, build-gate (typecheck + lint + `next build`), commit + push, email summary. Ship only on green.

### Content storage (the agent's entire write surface)

- `content/field-notes/YYYY-MM-DD-slug.json` — daily short posts.
- `content/insights/slug.json` — weekly evergreen guides (same shape as the existing `Article` type).
- `content/_ledger.json` — append-only run log (topic, slug, target query, critic verdict, publish/skip/fail, build result). Drives dedup and the audit trail.
- All files validated by Zod at build time. A malformed file fails the build, so nothing broken ships.

### Rendering

- `/field-notes` index + `/field-notes/[slug]` detail, mirroring the existing insights pattern: definition-first lead, query-phrased structure, an optional cited stat with a real source URL, related internal links to the matching guide and service, and `BlogPosting` + `BreadcrumbList` JSON-LD.
- Weekly JSON guides merge into the existing `ARTICLES` registry, so they inherit the full best-in-class article layout unchanged.
- Field notes and guides auto-flow into `sitemap.ts` (with real per-item `dateModified`, which also fixes the audit's `new Date()` lastmod finding) and `llms.txt`.

## The daily decision logic (brain)

1. Check the kill switch (`content/_paused` file or `CONTENT_BOT_ENABLED=false`). If paused, email and stop.
2. Pick mode by date: weekly-guide day, monthly-refresh day, else daily field note.
3. Research: web search for real AI news, tools, and SMB adoption angles. Normalize into candidate topics tagged to a target-query cluster (adoption, training, best-uses, making-it-stick).
4. Select: skip anything already in the ledger; require genuine SMB usefulness and a natural keyword fit. If nothing clears the bar, publish nothing and say why.
5. Draft: Traq voice, existing article pattern, definition-first, a cited stat where relevant, internal links to the matching guide and service.
6. Self-critique (separate pass): every factual claim has a resolvable source; no fabricated numbers; on-brand; no em-dashes; keywords natural (flag stuffing); real substance. Revise once, else abort and email.
7. Publish via `publish.mjs`: build-gate, then commit + push + email. On any failure, discard and email the error.

## Guardrails (because it is fully autonomous)

- **Build-gate** before every push (`typecheck && lint && build`). No green, no ship.
- **Vercel backstop:** failed builds are never promoted, so the live site cannot break.
- **Dedup + audit ledger** committed each run.
- **Kill switch** to pause instantly.
- **Daily email** every run: published / skipped / failed, with detail. Autonomous never means invisible.
- **Scope caps:** at most one field note per day, one guide per week, one refresh per month.
- **No fabrication rule:** any statistic must carry a real, resolvable source URL, enforced by the critic pass.

## Runtime and secrets (Nazir provides)

- A `GITHUB_TOKEN` (or fine-grained PAT) scoped to push to `nazirdogan/TraqAI`, stored as a cloud routine secret.
- `RESEND_API_KEY` (already used by the site) and `ALERT_EMAIL` for the daily summary.
- Voice reference: `~/Content/voices/nazir.md` + the Traq brand kit + the existing `/insights` articles as the style anchor.

## Out of scope (YAGNI, for now)

No AI-generated images, no social cross-posting (the Lish/Marlow engine owns social), no CMS. Add generated hero images later once the text engine is proven.

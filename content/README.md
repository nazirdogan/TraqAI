# content/ — the daily content agent's write surface

This directory is the **only** place the daily content agent writes. It never edits app code. Everything here is validated by Zod at build time, so a malformed file fails `next build` and nothing broken ships.

## Layout

- `field-notes/YYYY-MM-DD-slug.json` — one short daily post. Schema: `src/lib/content/field-notes/schema.ts`.
- `insights/slug.json` — one weekly evergreen guide. Schema: `src/lib/content/insights/schema.ts`.
- `_ledger.json` — append-only run log + dedup index. Read before selecting a topic; append every run.

## Hard rules (the critic pass enforces these)

1. **No fabrication.** Every `stat` must carry a real, resolvable `url`. If you cannot cite a real source, drop the stat. Never invent a number.
2. **No em-dashes.** Anywhere. Use periods, commas, colons or parentheses. This is a house rule.
3. **No repeats.** Check `_ledger.json`. Do not reuse a `slug` or a `targetQuery` that is already covered, and do not paraphrase an existing note.
4. **Real substance, not buzzwords.** One clear, useful idea per note, written for an SMB owner. If nothing clears that bar today, publish nothing and log a skip.
5. **Keywords natural.** Target one primary `targetQuery`, use it and close variants where they read naturally. No stuffing.
6. **Definition-first.** The `intro` is a standalone 40 to 60 word answer to the target query. It must make sense lifted out on its own (that is what AI answer engines quote).
7. **Always link inward.** `related` must point to at least one real `/insights` guide and one `/services` page, so each note feeds a hub.
8. **Voice.** Traq voice: plain, practitioner, direct. Anchor to `~/Content/voices/nazir.md`, the Traq brand kit, and the existing `/insights` guides.

## Cluster tags

Use one or more of: `adoption`, `training`, `best-uses`, `making-it-stick`, `tools`, `news`.

## Field note shape (example)

See `field-notes/2026-07-16-where-small-teams-should-start-with-ai.json` for a complete, valid example. Required fields: `slug`, `title` (<=70 chars), `h1`, `metaDescription` (<=200 chars), `targetQuery`, `tags`, `datePublished`, `dateModified`, `author` ("Nazir Dogan"), `dek`, `intro`, `body` (array of paragraphs), `takeaway`, `related`. Optional: `stat`, `faqs`.

## Weekly guide shape

Same shape as the cornerstone guides in `src/lib/content/insights/index.ts`: `bodySections` (>=3, H2s phrased as real queries), optional `tables` and `stats` (>=3 when present), `faqs`, `related`. Pick a `targetQuery` that fills a gap in the existing set.

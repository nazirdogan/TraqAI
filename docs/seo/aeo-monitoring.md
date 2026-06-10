# AEO Monitoring Playbook: Traq Collective

**Owner:** Nazir Dogan
**Last updated:** 10 June 2026
**Purpose:** A simple, repeatable monthly check to see whether AI answer engines name Traq Collective for the queries that matter, which page they cite, and how that changes over time. No paid tools required. Runs in about 30–45 minutes a month.

---

## What this measures and why

Traditional rank tracking tells you where you sit on a Google results page. It does not tell you whether ChatGPT, Perplexity, or Google AI Overviews actually name you when someone asks a question. For an AI enablement business whose buyers increasingly ask an assistant before they search, the answer-engine result is what matters.

So once a month you run a fixed set of 20 priority queries across three engines, by hand, and log three things for each: were we cited, who else was cited, and which Traq page (if any) was the source. Run it the same way every month so the trend is honest. The goal over time is to move from "not mentioned" to "mentioned" to "cited with a link", and to watch which guides and pages do the pulling.

Do the run in a fresh, signed-out or temporary session each time. Personalisation and chat memory skew results, so a clean session keeps months comparable.

---

## The 20 priority queries

Run every one of these, in plain conversational phrasing, across all three engines. They map to Traq's query clusters: brand/category, fractional Head of AI, UAE local, training, and the comparison/how-to topics the `/insights` guides target.

### Category and brand (1–4)
1. What is an AI enablement partner and what do they do?
2. Best AI consultants for small and mid-sized teams
3. Who can help my team actually use the AI tools we already pay for?
4. What is Traq Collective?

### Fractional Head of AI (5–8)
5. What is a fractional Head of AI?
6. What does a fractional Head of AI do?
7. Should I hire a fractional Head of AI or a full-time one?
8. Fractional Chief AI Officer vs a full-time AI hire

### UAE / local (9–12)
9. Best AI consultants in the UAE
10. AI consultant Dubai
11. AI training for teams in the UAE
12. AI training companies Dubai

### Training and adoption (13–16)
13. How do I get my team to actually use AI?
14. Is AI training for employees worth it?
15. How much AI training do employees need to use it regularly?
16. How do I run an AI adoption programme for my company?

### Comparison and how-to (17–20)
17. AI consultant vs AI agency, which do I need?
18. Is it worth hiring an AI consultant or should we do it ourselves?
19. How do agentic AI workflows work for a business?
20. How do I tell if my company is ready for AI?

---

## The three engines

Run all 20 in each. Note that AI Overviews does not trigger on every query, which is itself a data point worth logging.

1. **ChatGPT** (chat.openai.com). Use the model with browsing enabled so it can cite live sources. Log the named brands and any linked sources.
2. **Perplexity** (perplexity.ai). The most citation-transparent engine. It lists numbered sources for every answer, so it is the clearest signal of whether a Traq page was actually used.
3. **Google AI Overviews**. Run the query in Google search (signed-out) and check whether an AI Overview appears at the top, and which sources it links. If no Overview appears, log "no AIO".

---

## How to score each query

For each query in each engine, record:

- **Cited?** One of: `Linked` (Traq named and linked), `Named` (Traq named, no link), `No`.
- **Which page:** the Traq URL the engine used or linked, if any (for example `/insights/what-a-fractional-head-of-ai-does` or the home page).
- **Who else:** the competitors or sources named alongside or instead of us. This tells you who owns the query today.
- **Notes:** anything useful, such as whether an AI Overview was shown at all, whether the engine described us accurately, and whether it used our one-liner.

Scoring guide for the trend: `Linked` = 2, `Named` = 1, `No` = 0. Sum across the 20 queries per engine for a single monthly number (max 40 per engine) so you can see movement at a glance without reading every cell.

---

## Tracking sheet template

Copy this into a Google Sheet or Notion table. One tab (or a Month column) per monthly run so history is preserved. 20 rows per engine.

| # | Query | Engine | Cited? (Linked/Named/No) | Score (2/1/0) | Which Traq page | Who else was cited | Notes | Date run |
|---|---|---|---|---|---|---|---|---|
| 1 | What is an AI enablement partner... | ChatGPT | | | | | | |
| 1 | What is an AI enablement partner... | Perplexity | | | | | | |
| 1 | What is an AI enablement partner... | Google AIO | | | | | | |
| 2 | Best AI consultants for small... | ChatGPT | | | | | | |
| ... | ... | ... | | | | | | |
| 20 | How do I tell if my company is ready... | Google AIO | | | | | | |

### Monthly summary block (fill after each run)

| Engine | Total score (max 40) | Queries cited (of 20) | Top page cited | Biggest gap (query we should win but don't) |
|---|---|---|---|---|
| ChatGPT | | | | |
| Perplexity | | | | |
| Google AIO | | | | |

Use the "biggest gap" cell to drive the next month's work. If we keep losing query 9 ("Best AI consultants in the UAE") to a directory, that points straight at the off-page directory and roundup work in `off-page-checklist.md`. If a guide is never cited for its target query, the guide's intro or H2s probably need to match the query phrasing more closely.

---

## Google Search Console (the traditional-search complement)

AEO monitoring covers answer engines. Search Console covers classic Google, and the two together give the full picture.

- [ ] Verify the `traqcollective.com` domain in Search Console (if not already done in Phase 1/2).
- [ ] Submit the sitemap and confirm it is read.
- [ ] Once a month, open Performance and check: which queries bring impressions and clicks, which `/insights` pages and service pages are gaining or losing impressions, and any new queries Traq is starting to show for.
- [ ] Cross-reference: a query that earns Google impressions but no AI citation is a prime candidate for a sharper definition-first answer block on the matching page.

---

## Optional paid tools (later, not required)

The manual run above is enough to start and is honest because you see the actual answers. If the monthly check becomes a chore or you want alerting, these track AI citations automatically:

- **Otterly.ai** tracks brand mentions and citations across ChatGPT, Perplexity, and AI Overviews for a set of prompts.
- **Peec.ai** offers similar AI-visibility tracking with competitor comparison.

Adopt one only when the manual process proves the queries worth automating. Until then, the 20-query sheet is the system of record.

---

## Monthly cadence summary

1. Fresh, signed-out session.
2. Run all 20 queries across ChatGPT, Perplexity, and Google AI Overviews.
3. Log Cited / page / competitors / notes for each in the sheet.
4. Fill the monthly summary block and note the biggest gap per engine.
5. Skim Search Console Performance for the same month.
6. Turn the biggest gaps into next-month actions (an on-page fix from the AEO content rules, or an off-page task from `off-page-checklist.md`).

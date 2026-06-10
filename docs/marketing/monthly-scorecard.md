# Monthly Inbound & Visibility Scorecard — Traq Collective

**Owner:** Nazir · **Cadence:** monthly (with a light weekly top-5-query spot-check for the first 90 days)
**Why:** one page that answers "are we getting found, and is it turning into calls?" Copy this block each month and fill it in. It pulls from three free sources: GA4, Google Search Console (GSC), and a manual AI-citation check.

---

## Month: ______  (prepared by: ___ on ___)

### 1. Inbound & conversion (from GA4)
*Source: GA4 → Reports → Acquisition → Traffic acquisition; Key events = cta_book_click / quick_form_submit / chat_lead_submit / booking_view.*

| Metric | This month | Last month | Notes |
|---|---|---|---|
| Sessions | | | |
| `cta_book_click` | | | primary-CTA intent |
| `booking_view` (reached /book) | | | |
| Bookings completed (Calendly) | | | from Calendly dashboard |
| `quick_form_submit` + `chat_lead_submit` | | | form leads |
| **Total leads** | | | calls + form |
| Top 3 lead sources (source/medium) | | | which channel won |

### 2. Search visibility (from GSC)
*Source: Search Console → Performance. Verify the domain + submit sitemap first (see below).*

| Metric | This month | Last month |
|---|---|---|
| Total impressions | | |
| Total clicks | | |
| Avg position | | |
| Top 5 queries (by impressions) | | |
| New queries we started ranking for | | |
| Pages indexed (Pages report) | | |

### 3. AI citation check (manual, ~30 min)
*Run each query in ChatGPT, Perplexity, and Google (AI Overview). Record: are WE cited? who else is? which of our pages?*

Priority queries (edit to taste):
1. AI consultant Dubai / UAE
2. AI training for teams UAE
3. fractional Head of AI
4. fractional Chief AI Officer
5. AI consultant vs AI agency
6. how to get my team to use AI
7. AI readiness assessment
8. agentic AI for business
9. best AI consultants UAE
10. do I need a Chief AI Officer
*(full 20 in `docs/seo/aeo-monitoring.md`)*

| Query | ChatGPT cited us? | Perplexity? | Google AIO? | Competitors cited |
|---|:--:|:--:|:--:|---|
| | | | | |

### 4. This month's read
- **What worked:** ___
- **What didn't:** ___
- **One change for next month:** ___

---

## First-time setup (do once)
1. **GA4:** create a property → get the `G-XXXXXXXX` measurement ID → set `NEXT_PUBLIC_GA_ID` on Vercel (production) → redeploy → mark the four events as Key events.
2. **GSC:** add `traqcollective.com` (Domain property → DNS TXT verify at GoDaddy), then submit `https://traqcollective.com/sitemap.xml`, then request indexing for the priority pages.
3. **Calendly:** confirm bookings show in the Calendly dashboard (the embed is live on `/book`).
4. *(Optional, paid)* an AI-visibility tool (Otterly / Peec / ZipTie) to automate section 3.

## Realistic expectation
Sections 1–2 produce signal within weeks. **Section 3 (AI citations) is a 2–4 month compounding game** and depends heavily on the off-page work in `docs/seo/off-page-checklist.md` — that's the lever, not more frequent checking.

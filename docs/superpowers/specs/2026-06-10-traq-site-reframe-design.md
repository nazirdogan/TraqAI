# Traq Collective — Site Reframe & SEO/AEO Rebuild

**Date:** 2026-06-10
**Owner:** Nazir
**Repo:** `~/Downloads/TraqAI/site` (the Netlify-linked, deployed copy)
**Status:** Draft for review

---

## 1. Goal

Reposition and rebuild traqcollective.com from a dark, gradient-heavy "we build AI systems for you" landing page into a **friendly, light, proper-business site** that:

1. Positions Traq as an **AI enablement partner** — training teams, consulting as a fractional Head of AI, implementing AI into real workflows, and building agentic infrastructure.
2. **Looks like a credible business**, not a typical AI-cliché site. Light mode, no gradients, no AI slop in copy or UI.
3. **Ranks top 1–3 and gets cited by AI search** (ChatGPT, Perplexity, Google AI Overviews) for AI-consulting/training queries in the UAE and globally.
4. **Drives inbound** — every page routes to "Book a call," and the contact backend reliably delivers leads to nazir@traqcollective.com.

---

## 2. Positioning (locked)

- **Frame:** outcome-led, plain language. The buyer has paid for AI tools; their team isn't using them; nobody has time to train them. Traq fills that gap.
- **Voice:** friendly, supportive, ICP-targeted. We're here for you, we'll show you, we want you to take advantage and not get left behind. Confident, warm, never fear-mongering or hypey.
- **Wedge (from competitor research):** practitioners who embed in your workflows — not slow, expensive consultancy decks, and not generic certificate courses.
- **Regional:** globally fluent, locally embedded. UAE presence is a clear differentiator; not UAE-exclusive.
- **Anti-dependency promise:** your team owns the capability. We make ourselves redundant.

### ICP

Mid-market business leaders and operators (founders, COOs, ops/department heads) in the UAE and globally who have bought AI tools (ChatGPT, Copilot, etc.) but whose teams aren't using them well. They worry about falling behind and don't have time to train people themselves.

---

## 3. Copy voice rules (stop-slop, applied to every line)

Write every line for **this reader, talking to "you,"** warm and direct. Concretely:

- Active voice, human subject. No "the system empowers," no "leverage," "unlock," "supercharge," "seamless," "cutting-edge," "in today's fast-paced world," "game-changer," "revolutionize."
- No gradients of hype. State the benefit plainly and back it with a number or a specific.
- No em dashes. Vary sentence length. Two items beat three.
- No throat-clearing ("Here's the thing"), no "not X, it's Y" contrast crutches, no pull-quote bait.
- Friendly and supportive: "We'll show your team," "we stay with you," "you won't get left behind," "let's get the tools you're paying for working."
- Specific over vague: name the tool, the hour saved, the workflow.

Lead copy below is the recommended direction. Treat it as reviewable, not final.

---

## 4. Visual design system (light, gradient-free, anti-slop)

A clean, modern B2B look. Think a trustworthy professional services firm, not an AI startup template.

- **Background:** premium white. `#FFFFFF` page, `#FAFAFA` for alternating section bands. No mesh, no glow, no orbital animations.
- **Surfaces:** white cards with a single solid hairline border (`~#ECECEC`) and a soft, flat shadow. No gradient fills, no gradient borders, no glow.
- **Text:** near-black headings (`~#141414`), neutral-600 body (`~#555`). High contrast, easy to read.
- **Accent:** Traq purple as a **solid** color only (buttons, links, small marks, the active states). Source the exact token from `~/Downloads/TraqAI/brand-kit`. No purple gradients.
- **Type:** Inter throughout, per the Traq brand kit (the brand dictates Inter, overriding the global serif-heading default). Heavy, tight headings; comfortable body. Option to add a single serif display face for H1 only if we want warmth — flagged, not default.
- **Buttons/CTA:** solid purple primary, flat. Generous padding, clear hover. Secondary is outline on white.
- **Spacing:** generous white space between every component (per global rules).
- **Nav:** clean fixed top navbar on white. No sticky bottom bar (that's for app mockups, not this marketing site).
- **Imagery:** real and human where possible — workshop photos, named headshots for testimonials. Avoid generic abstract "AI" art. Placeholders flagged where real assets are needed.

**Removed entirely:** `text-gradient`, `mesh-bg`, `grid-overlay`, `hero-bg-orbits`, `hero-glow`, gradient avatars, gradient impact-card backgrounds, the dark `bg-base` theme, the scroll-reveal 3D-tilt dashboard animation. The whole "AI vibe" decorative layer goes.

### Hero visual — one open call

The current hero is a dark, animated, gradient CRM dashboard mock sitting on orbital/mesh/glow backgrounds. That is exactly the AI-cliché look we're removing. Two clean options:

- **(Recommended) Restrained light snapshot.** A flat, light, gradient-free panel showing an "AI adoption" snapshot (tools activated, team confidence, workshops delivered, a simple 90-day roadmap). Solid colors, hairline borders, no animation. Keeps a product feel without the slop.
- **(Safe fallback) Clean typographic hero.** Headline, subhead, CTAs, and a simple proof strip (tool logos + a stat). No mock at all. This is what many credible firms do.

Default to the restrained light snapshot; drop to typographic if it still reads "AI template" once built. **Confirm at review.**

---

## 5. Information architecture (the SEO backbone)

The site is currently one page at `/`. A single page cannot rank for many query clusters or get cited across topics. We add dedicated, extractable pages, each targeting one cluster.

### Pages

| Path | Purpose | Primary query cluster |
|------|---------|----------------------|
| `/` | Home — reframed landing | "AI consultant / AI enablement" brand + overview |
| `/services` | Capabilities hub | "AI consulting services" |
| `/services/ai-training` | Training & workshops | "AI training for teams / companies (UAE)" |
| `/services/ai-consulting` | Consulting & strategy | "AI consultant / AI strategy (UAE)" |
| `/services/ai-implementation` | Implementation & enablement | "AI implementation / adoption" |
| `/services/agentic-ai` | Agentic AI & autonomous infrastructure | "AI agents / agentic workflows / autonomous operations" |
| `/fractional-head-of-ai` | The flagship offer | "fractional Head of AI / fractional Chief AI Officer" |
| `/ai-consulting-uae` | Location landing | "AI consultant Dubai / AI training UAE" + local |
| `/ai-readiness` | Free interactive assessment (lead magnet) | "AI readiness assessment / is my company AI ready" |
| `/insights` + `/insights/[slug]` | Definitive guides (citation engine) | informational "how to / what is" queries |
| `/about` | Entity + E-E-A-T (founder, credentials, story) | brand + author authority |
| `/faq` | Site-wide FAQ + inline FAQ blocks | long-tail question queries |
| `/contact` | Already exists on `/`; keep anchor + standalone | "contact / book a call" |

### Comparison / "alternatives" pages (high-citation; ~33% of AI citations)

Start with 2–3, expand later:
- `/insights/ai-consultant-vs-ai-agency`
- `/insights/fractional-head-of-ai-vs-full-time-hire`
- `/insights/ai-training-vs-doing-it-yourself`

### Cornerstone guides (start with 4–5)

Each is a definitive, sourced, extractable guide (definition-first, 40–60 word answer blocks, stats with sources and dates, FAQ block, author byline, "last updated"):
- "How to actually get your team using AI (a practical playbook)"
- "AI readiness: how to tell if your company is ready (checklist)"
- "What a fractional Head of AI does, and when you need one"
- "Building agentic workflows: how self-improving operations actually work"
- "AI training for teams in the UAE: what good looks like"

---

## 6. Home page — section-by-section

Order: **Hero → Trusted tools → What we do (4 capabilities) → Ways to work (3 tiers) → How we work (30/60/90) → Why Traq → Measured impact → CTA → Contact.**

### 6.1 Hero
- **Eyebrow:** `AI training · consulting · implementation`
- **H1 (lead):** "You've got the AI tools. We help your team actually use them."
  - *Alt:* "You've paid for AI. Let's get your team using it well."
- **Sub:** "Most teams have AI tools they barely touch. We come in, train your people, and wire AI into the way you already work — so the tools you pay for start saving real time. And we stay until your team can run it without us."
- **CTAs:** `Book a free call` (solid purple) · `See how we work` (outline).
- **Visual:** restrained light snapshot (see §4). The old ROI-calculator badge is removed.

### 6.2 Trusted tools strip
- Label: "We train your team on the tools you already use."
- Solid, flat logos: OpenAI, Anthropic, Microsoft Copilot, Google, plus others Traq genuinely works with. No marquee gradient fades.

### 6.3 What we do — Training, Consultation & Implementation (4 capabilities)
Four equal cards, flat with hairline borders:
1. **AI Training & Workshops** — "Hands-on sessions built around your team's real work. People leave knowing exactly how to use AI in their role, not just what it is."
2. **Consultation & Strategy** — "We act as your fractional Head of AI: we audit your tools and workflows, find the highest-leverage uses, and give you a clear roadmap."
3. **Implementation & Enablement** — "We wire AI into the tools and workflows you already pay for, with the guardrails to use it safely. Then we make sure the team adopts it."
4. **Agentic AI & Autonomous Infrastructure** — "We build AI agents and agentic systems that run and improve on their own. We've built a full autonomous operation for a company we run end to end, and we can build yours." *(Client kept anonymous — refer to "a company," never named.)*

Supporting line under the grid: "And when something needs building, we build it with you, not in a black box."

### 6.4 Ways to work — offer ladder (3 tiers, no prices)
Three tiers, flat cards, "Book a call for pricing":
1. **AI Readiness Audit** — a fast, fixed-scope look at where AI helps most. Pairs with the free assessment.
2. **Embedded Fractional Head of AI** — flagship. We embed with your team, set the strategy, train, implement, and stay accountable to outcomes.
3. **Ongoing Partner / Oversight** — for teams with some capability who want cadence, governance, and a senior partner on call.

### 6.5 How we work — the named framework
**The Traq AI Enablement Sprint** (name reviewable). A 90-day, time-boxed process with concrete deliverables:
- **Days 0–30 · Audit & map** — your tools, team, and workflows; where AI saves the most time.
- **Days 30–60 · Train your team** — role-specific, hands-on workshops.
- **Days 60–90 · Implement & embed** — AI wired into real workflows, with guardrails, and the team using it.
- **Then · Measure & hand over** — track adoption and impact; your team owns it. We stay as much or as little as you want.

### 6.6 Why Traq
- **Headline:** "We don't hand you a deck. We get your team doing the work." (retires "built by builders, not consultants")
- Principles (flat cards): *Done with you, not to you* · *The capability stays in your team* · *Senior operators, embedded as partners* · *Every engagement has a number on it.*

### 6.7 Measured impact (research-backed, two clearly separate blocks)
**Block A — "Why this matters" (industry stats, each cited inline):**
- **78%** — workers already bring their own AI to work, usually without guidance *(Microsoft Work Trend Index, 2024)*
- **43% → 72%** — comfort with AI nearly doubles after structured training *(Slack)*
- **79% vs 67%** — 5+ hours of training is the tipping point to regular use *(BCG, 2025)*
- **+14–34%** — productivity lift from AI, largest for less-experienced staff *(Brynjolfsson, Li & Raymond, NBER/QJE)*
- **+81%** — daily AI users report far higher job satisfaction *(Slack Workforce Index, 2025)*
- **48%** — employees name training as the #1 thing they need to adopt AI *(McKinsey, 2025)*

Sources are cited with links and dates (this itself boosts AI citation ~40%, per Princeton GEO research).

**Block B — "Our results" (first-party, visually distinct):** Nazir's own client outcomes, clearly labelled as Traq results, kept separate so industry stats are never passed off as ours. Seed with the existing three (60% less manual data entry; 3× faster lead response; +43% qualified enquiries), labelled as client outcomes. Replace/add audited numbers as they come.

### 6.8 CTA + Contact
- CTA: "In one call, we'll find where AI can save your team the most time. No deck, no obligation."
- Contact keeps the existing **quick form** and **AI chat intake**, reframed to the new offering (see §8).

---

## 7. SEO / AEO implementation

### 7.1 Technical foundations (currently missing)
- **`src/app/robots.ts`** — allow AI crawlers explicitly: `GPTBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`, `anthropic-ai`, `Google-Extended`, `Bingbot`. Allow general crawl. Optionally block training-only `CCBot`. Point to sitemap.
- **`src/app/sitemap.ts`** — list every indexable page with `lastModified`.
- **Per-page metadata** — unique title, description, canonical, OpenGraph for each new page. Replace the current build-era keywords/description with enablement-era copy.
- **One OG image** per template, generated (no gradients, on-brand).

### 7.2 Schema markup (none exists today; use the schema-markup skill)
- **Organization** (sitewide) — name, logo, `sameAs` (LinkedIn, etc.), contact.
- **LocalBusiness / ProfessionalService** — on `/ai-consulting-uae`, with UAE address/area served and phone (`+971 50 868 7196`).
- **Service** — one per service page.
- **FAQPage** — on `/faq` and inline FAQ blocks on key pages.
- **Article / BlogPosting** — on every guide, with `author` (Person), `datePublished`, `dateModified`.
- **Person** — founder/author entity on `/about`, linked from guide bylines (E-E-A-T).
- **BreadcrumbList** — across nested pages.

### 7.3 On-page extractability (apply to every page)
- Lead each section with a direct, standalone answer (40–60 words).
- Use H2/H3 that match how people phrase queries ("What does a fractional Head of AI do?").
- Comparison content as tables, not prose.
- Stats with source + date inline.
- An FAQ block (real questions) near the foot of each key page.
- Visible "Last updated: [date]" on guides.
- Named author with credentials on guides.

### 7.4 Off-page presence (Nazir to execute — this earns the AI citations)
On-site we build link-worthy assets (sourced guides, the free assessment, comparison pages). Off-site checklist, delivered as a doc:
- Google Business Profile (UAE) — verified, categorized, with services.
- B2B directories with strong domain authority: Clutch, GoodFirms, DesignRush, plus UAE business directories.
- LinkedIn company page (complete, active), Crunchbase profile.
- Get listed in "best AI consultants / AI training UAE" roundups (outreach with a media kit).
- Authentic Reddit/Quora answers on AI-adoption questions; YouTube how-to clips (cited by AI Overviews).
- Wikipedia parked as long-term (notability bar not yet met).

### 7.5 Monitoring
Set up a simple monthly manual check (20 priority queries across ChatGPT, Perplexity, Google) logged in a sheet. Optional tool later (Otterly/Peec). Submit sitemap to Google Search Console.

---

## 8. Contact backend — verification (the lead pipeline)

The code path is sound: `/api/intake/quick` and `/api/intake/submit` send a team email to `TEAM_INTAKE_EMAIL` and a confirmation to the lead via Resend; `/api/intake/chat` runs the Claude intake. Locally, `TEAM_INTAKE_EMAIL` and `FROM_EMAIL` both point to nazir@traqcollective.com and all keys are set.

**Work to do:**
1. **Reframe intake content** — update `SERVICES_OF_INTEREST` (in `src/lib/intake/types.ts`), `SERVICE_DROPDOWN_OPTIONS` (in `src/lib/constants.ts`), and the AI intake system prompt (`src/lib/intake/prompt.ts`) to the new offering: AI Training, Consultation & Strategy, Implementation, Agentic AI, plus "Just exploring." Re-theme the confirmation/team email templates' wording.
2. **Verify production env** — confirm `RESEND_API_KEY`, `ANTHROPIC_API_KEY`, `TEAM_INTAKE_EMAIL=nazir@traqcollective.com`, `FROM_EMAIL`, Turnstile, and Upstash keys are set in the Netlify dashboard (not just `.env.local`, which is git-ignored and local-only).
3. **Verify Resend sending domain** — confirm `traqcollective.com` is a verified domain in Resend so `FROM_EMAIL` sends don't bounce.
4. **Live end-to-end test** — submit a real test lead on the deployed site and confirm the email lands in nazir@traqcollective.com. Report the result. (User approved a live test.)

---

## 9. ROI calculator — archive

- Remove the `/automation-roi-calculator` route, the hero "New" badge link to it, and any nav references, so it is not in the shipped build.
- Move `src/app/automation-roi-calculator/*` to an archived location (e.g. `docs/_archive/automation-roi-calculator/` or a clearly-marked non-routed folder) so the code is recoverable.
- Also remove the unused `/gooey` demo route if it is not intended for production.
- The **AI Readiness Assessment** (`/ai-readiness`) replaces it as the top-of-funnel magnet.

---

## 10. Out of scope (for now)

- "Learn about us with AI" prompt buttons — decided against (signalling, not real AEO). Real AEO handled via §7.
- Public pricing numbers — offer ladder shows tiers only, pricing via call.
- Wikipedia page — long-term.
- Paid ads, email nurture sequences — separate effort.

---

## 11. Phasing (so it ships in deployable milestones)

**Phase 1 — Reframe + light redesign + lead pipeline (deployable).**
Light/gradient-free design system; rebuild home sections with new copy and 4 capabilities, offer ladder, framework, measured impact, why; reframe contact intake; archive ROI calculator; technical AEO foundations (robots, sitemap, base metadata, Organization + FAQ schema on home); verify production email + live test. Outcome: a credible, friendly, on-message site that captures leads.

**Phase 2 — SEO surface (ranking).**
Build `/services` hub + 4 service pages, `/fractional-head-of-ai`, `/ai-consulting-uae`, `/about`, `/faq`. Per-page metadata, Service/LocalBusiness/Person/Breadcrumb schema, internal linking. Submit to Search Console.

**Phase 3 — Citation engine + magnet.**
`/insights` with 4–5 cornerstone guides and 2–3 comparison pages (Article/FAQ schema, bylines, dates); build the `/ai-readiness` interactive assessment; deliver the off-page presence checklist.

Each phase ends with `npm run typecheck && npm run lint` clean (per global build rules) and a Netlify deploy returning the shareable URL.

---

## 12. Success criteria

- Site reads as a credible business: light, gradient-free, no AI-cliché copy or UI.
- Copy is friendly and ICP-targeted; passes a stop-slop pass (no filler, active voice, no em dashes, specifics over vagueness).
- Every page routes to "Book a call"; no dead ends; all nav/links work.
- A live test submission reliably reaches nazir@traqcollective.com.
- Technical AEO in place: robots allowing AI bots, sitemap, schema on key pages, extractable content patterns.
- Dedicated pages exist for each priority query cluster (UAE + global), positioned to rank and be cited.
- typecheck + lint pass; deployed to Netlify.

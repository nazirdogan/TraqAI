# Traq Collective — Site Reframe & SEO/AEO Rebuild

**Date:** 2026-06-10
**Owner:** Nazir
**Repo:** `~/Downloads/TraqAI/site` (the deployed copy)
**Hosting:** **Vercel** — project `nazirdogans-projects/traqcollective`, custom domain `traqcollective.com` (DNS at GoDaddy → Vercel). Auto-deploys from GitHub `nazirdogan/TraqAI` on push. The `netlify.toml` and `@netlify/plugin-nextjs` in the repo are vestigial from a prior Netlify setup and should be removed. (This overrides the global "deploy to Netlify" default for this project.)
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

### Hero visual (decided)

A **restrained, light, gradient-free snapshot** panel showing an "AI adoption" view (tools activated, team confidence, workshops delivered, a simple 90-day roadmap). Solid colors, hairline borders.

**Animation is welcome** — tasteful motion (subtle entrance, a counting number, a gentle reveal) is fine and encouraged. The hard rule is **no gradients**, anywhere. The old dark/mesh/glow/orbital decorative layer and the 3D-tilt scroll effect are removed; clean motion on a light surface replaces them.

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
| `/book` | Embedded scheduler (Cal.com/Calendly) — primary CTA target | "book a call" |
| `/contact` | Already exists on `/`; keep anchor + standalone | "contact / book a call" |
| `/privacy`, `/terms` | Legal + legitimacy; linked in footer | — |

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

Order: **Hero → Trusted tools → Sound familiar? (problem) → What we do (4 capabilities) → How we work (30/60/90) → Ways to work (offer ladder + risk reversal) → Meet Nazir (founder) → Proof (anonymized case studies + testimonials) → Why Traq → Measured impact (industry stats) → CTA / Book a call → Contact.**

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

### 6.2b Sound familiar? (problem section)
A short, empathetic grid that names the buyer's real frustrations before we pitch (ChiefAIOfficer uses this to strong effect; it also matches "why isn't my team using AI" search queries). Friendly, not preachy. Four cards:
- "You pay for ChatGPT and Copilot, but most of the team still doesn't touch them."
- "You know AI could save hours, but nobody has time to figure out where."
- "Every week there's a new tool, and it's hard to tell what's worth it."
- "You don't want to fall behind while competitors get ahead."
Closing line: "If any of these sound like you, you're in the right place. Here's how we help."

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

**Risk reversal + scarcity** (a band under the tiers, friendly tone): fixed-scope so you know what you're getting; we start by showing value before any long commitment; you keep everything we build and your team learns to run it. Light scarcity to protect positioning: "We take on a limited number of new partners each quarter so every team gets senior attention."

### 6.5 How we work — the named framework
**The Traq AI Enablement Sprint** (name reviewable). A 90-day, time-boxed process with concrete deliverables:
- **Days 0–30 · Audit & map** — your tools, team, and workflows; where AI saves the most time.
- **Days 30–60 · Train your team** — role-specific, hands-on workshops.
- **Days 60–90 · Implement & embed** — AI wired into real workflows, with guardrails, and the team using it.
- **Then · Measure & hand over** — track adoption and impact; your team owns it. We stay as much or as little as you want.

### 6.6 Why Traq
- **Headline:** "We don't hand you a deck. We get your team doing the work." (retires "built by builders, not consultants")
- Principles (flat cards): *Done with you, not to you* · *The capability stays in your team* · *Senior operators, embedded as partners* · *Every engagement has a number on it.*

### 6.6b Meet Nazir (founder-led credibility)
A warm, personal block on the home page: photo, name, and a short credibility story in the first person. The angle: "You work directly with a senior operator who has built this in the real world, not a junior analyst on a markup." Reinforces the boutique advantage and feeds E-E-A-T (links to `/about`, backed by `Person` schema). Friendly and direct, e.g. "Hi, I'm Nazir. I build AI systems and train teams to use them every day, including a full autonomous operation I run end to end. I'll be the one you work with."

### 6.7 Proof — anonymized case studies + testimonials
The strongest conversion device in this market. Built from **real outcomes, anonymized** (no client names; the agentic client stays unnamed). Format:
- **2–3 before/after case studies**, each: industry + size descriptor ("a UAE logistics company, ~80 staff"), the problem, what we did, and the number. Seed from existing results: 60% less manual data entry; 3× faster lead response; +43% qualified enquiries.
- **Short testimonials** rendered role-level where names can't be used ("Operations Director, logistics"), designed so real named quotes + photos drop in later without a redesign.
- Designed to upgrade to named testimonials + logos the moment they're available.

### 6.9 Measured impact — why this matters (industry stats, each cited inline)
Industry research only here (first-party results live in §6.7, kept separate so industry stats are never passed off as ours):
- **78%** — workers already bring their own AI to work, usually without guidance *(Microsoft Work Trend Index, 2024)*
- **43% → 72%** — comfort with AI nearly doubles after structured training *(Slack)*
- **79% vs 67%** — 5+ hours of training is the tipping point to regular use *(BCG, 2025)*
- **+14–34%** — productivity lift from AI, largest for less-experienced staff *(Brynjolfsson, Li & Raymond, NBER/QJE)*
- **+81%** — daily AI users report far higher job satisfaction *(Slack Workforce Index, 2025)*
- **48%** — employees name training as the #1 thing they need to adopt AI *(McKinsey, 2025)*

Sources cited with links and dates (this alone boosts AI citation ~40%, per Princeton GEO research).

### 6.10 CTA + Book a call + Contact
- CTA copy: "In one call, we'll find where AI can save your team the most time. No deck, no obligation."
- **Primary action: an embedded scheduler** (Cal.com or Calendly) so visitors pick a time and book in one step. This is the main "Book a call" target sitewide.
- **Fallbacks kept:** the existing **quick form** and **AI chat intake**, reframed to the new offering (see §8), for people who'd rather message first.

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
2. **Set production env on Vercel — KNOWN BROKEN, fix first.** Verified 2026-06-10: the Vercel `traqcollective` project has **zero** environment variables in production, so the live contact form fails on every path (Resend/Anthropic/Turnstile all unset) and leads are being lost. Set `RESEND_API_KEY`, `ANTHROPIC_API_KEY`, `TEAM_INTAKE_EMAIL=nazir@traqcollective.com`, `FROM_EMAIL`, the two Turnstile keys, and the two Upstash keys on Vercel (production scope), sourcing the verified-correct values from local `.env.local`. The `NEXT_PUBLIC_` Turnstile key is build-time/inlined, so a **redeploy is required** after setting env. (Resend domain `traqcollective.com` is already verified + sending-enabled, so delivery will work once keys are set.)
3. **Verify Resend sending domain** — confirm `traqcollective.com` is a verified domain in Resend so `FROM_EMAIL` sends don't bounce.
4. **Live end-to-end test** — submit a real test lead on the deployed site and confirm the email lands in nazir@traqcollective.com. Report the result. (User approved a live test.)
5. **Embed the scheduler** — add a Cal.com/Calendly embed as the primary "Book a call" target (a dedicated `/book` route or modal, linked from every CTA). Needs Nazir's scheduler link, or set up a Cal.com account. Track the booking as a conversion event (see §8b).

## 8b. Analytics, conversion tracking & legal

The site's job is inbound, so we measure it and meet basic business/legal expectations.

- **Analytics:** add GA4 (or Plausible if Nazir prefers privacy-first). Fire conversion events on: scheduler booking completed, quick-form submit, AI-chat lead submitted, and primary-CTA clicks. This is what tells us which pages and queries actually drive calls.
- **Search Console:** verify the domain, submit the sitemap, monitor query performance.
- **Legal pages:** add `/privacy` and `/terms` (and a short cookie note if GA4 is used). A proper business collecting data through forms and analytics needs these; they also add quiet legitimacy and are linked in the footer.

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
Light/gradient-free design system; rebuild all home sections with new copy: hero, trusted tools, problem ("sound familiar?"), 4 capabilities, 30/60/90 framework, offer ladder + risk reversal, founder block, proof (anonymized case studies), why, measured impact (industry stats); reframe contact intake; embed the scheduler; add GA4 + conversion events; add `/privacy` + `/terms`; archive ROI calculator; technical AEO foundations (robots, sitemap, base metadata, Organization + FAQ schema on home); verify production email + live test. Outcome: a credible, friendly, on-message site that captures and books leads.

**Phase 2 — SEO surface (ranking).**
Build `/services` hub + 4 service pages, `/fractional-head-of-ai`, `/ai-consulting-uae`, `/about`, `/faq`. Per-page metadata, Service/LocalBusiness/Person/Breadcrumb schema, internal linking. Submit to Search Console.

**Phase 3 — Citation engine + magnet.**
`/insights` with 4–5 cornerstone guides and 2–3 comparison pages (Article/FAQ schema, bylines, dates); build the `/ai-readiness` interactive assessment; deliver the off-page presence checklist.

Each phase ends with `npm run typecheck && npm run lint` clean (per global build rules) and a Vercel deploy returning the shareable URL.

---

## 12. Assets / inputs needed from Nazir

These unblock specific pieces; the build proceeds with sensible placeholders where they're missing, to be swapped in later.

- **Scheduler link** — a Cal.com or Calendly URL for the booking embed (or a go-ahead for me to set up a Cal.com account).
- **Founder block** — a photo of Nazir and a couple of credibility facts (background, what you've built) for the "Meet Nazir" block and `/about`.
- **Case studies** — the real (anonymizable) details behind the three results: rough industry, company size, the problem, and what was done. Plus any other client outcomes you want to feature.
- **Analytics preference** — GA4 (default) or Plausible.
- **Framework name** — confirm "The Traq AI Enablement Sprint" or propose an alternative.
- **Exact brand purple** — confirm the token from `~/Downloads/TraqAI/brand-kit` to use as the solid accent.

## 13. Success criteria

- Site reads as a credible business: light, gradient-free, no AI-cliché copy or UI.
- Copy is friendly and ICP-targeted; passes a stop-slop pass (no filler, active voice, no em dashes, specifics over vagueness).
- Every page routes to "Book a call"; no dead ends; all nav/links work.
- A live test submission reliably reaches nazir@traqcollective.com.
- Technical AEO in place: robots allowing AI bots, sitemap, schema on key pages, extractable content patterns.
- Dedicated pages exist for each priority query cluster (UAE + global), positioned to rank and be cited.
- typecheck + lint pass; deployed to Vercel.

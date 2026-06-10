# Scroll-Journey UI + Embedded AI Partner Reframe — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a scroll-driven "guided spine" that ties Problem → What we do → How we work → the 90-day roadmap into one journey, and reframe "fractional Head of AI" into our identity **"Embedded AI Partner"** (while still capturing + intercepting that search traffic).

**Architecture:** Next.js 14 App Router site in `~/Downloads/TraqAI/site`, branch `reframe/phase2` (Phase 1 live + Phase 2 pages built). Home is flat sibling `<section>`s in `src/app/page.tsx`; sections use framer-motion. The journey is an **overlay**: wrap Problem+Services+Process in a relative container and render a client `JourneySpine` (SVG path, scroll-progress draw-on) in the centre gutter / left rail, with the `Process` roadmap re-rendered as the spine's weaving "landing." The reframe is systematic copy edits across home data, nav/footer, the flagship page, and the other Phase 2 pages.

**Tech Stack:** Next.js 14, TypeScript (strict), Tailwind, framer-motion (`useScroll`/`useTransform`/`useReducedMotion`), SVG.

**Spec:** `docs/superpowers/specs/2026-06-10-journey-ui-and-embedded-ai-partner.md`

**Verification model (no test runner in repo — do NOT add one):** each task ends with `npm run typecheck && npm run lint && npm run build` clean. Visual/scroll behaviour and no-overlap are verified on a **Vercel preview** (animation can't be unit-tested); routes with `curl -sI`. Stop-slop: no em dashes in user-facing copy, no banned words.

**Design constraints (carry into every task):** light premium white, **zero gradients**, solid `--traq-purple #5B3FE4` + pale `#E3DCFA` only, Inter, hairline borders `#ECECEC`. Respect `prefers-reduced-motion`. Nodes/labels must never overlap headings/buttons/body — verified at 375 / 768 / 1280px. The spine must not add meaningful scroll.

**Branch:** already on `reframe/phase2`. Commit after each task; do NOT push or deploy (the controller handles preview + production).

---

## Task 1: The guided-spine journey (component + home integration + roadmap re-render)

Build the whole journey as one cohesive frontend unit so it's visually unified. **Use the frontend-design skill.**

**Files:**
- Create: `src/components/journey/JourneySpine.tsx` (client; the scroll-driven SVG spine + section nodes)
- Modify: `src/app/page.tsx` (wrap Problem+Services+Process in a relative journey container hosting the spine)
- Modify: `src/components/sections/Process.tsx` (re-render the 30/60/90 roadmap as the spine's weaving "landing" with offset label cards)
- Reference: `src/components/sections/Problem.tsx` (`#problem`, `max-w-5xl`, 2-col grid), `src/components/sections/Services.tsx` (`#services`, `max-w-7xl`, 4-col grid), `src/lib/constants.ts` (`PROCESS_STEPS`, `FRAMEWORK_NAME`)

- [ ] **Step 1: Build `JourneySpine.tsx`**

A client component that renders an absolutely-positioned SVG overlay filling its relative parent (the journey wrapper). Behaviour:
- A single vertical, **gently curved (serpentine)** path down the centre column (desktop) / a thin left rail (mobile). Two stacked paths: a **pale base** (`#E3DCFA`) and a **purple progress** path (`#5B3FE4`) revealed via `stroke-dashoffset` driven by `useScroll({ target: wrapperRef })` → `scrollYProgress` → `useTransform`. A small purple **dot** marker sits at the progress frontier (`offsetDistance`/`motion` along the path, or a transformed `cy`).
- Accept a `nodes` prop (or render 3 fixed nodes) for **Problem / What we do / How we work**, each a white-fill + purple-ring circle that fills solid once passed. Position nodes in the **vertical whitespace gaps between sections** (not over content), label set beside each node with clear spacing.
- `useReducedMotion()`: when true, render base+full purple path statically with all nodes solid, **no scroll animation, no travelling dot**.
- Pure SVG + solid colours; **no gradients**. `aria-hidden="true"` on the decorative layer.
- Must be robust to layout: the SVG scales to the wrapper via `viewBox` + `preserveAspectRatio`, and the line lives in the centre gutter so it sits between the section grid columns, never across text.

- [ ] **Step 2: Integrate into `page.tsx`**

Wrap the three sections in a relative container and mount the spine:
```tsx
<div className="relative">
  <JourneySpine />
  <Problem />
  <Services />
  <Process />
</div>
```
Keep Hero, TrustedBy above and Offers… below outside the wrapper (journey scope is Problem→roadmap only). Ensure the spine overlay has `pointer-events-none` and a `z-index` below section content so it never blocks clicks or covers text.

- [ ] **Step 3: Re-render the `Process` roadmap as the weaving landing**

Replace the current 4-col grid + `.process-rail` with a **compact, gently weaving descending path** (the spine continues into it): the four `PROCESS_STEPS` (`0–30 Audit & map`, `30–60 Train your team`, `60–90 Implement & embed`, `90+ Measure & hand over`) as nodes along a short serpentine path, **each label a card offset from its node** with a clear connector + gap (alternating sides is fine). Keep it tight (no big sprawl → no extra scroll). Solid purple nodes, `90+` as the pale/outline "future" node. Keep the `id="how-we-work"`, eyebrow, `FRAMEWORK_NAME` title, and intro. framer-motion reveal on scroll; reduced-motion → static.

- [ ] **Step 4: No-overlap + no-extra-scroll pass**

In `npm run dev`, at widths 375 / 768 / 1280: confirm no node or label overlaps any heading, button, or body text; the spine sits in the gutter/rail; the page is not materially longer than before. Adjust node positions/label offsets until clean.

- [ ] **Step 5: Verify + commit**

Run: `npm run typecheck && npm run lint && npm run build` (all pass). Commit: `feat(journey): scroll-driven guided spine through Problem → What we do → How we work → roadmap`.

---

## Task 2: "Embedded AI Partner" reframe — home data, nav, footer, FAQ, metadata, intake

Systematic identity change. Keep all routing/slugs working; only labels + copy change here.

**Files:**
- Modify: `src/lib/constants.ts` — `SERVICES` consultation tagline (line ~28) `'Your fractional Head of AI.'` → `'Your embedded AI partner.'`; `OFFER_TIERS` (line ~95) tier name `'Embedded Fractional Head of AI'` → `'Embedded AI Partner'` and update its `who`/`includes` to partner framing (e.g. who: `'Our flagship.'`, includes keep but ensure "embedded with your team", "we work with you, not for you", "accountable to outcomes"); home `FAQ` data entry (line ~181) — keep the question wording **"What is a fractional Head of AI?"** (capture term) but reframe the **answer** to lead with the partner framing: that it's how people search for senior part-time AI help, and Traq delivers it as an *embedded partner who works with your team, not a hire/role*.
- Modify: `src/lib/metadata.ts` — keep "fractional Head of AI / Chief AI Officer" in keywords (search), reframe descriptive copy toward "embedded AI partner / AI transformation partner".
- Modify: `src/lib/intake/prompt.ts` — intro framing references "embedded AI partner" (keep tool schema/fields).
- Modify: `src/components/layout/Navbar.tsx`, `src/components/layout/Footer.tsx` — any link **label** "Fractional Head of AI" → "Embedded AI Partner" (link target stays `/fractional-head-of-ai`).
- Modify: `src/components/sections/FAQ.tsx` if it hardcodes the term.

- [ ] **Step 1: Apply the edits above.** Positioning language rules: "with you, not for you", "partner and consultants, not a new hire", "embedded with your team". No em dashes, no banned slop words.

- [ ] **Step 2: Verify + commit**

`npm run typecheck && npm run lint && npm run build`. Commit: `feat(reframe): Embedded AI Partner identity across home, nav, footer, intake`.

---

## Task 3: Flagship page capture + intercept + term updates across Phase 2 pages

Reframe `/fractional-head-of-ai` to **lead with Embedded AI Partner**, **capture** the "fractional Head of AI / Chief AI Officer" search, and **intercept** the "do I need to hire one?" crowd — keeping the slug and the term for SEO.

**Files:**
- Modify: `src/app/fractional-head-of-ai/page.tsx`
- Modify (term/label only): `src/app/services/page.tsx`, `src/app/services/ai-consulting/page.tsx`, `src/app/services/agentic-ai/page.tsx`, `src/app/ai-consulting-uae/page.tsx`, `src/app/about/page.tsx`, `src/app/faq/page.tsx`
- Reference: `src/lib/seo/schema.ts` (update `person()`/service naming only if it hardcodes "fractional Head of AI")

- [ ] **Step 1: Reframe the flagship hero + intro (keep slug + capture term)**

Keep `PATH = '/fractional-head-of-ai'` and `metadata` keywords including "fractional Head of AI / Chief AI Officer" (search). Change the visible lead:
- `eyebrow`: `'Flagship engagement'`
- `h1`: `'Your embedded AI partner'`
- `intro` (40–60 words, capture + reframe): e.g. *"Looking for a fractional Head of AI or Chief AI Officer? Here's a better fit. Traq embeds as your AI partner: we set the strategy, choose the tools, lead the rollout and put guardrails in place, working alongside your team and accountable to outcomes. You get senior AI leadership without adding a full-time hire."*
- Keep one H2 **"What is a fractional Head of AI, and do you need one?"** (capture/definition) reframed to clarify Traq does it *as a partner, not an employee*.

- [ ] **Step 2: Add the intercept section + comparison table**

Add an H2 **"Hiring a Head of AI vs an embedded AI partner"** with a real `<table>` comparing: time-to-value, cost, risk, flexibility, and "capability stays in your team". Add an FAQ entry **"Do I need to hire a Chief AI Officer or Head of AI?"** answered with the partner alternative. Mirror new FAQs into the `FaqPageJsonLd`. Keep `Service` + `BreadcrumbList` schema; ensure JSON-LD still mirrors visible content.

- [ ] **Step 3: Update term references on the other Phase 2 pages**

Where those pages show "fractional Head of AI" as a **link label** or identity, change to "Embedded AI Partner" (links to `/fractional-head-of-ai` stay). Where they reference it as a *search term* in FAQ/comparison context, keep the phrase but ensure the framing is partner-not-role. No dead links.

- [ ] **Step 4: Verify + commit**

`npm run typecheck && npm run lint && npm run build`; `npm run dev` then `curl -sI localhost:3000/fractional-head-of-ai` → 200, and view-source confirms the page still carries the "fractional Head of AI" term in a heading + FAQ + schema. Commit: `feat(reframe): flagship capture+intercept page + term updates across Phase 2 pages`.

---

## Task 4: Full verification + preview

**Files:** none (verification only).

- [ ] **Step 1: Clean build**

`cd ~/Downloads/TraqAI/site && rm -rf .next && npm run typecheck && npm run lint && npm run build` — all pass.

- [ ] **Step 2: Sweeps**

Grep src for: any em dash in user-facing copy (allow the TeamLeadEmail empty-value glyph), any gradient/mesh/glow remnant, and any remaining "fractional Head of AI" used as **identity** (vs the intentional capture term on the flagship page). Confirm every nav/footer link target exists.

- [ ] **Step 3: Commit any fixes**

Commit: `fix: journey + reframe verification pass`. (Controller then deploys a preview for visual/scroll review, iterates, and promotes to production with the Phase 2 deploy.)

---

## Out of scope
Extending the spine beyond Problem→roadmap; restructuring other sections; new routes; pricing; Phase 3 content.

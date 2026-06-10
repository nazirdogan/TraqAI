# Scroll "Journey" UI + "Embedded AI Partner" Reframe — Design

**Date:** 2026-06-10
**Owner:** Nazir
**Branch:** `reframe/phase2` (sits on top of Phase 1 [live] + Phase 2 [built, not yet deployed]). Ships with the Phase 2 production deploy.
**Status:** Approved in brainstorm (visual companion + research). Ready for implementation plan.

---

## Part A — The scroll "journey" (guided spine)

### Goal
As the user scrolls from the **Problem** section downward, a connecting "spine" makes the page feel like a guided journey: *here's your problem → here's what we do → here's how we do it → here's the 90-day path*. It should feel considered and premium, not basic — but stay clean and calm.

### Behaviour (decided — Option A "Guided spine", refined)
1. **A connecting line** (SVG path) runs from the Problem section down into the **How We Work** section's 90-day roadmap, threading **Problem → What we do (Services) → How we work (Process)**. The line is **gently curved/serpentine**, not ruler-straight.
2. **Draws on as you scroll.** Stroke reveal tied to scroll progress: the portion behind the scroll position is **solid `--traq-purple` (#5B3FE4)**; the path ahead is **pale (`#E3DCFA`)**. A small dot/marker travels along the line at the scroll frontier.
3. **A node marker per section anchor** (Problem, What we do, How we work). Node = white fill, purple ring (the "purple circle with white middle"). A node lights up (fills solid) as its section is reached.
4. **The 90-day roadmap is the spine's "landing."** Rendered as a **compact, gently weaving descending path** (NOT a single straight horizontal row) with the four milestones as nodes: `0–30 Audit & map`, `30–60 Train your team`, `60–90 Implement & embed`, `90+ Measure & hand over`. Each milestone's **label is a card offset from its dot** with a clear connector and gap.

### Hard rules (the two things the user flagged + brand rules)
- **Nodes never cover text.** Each node sits in the **whitespace gap** above its section (or out in the clear centre gutter), with its label set **beside it with clear spacing** — never on a heading, button, or body copy. Same for roadmap milestone labels: offset from the dot, readable, no overlap. Verify at 375px, 768px, 1280px.
- **No extra scroll.** The spine lives in the whitespace that already exists between sections and in the centre gutter; it must not lengthen the page. The roadmap stays compact (short weave, tight spacing).
- **No gradients.** Solid `#5B3FE4` + pale `#E3DCFA` only. Light, flat, on-brand, Inter.
- **Respects `prefers-reduced-motion`:** no draw/scroll animation when reduced motion is set — render the line + nodes statically (still no overlap).
- **Responsive:** on narrow screens the spine sits in a thin left margin/gutter (or simplifies to a left rail) so it never crosses content; nodes/labels never collide.

### Scope
- Applies to **Problem → Services → Process(roadmap)** only. Sections below the roadmap (Offers, Founder, Proof, etc.) are unchanged.
- The connective layer is **additive/overlay** — it does not restructure existing section content beyond keeping a clear centre gutter and re-rendering the Process roadmap as the weaving path.

### Implementation approach (for the plan)
- A reusable **`JourneySpine`** mechanism driven by scroll progress (framer-motion `useScroll`/`useTransform`, or IntersectionObserver + scroll progress) rendering an SVG path with `stroke-dashoffset` tied to progress; pale base path + purple progress path + travelling dot.
- Section nodes anchored to the Problem/Services/Process boundaries, positioned in gutters/gaps.
- **`Process.tsx`** roadmap re-rendered as the weaving milestone path with offset label cards (replaces the current basic row).
- Reuse Phase-1 tokens/components; keep everything flat.

---

## Part B — "Embedded AI Partner" reframe (capture + reframe)

### Decision
Retire **"fractional Head of AI"** as our *identity*. We are an **Embedded AI Partner** — partner, consultants, strategists who **work *with* you, not *for* you**. Not a new hire, not a role, not an employee. Borrow the embedded/hands-on energy of the "forward-deployed" model (a 2025-trending, 800%+ growth term) **without the label** (it implies an employee/engineer).

### Search strategy (decided: "capture + reframe")
"Fractional Head of AI / fractional Chief AI Officer" is a real, high-intent, growing **search** term (mid-market buyers searching for part-time strategic AI leadership at ~20–40% of a full-time exec). We **keep ranking for it** but **reframe it to our partner offer**:
- Keep the **`/fractional-head-of-ai` slug**, plus the term in a **heading + FAQ + schema (`Service`/`FAQPage`) + meta** on that page (discovery, not identity).
- The page **leads with "Embedded AI Partner"** and explicitly reframes: *"Looking for a fractional Head of AI? Here's a better fit — an embedded AI partner who works with your team, not for it."*
- Add **"AI transformation partner"** / **"AI consulting partner"** as secondary target terms (partner-framed and searched).

### Positioning language rules
- "With you, not for you." "Your partner and consultants, not a new hire." "We build the strategy with you." "Embedded with your team, accountable to outcomes." Avoid any phrasing that implies Traq becomes an employee or fills a headcount/role.

### Files to update (term inventory — 14 files found)
- **Home / shared data:** `src/lib/constants.ts` (OFFER_TIERS tier "Embedded Fractional Head of AI" → "Embedded AI Partner" + partner description; SERVICES consultation tagline "Your fractional Head of AI" → "Your embedded AI partner"), `src/lib/metadata.ts` (keep fractional terms as keywords for search, reframe descriptive copy), `src/lib/intake/prompt.ts` (intro framing), `src/components/sections/FAQ.tsx`.
- **Nav/footer:** `src/components/layout/Navbar.tsx`, `src/components/layout/Footer.tsx` — link **label** → "Embedded AI Partner" (link target/slug may stay `/fractional-head-of-ai`).
- **Phase 2 flagship page:** `src/app/fractional-head-of-ai/page.tsx` — H1/hero leads with "Embedded AI Partner" + reframe line; keep a "What is a fractional Head of AI, and do you need one?" H2/FAQ/schema for search; keep slug. Update `src/lib/seo/schema.ts` `person()`/service naming if it hardcodes the term.
- **Other Phase 2 pages referencing the term:** `src/app/services/page.tsx`, `src/app/services/ai-consulting/page.tsx`, `src/app/services/agentic-ai/page.tsx`, `src/app/ai-consulting-uae/page.tsx`, `src/app/about/page.tsx`, `src/app/faq/page.tsx` — update link **labels/body** to "Embedded AI Partner," but where they reference the *search term* in FAQ/comparison context, keep it as the reframed phrase. Internal links to `/fractional-head-of-ai` stay valid.

---

## Success criteria
- Journey reads as a guided path from Problem → roadmap; nodes/labels never overlap text (checked at 375/768/1280px); adds no meaningful scroll; reduced-motion safe; zero gradients.
- "Embedded AI Partner" is the consistent identity across home, nav, footer, and all pages; "with you, not for you" framing throughout.
- The flagship page still ranks for "fractional Head of AI / Chief AI Officer" (term retained in heading + FAQ + schema + slug + meta) while leading with partner positioning; "AI transformation partner" added as a secondary target.
- `npm run typecheck && npm run lint && npm run build` clean; previewed on Vercel so the real scroll motion can be judged before production.

## Out of scope
- Extending the spine beyond Problem→roadmap; restructuring other sections; new routes; pricing changes.

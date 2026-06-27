# Mobile Overhaul — Homepage — Design

Date: 2026-06-27
Branch: `mobile-overhaul`
Scope: Homepage (`src/app/page.tsx`) and shared layout, **mobile + tablet only** (`< lg` / below 1024px). Desktop (`≥ lg`) is visually unchanged.

## Goal

1. Remove the left-edge "journey line" on phones and tablets; keep it on desktop.
2. Make the phone experience feel tighter, more intentional, and more conversion-focused, while staying 100% inside the existing Traq brand.

Stay in brand: Inter, purple `#5B3FE4` (`traq-purple`), premium white, flat hairline-bordered cards with soft `shadow-card`, subtle notebook motif. This is a restyle/optimization pass, **not** a new identity. No copy rewrites.

## Non-goals

- No change to desktop layout, spacing, or behavior at `≥ lg`.
- No content/copy changes (layout, spacing, and one new CTA control only).
- No backend, form-logic, analytics, or SEO/schema changes.
- No deploy. Repo auto-deploys from `main` on push; all work stays on the `mobile-overhaul` branch until Nazir approves a merge/deploy.

## Changes

### 1. Hide the journey line below `lg`
- `src/components/journey/JourneySpine.tsx`: root wrapper gains `hidden lg:block` (currently `pointer-events-none absolute inset-0 z-20`).
- Effect: the 2px purple rail, scroll dot, and stage rings disappear `< 1024px`; desktop unchanged.
- The component already no-ops gracefully when not measured; `display:none` on mobile means its effects/observers simply don't drive a visible rail.

### 2. Sticky mobile "Book a call" bar (new component)
- New `src/components/layout/MobileCtaBar.tsx`, rendered once in the root layout (`src/app/layout.tsx`), `lg:hidden`.
- Single full-width primary pill: **"Book a free call →"** → `/book`. No secondary action.
- Style: fixed to bottom, premium-white surface with `backdrop-blur`, hairline top border (`border-border-subtle`), `shadow-card`, rounded pill inside a padded container. Respects iOS safe area via `pb-[env(safe-area-inset-bottom)]`.
- Visibility: hidden while the hero is on screen; fades/slides in after the user scrolls past the hero (so it never duplicates the hero CTA on the first screen). Implemented with an `IntersectionObserver` on the hero (`#top`) or a scroll threshold; respects `prefers-reduced-motion` (no slide, just show/hide).
- Fires the existing `track('cta_book_click', { location: 'mobile_sticky' })` analytics event for parity with other CTAs.
- No-content-hidden rule: `<main>` (or the page) gets bottom padding on mobile (`pb-24 lg:pb-0` or equivalent) so the bar never covers the footer or last section.

### 3. Hero — tighter, stronger first screen (`src/components/sections/Hero.tsx`)
- Reduce the mobile top padding so the headline lands sooner under the fixed navbar (`pt-32` → ~`pt-28` on mobile; `sm:`/`lg:` values unchanged).
- Tighten the vertical rhythm between eyebrow → `h1` → paragraph → CTA group on mobile so the primary buttons sit higher (less scroll to first action). Adjust `mt-*` only at the base breakpoint.
- Eyebrow: allow cleaner wrapping on narrow widths (no overflow/awkward break).
- 89% adoption chart card: stays below the copy on mobile (as today); minor mobile padding trim so it reads as a clean contained card. No data/animation changes.

### 4. Global mobile section rhythm
- Sections currently use `py-20` (80px) at the base (phone) breakpoint, ×14 sections = an over-long scroll.
- Reduce the **base** (phone, `< 640`) vertical padding to ~`py-14`/`py-16` per section while leaving `sm:`/`md:`/`lg:` values intact (tablet + desktop unchanged).
- Affected section files: `Problem`, `Services`, `Process`, `Offers`, `Founder`, `WhyUs`, `Proof`, `Impact`, `FAQ`, `CTABanner`, `ContactIntake` (+ `TrustedBy` `py-14` already fine). Mechanical, per-file class edits.

### 5. Targeted per-section polish (mobile only)
- **LocalBand**: tighten the stacked 3-row layout so it reads as one neat credibility card rather than three loose rows.
- **Services / Offers / Proof / Impact**: consistent stacked-card padding + corner-radius rhythm so single-column cards feel intentional and uniform.
- **ContactIntake**: reduce the chat panel's fixed height on small screens (`h-[540px]` → smaller on mobile) and tighten form field spacing so the section isn't a giant block. Keep both Quick form and Chat modes and all logic.
- **Footer**: tighten the mobile stack spacing.

## Guardrails / acceptance

- Desktop (`≥ 1024px`) renders identically to before (every change is breakpoint-scoped to base/`sm`/`md`, or `lg:hidden` / `hidden lg:block`).
- All existing links and CTAs still work; no dead ends; nothing hidden behind the sticky bar.
- Tap targets stay `≥ 44px`.
- `npm run typecheck && npm run lint` pass clean (per global rules).
- Verified on the local dev server before any merge/deploy is proposed.

## Risks

- Global section-padding edits touch many files — keep edits limited to the base breakpoint class to avoid desktop regressions.
- Sticky bar must not overlap the footer or the in-page contact form CTA — handled via page bottom padding and hide-over-hero logic.

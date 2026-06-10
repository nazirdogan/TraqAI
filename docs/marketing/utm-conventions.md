# UTM & Inbound Attribution Conventions — Traq Collective

**Owner:** Nazir
**Why:** so every visit and lead can be traced to the channel that produced it. The site already fires GA4 conversion events (`cta_book_click`, `quick_form_submit`, `chat_lead_submit`, `booking_view`); UTMs tell GA4 *where the person came from*. Without consistent UTMs, most non-Google traffic shows up as "direct / unattributed" and you can't tell what's working.

> **Prerequisite:** set `NEXT_PUBLIC_GA_ID` on Vercel (production) so GA4 actually records this. Until then events fire to nothing.

## The five parameters

Append to any link you control (LinkedIn, outreach, email signature, GBP, ads):

`?utm_source=<where>&utm_medium=<how>&utm_campaign=<why>`

| Param | Meaning | Use a fixed vocabulary |
|---|---|---|
| `utm_source` | the platform | `linkedin`, `heyreach`, `apollo`, `gbp`, `youtube`, `email`, `reddit`, `quora` |
| `utm_medium` | the type | `social`, `outreach`, `profile`, `referral`, `email-sig`, `organic-social` |
| `utm_campaign` | the reason | e.g. `personal-brand`, `cold-q3`, `ai-readiness`, `fractional-launch` |
| `utm_content` *(optional)* | which asset | e.g. `post-2026-06-10`, `dm-v1` |

Keep everything **lowercase, hyphenated** — GA4 treats `LinkedIn` and `linkedin` as different sources.

## Ready-to-use links

- **LinkedIn posts (Nazir):** `https://traqcollective.com/?utm_source=linkedin&utm_medium=organic-social&utm_campaign=personal-brand`
- **LinkedIn / outreach DMs:** `https://traqcollective.com/?utm_source=linkedin&utm_medium=outreach&utm_campaign=cold-q3`
- **HeyReach / Apollo sequences:** `https://traqcollective.com/?utm_source=heyreach&utm_medium=outreach&utm_campaign=cold-q3`
- **Email signature:** `https://traqcollective.com/?utm_source=email&utm_medium=email-sig&utm_campaign=evergreen`
- **Google Business Profile:** `https://traqcollective.com/?utm_source=gbp&utm_medium=profile&utm_campaign=uae-local`
- **AI-readiness lead magnet pushes:** point at `/ai-readiness` with `...&utm_campaign=ai-readiness`

Build new ones with Google's Campaign URL Builder (ga-dev-tools.google/campaign-url-builder/).

## Reading it in GA4

- **Reports → Acquisition → Traffic acquisition** → group by Session source/medium → see which channel drove sessions *and* the conversion events.
- **Explore → Free form** → dimension `Session campaign`, metric `Key events` → leads per campaign.
- Mark `cta_book_click`, `quick_form_submit`, `chat_lead_submit`, `booking_view` as **Key events** in GA4 Admin so they count as conversions.

## What UTMs miss (and the fix)

Word-of-mouth and offline referrals arrive with no UTM. To catch those, add an optional **"How did you hear about us?"** field to the intake form (a small, separate change — ask Claude to wire it with GA4 and verify with a real browser submit, since the form is Turnstile-gated).

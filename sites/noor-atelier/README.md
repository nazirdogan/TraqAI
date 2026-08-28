# Noor Atelier — Dubai wardrobe organiser & personal stylist

A five-page static marketing site. No framework, no build step, no dependencies —
plain HTML, one stylesheet, one small progressive-enhancement script. It deploys to
Netlify as-is.

```
index.html          Home — hero, services, process, testimonials, FAQ
services/           Full services and AED pricing
about/              Bio, working principles, coverage area
contact/            Enquiry form (Netlify Forms) + direct contact details
thank-you/          Form success page (noindex)
404.html            Custom not-found page
assets/css/         Design tokens + all styling
assets/js/          Mobile nav, FAQ accordion, scroll reveals, ?service= prefill
assets/img/         Favicon, logo, Open Graph card
tools/make-og.py    Regenerates assets/img/og.png (stdlib only: `python3 tools/make-og.py`)
netlify.toml        Publish dir, security headers, redirects
```

## Run it locally

Use a server, not `file://` — the pages link to absolute paths (`/services/`).

```bash
cd sites/noor-atelier
python3 -m http.server 4000
# http://localhost:4000
```

## Deploy to Netlify

**From the CLI** (needs a Netlify personal access token):

```bash
cd sites/noor-atelier
npx netlify-cli login          # or: export NETLIFY_AUTH_TOKEN=...
npx netlify-cli deploy --prod  # publishes this directory
```

**From Git** (recommended — every push redeploys): in Netlify, *Add new site →
Import an existing project*, pick this repo, and set

- **Base directory:** `sites/noor-atelier`
- **Build command:** *(leave empty)*
- **Publish directory:** `sites/noor-atelier`

`netlify.toml` handles headers, pretty URLs and redirects from there.

## The enquiry form

`contact/index.html` uses **Netlify Forms** — `data-netlify="true"`, a hidden
`form-name` field and a `bot-field` honeypot. Nothing else to configure: after the
first deploy the form appears under *Forms* in the Netlify dashboard. Add an email
or Slack notification there so enquiries reach you rather than sitting in the
dashboard.

Links like `/contact/?service=The%20Reset` pre-select that option in the dropdown.

## Before this goes live — replace the placeholders

The copy, structure and design are finished; these specifics are stand-ins:

| What | Where | Currently |
|---|---|---|
| Business name | every page, `assets/img/*`, `tools/make-og.py` | "Noor Atelier" |
| Domain | `<link rel="canonical">`, OG tags, `sitemap.xml`, `robots.txt` | `nooratelier.ae` |
| Phone / WhatsApp | footers, contact page, JSON-LD | `+971 50 000 0000` |
| Email | footers, contact page, JSON-LD | `hello@nooratelier.ae` |
| Instagram | footer of every page | `https://instagram.com/` |
| Testimonials | `index.html`, marked with a comment | Three placeholder quotes — swap for real, permissioned client quotes |
| Bio | `about/index.html`, marked with a comment | Placeholder narrative |
| Prices | `services/index.html`, `index.html` | Plausible Dubai market rates — set your own |

A fast find-and-replace across the folder covers most of it:

```bash
grep -rl 'nooratelier.ae' . | xargs sed -i 's/nooratelier\.ae/yourdomain.ae/g'
grep -rl '971500000000' . | xargs sed -i 's/971500000000/9715XXXXXXXX/g'
```

## Photography

Every image slot is currently a hand-drawn SVG (the hero rail, the shelving
illustration, the portrait block) so nothing is stock and nothing can 404. Each one
is marked with a comment. When real photography exists, replace the `.art` / `.figure`
block with an `<img>` carrying the same class — the aspect ratios and shadows are
already set.

## Accessibility & performance notes

- Single stylesheet, one 3KB script, no third-party JS. Fonts are the only external
  request.
- Keyboard-navigable menu and FAQ, `aria-expanded` state on both, visible focus rings.
- Honours `prefers-reduced-motion` — reveals and smooth scrolling switch off.
- Every page works with JavaScript disabled, including the enquiry form.

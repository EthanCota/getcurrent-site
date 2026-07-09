# Baxter Solutions — Website

Static HTML/CSS site. No build step, no framework, no bundler.

**Brand:** Baxter Solutions (formerly "Get Current AI" — renamed 2026-07-08; offer ladder, pricing, and ICP are unchanged, see `decisions/2026-07-08-baxter-solutions-scope`). Underlying GitHub repo is still named `getcurrent-site` (renaming the repo is an infra decision, out of scope for this branding pass — see `BRANDING-AUDIT.md`).

**Live URL:** `https://baxter.solutions` (custom domain configured in GitHub Pages settings; DNS not yet pointed there — see `BLOCKERS.md`). Fallback while DNS is dark: `https://ethancota.github.io/getcurrent-site/`.

**Design system: v3 (2026-06-12).** Human, warm, editorial — Perplexity/Anthropic school. Fonts: Lora (display serif) + Source Sans 3 (body) + JetBrains Mono (code). Base: 18px. Parchment (#FAF7F2) page bg. Marine (#1A6B8A) accent. Zero glassmorphism — all glass/blur removed. Hero uses warm horizon gradient only. See brand/BRAND-KIT.md v3 for full token reference (that doc still uses the old brand name in places — not updated as part of this pass, it lives outside `website/`).

**v2 superseded (2026-06-12):** Inter / ice-blue / glassmorphism / electric-sky accent all removed. All 6 pages + site.css updated to v3 tokens.

**v3 verified (2026-06-12):** Playwright full-page screenshots at 1280px + 390px for all 7 pages in screenshots/v3/. Zero console errors across all pages. Zero backdrop-filter/blur() declarations in CSS or HTML. Contrast: body text 10.88:1 (AAA), H1 on hero 16.15:1 (AAA), CTA button 5.98:1 (AA). ROI calculators verified — restaurant calc: $70,200 output at 50 missed calls/wk; VA calc: live payback section at $1,200/mo input. All page-specific CSS classes defined inline in source page. Prices match Offer Ladder v1 exactly. Niche balance: Standard Audit targets "Any SD small business"; restaurant is example vertical, not brand identity. **Screenshots are stale post-rebrand (still show pre-rebrand copy, see brand note above) — refresh once the live domain is up, see `BRANDING-AUDIT.md`.**

---

## Structure

```
website/
  index.html            Homepage (hero, how-it-works, services teaser, pricing, about, FAQ, contact)
  about.html            Founder/credibility page
  services.html         Full offer ladder with detailed cards (audits, builds, retainers)
  restaurants.html      Restaurant voice AI niche page + ROI calculator
  replace-your-va.html  VA replacement niche page + TCO calculator
  audit.html            Audit booking page (primary conversion page)
  thank-you.html        Post-form-submit landing page (v3, noindex)
  _headers              Security headers for Cloudflare Pages / Netlify
  assets/
    css/
      site.css          Single stylesheet — design tokens v3 + all global components
    js/
      roi-calc.js       Vanilla JS ROI calculators (restaurant + VA TCO)
  sitemap.xml           Sitemap for baxter.solutions (includes thank-you.html)
  robots.txt            robots.txt pointing to sitemap
  deploy.sh             One-command deploy script (requires gh auth login first)
  screenshots/          Playwright verification screenshots
  README.md             This file
```

---

## Deploy / Update Procedure

### Prerequisites

```sh
# One-time: authenticate GitHub CLI
gh auth login
```

### First deploy

```sh
cd "/Users/baxter/claude/software projects/agency/website"
chmod +x deploy.sh
./deploy.sh
```

This creates a public GitHub repo `getcurrent-site`, commits all files, pushes to `main`,
enables GitHub Pages, and polls until the site returns 200.

### Redeploy after changes

```sh
cd "/Users/baxter/claude/software projects/agency/website"
./deploy.sh
```

The script force-pushes to main and Pages redeploys automatically (typically 30–90 seconds).

---

## Custom Domain (baxter.solutions)

Status as of this branding pass: `baxter.solutions` is already purchased, the GitHub Pages
custom domain is already configured (`gh api repos/EthanCota/getcurrent-site/pages` shows
`cname: baxter.solutions`), and a `CNAME` file is now committed in this directory. Canonical
URLs, OG tags, and JSON-LD across all pages already point at `https://baxter.solutions`.

**What's still outstanding is DNS, not this repo** — see `BLOCKERS.md` in the wider workspace
for the exact records (4 apex A records to GitHub Pages IPs, `www` CNAME, email forwarding,
then the HTTPS-enforce flip). That's a DNS-registrar action, out of scope for a branding-content
pass and explicitly not touched here.

If the domain or GitHub username ever changes again, the full swap is:

1. Update (or create) the `CNAME` file in this directory with the new domain.
2. In the GitHub repo Settings → Pages → Custom domain: type the new domain and save.
3. At the DNS registrar, add four A records for `@` to the GitHub Pages IPs
   (`185.199.108.153` / `.109.153` / `.110.153` / `.111.153`) and a `www` CNAME to
   `<github-username>.github.io`.
4. Wait for DNS propagation, then tick "Enforce HTTPS" in Pages settings once the cert is issued.
5. Update canonical/OG/JSON-LD URLs in all HTML files and redeploy.

---

## Local Preview

```sh
cd "/Users/baxter/claude/software projects/agency/website"
python3 -m http.server 8080
# open http://localhost:8080
```

---

## [VERIFY] Placeholders — Complete Before Going Live

These must be resolved before the site is client-facing:

| Location | Placeholder | Action needed |
|---|---|---|
| `index.html` JSON-LD | `"telephone": "[VERIFY...]"` | Replace with business phone number or remove field |
| `index.html` JSON-LD | `"streetAddress": "[VERIFY...]"` | Add street address or remove |
| `index.html` JSON-LD | `"latitude/longitude": "[VERIFY]"` | Add coordinates or remove GeoCoordinates block |
| `index.html` contact section | `[VERIFY — add phone once business line acquired]` | Replace with phone number |
| `about.html` contact section | Same phone placeholder | Same |
| `audit.html` calendar block | Calendar embed placeholder | Replace with Calendly or Cal.com link |
| All forms | `action="https://formspree.io/f/REPLACE_WITH_YOUR_FORMSPREE_ID"` | Replace with real Formspree/Basin endpoint |

---

## Form Service Setup

All 5 forms now use `action="https://formspree.io/f/REPLACE_WITH_YOUR_FORMSPREE_ID"` as a placeholder with a `_next` hidden field pointing to `/thank-you.html`.

**To activate:**
1. Sign up at formspree.io → New Form → copy the endpoint URL (e.g. `https://formspree.io/f/xpwzabcd`)
2. Find-and-replace `REPLACE_WITH_YOUR_FORMSPREE_ID` in all 5 forms with the actual ID
3. The `_next` redirect to `thank-you.html` is already wired — no additional config needed

Forms that need updating (search for `REPLACE_WITH_YOUR_FORMSPREE_ID`):
- `index.html` — contact form
- `audit.html` — booking form
- `about.html` — general contact form
- `restaurants.html` — restaurant inquiry form
- `replace-your-va.html` — VA replacement inquiry form

Alternative: **Basin** (basin.com) — change `action` to Basin endpoint; `_next` redirect works the same way.

---

## Name-Swap Procedure (if brand name changes again)

The site's most recent rename (2026-07-08, see brand note at the top of this file) was a
branding-only pass — offers, pricing, and ICP unchanged. See `BRANDING-AUDIT.md` in this
directory for the full list of what was touched. If the brand name changes again, the
equivalent sweep is:

```sh
find /path/to/website -type f \( -name "*.html" -o -name "*.css" -o -name "*.js" -o -name "*.xml" -o -name "*.txt" \) \
  -exec sed -i '' 's/Baxter Solutions/NEW NAME HERE/g; s/BAXTER SOLUTIONS/NEW NAME CAPS/g; s/baxter\.solutions/newdomain.tld/g' {} \;
```

Then hand-check (this list bit us last time — a mechanical sed alone is not enough):
- `assets/og-card.svg` and `assets/favicon.svg` (name is in `<text>`/path elements, not caught by the sed above)
- `CNAME` file
- Any tagline or founder-bio copy that names the brand in prose rather than as a literal string match

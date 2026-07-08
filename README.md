# Baxter Solutions — Website

Static HTML/CSS site. No build step, no framework, no bundler.

**Live URL:** blocked on `gh auth login` — run `./deploy.sh` after authenticating.

**Design system: v3 (2026-06-12).** Human, warm, editorial — Perplexity/Anthropic school. Fonts: Lora (display serif) + Source Sans 3 (body) + JetBrains Mono (code). Base: 18px. Parchment (#FAF7F2) page bg. Marine (#1A6B8A) accent. Zero glassmorphism — all glass/blur removed. Hero uses warm horizon gradient only. See brand/BRAND-KIT.md v3 for full token reference.

**v2 superseded (2026-06-12):** Inter / ice-blue / glassmorphism / electric-sky accent all removed. All 6 pages + site.css updated to v3 tokens.

**v3 verified (2026-06-12):** Playwright full-page screenshots at 1280px + 390px for all 7 pages in screenshots/v3/. Zero console errors across all pages. Zero backdrop-filter/blur() declarations in CSS or HTML. Contrast: body text 10.88:1 (AAA), H1 on hero 16.15:1 (AAA), CTA button 5.98:1 (AA). ROI calculators verified — restaurant calc: $70,200 output at 50 missed calls/wk; VA calc: live payback section at $1,200/mo input. All page-specific CSS classes defined inline in source page. Prices match Offer Ladder v1 exactly. Niche balance: Standard Audit targets "Any SD small business"; restaurant is example vertical, not brand identity.
**Expected live URL:** `https://<your-gh-username>.github.io/getcurrent-site/`
**Custom domain target:** `https://baxter.solutions` (once purchased and DNS configured)

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

## Custom Domain Swap (when baxter.solutions is purchased)

1. Create a `CNAME` file in this directory:
   ```sh
   echo "baxter.solutions" > "/Users/baxter/claude/software projects/agency/website/CNAME"
   ```

2. Run `./deploy.sh` to push the CNAME file.

3. In the GitHub repo Settings → Pages → Custom domain: type `baxter.solutions` and save.

4. At your DNS registrar, add:
   - Four A records pointing `@` to GitHub Pages IPs:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - One CNAME record: `www` → `<your-gh-username>.github.io`

5. Wait for DNS propagation (15 min–2 hrs). Then in the repo Pages settings,
   tick "Enforce HTTPS." Certificate provisioning takes ~15 additional minutes.

6. Update canonical URLs in all HTML files from the github.io URL to `baxter.solutions`:
   ```sh
   find "/Users/baxter/claude/software projects/agency/website" -name "*.html" \
     -exec sed -i '' 's|https://[^.]*\.github\.io/getcurrent-site|https://baxter.solutions|g' {} \;
   ```
   Then redeploy: `./deploy.sh`

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
| All forms | `action="mailto:ethan@baxter.solutions"` | Replace with Formspree/Basin endpoint |

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

## Name-Swap Procedure (if brand name changes)

```sh
find "/Users/baxter/claude/software projects/agency/website" -type f \( -name "*.html" -o -name "*.css" \) \
  -exec sed -i '' 's/Baxter Solutions/NEW NAME HERE/g; s/getcurrentai\.com/newdomain.com/g' {} \;
```

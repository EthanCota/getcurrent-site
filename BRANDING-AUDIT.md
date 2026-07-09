# Branding audit — Get Current AI → Baxter Solutions

**Date:** 2026-07-08
**Scope:** this `website/` directory only.
**Positioning:** unchanged — same San Diego SMB automation-agency offer ladder, pricing, and ICP. This pass is brand identity only (name, wordmark, tagline, meta/OG, footer, contact email, favicon).

## Starting state

At the start of this pass the local working copy was still **100% "Get Current AI"** — every page's title, meta description, OG/Twitter tags, JSON-LD, nav wordmark, footer, and copy said "Get Current AI" / `getcurrentai.com`. Zero "Baxter Solutions" references existed in that checkout.

Partway through, it turned out a separate, concurrent commit on `origin/main` had already done a first-pass mechanical rebrand (plain string substitution, no favicon/OG-card fixes, contact email set to `ethan@baxter.solutions`). This pass had independently picked `hello@baxter.solutions` (matching the old `hello@getcurrentai.com` convention) before discovering that commit. The two histories were reconciled with a merge: the concurrent commit's email choice (`ethan@baxter.solutions`, which matches the already-planned inbox forwarding for this domain, so it'll actually deliver) was kept everywhere; this pass's deeper fixes (favicon redesign, OG-card clipping fix, regenerated checklist PDF, CNAME file, expanded README/deploy.sh notes, this audit doc) were kept on top.

## What was found (residual old-brand artifacts)

Old-brand strings (`Get Current AI`, `getcurrentai.com`, and case variants) were present in every top-level HTML page, the blog and resources subdirectories, and:

- **Title tags / meta description** — every page.
- **Canonical + OG/Twitter tags** — `og:url`, `og:title`, `og:site_name`, `og:image`, `twitter:*`.
- **JSON-LD structured data** (`LocalBusiness` schema) — `name`, `url`, `email`.
- **Nav wordmark + aria-label**, **footer wordmark**, **copyright line**, **founder-bio copy**.
- **Contact email** `hello@getcurrentai.com` — mailto links, form hidden fields, JSON-LD `email`.
- **`assets/css/site.css`** — two header comments.
- **`assets/js/roi-calc.js`** — file header comment + two calculator labels.
- **`assets/og-card.svg`** — wordmark text, footer domain text, and a real layout bug: the wordmark was sized at 72px for the shorter old name, riding the edge of clipping into the price card at social-preview width.
- **`assets/favicon.svg`** — a "C + arrow" mark that's a visual pun on "**Get Current**" (C-shaped body, diagonal arrow reading as "current flow"). Meaningless for "Baxter Solutions"; needed a real redesign, not a text swap.
- **`sitemap.xml`** / **`robots.txt`** — every URL/`Sitemap:` line.
- **`deploy.sh`** — header comments, repo description, default commit message.
- **`README.md`** — title, live-URL notes, custom-domain instructions, VERIFY-placeholder table, and the "Name-Swap Procedure" section.
- **`resources/sd-smb-ai-audit-checklist.md`** (lead-magnet source) and its generated **`.html`** / **`.pdf`** — brand name, domain, contact email in the header/footer and the audit-upsell paragraph.
- **`resources/render_checklist.py`** — hardcoded brand strings in the PDF cover-line generator.

**Out of scope, left as-is (flagged, not fixed):**
- A shared brand-CSS template used by a client-report generator that lives outside this `website/` directory — not site content, wasn't part of this brief. One trace effect: regenerating the checklist PDF pulls in that shared CSS, so a non-visible `/* ... print CSS */` comment in the generated HTML was fixed directly, but will reappear if the PDF is regenerated again before the shared tool is updated separately.
- A separate brand-kit reference doc (also outside `website/`) still uses the old name in places — referenced by this README but not part of the deployed site.
- The underlying GitHub repo name (`getcurrent-site`) and the `REPO_NAME` value in `deploy.sh` — renaming the repo is an infra decision (affects the `.github.io` fallback URL and the already-configured Pages custom-domain association), not a content edit. Left as-is; noted inline in `deploy.sh` and `README.md` so it doesn't read as an oversight.
- `screenshots/` — stale, pre-rebrand, per the task brief (needs the live domain to refresh meaningfully). Noted in `README.md`.

## What was fixed

1. **Global text pass** across every `.html`, `.css`, `.js`, `.xml`, `.txt` file: `Get Current AI` → `Baxter Solutions`, `GET CURRENT AI` → `BAXTER SOLUTIONS`, `getcurrentai.com` → `baxter.solutions` — one substitution correctly fixed the domain everywhere it appeared (canonical, OG, JSON-LD, sitemap, robots.txt, every `hello@` email address).
2. **`resources/sd-smb-ai-audit-checklist.md`** fixed by hand, then **regenerated** the `.html` and `.pdf` outputs via `render_checklist.py` — verified 0 old-brand hits in the regenerated PDF text (extracted and grepped) and HTML.
3. **`assets/favicon.svg`** — redesigned. New mark is a bold serif **"B" monogram** in Warm Ink (#1C1A16) on Parchment (#FAF7F2), with a Marine (#1A6B8A) accent bar beneath — reuses the site's existing accent-bar motif (same one used on the OG card) rather than inventing a new visual language. Rendered and checked legible at 16px/32px.
4. **`assets/og-card.svg` (OG/Twitter share-card)** — swapped wordmark and domain text, **and fixed the clipping bug**: reduced the wordmark from 72px to 54px (the old size was tuned for the 14-character old name; "Baxter Solutions" is 16 characters and was riding the edge of the price-card boundary). Rendered via headless Chrome at the real 1200×630 OG dimensions to confirm — wordmark now ends with comfortable clearance before the card.
5. **`CNAME` file created** (`baxter.solutions`) — didn't exist before. GitHub Pages' custom-domain setting was previously configured via the API only, with no repo file backing it, which risks the association being dropped on a future force-push deploy. This is repo content, not a DNS change. **Tradeoff worth knowing:** with the CNAME file live, GitHub Pages now 301-redirects the `.../ethancota.github.io/getcurrent-site/` fallback URL to `baxter.solutions` — confirmed via `curl -sI`. Since DNS isn't pointed at GitHub yet, that means there's currently no public URL that serves the site (the old .github.io URL just redirects into a domain that isn't live). Local preview is the only way to see it until DNS resolves. This is expected/correct once DNS is live, but flagging the interim gap.
6. **`README.md`** rewritten in the affected sections: title, brand note, live-URL section, Custom Domain section, VERIFY-placeholder table, and the Name-Swap Procedure (expanded to call out the SVG/CNAME files a plain sed sweep would miss).
7. **`deploy.sh`** — updated comments, repo description, default commit message, post-deploy output. Left the repo-creation logic (repo name) untouched — infra, not branding.

## Verification performed

- `grep -ri "get current" .` (excluding `.git`, `screenshots/`) → clean except one intentional historical note in `README.md`'s brand-note line documenting the rename date (standard changelog practice, not a residual artifact).
- `grep -ri "getcurrentai" .` → zero hits anywhere.
- Local server — every top-level page, both blog/resources subpages, both CSS/JS assets, the OG card, the favicon, sitemap.xml, robots.txt, and the checklist HTML/PDF all returned HTTP 200 — no broken links/assets introduced.
- Headless-Chrome screenshot of the homepage — nav wordmark, hero copy, and CTA all read "Baxter Solutions" correctly, no layout breakage.
- Headless-Chrome render of `og-card.svg` at native 1200×630 — confirmed no clipping.
- Extracted text from the regenerated checklist PDF — 0 old-brand hits, 4 "Baxter Solutions" hits.

## Flagged (not blocking, picked a sensible default)

- **Contact email**: `ethan@baxter.solutions` is used sitewide (reconciled from the merge above — matches the domain's planned inbox forwarding, so it'll actually deliver once DNS/email is live). Not `hello@`, despite that being the old `hello@getcurrentai.com` convention — deliberate, so mailto links resolve correctly.
- **Tagline** ("Business automation built for real operators. Systems you own.") — kept as-is; it's brand-name-agnostic and reads fine attached to "Baxter Solutions." Flagging only because no one has explicitly signed off on keeping it — if a Baxter-Solutions-specific tagline is wanted later, this is the string to touch (homepage hero + OG card only).
- **Repo/domain naming mismatch**: the GitHub repo is still named `getcurrent-site` while the brand and domain are now Baxter Solutions. Cosmetic only, doesn't affect the custom domain once DNS is live — worth a deliberate call at some point on whether to rename it.

## Not done (per task brief)

- `screenshots/` refresh — needs the live domain, explicitly deferred.
- DNS, HTTPS enforcement, email forwarding — out of scope for this pass; tracked elsewhere.

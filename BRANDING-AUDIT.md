# Branding audit — Get Current AI → Baxter Solutions

**Date:** 2026-07-08
**Scope:** `/Users/baxter/claude/software projects/agency/website/` only (the site source for `EthanCota/getcurrent-site`, custom domain `baxter.solutions`).
**Positioning:** unchanged (Option 1, per `decisions/2026-07-08-baxter-solutions-scope`) — same San Diego SMB automation-agency offer ladder, pricing, and ICP. This pass is brand identity only.

## Starting state (important — corrects a prior false claim)

`JOBS-TO-BE-DONE.md` and a prior handoff (`agents/handoffs/2026-07-08-baxter-solutions-ready-to-execute.md`) claimed the site had already been rebranded — "36 files, 0 residual old-brand refs, commit `4d2fd4e`, pushed live." **That claim did not hold.** At the start of this pass:

- No commit `4d2fd4e` existed anywhere in `git log --all` for this repo.
- The site was **100% "Get Current AI"** — every page's title, meta, OG tags, JSON-LD, nav wordmark, footer, and copy still said "Get Current AI" / `getcurrentai.com`. Zero "Baxter Solutions" references existed anywhere.
- No `CNAME` file existed in the repo (GitHub Pages' custom-domain config was set via the Pages API/settings only, not backed by a committed file — meant the domain association could be lost on a future force-push deploy from `deploy.sh`).

Flagging this so the stale claim in `JOBS-TO-BE-DONE.md`/the handoff doc gets corrected — the work described there had not actually shipped.

## What was found (residual old-brand artifacts)

Grepped every HTML/CSS/JS/XML/TXT/MD/SVG/PY file for `get current`, `getcurrentai`, and case variants. Found old-brand strings in every one of the 17 top-level HTML pages, both blog/resources subdirectories, plus:

- **Title tags / meta description** — every page's `<title>` and `meta[name=description]` said "Get Current AI."
- **Canonical + OG/Twitter tags** — `og:url`, `og:title`, `og:site_name`, `og:image`, `twitter:*`, all pointed at `getcurrentai.com` and named the old brand.
- **JSON-LD structured data** (`LocalBusiness` schema) — `name`, `url`, `email` all old-brand, on every page that carries it.
- **Nav wordmark + aria-label**, **footer wordmark**, **copyright line**, **founder-bio copy** ("Founder, Get Current AI · San Diego", "Get Current AI is new...").
- **Contact email** `hello@getcurrentai.com` — used as mailto links, form hidden fields, and JSON-LD `email` across 5+ pages.
- **`assets/css/site.css`** — two header comments ("GET CURRENT AI — site.css v3" / "— Design Tokens v3").
- **`assets/js/roi-calc.js`** — file header comment + two calculator section labels ("Voice AI cost (Get Current AI)", "Build + automation cost (Get Current AI)").
- **`assets/og-card.svg`** — wordmark text, domain text at the card footer, and (separately) a real bug: the wordmark was sized at 72px for the shorter old name, which put it right at the edge of clipping into the price card at social-preview width.
- **`assets/favicon.svg`** — a "C + arrow" mark that's a visual pun on "**Get Current**" (the C-shape body, the diagonal arrow reading as "current flow"). This doesn't mean anything for "Baxter Solutions" and needed a real redesign, not a text swap.
- **`sitemap.xml`** / **`robots.txt`** — every `<loc>` and the `Sitemap:` line pointed at `getcurrentai.com`.
- **`deploy.sh`** — header comments, the `gh repo create --description`, and the default git commit message all said "Get Current AI."
- **`README.md`** — title, live-URL notes, custom-domain instructions, VERIFY-placeholder table, and the "Name-Swap Procedure" section were all still framed around the old name/domain and referenced a `getcurrentai.com` purchase that's now moot (`baxter.solutions` is already owned).
- **`resources/sd-smb-ai-audit-checklist.md`** (the lead-magnet source) and its generated **`.html`** and **`.pdf`** outputs — brand name, domain, and contact email in the checklist header/footer and the audit-upsell paragraph.
- **`resources/render_checklist.py`** — hardcoded brand strings in the PDF cover-line generator.

**Out of scope, left as-is (flagged, not fixed):**
- `tools/audit-engine/` (lives at `agency/tools/audit-engine/`, **outside** `website/`) still carries old-brand strings in its shared `BRAND_CSS` — it's a shared client-report generator, not site content, and touching it wasn't part of this brief. One trivial side-effect: regenerating the checklist PDF via `render_checklist.py` pulls in that shared CSS, so the PDF's embedded print-CSS still has one non-visible `/* Get Current AI — brand-kit v3 print CSS */` comment baked in from the shared tool (fixed in the committed `.html` output directly, but will reappear if the PDF is regenerated again before the shared tool itself is updated).
- `agency/brand/BRAND-KIT.md` (also outside `website/`) — still uses the old name in places. Referenced by this README but not part of the site itself.
- The underlying GitHub repo name `getcurrent-site` and `deploy.sh`'s `REPO_NAME` variable — renaming the actual repo is an infra decision (would change the `.github.io` fallback URL and needs care around the already-configured Pages custom-domain association), not a content/branding edit. Left as-is; noted inline in `deploy.sh` and `README.md` so it doesn't read as an oversight.
- `screenshots/` — stale, pre-rebrand, per the task brief ("leave for later, needs the live domain"). Noted in `README.md`.

## What was fixed

1. **Global text pass** across every `.html`, `.css`, `.js`, `.xml`, `.txt` file: `Get Current AI` → `Baxter Solutions`, `GET CURRENT AI` → `BAXTER SOLUTIONS`, `getcurrentai.com` → `baxter.solutions` (this single substitution correctly fixed the domain everywhere it appeared — canonical, OG, JSON-LD, sitemap, robots.txt, and every `hello@` email address).
2. **`resources/sd-smb-ai-audit-checklist.md`** fixed by hand (same substitutions), then **regenerated** `sd-smb-ai-audit-checklist.html` and `.pdf` by re-running `render_checklist.py` — verified 0 old-brand hits in the regenerated PDF text (extracted and grepped) and HTML (one non-visible CSS comment from the shared out-of-scope tool, fixed directly).
3. **`assets/favicon.svg`** — redesigned. Old mark was a "C + current-flow-arrow" pun specific to "Get Current." New mark is a bold serif **"B" monogram** in Warm Ink (#1C1A16) on Parchment (#FAF7F2), with a Marine (#1A6B8A) accent bar beneath — reuses the site's existing accent-bar motif (same one used on the OG card and elsewhere) rather than inventing a new visual language. Rendered and checked legible at 16px/32px.
4. **`assets/og-card.svg` (the OG/Twitter share-card)** — swapped wordmark and domain text, **and fixed the clipping bug**: reduced the wordmark from 72px to 54px (the old size was tuned for the 14-character "Get Current AI"; "Baxter Solutions" is 16 characters and was riding the edge of the price-card boundary at x=790). Rendered via headless Chrome at the real 1200×630 OG dimensions to confirm — wordmark now ends around x≈600, comfortable clearance before the card. Screenshot taken and visually verified before/after.
5. **`CNAME` file created** (`baxter.solutions`) — didn't exist before. GitHub Pages' custom-domain setting was already configured via the Pages API but had no repo-committed `CNAME` backing it, which is a known way to lose the custom-domain association on a future deploy. This is repo content, not a DNS change — DNS itself was not touched (see Guardrails below).
6. **`README.md`** rewritten in the affected sections: title, brand note (documents the 2026-07-08 rename + corrects the false "already done" claim), live-URL section, Custom Domain section (rewritten to reflect that `baxter.solutions` is already purchased/configured and DNS is the only remaining gate, cross-referenced to `BLOCKERS.md`), VERIFY-placeholder table (fixed the stale form-action example), and the Name-Swap Procedure (updated + expanded to include the SVG/CNAME files a plain sed sweep would miss — this repo's own gap).
7. **`deploy.sh`** — updated comments, `gh repo create` description, default commit message, and the post-deploy "next steps" output. Left `REPO_NAME="getcurrent-site"` and the repo-creation logic untouched (infra, not branding — see Out of Scope above).

## Remaining literal "Get Current AI" / "getcurrentai" mentions (intentional)

One deliberate exception: `README.md`'s brand note at the top ("**Brand:** Baxter Solutions (formerly 'Get Current AI' — renamed 2026-07-08...)") is the single canonical place documenting the rename for future maintainers — standard changelog practice, not a residual artifact. All other explanatory mentions elsewhere (deploy.sh comments, the OG-card/favicon SVG design-rationale comments) were rephrased to avoid repeating the literal old name. Live, user-facing site content has zero old-brand references.

## Verification performed

- `grep -ri "get current" .` (excluding `.git`, `screenshots/`) → clean except the one intentional README historical note above.
- `grep -ri "getcurrentai" .` → zero hits anywhere.
- `grep -rli "vornix" .` → zero hits (hard-stop respected).
- Local server (`python3 -m http.server`) — every top-level page, both blog/resources subpages, both CSS/JS assets, the OG card, the favicon, sitemap.xml, robots.txt, and the checklist HTML/PDF/PDF-source all returned HTTP 200 — no broken links/assets introduced by the rename.
- Headless-Chrome screenshot of the homepage — nav wordmark, hero copy, and CTA all read "Baxter Solutions" correctly, no layout breakage.
- Headless-Chrome render of `og-card.svg` at native 1200×630 — confirmed no clipping (see fix #4 above).
- Extracted text from the regenerated `sd-smb-ai-audit-checklist.pdf` via `pypdf` — 0 old-brand hits, 4 "Baxter Solutions" hits.

## Flagged for Baxter (not blocking, picked a sensible default)

- **Contact email**: used `hello@baxter.solutions` throughout (matches the old `hello@getcurrentai.com` convention). The DNS runbook (`agents/handoffs/2026-07-08-baxter-solutions-ready-to-execute.md`, Step 2) currently only plans to forward `ethan@baxter.solutions` → gmail. Once DNS/email-forwarding gets set up, either add a `hello@` forward too or the site's mailto links won't deliver anywhere. Flagging so it doesn't get missed — not something I can fix from here (DNS/Dynadot is out of scope and gated per `BLOCKERS.md`).
- **Tagline** ("Business automation built for real operators. Systems you own.") — kept as-is; it's brand-name-agnostic and reads fine attached to "Baxter Solutions," so no change was forced here. Flagging only because no one has explicitly signed off on keeping it — if a Baxter-Solutions-specific tagline is wanted later, this is the string to touch (appears on the homepage hero, the OG card, and nowhere else).
- **Repo/domain naming mismatch**: the live GitHub repo is `EthanCota/getcurrent-site` while the brand and domain are now Baxter Solutions. Cosmetic only (doesn't affect the custom domain once DNS is live), but worth a deliberate call on whether to rename the repo at some point — didn't do it here since it's an infra action outside this brief and could have side effects on the Pages config.
- **Security note (not branding, discovered incidentally)**: `git remote -v` in this repo shows a GitHub OAuth token embedded in plaintext in the `origin` URL (stored in local `.git/config`, not in any committed file). That's a real local-credential-exposure risk independent of this task — flagging for awareness, didn't touch it since credential handling is out of scope here.

## Not done (per task brief)

- `screenshots/` refresh — needs the live domain, explicitly deferred.
- DNS, HTTPS enforcement, email forwarding — all out of scope per guardrails; tracked in `BLOCKERS.md` and the existing runbook.

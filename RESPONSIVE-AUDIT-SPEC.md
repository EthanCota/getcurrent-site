# Responsive Audit Spec — baxter.solutions

**Date:** 2026-07-09
**Persona:** Software
**Trigger:** Baxter, reviewing the live site 2026-07-09: "looks decent" but must format correctly at all scales/resolutions. Routed via `agents/handoffs/2026-07-09-software-queue-2.md`; standing gate recorded in `agents/DECISIONS.md`.
**Status:** DRAFT — spec-first per persona hard rule 1. Confirm before implementation starts.

---

## Hard gate

**No Tailwind CSS or any CSS framework.** Baxter's words: the site "looks vibe-coded" — this is a direct reaction against utility-class/framework aesthetics. All fixes are hand-written CSS additions to the existing `assets/css/site.css`, following its current conventions (CSS custom properties, BEM-ish class names like `site-nav__toggle`).

## What this is NOT

Not a redesign, not new pages, not new content. This is a correctness pass: every existing page (27 HTML files) must render without layout breakage at every target width. Visual polish beyond "doesn't break" is out of scope unless it blocks the fix.

---

## Current state (inventoried 2026-07-09)

- **Shared stylesheet:** `assets/css/site.css`, 1942 lines, single file, already has 16 `@media` blocks.
- **Existing breakpoints in use:** 480px, 640px, 768px, 900px, 1024px — inconsistent (not a deliberate scale, accreted page-by-page). **Nothing above 1024px** — large-desktop (1440px+) and ultrawide (2560px+) behavior is currently unaudited.
- **Container strategy:** `.container` caps at `--max-width-content: 72rem` (~1296px), so body content shouldn't stretch unbounded on large screens by default — but full-bleed sections (hero backgrounds, nav bar, footer) aren't covered by that cap and need separate checking.
- **Mobile nav:** hamburger toggle pattern already implemented (`site-nav__toggle` / `site-nav__menu`), not built from scratch.
- **Known specific defect:** `resources/sd-smb-ai-audit-checklist.html` is a standalone page with its own embedded `<style>` block (print/checklist styling, doesn't use `site.css`) and **is missing the `<meta name="viewport">` tag entirely** — will render zoomed-out/broken on mobile. Confirm whether this page is meant primarily as a print/PDF-export source (in which case a missing viewport tag may be low-priority) or a normal browsed page (in which case it's a real bug) before fixing.
- **Risk surface by page type:**
  - 6 pages contain `<table>` elements (`security.html`, `replace-your-va.html`, `services.html`, `why-projects-fail.html`, `resources/sd-smb-ai-audit-checklist.html`, `blog/sd-restaurant-automation-case-study.html`) — tables are the single most common horizontal-overflow source on mobile.
  - 6 pages contain `<form>` elements (`about.html`, `index.html`, `replace-your-va.html`, `audit.html`, `restaurants.html`, `opportunity-finder/index.html`) — check touch-target size (44×44px minimum) and input font-size ≥16px (prevents iOS auto-zoom-on-focus).
  - `opportunity-finder/index.html` is a 932-line interactive tool (23 `grid-template-columns` uses sitewide, concentrated here) — highest layout complexity, needs the most careful sweep.
  - Spot-checked pages (`index.html`, `restaurants.html`, `services.html`) have **zero `<img>` tags** — imagery appears to be SVG/CSS-background driven, which is generally lower risk for scaling bugs than raster `<img>`, but hero/background-image sections still need checking at extreme aspect ratios (ultrawide, mobile landscape).

---

## Breakpoint targets

Rationalize around a small, deliberate scale (replacing the ad-hoc 480/640/768/900/1024 mix where it makes sense, without breaking what already works):

| Label | Width | Why |
|---|---|---|
| Mobile portrait | 360–390px | Modern small-phone baseline (iPhone SE / 14) |
| Mobile landscape | 640–844px | Rotated phone — nav and hero often break here first |
| Tablet | 768–1024px | iPad portrait/landscape |
| Laptop | 1280–1440px | Common laptop viewport |
| Desktop | 1920px | Common external monitor |
| Ultrawide | 2560px+ | Currently unaudited — verify `.container` cap holds, full-bleed sections don't look sparse/broken |

Don't rip out the existing 480/640/768/900/1024 breakpoints wholesale — audit each one against this target scale and only consolidate where doing so doesn't risk regressing something that currently works.

## Audit method

1. **Screenshot sweep:** headless-Chrome (same technique as `BRANDING-AUDIT.md`'s OG-card verification pass) across all 27 pages × the 6 widths above, portrait and landscape for the two mobile widths. That's ~27 × 8 = ~216 screenshots.
2. **Per-screenshot check for:**
   - Horizontal scroll / overflow (the most common and most visible bug)
   - Clipped or truncated text (headings, nav labels, table cells)
   - Touch-target size on interactive elements at mobile widths
   - Font scaling (nothing illegibly small, nothing absurdly large at ultrawide)
   - Nav behavior (hamburger triggers at the right breakpoint, doesn't overlap content, closes correctly)
   - Table behavior on mobile (scroll container vs. reflow vs. card-transform — pick one pattern, apply consistently across the 6 table pages)
   - Hero/background-image sections at extreme aspect ratios
   - Form input sizing and spacing at mobile widths
3. **Fix with plain CSS:** `@media` queries and fluid units (`clamp()`, `rem`, percentage/`fr` widths) added to `assets/css/site.css`; page-specific embedded styles (the checklist page) fixed in place. No new build tooling, no framework.
4. **Re-sweep** the fixed pages to confirm; diff against the first pass to catch regressions on pages that weren't touched.
5. **Refresh `screenshots/`** with the corrected, live-domain screenshots — this also closes the pre-existing P1 polish item (`screenshots/` was stale pre-rebrand, and needed the live domain, which is now up).

## Explicitly out of scope

- HTTPS/cert work (tracked separately in `JOBS-TO-BE-DONE.md` P1 — GitHub cert issuance, currently stuck, needs Baxter's go on the remove/re-add fix).
- Tally form wiring, analytics script, OG card regeneration (separate P1 polish items — do only if bandwidth allows after this audit, per the existing queue note not to let polish jump the audit).
- Content or copy changes, new pages, positioning changes (the Step-6 Get-Current-AI-vs-personal-brand question from the deploy runbook is still open and unrelated to this).

## Verification (before claiming done)

- Re-sweep screenshots show no horizontal overflow, no clipped text, no broken nav at any of the 6 target widths across all 27 pages.
- `grep -ril tailwind` still clean (gate didn't get violated by any dependency pulled in during the fix).
- Manual check in a real browser (resize + devtools device toolbar) on at least: `index.html`, `opportunity-finder/index.html`, one table page, the checklist page.

## Next step

Confirm this spec (or redirect scope) before implementation starts.

#!/usr/bin/env python3
"""
Render sd-smb-ai-audit-checklist.md to branded HTML (and PDF if Playwright available).
Run from anywhere; output goes to website/resources/.
"""
import sys
from pathlib import Path

# Add audit-engine to path so we can reuse its renderer
AGENCY = Path(__file__).parent.parent.parent  # software projects/agency/
sys.path.insert(0, str(AGENCY / "tools" / "audit-engine"))

from engine import md_to_html, render_pdf_via_playwright, BRAND_CSS  # noqa: E402

HERE = Path(__file__).parent
MD_FILE = HERE / "sd-smb-ai-audit-checklist.md"
HTML_FILE = HERE / "sd-smb-ai-audit-checklist.html"
PDF_FILE  = HERE / "sd-smb-ai-audit-checklist.pdf"

def main():
    md_text = MD_FILE.read_text(encoding="utf-8")

    # Build HTML with brand CSS — override draft-banner with a clean cover line
    html = md_to_html(md_text, "The SD SMB Owner's AI-Automation Audit Checklist — Baxter Solutions")
    # Remove draft banner injected by md_to_html
    html = html.replace(
        '<div class="draft-banner">DRAFT — Engine-generated. Founder review required before sending.</div>',
        '<div style="text-align:center;padding:0.6rem 1rem;background:var(--brand-accent-lt);'
        'border-radius:4px;margin-bottom:1.5rem;font-size:0.9rem;color:var(--brand-accent);">'
        'Baxter Solutions · Free Resource · baxter.solutions</div>',
    )
    HTML_FILE.write_text(html, encoding="utf-8")
    print(f"HTML: {HTML_FILE}")

    # Attempt PDF
    out_path, method = render_pdf_via_playwright(html, PDF_FILE)
    print(f"PDF/fallback: {out_path}  [{method}]")

if __name__ == "__main__":
    main()

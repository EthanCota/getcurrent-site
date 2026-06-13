## Nav and Footer Sharing — Copy-Paste Pattern

There is no build step. Nav and footer markup is shared across pages by copy-pasting the clearly marked blocks.

In index.html, two blocks are delimited with HTML comments: `<!-- COPY-PASTE BLOCK: nav -->` (the `<header>` element through `<!-- END COPY-PASTE BLOCK: nav -->`) and `<!-- COPY-PASTE BLOCK: footer -->` (the `<footer>` element through `<!-- END COPY-PASTE BLOCK: footer -->`). When adding a new page (e.g., services.html, contact.html), copy both blocks verbatim and paste them at the same positions in the new file's `<body>`.

If nav or footer content changes (new link, updated CTA, phone number added), update index.html first, then find-replace the block in every other page file — there is no shared include mechanism. Keep a comment like `<!-- nav v2 — updated 2026-XX-XX -->` on the block header so you know which version each page is on after a partial update.

The nav relies on two JS functions defined in the page `<script>` tag: `closeMenu()` for mobile link clicks and the `resize` listener. Copy the full `<script>` block as well; it is self-contained with no external dependencies.

For active-state nav styling, add `aria-current="page"` to the matching `<a>` in the nav links list on each page (e.g., `<a href="#services" aria-current="page">Services</a>`); the CSS currently does not have an active style rule but the attribute is the correct semantic hook to add one when needed.

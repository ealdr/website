# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio site for Ethan Aldred, hosted at ethanaldred.com. Plain HTML/CSS/JS — no framework, no build step, no package manager. Just open the HTML files in a browser.

## Architecture

- `index.html` — Home: hero, about, Technical Skills tags, Professional Skills tags
- `projects.html` — Tabbed UI (Completed / What's Next); tab state syncs to `?tab=` URL param
- `homelab.html` — Homelab overview with SVG network topology and section nav (not linked in the main nav — removed; accessible by direct URL)
- `contact.html` — Email, GitHub, LinkedIn links
- `how-i-built-this.html` — Explains the site's hosting/deployment setup (Cloudflare Pages + Zero Trust); contains an architecture flow diagram using `.arch-*` CSS classes; linked from the footer as "How I made this site"
- `styles.css` — Single stylesheet with CSS custom properties; 8px spacing scale
- `theme-init.js` — Inline before render to prevent flash-of-wrong-theme; sets `data-theme="dark"` on `<html>`
- `main.js` — Theme toggle, mobile nav, scroll-fade IntersectionObserver, ARIA tab UI, section nav active state, homelab topology toggles, auto-update copyright year

## Deployment

Hosted on **Cloudflare Pages** with two branches:
- `main` branch → `ethanaldred.com` (production)
- `testing` branch → `testing.ethanaldred.com` (staging; gated behind Cloudflare Zero Trust Access — approved email + OTP required)

No build step — Cloudflare Pages serves the static files directly on push.

## Design System

Defined in `.impeccable.md`. Key points:
- **Dark-first.** Default theme is dark; light available via toggle, persisted in `localStorage`.
- **Fonts:** `Syne 800` for display headings · `Fira Code` for nav, tags, labels, buttons, footer · `DM Sans` for body text
- **Accent:** amber gold (`#d4a843` dark / `#b07a20` light)
- **Anti-patterns to avoid:** generic dark+purple-gradient portfolio look, excessive terminal/glitch aesthetics, corporate stiffness

## Adding Project Cards

See `project-tabs.md` for full templates. Quick reference:
- Completed cards go in `#panel-completed`, planned in `#panel-planned`
- Tag classes: `tag-cloud` (blue), `tag-sec` (red), `tag-net` (teal), `tag-plat` (warm neutral)
- After adding/moving a card, update the count badge on the tab button (both visible number and `aria-label`)
- Planned → Completed: swap `status-planned` → `status-complete`, add `<a class="project-link">`, update counts

## Adding a Completed Project Detail Page

Every completed project gets its own page at `projects/[slug].html` (e.g. `projects/my-project-name.html`), accessible at `/projects/my-project-name`. The card's "View Project →" button links to this URL.

**Steps when a new completed project is added:**
1. Fetch the README from the GitHub repo
2. Write a 3-paragraph AI summary covering: what was built and how, key results or findings, skills and takeaways
3. Create `projects/[slug].html` using the existing pages as a template — copy the structure from one of the existing project pages
4. Use `.project-summary` with a `.summary-label` ("AI Summary"), three `<p>` paragraphs, then the buttons div
5. Set `connect-src 'none'` in the CSP (no dynamic fetching needed)
6. Add a "View Project →" `btn btn-primary btn-sm` button to the card in `projects.html` linking to `/projects/[slug]`
7. Also add `data-date="YYYY-MM"` and `data-tags="..."` attributes to the card for filter/sort

**Project summary HTML structure:**
```html
<div class="project-summary fade-in">
    <p class="summary-label">AI Summary</p>
    <p>First paragraph — what was built, setup, and how.</p>
    <p>Second paragraph — key results, data, or findings.</p>
    <p>Third paragraph — skills gained and takeaways.</p>
</div>
<div style="max-width:760px;margin:var(--s8) auto 0;display:flex;gap:var(--s4);flex-wrap:wrap">
    <a href="https://github.com/ealdr/REPO" target="_blank" rel="noopener noreferrer" class="btn btn-primary">View full project on GitHub &rarr;</a>
    <a href="/projects" class="btn btn-secondary">&larr; Back to Projects</a>
</div>
```

## CSS Conventions

- All theme colours are CSS custom properties; dark values are on `[data-theme="dark"]`, light values on `:root`
- Scroll-fade animations use the `.fade-in` / `.visible` class pair with IntersectionObserver
- `prefers-reduced-motion`, `forced-colors`, and safe-area insets are all handled in `styles.css`
- Spacing uses an 8px base scale
- Architecture diagram (used in `how-i-built-this.html`): `.arch-topo`, `.arch-flow`, `.arch-box`, `.arch-box-header`, `.arch-pill`, `.arch-conn`, `.arch-conn-label`, `.arch-line`, `.arch-group`, `.arch-row`, `.arch-legend`, `.arch-legend-item`, `.arch-legend-swatch`

## Accessibility

- Every page has a `.skip-link` as the first focusable element
- Interactive elements use `:focus-visible` (not `:focus`) for keyboard outlines
- Tab UI is ARIA-compliant: `role="tablist"`, `aria-selected`, `aria-controls`/`aria-labelledby`, arrow-key navigation
- Decorative elements carry `aria-hidden="true"`

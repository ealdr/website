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
- `styles.css` — Single stylesheet with CSS custom properties; 8px spacing scale (`--s1:4px` through `--s12:128px`)
- `theme-init.js` — Inline before render to prevent flash-of-wrong-theme; sets `data-theme="dark"` on `<html>`
- `main.js` — Theme toggle, mobile nav, scroll-fade IntersectionObserver, ARIA tab UI, filter/sort logic, section nav active state, homelab topology toggles, auto-update copyright year

## Git Workflow

**Always work on the `testing` branch.** Never commit directly to `main`.

- `testing` → deploys to `testing.ethanaldred.com` (Cloudflare Zero Trust gated)
- `main` → deploys to `ethanaldred.com` (production)

Typical flow:
1. Make changes on `testing`
2. `git add <files>` then `git commit -m "..."`
3. `git push origin testing` — deploys to staging automatically
4. Only merge into `main` when explicitly asked to push to production:
   ```
   git checkout main && git merge testing && git push origin main && git checkout testing
   ```

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

## Adding a New Completed Project (Full Workflow)

Do all of these steps together whenever a new completed project is added.

### 1. Get the README

Fetch `https://raw.githubusercontent.com/ealdr/REPO-NAME/main/README.md` and read it.

### 2. Write the AI summary

Three paragraphs:
1. What was built, the setup, and how it works
2. Key results, data, or findings
3. Skills gained and takeaways

### 3. Create the detail page

Create `projects/[slug].html` by copying an existing project page (e.g. `projects/deploying-a-honeypot-with-t-pot-on-aws.html`). Change:
- `<title>`, `<meta name="description">`, `<h1>`, `<p class="page-label">` (date)
- Project tags in `.project-tags`
- The three summary paragraphs inside `.summary-body`
- The GitHub repo URL in the `btn btn-primary` link

**Full section template** (copy this exactly — the `.summary-body` wrapper is required so the border-left accent line doesn't extend into the gap below):

```html
<section class="section pt-0">
    <div class="project-summary fade-in">
        <p class="summary-label">AI Summary</p>
        <div class="summary-body">
            <p>First paragraph — what was built, setup, and how.</p>
            <p>Second paragraph — key results, data, or findings.</p>
            <p>Third paragraph — skills gained and takeaways.</p>
        </div>
    </div>
    <div style="max-width:760px;margin:0 auto;display:flex;gap:var(--s4);flex-wrap:wrap">
        <a href="https://github.com/ealdr/REPO-NAME" target="_blank" rel="noopener noreferrer" class="btn btn-primary">View full project on GitHub &rarr;</a>
        <a href="/projects" class="btn btn-secondary">&larr; Back to Projects</a>
    </div>
</section>
```

Notes:
- Use root-relative paths: `/styles.css`, `/theme-init.js`, `/main.js`
- CSP header uses `connect-src 'none'` (no dynamic fetching)
- The page is served at `/projects/[slug]` by Cloudflare Pages (no `.html` in the URL)

### 4. Add the card to projects.html

Add to `#panel-completed`. See full card template in `project-tabs.md`.

Required attributes on the card div:
- `data-date="YYYY-MM"` — used for date sorting
- `data-tags="cloud,sec,plat"` — used for filter buttons (valid values: `cloud`, `sec`, `net`, `plat`, `ai`)

### 5. Update the tab count badge

In `projects.html` around line 58, update both the visible number and `aria-label`:
```html
<button ... data-tab="completed">Completed<span class="tab-count" aria-label="3 projects">3</span></button>
```

### 6. Commit and push to testing

```
git add projects/[slug].html projects.html
git commit -m "Add [Project Name] detail page and project card"
git push origin testing
```

## Moving a Planned Project to Completed

1. Move the card from `#panel-planned` to `#panel-completed`
2. Swap `status-planned` → `status-complete`, label text `Planned` → `Complete`
3. Add `data-date="YYYY-MM"` and `data-tags="..."` to the card div
4. Add the date badge: `<span class="project-date">Mon YYYY</span>` inside `.project-card-header`
5. Replace any plain GitHub link with a `.project-card-actions` div (see `project-tabs.md`)
6. Create the detail page (follow "Adding a New Completed Project" steps 1–3 above)
7. Update both tab counts (completed goes up, planned goes down)
8. Commit and push

## Adding a Planned Project

1. Add a card to `#panel-planned` in `projects.html` (see template in `project-tabs.md`)
2. Update the "What's Next" tab count badge
3. Commit and push

## CSS Conventions

- All theme colours are CSS custom properties; dark values are on `[data-theme="dark"]`, light values on `:root`
- Scroll-fade animations use the `.fade-in` / `.visible` class pair with IntersectionObserver
- `prefers-reduced-motion`, `forced-colors`, and safe-area insets are all handled in `styles.css`
- Spacing uses an 8px base scale: `--s1:4px`, `--s2:8px`, `--s3:12px`, `--s4:16px`, `--s5:20px`, `--s6:24px`, `--s8:40px`, `--s10:80px`, `--s12:128px`
- Architecture diagram (used in `how-i-built-this.html`): `.arch-topo`, `.arch-flow`, `.arch-box`, `.arch-box-header`, `.arch-pill`, `.arch-conn`, `.arch-conn-label`, `.arch-line`, `.arch-group`, `.arch-row`, `.arch-legend`, `.arch-legend-item`, `.arch-legend-swatch`
- `display:flex` overrides the HTML `hidden` attribute — any element that uses `display:flex` and needs to be hideable must have a `[hidden]{display:none}` rule in `styles.css`

## Accessibility

- Every page has a `.skip-link` as the first focusable element
- Interactive elements use `:focus-visible` (not `:focus`) for keyboard outlines
- Tab UI is ARIA-compliant: `role="tablist"`, `aria-selected`, `aria-controls`/`aria-labelledby`, arrow-key navigation
- Decorative elements carry `aria-hidden="true"`

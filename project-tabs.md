# Adding New Project Cards

Reference for adding projects to `projects.html`.

---

## Card Templates

### Completed project

```html
<div class="project-card fade-in" data-date="YYYY-MM" data-tags="cloud,sec,plat">
    <div class="project-card-header">
        <div class="project-status status-complete">
            <span class="status-dot" aria-hidden="true"></span> Complete
        </div>
        <span class="project-date">Mon YYYY</span>
    </div>
    <h3>Project Title</h3>
    <p class="project-desc">Short description of what the project is and what it achieves.</p>
    <div class="project-tags">
        <!-- Add tags — see Tag Categories below -->
    </div>
    <div class="project-card-actions">
        <a href="/projects/slug" class="btn btn-primary btn-sm">View Project &rarr;</a>
        <a href="https://github.com/ealdr/REPO-NAME" target="_blank" rel="noopener noreferrer" class="project-link">View on GitHub &rarr;</a>
    </div>
</div>
```

**Required attributes on the card `<div>`:**
- `data-date="YYYY-MM"` — enables date sorting (e.g. `data-date="2025-09"`)
- `data-tags="..."` — comma-separated filter values: `cloud`, `sec`, `net`, `plat`, `ai`

**Date badge:** `<span class="project-date">` shows in the card header (e.g. `Sep 2025`).

### Planned project

```html
<div class="project-card fade-in" data-tags="cloud,sec">
    <div class="project-card-header">
        <div class="project-status status-planned">
            <span class="status-dot" aria-hidden="true"></span> Planned
        </div>
    </div>
    <h3>Project Title</h3>
    <p class="project-desc">Short description of what the project will do.</p>
    <div class="project-tags">
        <!-- Add tags — see Tag Categories below -->
    </div>
</div>
```

Planned cards have no `data-date`, no date badge, and no `.project-card-actions`. Add these when the project is moved to completed.

---

## Tag Categories

Every `<span class="project-tag">` takes one category class. Pick whichever fits best.

| Class | Colour | Use for |
|---|---|---|
| `tag-cloud` | Blue | AWS, EC2, CloudWatch, SNS, Terraform, IaC, Kubernetes, Azure, GCP |
| `tag-sec` | Red | Cybersecurity, Pentesting, Malware, OWASP, GuardDuty, Incident Response, Vulnerability |
| `tag-net` | Teal | Networking, DNS, Wireshark, Packet Capture, Pi-hole, Firewalls |
| `tag-plat` | Warm neutral | Linux, Docker, Raspberry Pi, Windows, Git, Documentation |

The filter buttons in `projects.html` use these same values (`data-filter="sec"` matches cards with `sec` in `data-tags`). Keep `data-tags` in sync with the actual tags shown on the card.

### Tag syntax

```html
<span class="project-tag tag-cloud">AWS</span>
<span class="project-tag tag-sec">Pentesting</span>
<span class="project-tag tag-net">DNS</span>
<span class="project-tag tag-plat">Linux</span>
```

---

## Tab Counts

After adding or moving a card, update the count badge on the tab button in `projects.html` (around line 58). Change both the visible number and the `aria-label`:

```html
<button ... data-tab="completed">Completed<span class="tab-count" aria-label="3 projects">3</span></button>
<button ... data-tab="planned">What's Next<span class="tab-count" aria-label="6 projects">6</span></button>
```

---

## Moving a Project from Planned → Completed

1. Cut the card from `#panel-planned`, paste into `#panel-completed`
2. Change `status-planned` → `status-complete` and label text `Planned` → `Complete`
3. Add `data-date="YYYY-MM"` to the card div
4. Add `data-tags` if not already present (check it matches the visible tags)
5. Add the date badge inside `.project-card-header`: `<span class="project-date">Mon YYYY</span>`
6. Replace any plain GitHub link with a `.project-card-actions` div:
   ```html
   <div class="project-card-actions">
       <a href="/projects/slug" class="btn btn-primary btn-sm">View Project &rarr;</a>
       <a href="https://github.com/ealdr/REPO" target="_blank" rel="noopener noreferrer" class="project-link">View on GitHub &rarr;</a>
   </div>
   ```
7. Create the detail page — follow the full workflow in `CLAUDE.md`
8. Update both tab counts (completed +1, planned −1)

---

## Full Example (Completed)

```html
<div class="project-card fade-in" data-date="2025-09" data-tags="cloud,sec,plat">
    <div class="project-card-header">
        <div class="project-status status-complete">
            <span class="status-dot" aria-hidden="true"></span> Complete
        </div>
        <span class="project-date">Sep 2025</span>
    </div>
    <h3>Deploying a Honeypot with T-Pot on AWS</h3>
    <p class="project-desc">Deploying a T-Pot honeypot on an AWS EC2 instance to capture malicious traffic and analyse attack patterns targeting cloud infrastructure.</p>
    <div class="project-tags">
        <span class="project-tag tag-cloud">AWS</span>
        <span class="project-tag tag-cloud">EC2</span>
        <span class="project-tag tag-sec">T-Pot</span>
        <span class="project-tag tag-sec">Honeypot</span>
        <span class="project-tag tag-sec">Cybersecurity</span>
        <span class="project-tag tag-plat">Linux</span>
    </div>
    <div class="project-card-actions">
        <a href="/projects/deploying-a-honeypot-with-t-pot-on-aws" class="btn btn-primary btn-sm">View Project &rarr;</a>
        <a href="https://github.com/ealdr/Deploying-a-Honeypot-with-T-Pot-on-AWS" target="_blank" rel="noopener noreferrer" class="project-link">View on GitHub &rarr;</a>
    </div>
</div>
```

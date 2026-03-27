# Adding New Project Cards

Reference for adding projects to `projects.html`.

---

## Structure

Projects live inside one of two tab panels in `projects.html`:

- `#panel-completed` — finished projects with a GitHub link
- `#panel-planned` — upcoming work (the "What's Next" tab)

---

## Card Template

### Completed project
```html
<div class="project-card fade-in">
    <div class="project-card-header">
        <div class="project-status status-complete">
            <span class="status-dot" aria-hidden="true"></span> Complete
        </div>
    </div>
    <h3>Project Title</h3>
    <p class="project-desc">Short description of what the project is and what it achieves.</p>
    <div class="project-tags">
        <!-- Add tags — see Tag Categories below -->
    </div>
    <a href="https://github.com/ealdr/REPO-NAME" target="_blank" rel="noopener noreferrer" class="project-link">View on GitHub &rarr;</a>
</div>
```

### Planned project
```html
<div class="project-card fade-in">
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

> Planned cards have no `<a class="project-link">`. Add it when the project is complete and moved to `#panel-completed`.

---

## Tag Categories

Every `<span class="project-tag">` takes one category class alongside it. Pick whichever fits best.

| Class | Colour | Use for |
|---|---|---|
| `tag-cloud` | Blue | AWS, EC2, CloudWatch, SNS, Terraform, IaC, Kubernetes, Azure, GCP |
| `tag-sec` | Red | Cybersecurity, Pentesting, Malware, OWASP, GuardDuty, Incident Response, Vulnerability |
| `tag-net` | Teal | Networking, DNS, Wireshark, Packet Capture, Pi-hole, Firewalls |
| `tag-plat` | Warm neutral | Linux, Docker, Raspberry Pi, Windows, Git, Documentation |

### Tag syntax
```html
<span class="project-tag tag-cloud">AWS</span>
<span class="project-tag tag-sec">Pentesting</span>
<span class="project-tag tag-net">DNS</span>
<span class="project-tag tag-plat">Linux</span>
```

---

## Tab Counts

After adding or moving a card, update the count badge on the tab button in `projects.html` around line 60:

```html
<button ... data-tab="completed">Completed<span class="tab-count" aria-label="3 projects">3</span></button>
<button ... data-tab="planned">What's Next<span class="tab-count" aria-label="6 projects">6</span></button>
```

Change both the visible number and the `aria-label` value.

---

## Moving a Project from Planned → Completed

1. Cut the card from `#panel-planned`
2. Paste it into `#panel-completed` (at the top, so newest appears first)
3. Change `status-planned` → `status-complete` and the label text `Planned` → `Complete`
4. Add the GitHub link below the tags:
   ```html
   <a href="https://github.com/ealdr/REPO" target="_blank" rel="noopener noreferrer" class="project-link">View on GitHub &rarr;</a>
   ```
5. Update both tab counts

---

## Full Example (Completed)

```html
<div class="project-card fade-in">
    <div class="project-card-header">
        <div class="project-status status-complete">
            <span class="status-dot" aria-hidden="true"></span> Complete
        </div>
    </div>
    <h3>AWS VPC with Terraform</h3>
    <p class="project-desc">Provisioning a full VPC on AWS using Terraform — subnets, route tables, security groups, and an internet gateway. Deployed and torn down repeatably via a single apply.</p>
    <div class="project-tags">
        <span class="project-tag tag-cloud">AWS</span>
        <span class="project-tag tag-cloud">Terraform</span>
        <span class="project-tag tag-cloud">VPC</span>
        <span class="project-tag tag-cloud">IaC</span>
        <span class="project-tag tag-plat">Linux</span>
    </div>
    <a href="https://github.com/ealdr/aws-vpc-terraform" target="_blank" rel="noopener noreferrer" class="project-link">View on GitHub &rarr;</a>
</div>
```

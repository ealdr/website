// Theme
const themeSwitch = document.querySelector('.theme-switch');
function setTheme(t) {
    if (t === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
    try { localStorage.setItem('theme', t); } catch(e) {}
}
try { const s = localStorage.getItem('theme'); setTheme(s === 'light' ? 'light' : 'dark'); } catch(e) { setTheme('dark'); }
if (themeSwitch) {
    themeSwitch.addEventListener('click', () => {
        setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
    themeSwitch.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); themeSwitch.click(); }
    });
}

// Mobile nav
const navToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const nav = document.querySelector('.nav');
if (navToggle) {
    navToggle.addEventListener('click', () => {
        const open = mobileMenu.classList.toggle('open');
        navToggle.classList.toggle('active');
        nav.classList.toggle('menu-open', open);
        navToggle.setAttribute('aria-expanded', open);
    });
    document.querySelectorAll('.mobile-link').forEach(l => {
        l.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            navToggle.classList.remove('active');
            nav.classList.remove('menu-open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('open') && !nav.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.remove('open');
            navToggle.classList.remove('active');
            nav.classList.remove('menu-open');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// Scroll fade
const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));

// Project tabs — ARIA-compliant with arrow key navigation + URL sync
const tabBtns = document.querySelectorAll('.tab-btn');
if (tabBtns.length) {
    // Only active tab is in tab order; inactive tabs use tabindex="-1"
    tabBtns.forEach((btn, i) => btn.setAttribute('tabindex', i === 0 ? '0' : '-1'));

    function activateTab(btn, updateUrl) {
        tabBtns.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
            b.setAttribute('tabindex', '-1');
        });
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        btn.setAttribute('tabindex', '0');
        const panel = document.getElementById('panel-' + btn.dataset.tab);
        panel.classList.add('active');
        // Trigger fade-in for cards that were hidden inside display:none panel
        panel.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
        // Sync tab state to URL query param
        if (updateUrl !== false) {
            const url = new URL(location.href);
            url.searchParams.set('tab', btn.dataset.tab);
            history.replaceState(null, '', url);
        }
    }

    // Restore tab from URL on page load
    const urlTab = new URL(location.href).searchParams.get('tab');
    const initialBtn = urlTab ? Array.from(tabBtns).find(b => b.dataset.tab === urlTab) : null;
    if (initialBtn) activateTab(initialBtn, false);

    tabBtns.forEach((btn, i) => {
        btn.addEventListener('click', () => activateTab(btn));
        btn.addEventListener('keydown', (e) => {
            const len = tabBtns.length;
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                const t = tabBtns[(i + 1) % len];
                t.focus();
                activateTab(t);
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const t = tabBtns[(i - 1 + len) % len];
                t.focus();
                activateTab(t);
            }
        });
    });
}

// Project filter + sort
const filterBar = document.querySelector('.filter-bar');
if (filterBar) {
    const filterBtns = filterBar.querySelectorAll('.filter-btn');
    const sortBtn = document.getElementById('sort-date');
    let activeFilter = 'all';
    let sortNewest = true;

    function applyFilterSort() {
        const activePanel = document.querySelector('.tab-panel.active');
        if (!activePanel) return;
        const cards = Array.from(activePanel.querySelectorAll('.project-card'));
        const emptyMsg = activePanel.querySelector('.filter-empty');

        cards.forEach(card => {
            const tags = (card.dataset.tags || '').split(',');
            card.style.display = (activeFilter === 'all' || tags.includes(activeFilter)) ? '' : 'none';
        });

        const visible = cards.filter(c => c.style.display !== 'none');
        if (emptyMsg) emptyMsg.classList.toggle('visible', visible.length === 0);

        const datable = visible.filter(c => c.dataset.date);
        if (datable.length > 1) {
            datable.sort((a, b) => sortNewest
                ? b.dataset.date.localeCompare(a.dataset.date)
                : a.dataset.date.localeCompare(b.dataset.date));
            datable.forEach(card => activePanel.appendChild(card));
        }
    }

    function updateSortVisibility() {
        const activePanel = document.querySelector('.tab-panel.active');
        if (sortBtn) sortBtn.hidden = !activePanel || activePanel.id !== 'panel-completed';
        applyFilterSort();
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.dataset.filter;
            applyFilterSort();
        });
    });

    if (sortBtn) {
        sortBtn.addEventListener('click', () => {
            sortNewest = !sortNewest;
            sortBtn.textContent = sortNewest ? 'Newest ↓' : 'Oldest ↑';
            applyFilterSort();
        });
    }

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => requestAnimationFrame(updateSortVisibility));
    });

    updateSortVisibility();
}

// Section nav active state
const sectionNavLinks = document.querySelectorAll('.section-nav-link');
if (sectionNavLinks.length) {
    const sectionIds = Array.from(sectionNavLinks).map(l => l.getAttribute('href').slice(1));
    const sectionEls = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
    const sectionObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                sectionNavLinks.forEach(l => l.classList.remove('active'));
                const link = document.querySelector('.section-nav-link[href="#' + entry.target.id + '"]');
                if (link) {
                    link.classList.add('active');
                    const nav = link.closest('.section-nav');
                    if (nav) nav.scrollLeft = link.offsetLeft - nav.offsetWidth / 2 + link.offsetWidth / 2;
                }
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sectionEls.forEach(el => sectionObs.observe(el));
}

// Auto-update copyright year
document.querySelectorAll('.footer-name').forEach(el => {
    el.textContent = el.textContent.replace(/\d{4}/, new Date().getFullYear());
});

// Homelab topology toggles
const topoState = { hw: true, sw: true, visor: true, access: true, opt: true };
const topoGroups = {
    hw:     ['hw-sentinel','hw-forge','hw-nexus','hw-citadel','hw-argus','hw-vault','hw-jetkvm'],
    sw:     ['sw-sentinel','sw-forge','sw-nexus','sw-citadel','sw-argus','sw-vault','sw-jetkvm'],
    visor:  ['visor-sentinel','visor-forge','visor-nexus','visor-citadel','visor-argus','visor-layer'],
    access: ['access-layer'],
    opt:    ['opt-vault','opt-jetkvm']
};
document.querySelectorAll('[data-tog]').forEach(el => {
    el.addEventListener('click', () => {
        const key = el.dataset.tog;
        topoState[key] = !topoState[key];
        document.getElementById('tog-' + key).classList.toggle('on', topoState[key]);
        topoGroups[key].forEach(id => {
            const g = document.getElementById(id);
            if (g) g.style.opacity = topoState[key] ? '1' : '0.05';
        });
    });
});

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

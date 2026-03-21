// Theme
const themeSwitch = document.querySelector('.theme-switch');
function setTheme(t) {
    if (t === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
    try { localStorage.setItem('theme', t); } catch(e) {}
}
try { const s = localStorage.getItem('theme'); if (s) setTheme(s); } catch(e) {}
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
}

// Scroll fade
const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));

// Project tabs
const tabBtns = document.querySelectorAll('.tab-btn');
if (tabBtns.length) {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
        });
    });
}

// Auto-update copyright year
document.querySelectorAll('.footer-name').forEach(el => {
    el.textContent = el.textContent.replace(/\d{4}/, new Date().getFullYear());
});

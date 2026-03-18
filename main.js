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
if (navToggle) {
    navToggle.addEventListener('click', () => {
        const open = mobileMenu.classList.toggle('open');
        navToggle.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', open);
    });
    document.querySelectorAll('.mobile-link').forEach(l => {
        l.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// Scroll fade
const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));

// Active nav
const page = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link, .mobile-link').forEach(l => {
    l.classList.remove('active');
    const h = l.getAttribute('href');
    if (page === h || (page === '' && h === 'index.html')) l.classList.add('active');
});

// Auto-update copyright year
document.querySelectorAll('.footer-name').forEach(el => {
    el.innerHTML = el.innerHTML.replace(/\d{4}/, new Date().getFullYear());
});

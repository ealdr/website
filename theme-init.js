try { if (localStorage.getItem('theme') !== 'light') document.documentElement.setAttribute('data-theme', 'dark'); } catch(e) { document.documentElement.setAttribute('data-theme', 'dark'); }

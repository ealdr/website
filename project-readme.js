(function () {
    function esc(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function inline(text) {
        text = text.replace(/!\[([^\]]*)\]\([^)]*\)/g, '');
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (_, label, href) {
            return '<a href="' + esc(href) + '" target="_blank" rel="noopener noreferrer">' + esc(label) + '</a>';
        });
        text = text.replace(/\*\*\*([^*\n]+)\*\*\*/g, '<strong><em>$1</em></strong>');
        text = text.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
        text = text.replace(/`([^`\n]+)`/g, '<code>$1</code>');
        return text;
    }

    function renderMarkdown(md) {
        var lines = md.split('\n');
        var html = '';
        var i = 0;
        var inUL = false, inOL = false;

        function closeList() {
            if (inUL) { html += '</ul>'; inUL = false; }
            if (inOL) { html += '</ol>'; inOL = false; }
        }

        while (i < lines.length) {
            var line = lines[i];

            if (line.startsWith('```')) {
                closeList();
                var lang = line.slice(3).trim();
                i++;
                var code = '';
                while (i < lines.length && !lines[i].startsWith('```')) {
                    code += esc(lines[i]) + '\n';
                    i++;
                }
                html += '<pre><code' + (lang ? ' class="language-' + esc(lang) + '"' : '') + '>' + code + '</code></pre>';
                i++;
                continue;
            }

            var hm = line.match(/^(#{1,6})\s+(.+)/);
            if (hm) {
                closeList();
                var lvl = Math.min(hm[1].length + 1, 6);
                html += '<h' + lvl + '>' + inline(hm[2]) + '</h' + lvl + '>';
                i++; continue;
            }

            if (/^[-*_]{3,}\s*$/.test(line)) {
                closeList();
                html += '<hr>';
                i++; continue;
            }

            if (line.startsWith('> ')) {
                closeList();
                html += '<blockquote><p>' + inline(line.slice(2)) + '</p></blockquote>';
                i++; continue;
            }

            if (/^[-*+]\s/.test(line)) {
                if (inOL) { html += '</ol>'; inOL = false; }
                if (!inUL) { html += '<ul>'; inUL = true; }
                html += '<li>' + inline(line.replace(/^[-*+]\s+/, '')) + '</li>';
                i++; continue;
            }

            if (/^\d+\.\s/.test(line)) {
                if (inUL) { html += '</ul>'; inUL = false; }
                if (!inOL) { html += '<ol>'; inOL = true; }
                html += '<li>' + inline(line.replace(/^\d+\.\s+/, '')) + '</li>';
                i++; continue;
            }

            if (line.trim() === '') {
                closeList();
                i++; continue;
            }

            closeList();
            html += '<p>' + inline(line) + '</p>';
            i++;
        }

        closeList();
        return html;
    }

    var container = document.getElementById('readme-content');
    if (!container) return;
    var repo = container.dataset.repo;
    var branch = container.dataset.branch || 'main';
    if (!repo) return;

    container.innerHTML = '<p class="readme-loading">Loading README…</p>';

    fetch('https://raw.githubusercontent.com/' + repo + '/' + branch + '/README.md')
        .then(function (r) {
            if (!r.ok) throw new Error('not found');
            return r.text();
        })
        .then(function (md) {
            container.innerHTML = renderMarkdown(md);
            container.classList.add('visible');
        })
        .catch(function () {
            container.innerHTML = '<p class="readme-error">Could not load README. <a href="https://github.com/' +
                repo + '" target="_blank" rel="noopener noreferrer">View on GitHub →</a></p>';
            container.classList.add('visible');
        });
}());

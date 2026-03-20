(function() {
    // ── Scroll Reveal ──
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.08 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // ── Project Grid Loader ──
    const grid = document.getElementById('project-grid');
    if (!grid) return;

    fetch('/projects.json')
        .then(r => r.json())
        .then(projects => {
            projects.sort((a, b) => a.order - b.order);
            projects.forEach(p => {
                const card = document.createElement(p.hasDemo ? 'a' : 'div');
                if (p.hasDemo) {
                    card.href = `/projects/${p.slug}/`;
                }
                card.className = 'project-card' + (p.featured ? ' featured' : '');

                let html = '';
                html += `<div class="card-context">${p.context}</div>`;
                html += `<div class="card-title">${p.title}</div>`;
                html += `<div class="card-subtitle">${p.subtitle}</div>`;
                html += `<div class="card-desc">${p.description}</div>`;

                if (p.featured && p.longDescription) {
                    html += `<div class="card-long-desc">${p.longDescription}</div>`;
                }

                html += '<div class="tag-list">';
                p.tags.forEach(t => {
                    html += `<span class="tag">${t}</span>`;
                });
                html += '</div>';

                if (p.hasDemo) {
                    html += '<div class="demo-arrow">View interactive demo →</div>';
                }

                card.innerHTML = html;
                grid.appendChild(card);
            });

            // Observe newly created cards for reveal
            grid.querySelectorAll('.project-card').forEach((card, i) => {
                card.style.transitionDelay = `${i * 0.08}s`;
                card.classList.add('reveal');
                observer.observe(card);
            });
        })
        .catch(err => {
            // Silently fail — noscript fallback handles this
            console.warn('Failed to load projects.json:', err);
        });
})();

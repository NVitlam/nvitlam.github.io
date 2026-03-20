/* ══════════════════════════════════════════════════════════
   Projects Loader — Fetches projects.json, renders grid
   ══════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    function createTag(text) {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = text;
        return span;
    }

    function createCard(project) {
        const isLink = project.hasDemo;
        const el = document.createElement(isLink ? 'a' : 'div');
        el.className = 'project-card' + (project.featured ? ' featured' : '');

        if (isLink) {
            el.href = '/projects/' + project.slug + '/';
        } else if (!project.featured && project.longDescription) {
            el.addEventListener('click', function () {
                el.classList.toggle('expanded');
            });
        }

        let html = '';
        html += '<div class="project-card-title">' + escapeHtml(project.title) + '</div>';
        html += '<div class="project-card-subtitle">' + escapeHtml(project.subtitle) + '</div>';
        html += '<div class="project-card-context">' + escapeHtml(project.context) + '</div>';
        html += '<div class="project-card-desc">' + escapeHtml(project.description) + '</div>';

        if (project.longDescription) {
            html += '<div class="project-card-long-desc">' + escapeHtml(project.longDescription) + '</div>';
        }

        el.innerHTML = html;

        const tagsDiv = document.createElement('div');
        tagsDiv.className = 'project-card-tags';
        project.tags.forEach(function (t) {
            tagsDiv.appendChild(createTag(t));
        });
        el.appendChild(tagsDiv);

        if (isLink) {
            const label = document.createElement('div');
            label.className = 'project-card-demo-label';
            label.textContent = '\u2192 View Interactive Demo';
            el.appendChild(label);
        }

        return el;
    }

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function render(projects) {
        var grid = document.getElementById('project-grid');
        if (!grid) return;
        projects.sort(function (a, b) { return a.order - b.order; });
        projects.forEach(function (p) {
            grid.appendChild(createCard(p));
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        fetch('/projects.json')
            .then(function (res) { return res.json(); })
            .then(render)
            .catch(function (err) {
                console.warn('Failed to load projects.json:', err);
            });
    });
})();

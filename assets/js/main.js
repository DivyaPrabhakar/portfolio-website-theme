$(function () {
    'use strict';
    featured();
    pagination(false);
    tableOfContents();
    sidebarNav();
});

function sidebarNav() {
    'use strict';
    var layout = document.querySelector('.site-main.sidebar-layout');
    if (!layout) return;
    var toggle = layout.querySelector('.sidebar-toggle');
    if (!toggle) return;

    var sidebar = layout.querySelector('.sidebar');
    var closeBtn = layout.querySelector('.sidebar-close');
    var overlay = layout.querySelector('.sidebar-overlay');

    function open() {
        layout.classList.add('is-nav-open');
        toggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }
    function close() {
        layout.classList.remove('is-nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function () {
        if (layout.classList.contains('is-nav-open')) { close(); } else { open(); }
    });
    if (closeBtn) { closeBtn.addEventListener('click', close); }
    if (overlay) { overlay.addEventListener('click', close); }
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { close(); }
    });
    // Close after choosing a destination (tag link, TOC anchor, or the name/back links).
    if (sidebar) {
        sidebar.addEventListener('click', function (e) {
            if (e.target.closest('a')) { close(); }
        });
    }
    window.addEventListener('resize', function () {
        if (window.innerWidth > 900) { close(); }
    });
}

function tableOfContents() {
    'use strict';
    var container = document.querySelector('#post-toc');
    var content = document.querySelector('.gh-content');
    if (!container || !content) return;

    var headings = content.querySelectorAll('h2, h3');
    if (headings.length < 2) {
        container.remove();
        return;
    }

    function slugify(text) {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    var list = container.querySelector('.sidebar-nav-list');
    var usedIds = {};
    var items = [];
    var targets = [];

    headings.forEach(function (heading) {
        var id = heading.id;
        if (!id) {
            id = slugify(heading.textContent) || 'section';
            var base = id;
            var n = 2;
            while (document.getElementById(id) || usedIds[id]) {
                id = base + '-' + n++;
            }
            heading.id = id;
        }
        usedIds[id] = true;

        // Shared sidebar-nav markup so the TOC matches the tag nav exactly.
        var item = document.createElement('li');
        item.className = 'sidebar-nav-item';
        if (heading.tagName.toLowerCase() === 'h3') {
            item.className += ' sidebar-nav-item--sub';
        }

        var link = document.createElement('a');
        link.className = 'sidebar-nav-link';
        link.href = '#' + id;
        link.textContent = heading.textContent;
        link.addEventListener('click', function (e) {
            e.preventDefault();
            heading.scrollIntoView({behavior: 'smooth', block: 'start'});
            history.replaceState(null, '', '#' + id);
        });

        item.appendChild(link);
        list.appendChild(item);
        items.push(item);
        targets.push(heading);
    });

    container.hidden = false;

    // Scrollspy: keep exactly one item active at all times (the section you're
    // currently reading), so the post TOC selection persists like the tag nav's.
    var ticking = false;
    function syncActive() {
        ticking = false;
        var offset = 140;
        var current = 0;
        for (var i = 0; i < targets.length; i++) {
            if (targets[i].getBoundingClientRect().top - offset <= 0) {
                current = i;
            } else {
                break;
            }
        }
        items.forEach(function (it, i) {
            it.classList.toggle('is-active', i === current);
        });
    }
    function requestSync() {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(syncActive);
        }
    }
    window.addEventListener('scroll', requestSync, {passive: true});
    window.addEventListener('resize', requestSync, {passive: true});
    syncActive();
}

function portfolioNav() {
    'use strict';
    var groupHeaders = document.querySelectorAll('.portfolio-nav-group-header');
    var navItems = document.querySelectorAll('.portfolio-nav-item');
    var sections = document.querySelectorAll('.portfolio-section');
    var siteMain = document.querySelector('.site-main');
    var mobileTitleEl = document.querySelector('.portfolio-mobile-section-title');
    if (!groupHeaders.length && !navItems.length) return;

    function deactivateAll() {
        groupHeaders.forEach(function (h) { h.classList.remove('active'); });
        navItems.forEach(function (i) { i.classList.remove('active'); });
        sections.forEach(function (s) { s.classList.remove('visible', 'in-group'); });
    }

    groupHeaders.forEach(function (header) {
        header.addEventListener('click', function () {
            var isMobile = window.matchMedia('(max-width: 767px)').matches;
            deactivateAll();
            this.classList.add('active');
            var sectionIds = this.getAttribute('data-sections').split(',');
            sectionIds.forEach(function (id) {
                var section = document.getElementById('section-' + id.trim());
                if (section) { section.classList.add('visible', 'in-group'); }
            });
            if (isMobile && siteMain && mobileTitleEl) {
                mobileTitleEl.textContent = this.textContent.trim();
                siteMain.classList.add('mobile-section-view');
                document.body.classList.add('mobile-section-active');
            }
            document.body.classList.remove('is-head-open');
        });
    });

    navItems.forEach(function (item) {
        item.addEventListener('click', function () {
            var isMobile = window.matchMedia('(max-width: 767px)').matches;
            deactivateAll();
            this.classList.add('active');
            var sectionId = this.getAttribute('data-section');
            var section = document.getElementById('section-' + sectionId);
            if (section) { section.classList.add('visible'); }
            if (isMobile && siteMain && mobileTitleEl) {
                mobileTitleEl.textContent = this.textContent.trim();
                siteMain.classList.add('mobile-section-view');
                document.body.classList.add('mobile-section-active');
            }
            document.body.classList.remove('is-head-open');
        });
    });

    var logo = document.querySelector('.gh-head-logo');
    if (logo && siteMain) {
        logo.addEventListener('click', function (e) {
            if (window.matchMedia('(max-width: 767px)').matches && siteMain.classList.contains('mobile-section-view')) {
                e.preventDefault();
                siteMain.classList.remove('mobile-section-view');
                document.body.classList.remove('mobile-section-active');
            }
        });
    }
}

function featured() {
    'use strict';
    $('.featured-feed').owlCarousel({
        dots: false,
        margin: 30,
        nav: true,
        navText: [
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" class="icon"><path d="M20.547 22.107L14.44 16l6.107-6.12L18.667 8l-8 8 8 8 1.88-1.893z"></path></svg>',
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" class="icon"><path d="M11.453 22.107L17.56 16l-6.107-6.12L13.333 8l8 8-8 8-1.88-1.893z"></path></svg>',
        ],
        responsive: {
            0: {
                items: 1,
            },
            768: {
                items: 2,
            },
            992: {
                items: 3,
            },
        },
    });
}

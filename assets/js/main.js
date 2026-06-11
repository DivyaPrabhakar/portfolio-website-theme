$(function () {
    'use strict';
    featured();
    pagination(false);
    portfolioNav();
    tableOfContents();
});

function tableOfContents() {
    'use strict';
    var container = document.querySelector('.post-toc');
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

    var list = container.querySelector('.post-toc-list');
    var usedIds = {};
    var links = [];
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

        var item = document.createElement('li');
        item.className = 'post-toc-item post-toc-item-' + heading.tagName.toLowerCase();

        var link = document.createElement('a');
        link.className = 'post-toc-link';
        link.href = '#' + id;
        link.textContent = heading.textContent;
        link.addEventListener('click', function (e) {
            e.preventDefault();
            heading.scrollIntoView({behavior: 'smooth', block: 'start'});
            history.replaceState(null, '', '#' + id);
            container.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
        });

        item.appendChild(link);
        list.appendChild(item);
        links.push(link);
        targets.push(heading);
    });

    container.hidden = false;

    var toggle = container.querySelector('.post-toc-toggle');
    toggle.addEventListener('click', function () {
        var open = container.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    if ('IntersectionObserver' in window) {
        var visible = {};
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                visible[entry.target.id] = entry.isIntersecting;
            });
            var activeIndex = -1;
            for (var i = 0; i < targets.length; i++) {
                if (visible[targets[i].id]) { activeIndex = i; break; }
            }
            links.forEach(function (l, i) {
                l.classList.toggle('active', i === activeIndex);
            });
        }, {rootMargin: '-10% 0px -70% 0px'});

        targets.forEach(function (target) { observer.observe(target); });
    }
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

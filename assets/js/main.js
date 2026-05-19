$(function () {
    'use strict';
    featured();
    pagination(false);
    portfolioNav();
});

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

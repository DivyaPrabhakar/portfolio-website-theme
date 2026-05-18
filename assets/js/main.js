$(function () {
    'use strict';
    featured();
    pagination(false);
    portfolioNav();
});

function portfolioNav() {
    'use strict';
    var navItems = document.querySelectorAll('.portfolio-nav-item');
    var sections = document.querySelectorAll('.portfolio-section');
    var siteMain = document.querySelector('.site-main');
    var mobileTitleEl = document.querySelector('.portfolio-mobile-section-title');
    if (!navItems.length) return;

    navItems.forEach(function (item) {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            var targetSection = this.getAttribute('data-section');
            var isMobile = window.matchMedia('(max-width: 767px)').matches;

            navItems.forEach(function (nav) { nav.classList.remove('active'); });
            document.querySelectorAll('[data-section="' + targetSection + '"]').forEach(function (nav) {
                nav.classList.add('active');
            });

            sections.forEach(function (section) { section.classList.remove('visible'); });
            var target = document.getElementById('section-' + targetSection);
            if (target) { target.classList.add('visible'); }

            if (isMobile && siteMain && mobileTitleEl) {
                mobileTitleEl.textContent = this.textContent.trim();
                siteMain.classList.add('mobile-section-view');
            }

            document.body.classList.remove('is-head-open');
        });
    });
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

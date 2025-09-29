(function () {
  "use strict";

  let validHeadings = [];
  let isUserScrolling = true;
  let scrollTimeout;

  function initAutoTOC() {
    const tocContainer = document.getElementById("auto-toc-container");
    const tocNav = document.getElementById("auto-toc-nav");
    const tocToggle = document.getElementById("toc-toggle");
    const mobileTrigger = document.getElementById("mobile-toc-trigger");
    const backdrop = document.getElementById("toc-backdrop");

    if (!tocContainer || !tocNav) return;

    // Find content
    const contentSelectors = [
      ".gh-content",
      ".post-content",
      "main article",
      ".content",
      "article .post-body",
      ".kg-width-wide",
      ".kg-width-full",
    ];

    let content = null;
    for (const selector of contentSelectors) {
      content = document.querySelector(selector);
      if (content) break;
    }

    if (!content) {
      content =
        document.querySelector("article") || document.querySelector("main");
    }

    if (!content) {
      console.log("Auto TOC: Content area not found");
      return;
    }

    // Find valid headings
    const headings = content.querySelectorAll("h1, h2, h3, h4, h5, h6");
    validHeadings = Array.from(headings).filter((heading) => {
      const text = heading.textContent.trim();
      return text && text.length > 0;
    });

    if (validHeadings.length === 0) {
      tocContainer.style.display = "none";
      mobileTrigger.style.display = "none";
      return;
    }

    // Generate IDs
    const usedIds = new Set();
    validHeadings.forEach((heading, index) => {
      if (!heading.id) {
        let baseId = heading.textContent
          .trim()
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "");

        if (!baseId) baseId = "heading";

        let finalId = baseId;
        let counter = 1;
        while (usedIds.has(finalId)) {
          finalId = `${baseId}-${counter}`;
          counter++;
        }

        heading.id = finalId;
        usedIds.add(finalId);
      } else {
        usedIds.add(heading.id);
      }
    });

    // Build TOC
    let tocHTML = "";
    validHeadings.forEach((heading) => {
      const level = heading.tagName.toLowerCase();
      const text = heading.textContent.trim();
      const id = heading.id;

      if (text && text.length > 0) {
        tocHTML += `<a href="#${id}" class="toc-link ${level}" data-target="${id}">${text}</a>`;
      }
    });

    tocNav.innerHTML = tocHTML;

    // Show TOC
    setTimeout(() => {
      tocContainer.classList.add("show");
    }, 200);

    // Click handlers
    tocNav.addEventListener("click", function (e) {
      const link = e.target.closest(".toc-link");
      if (link) {
        e.preventDefault();
        isUserScrolling = false;

        const targetId = link.getAttribute("data-target");
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          // Simple, reliable scroll
          const targetTop =
            targetElement.getBoundingClientRect().top +
            window.pageYOffset -
            100;

          window.scrollTo({
            top: targetTop,
            behavior: "smooth",
          });

          // Update active immediately
          const tocLinks = tocNav.querySelectorAll(".toc-link");
          tocLinks.forEach((l) => l.classList.remove("active"));
          link.classList.add("active");

          // Hide mobile TOC after click
          if (window.innerWidth <= 768) {
            tocContainer.classList.add("mobile-hidden");
            if (backdrop) backdrop.classList.remove("show");
          }

          // Re-enable scroll spy after scroll completes
          setTimeout(() => {
            isUserScrolling = true;
          }, 1000);
        }
      }
    });

    // Mobile toggle handlers
    if (tocToggle) {
      tocToggle.addEventListener("click", function () {
        tocContainer.classList.add("mobile-hidden");
        if (backdrop) backdrop.classList.remove("show");
      });
    }

    if (mobileTrigger) {
      mobileTrigger.addEventListener("click", function () {
        tocContainer.classList.remove("mobile-hidden");
        if (backdrop) backdrop.classList.add("show");
      });
    }

    if (backdrop) {
      backdrop.addEventListener("click", function () {
        tocContainer.classList.add("mobile-hidden");
        backdrop.classList.remove("show");
      });
    }

    // Simple scroll spy
    function updateActiveLink() {
      if (!isUserScrolling) return;

      let activeHeading = null;
      const scrollPos = window.scrollY + 150;

      // Find the heading that's currently in view
      for (let i = validHeadings.length - 1; i >= 0; i--) {
        const heading = validHeadings[i];
        const headingTop = heading.offsetTop;

        if (scrollPos >= headingTop) {
          activeHeading = heading;
          break;
        }
      }

      // Update active states
      const tocLinks = tocNav.querySelectorAll(".toc-link");
      tocLinks.forEach((link) => {
        link.classList.remove("active");
        if (
          activeHeading &&
          link.getAttribute("data-target") === activeHeading.id
        ) {
          link.classList.add("active");
        }
      });
    }

    // Throttled scroll handler
    function handleScroll() {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(updateActiveLink, 50);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    setTimeout(updateActiveLink, 300);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAutoTOC);
  } else {
    initAutoTOC();
  }
})();

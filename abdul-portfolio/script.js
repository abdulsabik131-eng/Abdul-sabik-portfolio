
"use strict";

/* ==========================================
   ABDUL SABIK — PORTFOLIO INTERACTIONS
   Replace your existing script.js with this.
========================================== */

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // 1. CURRENT YEAR
  const yearElement = $("#year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 2. MOBILE NAVIGATION
  const menuToggle = $("#menuToggle");
  const navLinks = $("#navLinks");

  function closeMenu() {
    if (!menuToggle || !navLinks) return;

    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    menuToggle.textContent = "☰";
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );
      menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    $$("#navLinks a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (
        navLinks.classList.contains("open") &&
        !navLinks.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 650) closeMenu();
    });
  }

  // 3. SCROLL PROGRESS BAR
  const progressBar = $("#readingProgress");

  function updateScrollProgress() {
    if (!progressBar) return;

    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const percentage =
      scrollableHeight > 0
        ? (window.scrollY / scrollableHeight) * 100
        : 0;

    progressBar.style.width = `${Math.min(100, percentage)}%`;
    progressBar.setAttribute("aria-valuenow", String(Math.round(percentage)));
  }

  // 4. BACK-TO-TOP BUTTON
  const backToTop = $("#backToTop");

  function updateBackToTop() {
    if (!backToTop) return;

    const visible = window.scrollY > 450;
    backToTop.classList.toggle("visible", visible);
    backToTop.setAttribute("aria-hidden", String(!visible));
    backToTop.tabIndex = visible ? 0 : -1;
  }

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: reduceMotion ? "auto" : "smooth"
      });
    });
  }

  // 5. ACTIVE NAV LINK WHILE SCROLLING
  const navAnchors = $$("#navLinks a[href^='#']");
  const sections = navAnchors
    .map((link) => $(link.getAttribute("href")))
    .filter(Boolean);

  function updateActiveNavigation() {
    if (!sections.length) return;

    const marker = window.scrollY + 150;
    let activeSection = sections[0];

    sections.forEach((section) => {
      if (section.offsetTop <= marker) activeSection = section;
    });

    navAnchors.forEach((link) => {
      const isActive =
        link.getAttribute("href") === `#${activeSection.id}`;

      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  // 6. SCROLL REVEAL ANIMATIONS
  const revealItems = $$(
    ".skill-card, .project-card, .timeline-item, .about-panel, .contact-panel"
  );

  if (!reduceMotion && "IntersectionObserver" in window) {
    revealItems.forEach((item) => item.classList.add("reveal"));

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  // 7. OPTIONAL TYPING EFFECT
  // Add data-typing to a heading or span to enable it.
  const typingElement = $("[data-typing]");

  if (typingElement) {
    const phrases = (typingElement.dataset.phrases ||
      typingElement.textContent).split("|");

    if (!reduceMotion && phrases.length > 1) {
      let phraseIndex = 0;
      let characterIndex = phrases[0].length;
      let deleting = true;

      function typeNextCharacter() {
        const phrase = phrases[phraseIndex];

        if (deleting) {
          characterIndex--;
        } else {
          characterIndex++;
        }

        typingElement.textContent = phrase.slice(
          0,
          Math.max(0, characterIndex)
        );

        let delay = deleting ? 45 : 80;

        if (characterIndex <= 0 && deleting) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          delay = 350;
        } else if (
          characterIndex >= phrases[phraseIndex].length &&
          !deleting
        ) {
          deleting = true;
          delay = 1300;
        }

        window.setTimeout(typeNextCharacter, delay);
      }

      window.setTimeout(typeNextCharacter, 1300);
    }
  }

  // 8. THEME TOGGLE
  // Optional HTML button: id="themeToggle"
  const themeToggle = $("#themeToggle");
  const savedTheme = safeGetTheme();

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;

    if (themeToggle) {
      const isLight = theme === "light";
      themeToggle.textContent = isLight ? "☾ Dark mode" : "☀ Light mode";
      themeToggle.setAttribute(
        "aria-label",
        isLight ? "Switch to dark theme" : "Switch to light theme"
      );
      themeToggle.setAttribute("aria-pressed", String(isLight));
    }
  }

  function safeGetTheme() {
    try {
      return localStorage.getItem("portfolio-theme") || "dark";
    } catch {
      return "dark";
    }
  }

  function safeSaveTheme(theme) {
    try {
      localStorage.setItem("portfolio-theme", theme);
    } catch {
      // Theme still works for the current page session.
    }
  }

  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme =
        document.documentElement.dataset.theme === "light"
          ? "dark"
          : "light";

      applyTheme(nextTheme);
      safeSaveTheme(nextTheme);
    });
  }

  // 9. SKILLS SEARCH
  // Optional input: id="skillSearch"
  const skillSearch = $("#skillSearch");
  const skillCards = $$(".skill-card");
  const skillFilterButtons = $$("[data-skill-filter]");
  let activeSkillFilter = "all";

  function filterSkills() {
    const query = skillSearch
      ? skillSearch.value.trim().toLowerCase()
      : "";

    skillCards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      const category = card.dataset.category || "all";

      const matchesQuery = text.includes(query);
      const matchesCategory =
        activeSkillFilter === "all" ||
        category === activeSkillFilter;

      card.hidden = !(matchesQuery && matchesCategory);
    });
  }

  if (skillSearch) {
    skillSearch.addEventListener("input", filterSkills);
  }

  skillFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeSkillFilter = button.dataset.skillFilter || "all";

      skillFilterButtons.forEach((item) => {
        item.classList.toggle("active", item === button);
        item.setAttribute("aria-pressed", String(item === button));
      });

      filterSkills();
    });
  });

  // 10. PROJECT SEARCH AND CATEGORY FILTER
  // Optional input: id="projectSearch"
  const projectSearch = $("#projectSearch");
  const projectCards = $$(".project-card");
  const projectFilterButtons = $$("[data-project-filter]");
  let activeProjectFilter = "all";

  function filterProjects() {
    const query = projectSearch
      ? projectSearch.value.trim().toLowerCase()
      : "";

    let visibleCount = 0;

    projectCards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      const category = card.dataset.category || "all";

      const matchesQuery = text.includes(query);
      const matchesCategory =
        activeProjectFilter === "all" ||
        category === activeProjectFilter;

      const visible = matchesQuery && matchesCategory;
      card.hidden = !visible;

      if (visible) visibleCount++;
    });

    const resultMessage = $("#projectResults");
    if (resultMessage) {
      resultMessage.textContent =
        `${visibleCount} project${visibleCount === 1 ? "" : "s"} found`;
    }
  }

  if (projectSearch) {
    projectSearch.addEventListener("input", filterProjects);
  }

  projectFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeProjectFilter = button.dataset.projectFilter || "all";

      projectFilterButtons.forEach((item) => {
        item.classList.toggle("active", item === button);
        item.setAttribute("aria-pressed", String(item === button));
      });

      filterProjects();
    });
  });

  // 11. COPY EMAIL BUTTON
  // Optional button: id="copyEmail" data-email="your@email.com"
  const copyEmailButton = $("#copyEmail");

  if (copyEmailButton) {
    copyEmailButton.addEventListener("click", async () => {
      const email =
        copyEmailButton.dataset.email ||
        "abdulsabik131@gmail.com";

      const originalText = copyEmailButton.textContent;

      try {
        await navigator.clipboard.writeText(email);
        copyEmailButton.textContent = "Email copied ✓";
      } catch {
        // Fallback for browsers where Clipboard API is unavailable.
        const temporaryInput = document.createElement("textarea");
        temporaryInput.value = email;
        temporaryInput.setAttribute("readonly", "");
        temporaryInput.style.position = "fixed";
        temporaryInput.style.opacity = "0";
        document.body.appendChild(temporaryInput);
        temporaryInput.select();

        const copied = document.execCommand("copy");
        temporaryInput.remove();

        copyEmailButton.textContent = copied
          ? "Email copied ✓"
          : email;
      }

      window.setTimeout(() => {
        copyEmailButton.textContent = originalText;
      }, 2200);
    });
  }

  // 12. PROJECT CARD KEYBOARD SUPPORT
  // Makes only explicitly marked cards keyboard-focusable.
  $$("[data-card-link]").forEach((card) => {
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "link");

    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;

      const link = $("a[href]", card);
      if (!link) return;

      event.preventDefault();
      link.click();
    });
  });

  // 13. CONTACT FORM VALIDATION
  // Optional form: id="contactForm"
  const contactForm = $("#contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const nameInput = $('[name="name"]', contactForm);
      const emailInput = $('[name="email"]', contactForm);
      const messageInput = $('[name="message"]', contactForm);
      const status = $("#formStatus");

      const name = nameInput ? nameInput.value.trim() : "";
      const email = emailInput ? emailInput.value.trim() : "";
      const message = messageInput ? messageInput.value.trim() : "";

      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!name || !validEmail || !message) {
        if (status) {
          status.textContent =
            "Please enter your name, a valid email, and a message.";
          status.setAttribute("role", "alert");
        }
        return;
      }

      if (status) {
        status.textContent =
          "Your details look valid. This demo form does not send messages yet; use the email link to contact me.";
        status.setAttribute("role", "status");
      }
    });
  }

  // 14. ONE THROTTLED SCROLL HANDLER
  let scrollScheduled = false;

  function handleScroll() {
    if (scrollScheduled) return;

    scrollScheduled = true;

    window.requestAnimationFrame(() => {
      updateScrollProgress();
      updateBackToTop();
      updateActiveNavigation();
      scrollScheduled = false;
    });
  }

  window.addEventListener("scroll", handleScroll, { passive: true });

  // Initial state
  updateScrollProgress();
  updateBackToTop();
  updateActiveNavigation();
});

document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.style.outline = "3px solid lime";

  const body = document.body;

  const slidebar = document.querySelector(".slidebar");
  const menuBtn = document.querySelector(".menu-icon");
  const closeBtn = document.querySelector(".close-icon");
  const overlay = document.getElementById("overlay");
  const navbar = document.querySelector(".navbar");
  const hero = document.querySelector("#inicio .hero");

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ===== Load animations trigger
  requestAnimationFrame(() => body.classList.add("is-loaded"));

  // ===== Helpers
  const getNavbarOffset = () => {
    if (!navbar) return 70;
    const h = navbar.getBoundingClientRect().height || 70;
    return Math.max(60, Math.floor(h));
  };

  const openMenu = () => {
    slidebar?.classList.add("active");
    overlay?.classList.add("active");
    overlay?.setAttribute("aria-hidden", "false");
    body.classList.add("no-scroll");
    menuBtn?.setAttribute("aria-expanded", "true");
  };

  const closeMenu = () => {
    slidebar?.classList.remove("active");
    overlay?.classList.remove("active");
    overlay?.setAttribute("aria-hidden", "true");
    body.classList.remove("no-scroll");
    menuBtn?.setAttribute("aria-expanded", "false");
  };

  menuBtn?.addEventListener("click", openMenu);
  closeBtn?.addEventListener("click", closeMenu);
  overlay?.addEventListener("click", closeMenu);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // ===== Smooth scroll (con offset por navbar)
  const anchorLinks = document.querySelectorAll("a[href^='#']");
  anchorLinks.forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      closeMenu();

      const top = target.getBoundingClientRect().top + window.pageYOffset - getNavbarOffset() + 2;
      window.scrollTo({ top, behavior: prefersReduced ? "auto" : "smooth" });
    });
  });

  // ===== Navbar solid on scroll
  const onScrollNavbar = () => {
    if (!navbar) return;
    const solid = window.scrollY > 20;
    navbar.classList.toggle("navbar--solid", solid);
  };
  onScrollNavbar();
  window.addEventListener("scroll", onScrollNavbar, { passive: true });

  // ===== Hero parallax variable
  if (hero && !prefersReduced) {
    let raf = 0;
    const updateHeroParallax = () => {
      const y = window.scrollY || 0;
      const par = Math.max(-30, Math.min(30, y * 0.08)); // clamp
      hero.style.setProperty("--hero-par", `${par}px`);
      raf = 0;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (raf) return;
        raf = requestAnimationFrame(updateHeroParallax);
      },
      { passive: true }
    );

    updateHeroParallax();
  }

  // ===== Reveal + stagger
  // Aseguramos que ciertos elementos también tengan reveal aunque te olvides en HTML
  const ensureReveal = (selector) => {
    document.querySelectorAll(selector).forEach((el) => el.classList.add("reveal"));
  };

  ensureReveal(".service-card");
  ensureReveal(".footer-column");
  ensureReveal(".about-media");
  ensureReveal(".about-media-mobile");

  // marcamos reveal-img automáticamente en contenedores de imágenes
  document.querySelectorAll(".about-media.reveal, .about-media-mobile.reveal, .image-wrapper").forEach((el) => {
    el.classList.add("reveal-img");
    el.classList.add("reveal");
  });

  const revealEls = Array.from(document.querySelectorAll(".reveal"));

  // stagger: cada elemento recibe un delay variable en ms
  revealEls.forEach((el, i) => {
    const delay = Math.min(i * 80, 520); // tope para que no se vaya al infinito
    el.style.setProperty("--d", `${delay}ms`);
  });

  // Fallback: si no hay IntersectionObserver, mostramos todo igual
  if (!("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in-view"));
    body.classList.add("is-loaded");
    requestAnimationFrame(() => body.classList.add("is-loaded"));
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => io.observe(el));
});

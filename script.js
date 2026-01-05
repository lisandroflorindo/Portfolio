document.addEventListener("DOMContentLoaded", () => {
  const slidebar = document.querySelector(".slidebar");
  const menuIcon = document.querySelector(".menu-icon i");
  const closeIcon = document.querySelector(".close-icon i");
  const overlay = document.getElementById("overlay");
  const navbar = document.querySelector(".navbar");

  const navLinksSlidebar = document.querySelectorAll(".slidebar a[href^='#']");
  const navLinksNavbar = document.querySelectorAll(".navbar a[href^='#']");
  const allNavLinks = [...navLinksNavbar, ...navLinksSlidebar];

  const hireButtons = document.querySelectorAll(".hire-btn");
  const revealEls = document.querySelectorAll(".reveal");

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const getNavbarOffset = () => {
    if (!navbar) return 70;
    const h = navbar.getBoundingClientRect().height || 70;
    return Math.max(60, Math.floor(h));
  };

  const smoothScrollTo = (targetEl) => {
    if (!targetEl) return;
    const offset = getNavbarOffset() + 10;
    const top = targetEl.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const openMenu = () => {
    if (!slidebar) return;
    slidebar.classList.add("active");
    overlay?.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    if (!slidebar) return;
    slidebar.classList.remove("active");
    overlay?.classList.remove("active");
    document.body.style.overflow = "";
  };

  menuIcon?.addEventListener("click", openMenu);
  closeIcon?.addEventListener("click", closeMenu);
  overlay?.addEventListener("click", closeMenu);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  navLinksSlidebar.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetEl = targetId ? document.querySelector(targetId) : null;
      smoothScrollTo(targetEl);
      closeMenu();
    });
  });

  // WhatsApp en todos los botones hire-btn (navbar/hero/sidebar/about)
  hireButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const numero = "5493764564963";
      const mensaje = "¡Hola! Me gustaría contratarte para un proyecto web.";
      const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
      window.open(url, "_blank");
      closeMenu();
    });
  });

  navLinksNavbar.forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      const targetEl = document.querySelector(href);
      if (!targetEl) return;
      e.preventDefault();
      smoothScrollTo(targetEl);
    });
  });

  // Reveal
  if (revealEls.length && !prefersReduced) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  // Stagger: Servicios
  const serviceCards = document.querySelectorAll(".services-grid .service-card.reveal");
  serviceCards.forEach((card, idx) => {
    card.style.transitionDelay = `${idx * 180}ms`;
  });

  // ✅ Activa TODOS los links (Home/Nosotros/Servicios/Contacto)
  const sectionIds = [...new Set(
    allNavLinks
      .map((a) => a.getAttribute("href"))
      .filter((h) => h && h.startsWith("#") && h.length > 1)
  )];

  const targets = sectionIds
    .map((id) => ({ id, el: document.querySelector(id) }))
    .filter((x) => x.el);

  const setActiveLink = (id) => {
    allNavLinks.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === id);
    });
  };

  const updateActiveOnScroll = () => {
    if (!targets.length) return;

    const offset = getNavbarOffset() + 12;
    const y = window.scrollY + offset;

    const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (bottom) {
      setActiveLink(targets[targets.length - 1].id);
      return;
    }

    let current = targets[0].id;

    for (const t of targets) {
      const topAbs = t.el.getBoundingClientRect().top + window.scrollY;
      if (topAbs <= y) current = t.id;
      else break;
    }

    setActiveLink(current);
  };

  window.addEventListener("scroll", updateActiveOnScroll, { passive: true });
  window.addEventListener("resize", updateActiveOnScroll);
  updateActiveOnScroll();
});

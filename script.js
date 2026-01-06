document.addEventListener("DOMContentLoaded", () => {
  const slidebar = document.querySelector(".slidebar");
  const menuBtn = document.querySelector(".menu-icon");
  const closeBtn = document.querySelector(".close-icon");
  const overlay = document.getElementById("overlay");
  const navbar = document.querySelector(".navbar");

  const navLinksSlidebar = document.querySelectorAll(".slidebar a[href^='#']");
  const navLinksNavbar = document.querySelectorAll(".navbar a[href^='#']");
  const allNavLinks = [...navLinksNavbar, ...navLinksSlidebar];

  const hireButtons = document.querySelectorAll(".hire-btn");

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
    menuBtn?.setAttribute("aria-expanded", "true");
  };

  const closeMenu = () => {
    if (!slidebar) return;
    slidebar.classList.remove("active");
    overlay?.classList.remove("active");
    document.body.style.overflow = "";
    menuBtn?.setAttribute("aria-expanded", "false");
  };

  // Menú
  menuBtn?.addEventListener("click", openMenu);
  closeBtn?.addEventListener("click", closeMenu);
  overlay?.addEventListener("click", closeMenu);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // Navegación sidebar (scroll suave + cierra menú)
  navLinksSlidebar.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (!targetId || !targetId.startsWith("#")) return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();
      smoothScrollTo(targetEl);
      closeMenu();
    });
  });

  // Navegación navbar (scroll suave)
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

  // WhatsApp: aplica a todos los .hire-btn
  hireButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      const numero = "5493764564963";
      const mensaje = "¡Hola! Me gustaría contratarte para un proyecto web.";
      const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

      window.open(url, "_blank", "noopener");
      closeMenu();
    });
  });

  // Activa links según scroll (navbar + sidebar)
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

  // Oculta el botón flotante cuando se ve el footer / contacto
  const waFloat = document.querySelector(".wa-float");
  const contactSection = document.querySelector("#contacto");
  const footerEl = document.querySelector("footer.footer");
  const hideTarget = contactSection || footerEl;

  if (waFloat && hideTarget) {
    const ioFloat = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          waFloat.classList.toggle("is-hidden", entry.isIntersecting);
        });
      },
      { threshold: 0.05 }
    );

    ioFloat.observe(hideTarget);
  }

  // ===== Libs: AOS + GLightbox =====
  if (window.AOS) {
    AOS.init({
      once: true,
      duration: 650,
      offset: 120,
      easing: "ease-out",
    });
  }

  if (window.GLightbox) {
    GLightbox({
      selector: ".glightbox",
      touchNavigation: true,
      loop: true,
    });
  }

  // ===== Hero typing (Typed.js) =====
  const titleEl = document.querySelector("#typedTitle");
  if (titleEl && window.Typed) {
    new Typed("#typedTitle", {
      strings: ["Soluciones Informáticas"],
      typeSpeed: 30,
      startDelay: 30,
      showCursor: true,
      cursorChar: "|",
      loop: false,
    });
  }

});

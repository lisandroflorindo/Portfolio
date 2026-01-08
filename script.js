(() => {
  const qs = (s, p = document) => p.querySelector(s);
  const qsa = (s, p = document) => [...p.querySelectorAll(s)];

  const numeroWA = "5493764564963";
  const mensajeWA = "¡Hola! Me gustaría contratarte para un proyecto web.";

  const safeOpenWA = () => {
    const url = `https://wa.me/${numeroWA}?text=${encodeURIComponent(mensajeWA)}`;
    window.open(url, "_blank", "noopener");
  };

  const forceHeroVisible = () => {
    // Si AOS no inicializa, elementos con data-aos pueden quedar opacity:0
    qsa("#inicio [data-aos]").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  };

  const initTypedHero = () => {
    const el = qs("#typedTitle");
    if (!el) return;

    // Fallback visible siempre
    el.textContent = "Soluciones Informáticas";

    // Si Typed está, animamos. Si no, queda el fallback.
    if (window.Typed) {
      // Evitar doble instancia
      if (el._typedInstance && typeof el._typedInstance.destroy === "function") {
        el._typedInstance.destroy();
      }

      el._typedInstance = new window.Typed("#typedTitle", {
        strings: ["Soluciones Informáticas"],
        typeSpeed: 30,
        startDelay: 30,
        showCursor: true,
        cursorChar: "|",
        loop: false,
      });
    }
  };

  const initMenu = () => {
    const slidebar = qs(".slidebar");
    const menuBtn = qs(".menu-icon");
    const closeBtn = qs(".close-icon");
    const overlay = qs("#overlay");

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

    menuBtn?.addEventListener("click", openMenu);
    closeBtn?.addEventListener("click", closeMenu);
    overlay?.addEventListener("click", closeMenu);

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    return { closeMenu };
  };

  const initSmoothScroll = (closeMenuFn) => {
    const navbar = qs(".navbar");

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

    // Sidebar links
    qsa(".slidebar a[href^='#']").forEach((link) => {
      link.addEventListener("click", (e) => {
        const id = link.getAttribute("href");
        if (!id || !id.startsWith("#")) return;
        const target = qs(id);
        if (!target) return;

        e.preventDefault();
        smoothScrollTo(target);
        closeMenuFn?.();
      });
    });

    // Navbar links
    qsa(".navbar a[href^='#']").forEach((a) => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href");
        if (!href || !href.startsWith("#")) return;
        const target = qs(href);
        if (!target) return;

        e.preventDefault();
        smoothScrollTo(target);
      });
    });

    // Active links on scroll
    const allNavLinks = [
      ...qsa(".navbar a[href^='#']"),
      ...qsa(".slidebar a[href^='#']"),
    ];

    const sectionIds = [
      ...new Set(
        allNavLinks
          .map((a) => a.getAttribute("href"))
          .filter((h) => h && h.startsWith("#") && h.length > 1)
      ),
    ];

    const targets = sectionIds
      .map((id) => ({ id, el: qs(id) }))
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

      const bottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;

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
  };

  const initWhatsAppButtons = (closeMenuFn) => {
    qsa(".hire-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        safeOpenWA();
        closeMenuFn?.();
      });
    });
  };

  const initWaFloatHide = () => {
    const waFloat = qs(".wa-float");
    const contactSection = qs("#contacto");
    const footerEl = qs("footer.footer");
    const hideTarget = contactSection || footerEl;

    if (waFloat && hideTarget) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            waFloat.classList.toggle("is-hidden", entry.isIntersecting);
          });
        },
        { threshold: 0.05 }
      );
      io.observe(hideTarget);
    }
  };

  const initLibs = () => {
    // AOS
    if (window.AOS) {
      window.AOS.init({
        once: true,
        duration: 650,
        offset: 120,
        easing: "ease-out",
      });

      // Por si imágenes/cargas cambian layout
      window.AOS.refreshHard();
    } else {
      // Si AOS no está, evitamos que quede todo invisible por el CSS
      forceHeroVisible();
    }

    // GLightbox
    if (window.GLightbox) {
      window.GLightbox({
        selector: ".glightbox",
        touchNavigation: true,
        loop: true,
      });
    }
  };

  const initFailsafe = () => {
    // Si AOS CSS dejó cosas en opacity:0 y AOS JS no arrancó, lo levantamos igual.
    setTimeout(() => {
      if (!document.body.classList.contains("aos-init")) {
        forceHeroVisible();
      }
    }, 1200);
  };

  // ===== Boot =====
  document.addEventListener("DOMContentLoaded", () => {
    const menuApi = initMenu();
    const closeMenuFn = menuApi?.closeMenu;

    initSmoothScroll(closeMenuFn);
    initWhatsAppButtons(closeMenuFn);
    initWaFloatHide();

    // Fallback visible inmediato
    initTypedHero();
  });

  // En load inicializamos libs (más estable en móviles lentos)
  window.addEventListener("load", () => {
    initLibs();
    initTypedHero();
    initFailsafe();
  });
})();

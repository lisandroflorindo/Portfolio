document.addEventListener("DOMContentLoaded", () => {
    // Selecciones principales
    const slidebar = document.querySelector(".slidebar");
    const menuIcon = document.querySelector(".menu-icon i");
    const closeIcon = document.querySelector(".close-icon i");
    const navLinks = document.querySelectorAll(".slidebar a"); // Links dentro del slide-bar
    const hireButton = document.querySelector(".hire-btn"); // Botón "Contrátame" del navbar

    // === ABRIR SLIDE-BAR ===
    menuIcon.addEventListener("click", () => {
        slidebar.classList.add("active");
    });

    // === CERRAR SLIDE-BAR ===
    closeIcon.addEventListener("click", () => {
        slidebar.classList.remove("active");
    });

    // === FUNCIONALIDAD DE LOS LINKS DEL SLIDE-BAR ===
    navLinks.forEach(link => {
        link.addEventListener("click", e => {
        e.preventDefault();
        const targetId = link.getAttribute("href");
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Scroll suave
            window.scrollTo({
            top: targetElement.offsetTop - 70,
            behavior: "smooth"
            });
        }
        // Cierra el slide-bar después de hacer click
        slidebar.classList.remove("active");
        });
    });

    // === FUNCIÓN DEL BOTÓN "CONTRÁTAME" ===
    hireButton.addEventListener("click", () => {
        const numero = "5493764564963";
        const mensaje = "¡Hola Lisandro! Me gustaría contratarte para un proyecto web.";
        const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, "_blank");
    });

    // ==== Scroll suave al hacer clic en los enlaces del navbar ====
    document.querySelectorAll('.navbar a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        }
    });
    });

    // Scroll suave para los enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
        e.preventDefault();
        window.scrollTo({
            top: target.offsetTop,
            behavior: 'smooth'
        });
        }
    });
    });

});

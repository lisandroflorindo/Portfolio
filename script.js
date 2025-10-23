document.addEventListener("DOMContentLoaded", () => {
    // ==== MENU MÓVIL (slidebar) ====
    const menuToggle = document.querySelector('.menu-toggle');
    const slidebar = document.querySelector('.slidebar');
    const closeBtn = document.querySelector('.close-btn');

    menuToggle.addEventListener('click', () => {
    slidebar.classList.add('active');
    });

    closeBtn.addEventListener('click', () => {
    slidebar.classList.remove('active');
    });

    // ==== BOTONES "CONTRÁTAME" (desktop + móvil) ====
    const hireBtn = document.querySelector('.hire-btn');
    const hireBtnMobile = document.querySelector('.hire-btn-mobile');

    // URL de WhatsApp con tu número y mensaje
    const whatsappURL = 'https://wa.me/5493764564963?text=¡Hola!%20Estoy%20interesado%20en%20tus%20servicios.';

    function openWhatsApp() {
    slidebar.classList.remove('active'); // cierra el menú si está abierto
    window.open(whatsappURL, '_blank');
    }

    // Asignar la función a ambos botones
    if (hireBtn) hireBtn.addEventListener('click', openWhatsApp);
    if (hireBtnMobile) hireBtnMobile.addEventListener('click', openWhatsApp);

    // Abrir slidebar
    menuToggle.addEventListener('click', () => {
    slidebar.classList.add('active');
    });

    // Cerrar slidebar al presionar el ícono de cierre
    closeBtn.addEventListener('click', () => {
    slidebar.classList.remove('active');
    });

    // Cerrar slidebar al hacer clic en un enlace
    document.querySelectorAll('.slidebar a').forEach(link => {
    link.addEventListener('click', () => {
        slidebar.classList.remove('active');
    });
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
});

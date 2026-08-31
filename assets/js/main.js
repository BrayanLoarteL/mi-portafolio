/* ============================================
   PORTAFOLIO WEB — Lógica principal de la aplicación
   JS Puro | Navegación con Scroll-Spy | Menú Móvil
   ============================================ */

(function () {
  'use strict';

  // ─── Referencias del DOM ──────────────────────────
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const hamburger = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navOverlay = document.getElementById('nav-overlay');
  let sections = [];

  // ─── Efecto de scroll en la cabecera ────────────────────
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveNav();
  }

  // ─── Scroll-Spy: activa el enlace de navegación según la sección visible ───
  function updateActiveNav() {
    let currentId = '';
    const offset = header.offsetHeight + 20;

    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top <= offset) {
        currentId = section.id;
      }
    });

    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${currentId}`;
      link.classList.toggle('active', isActive);
      link.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
  }

  // ─── Scroll suave y cierre del menú móvil ────
  function handleNavClick(e) {
    const href = e.currentTarget.getAttribute('href');
    if (!href.startsWith('#')) return;

    e.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;

    const offsetTop = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight;
    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    closeMobileMenu();
  }

  // ─── Menú Móvil ─────────────────────────────
  function toggleMobileMenu() {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    navOverlay.classList.toggle('visible', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    hamburger.setAttribute('aria-expanded', String(isOpen));
  }

  function closeMobileMenu() {
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
    navOverlay.classList.remove('visible');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  // ─── Formulario de Contacto ─────────────────────────────
  function initContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    const text = document.getElementById('form-status-text');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const originalBtnText = btn.innerHTML;
      btn.disabled = true;
      btn.textContent = 'Enviando...';

      // Verificar si el usuario aún no ha configurado su ID de Formspree
      if (form.action.includes('TU_ID_AQUI')) {
        setTimeout(() => {
          status.removeAttribute('hidden');
          status.style.borderColor = 'var(--hollow-teal)';
          status.style.backgroundColor = 'rgba(0,127,124,0.1)';
          text.textContent = '✓ (Modo Prueba): Mensaje enviado. Recuerda configurar Formspree.';
          btn.disabled = false;
          btn.innerHTML = originalBtnText;
          form.reset();
        }, 1200);
        return;
      }

      const data = new FormData(form);

      fetch(form.action, {
        method: form.method,
        body: data,
        headers: {
            'Accept': 'application/json'
        }
      }).then(response => {
        if (response.ok) {
          status.removeAttribute('hidden');
          status.style.borderColor = 'var(--hollow-teal)';
          status.style.backgroundColor = 'rgba(0,127,124,0.1)';
          text.textContent = '✓ Mensaje enviado. ¡Te responderé pronto!';
          form.reset();
        } else {
          response.json().then(data => {
            status.removeAttribute('hidden');
            status.style.borderColor = 'var(--blood-red)';
            status.style.backgroundColor = 'rgba(139,0,0,0.1)';
            text.textContent = '⚠ Hubo un problema al enviar tu mensaje.';
          });
        }
      }).catch(error => {
        status.removeAttribute('hidden');
        status.style.borderColor = 'var(--blood-red)';
        status.style.backgroundColor = 'rgba(139,0,0,0.1)';
        text.textContent = '⚠ Error de red. Intenta de nuevo más tarde.';
      }).finally(() => {
        btn.disabled = false;
        btn.innerHTML = originalBtnText;
      });
    });
  }

  // ─── Intersection Observer: anima los gráficos circulares al ser visibles ───
  function initSkillBars() {
    const circles = document.querySelectorAll('.circular-progress');
    if (!circles.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const percent = entry.target.getAttribute('data-percent');
          entry.target.style.setProperty('--progress', `${percent}%`);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    circles.forEach(circle => {
      // Reiniciar a 0% por si acaso
      circle.style.setProperty('--progress', '0%');
      observer.observe(circle);
    });
  }

  // ─── Intersection Observer: aparición gradual de las secciones ──
  function initScrollAnimations() {
    const targets = document.querySelectorAll(
      '.about-grid, .skill-circle-item, .project-card, .contact-grid, .section-header'
    );
    if (!targets.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    targets.forEach(el => observer.observe(el));
  }

  // ─── Inicialización ────────────────────────────────────
  function init() {
    // Actualizar secciones dinámicamente cargadas
    sections = document.querySelectorAll('main section[id]');

    // Clics en los enlaces de navegación
    navLinks.forEach(link => link.addEventListener('click', handleNavClick));

    // Enlace del logotipo
    const logo = document.querySelector('.logo');
    if (logo) logo.addEventListener('click', handleNavClick);

    // Botón de hamburguesa
    if (hamburger) hamburger.addEventListener('click', toggleMobileMenu);
    if (navOverlay) navOverlay.addEventListener('click', closeMobileMenu);

    // Tecla de escape para cerrar menú
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeMobileMenu();
    });

    // Evento de scroll (pasivo para mejor rendimiento)
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Comprobación inicial

    // Funcionalidades adicionales
    initContactForm();
    initSkillBars();
    initScrollAnimations();
  }

  // ─── Carga Dinámica de Vistas ────────────────────────────
  async function loadViews() {
    const mainContent = document.getElementById('app-content');
    if (!mainContent) return;

    const viewsToLoad = [
      'views/inicio.html',
      'views/sobre-mi.html',
      'views/proyectos.html',
      'views/contacto.html'
    ];

    try {
      for (const view of viewsToLoad) {
        const response = await fetch(view);
        if (!response.ok) throw new Error(`Error cargando ${view}`);
        const html = await response.text();
        mainContent.innerHTML += html;
      }
      // Una vez cargado todo el HTML, inicializamos los scripts
      init();
    } catch (error) {
      console.error('Error al cargar las vistas:', error);
      mainContent.innerHTML = '<p style="color:red; text-align:center; padding: 2rem;">Error al cargar el portafolio. Asegúrate de ejecutar este código en un servidor local.</p>';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadViews);
  } else {
    loadViews();
  }

})();

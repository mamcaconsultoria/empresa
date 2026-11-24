/* =====================================================================
   MAMCA S.A.S. — Comportamiento del sitio
   ===================================================================== */

/* ---------- CONFIGURACIÓN: edite solo esta parte ---------- */
const CONFIG = {
  // Número de WhatsApp en formato internacional, sin "+" ni espacios
  whatsapp: '573154061408',
  correo: 'mamca.consultoria@gmail.com',

  // Redes sociales: pegue el enlace completo y el ícono aparecerá solo en el pie de página.
  // Ejemplo: facebook: 'https://www.facebook.com/mamcasas'
  redes: {
    facebook: '',
    instagram: '',
    linkedin: '',
  },

  // Google Analytics 4 (opcional). Pegue su ID, p. ej. 'G-XXXXXXXXXX', para medir visitas
  // y clics en WhatsApp, correo y descarga del PDF. Vacío = desactivado.
  ga4: '',
};
/* ----------------------------------------------------------- */

(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Analítica opcional ---------- */
  function track(evento, datos = {}) {
    if (typeof window.gtag === 'function') window.gtag('event', evento, datos);
  }
  if (CONFIG.ga4) {
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(CONFIG.ga4)}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', CONFIG.ga4, { anonymize_ip: true });
  }
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-track]');
    if (el) track(el.dataset.track, { link_url: el.href || '' });
  });

  /* ---------- Año del pie de página ---------- */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Redes sociales (solo las que tengan enlace) ---------- */
  $$('[data-social]').forEach((li) => {
    const url = (CONFIG.redes[li.dataset.social] || '').trim();
    if (url) {
      li.querySelector('a').href = url;
      li.hidden = false;
    }
  });

  /* ---------- Encabezado y menú móvil ---------- */
  const header = $('#site-header');
  const menuBtn = $('#menu-btn');
  const menu = $('#mobile-menu');
  const menuIcon = menuBtn ? menuBtn.querySelector('use') : null;
  let menuOpen = false;

  function updateHeader() {
    const solid = window.scrollY > 24 || menuOpen;
    header.dataset.solid = solid ? 'true' : 'false';
  }

  function setMenu(open, { focusButton = false } = {}) {
    if (!menu || !menuBtn) return;
    menuOpen = open;
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    if (menuIcon) menuIcon.setAttribute('href', `assets/icons.svg#${open ? 'x' : 'menu'}`);
    updateHeader();
    if (focusButton) menuBtn.focus();
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', () => setMenu(!menuOpen));
    $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('click', (e) => {
      if (menuOpen && !header.contains(e.target)) setMenu(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuOpen) setMenu(false, { focusButton: true });
    });
    // Si la pantalla se agranda a escritorio, cerrar el menú móvil
    window.matchMedia('(min-width: 1024px)').addEventListener('change', (mq) => {
      if (mq.matches) setMenu(false);
    });
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  /* ---------- Enlace activo en el menú según la sección visible ---------- */
  const navLinks = $$('.nav-link');
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => {
          const activo = a.getAttribute('href') === `#${entry.target.id}`;
          if (activo) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Animación al hacer scroll ---------- */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Botón flotante: se oculta en la portada y en contacto,
     donde ya hay botones de WhatsApp visibles ---------- */
  const floatBtn = $('#whatsapp-float');
  const zonasSinFlotante = ['#inicio', '#contacto'].map((s) => $(s)).filter(Boolean);
  if (floatBtn && zonasSinFlotante.length && 'IntersectionObserver' in window) {
    const visibles = new Set();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visibles.add(e.target) : visibles.delete(e.target)));
      floatBtn.classList.toggle('is-hidden', visibles.size > 0);
    }, { threshold: 0.15 });
    zonasSinFlotante.forEach((z) => io.observe(z));
  }

  /* ---------- Lista de servicios del formulario ----------
     Se arma sola a partir de los botones "Cotizar" (data-service / data-group),
     así las tarjetas y el formulario nunca quedan desincronizados. */
  const select = $('#f-servicio');
  if (select) {
    const grupos = new Map();
    $$('[data-service]').forEach((btn) => {
      const grupo = btn.dataset.group || 'Servicios';
      if (!grupos.has(grupo)) grupos.set(grupo, new Set());
      grupos.get(grupo).add(btn.dataset.service);
    });
    grupos.forEach((servicios, grupo) => {
      const og = document.createElement('optgroup');
      og.label = grupo;
      servicios.forEach((s) => og.appendChild(new Option(s, s)));
      select.appendChild(og);
    });
    select.appendChild(new Option('Otro / no estoy seguro', 'Otro / no estoy seguro'));
  }

  /* ---------- Botones "Cotizar": preseleccionan el servicio ---------- */
  $$('.quote-btn[data-service]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (select) select.value = btn.dataset.service;
      track('cotizar_click', { servicio: btn.dataset.service });
      const form = $('#contact-form');
      if (form) {
        form.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
        setTimeout(() => $('#f-nombre').focus({ preventScroll: true }), 600);
      }
    });
  });

  /* ---------- Formulario → WhatsApp ---------- */
  const form = $('#contact-form');
  if (form) {
    const errorBox = $('#form-error');
    const status = $('#form-status');
    const mailLink = $('#form-mail-link');

    const valor = (name) => (form.elements[name] ? form.elements[name].value.trim() : '');

    function armarMensaje() {
      const lineas = ['Hola MAMCA S.A.S., les escribo desde la página web.', ''];
      lineas.push(`*Nombre:* ${valor('nombre')}`);
      if (valor('empresa')) lineas.push(`*Empresa o entidad:* ${valor('empresa')}`);
      if (valor('municipio')) lineas.push(`*Municipio del proyecto:* ${valor('municipio')}`);
      lineas.push(`*Servicio de interés:* ${valor('servicio')}`);
      lineas.push('', `*Mensaje:* ${valor('mensaje')}`);
      return lineas.join('\n');
    }

    function actualizarCorreo() {
      if (!mailLink) return;
      const asunto = `Solicitud de información${valor('servicio') ? ' – ' + valor('servicio') : ''}`;
      const cuerpo = armarMensaje().replace(/\*/g, '');
      mailLink.href = `mailto:${CONFIG.correo}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
    }
    form.addEventListener('input', actualizarCorreo);
    form.addEventListener('change', actualizarCorreo);

    function validar() {
      const faltan = [];
      const revisar = [
        ['nombre', 'su nombre'],
        ['servicio', 'el servicio de interés'],
        ['mensaje', 'el mensaje'],
      ];
      revisar.forEach(([name, texto]) => {
        const campo = form.elements[name];
        const vacio = !campo.value.trim();
        campo.setAttribute('aria-invalid', vacio ? 'true' : 'false');
        if (vacio) faltan.push(texto);
      });
      const autoriza = form.elements.autoriza;
      if (!autoriza.checked) faltan.push('la autorización de tratamiento de datos');
      return faltan;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const faltan = validar();
      if (faltan.length) {
        errorBox.textContent = `Por favor complete: ${faltan.join(', ')}.`;
        errorBox.classList.remove('hidden');
        const primero = form.querySelector('[aria-invalid="true"]') || form.elements.autoriza;
        primero.focus();
        return;
      }
      errorBox.classList.add('hidden');

      const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(armarMensaje())}`;
      track('formulario_whatsapp', { servicio: valor('servicio') });
      // Se abre en otra pestaña (o en la app de WhatsApp en el celular).
      // Si el navegador bloquea la ventana, se abre en la misma pestaña.
      const ventana = window.open(url, '_blank');
      if (ventana) ventana.opener = null;
      else window.location.href = url;
      status.textContent = 'Listo: se abrió WhatsApp con su mensaje. Solo presione Enviar.';
    });
  }
})();

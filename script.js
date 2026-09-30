/* ==========================================================================
   TIGER SYSTEMS - INTERACTIVIDAD Y LÓGICA DE CONVERSIÓN (script.js)
   ========================================================================== */

// 1. Analítica con consentimiento (GA4 + Microsoft Clarity)
//    Nada se descarga ni se ejecuta hasta que el usuario pulsa "Aceptar Todo".
const GA_ID = 'G-GJ91HTBF2C';
const CLARITY_ID = 'yjwtsjf2x6';
const CONSENT_KEY = 'tiger_cookie_consent';

let analyticsLoaded = false;

function getConsent() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
}

function setConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch (e) { /* modo privado: se ignora */ }
}

function loadAnalytics() {
    if (analyticsLoaded) return;
    analyticsLoaded = true;

    // Google Analytics 4 (Consent Mode v2: se concede analytics_storage al aceptar)
    gtag('consent', 'update', { analytics_storage: 'granted' });
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(gaScript);
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });

    // Microsoft Clarity
    (function (c, l, a, r, i, t, y) {
        c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
        t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
        y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', CLARITY_ID);
}

function revokeAnalytics() {
    gtag('consent', 'update', { analytics_storage: 'denied' });
    if (typeof window.clarity === 'function') window.clarity('consent', false);
    analyticsLoaded = false;
}

// Envía un evento a GA4 únicamente si hay consentimiento
function track(eventName, params) {
    if (getConsent() !== 'accepted') return;
    gtag('event', eventName, params || {});
}

document.addEventListener('DOMContentLoaded', () => {

    // A. Año de copyright dinámico
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // A2. Menú Hamburguesa Móvil Desplegable
    const navToggleBtn = document.getElementById('nav-toggle-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-item-link');

    if (navToggleBtn && navMenu) {
        const toggleMenu = (open) => {
            const isOpen = open !== undefined ? open : !navMenu.classList.contains('active');
            navToggleBtn.classList.toggle('active', isOpen);
            navMenu.classList.toggle('active', isOpen);
            navToggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            document.body.style.overflow = isOpen ? 'hidden' : '';
        };

        navToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Cerrar menú al hacer clic en cualquier enlace
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    toggleMenu(false);
                }
            });
        });

        // Cerrar menú al hacer clic fuera del área del menú
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !navToggleBtn.contains(e.target)) {
                toggleMenu(false);
            }
        });

        // Cerrar con tecla Escape (Accesibilidad estándar)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                toggleMenu(false);
            }
        });

        // Restablecer scroll si la pantalla pasa a resolución de escritorio
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                toggleMenu(false);
            }
        });
    }

    // B. Servicios: Pestañas en Escritorio y Carrusel Táctil en Móviles
    const tabButtons = document.querySelectorAll('.tab-btn');
    const serviceCards = document.querySelectorAll('.service-card');
    const carouselTrack = document.getElementById('services-carousel-track');
    const carouselDots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.getElementById('carousel-prev-btn');
    const nextBtn = document.getElementById('carousel-next-btn');

    // 1. Control de Pestañas en Escritorio
    if (tabButtons.length > 0 && serviceCards.length > 0) {
        tabButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const serviceKey = btn.getAttribute('data-service');

                // Actualizar estado activo en botones
                tabButtons.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                    b.setAttribute('tabindex', '-1');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');
                btn.setAttribute('tabindex', '0');
                track('select_content', { content_type: 'servicio', item_id: serviceKey });

                // Alternar tarjeta activa
                serviceCards.forEach(card => {
                    if (card.getAttribute('data-service') === serviceKey) {
                        card.classList.add('active');
                    } else {
                        card.classList.remove('active');
                    }
                });

                // Sincronizar indicador de punto si aplica
                carouselDots.forEach((dot, idx) => {
                    dot.classList.toggle('active', idx === index);
                });
            });

            // Teclado (patrón ARIA de pestañas): flechas izquierda/derecha, Inicio y Fin
            btn.addEventListener('keydown', (e) => {
                const last = tabButtons.length - 1;
                let target = null;
                if (e.key === 'ArrowRight') target = tabButtons[index === last ? 0 : index + 1];
                if (e.key === 'ArrowLeft') target = tabButtons[index === 0 ? last : index - 1];
                if (e.key === 'Home') target = tabButtons[0];
                if (e.key === 'End') target = tabButtons[last];
                if (target) {
                    e.preventDefault();
                    target.focus();
                    target.click();
                }
            });
        });
    }

    // 2. Control de Carrusel Táctil en Dispositivos Móviles
    if (carouselTrack && serviceCards.length > 0) {
        let isScrolling = false;

        // Detección de tarjeta centrada al hacer scroll o swipe
        const updateActiveDotOnScroll = () => {
            const trackRect = carouselTrack.getBoundingClientRect();
            const trackCenter = trackRect.left + trackRect.width / 2;

            let closestIndex = 0;
            let minDistance = Infinity;

            serviceCards.forEach((card, index) => {
                const cardRect = card.getBoundingClientRect();
                const cardCenter = cardRect.left + cardRect.width / 2;
                const distance = Math.abs(trackCenter - cardCenter);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestIndex = index;
                }
            });

            // Actualizar puntos
            carouselDots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === closestIndex);
            });

            // Sincronizar pestañas
            if (tabButtons[closestIndex]) {
                tabButtons.forEach(b => b.classList.remove('active'));
                tabButtons[closestIndex].classList.add('active');
            }
        };

        // Escucha pasiva de desplazamiento con RAF para rendimiento 60fps
        carouselTrack.addEventListener('scroll', () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    updateActiveDotOnScroll();
                    isScrolling = false;
                });
                isScrolling = true;
            }
        }, { passive: true });

        // Navegación por clic en puntos indicadores (Dots)
        carouselDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (serviceCards[index]) {
                    serviceCards[index].scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'center'
                    });
                }
            });
        });

        // Navegación con flechas Anterior / Siguiente
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const cardWidth = serviceCards[0] ? serviceCards[0].offsetWidth + 16 : 320;
                carouselTrack.scrollBy({ left: -cardWidth, behavior: 'smooth' });
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const cardWidth = serviceCards[0] ? serviceCards[0].offsetWidth + 16 : 320;
                carouselTrack.scrollBy({ left: cardWidth, behavior: 'smooth' });
            });
        }
    }

    // C. Configurador / Cotizador Interactivo a WhatsApp
    const configCards = document.querySelectorAll('.config-card');
    const summaryText = document.getElementById('config-summary-text');
    const btnConfigWhatsApp = document.getElementById('btn-config-whatsapp');

    // Estado inicial de la configuración
    const configState = {
        servicio: "Desarrollo Web o App a Medida",
        etapa: "Emprendimiento o Idea Nueva",
        tiempo: "Lo antes posible (1 a 3 semanas)"
    };

    function updateConfigurator() {
        if (summaryText) {
            summaryText.innerHTML = `<strong>Servicio:</strong> ${configState.servicio} | <strong>Etapa:</strong> ${configState.etapa} | <strong>Plazo:</strong> ${configState.tiempo}`;
        }

        if (btnConfigWhatsApp) {
            const message = `Hola Tiger Systems, configuré en su página web la siguiente cotización preliminar:

• *Servicio:* ${configState.servicio}
• *Etapa del Negocio:* ${configState.etapa}
• *Plazo Deseado:* ${configState.tiempo}

¿Me podrían brindar más información sobre la arquitectura y un presupuesto estimado?`;

            btnConfigWhatsApp.href = `https://wa.me/584246072880?text=${encodeURIComponent(message)}`;
        }
    }

    if (configCards.length > 0) {
        configCards.forEach(card => {
            card.addEventListener('click', () => {
                const group = card.parentElement.getAttribute('data-group');
                const val = card.getAttribute('data-value');

                // Desmarcar hermanos del mismo grupo
                card.parentElement.querySelectorAll('.config-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');

                if (group === 'servicio') configState.servicio = val;
                if (group === 'etapa') configState.etapa = val;
                if (group === 'tiempo') configState.tiempo = val;

                card.setAttribute('aria-pressed', 'true');
                card.parentElement.querySelectorAll('.config-card').forEach(c => {
                    if (c !== card) c.setAttribute('aria-pressed', 'false');
                });
                track('cotizador_option', { group, value: val });

                updateConfigurator();
            });
        });

        // Inicializar enlace de WhatsApp
        updateConfigurator();
    }

    // E. Preguntas Frecuentes (FAQ Acordeón)
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const btn = item.querySelector('.faq-question');
            if (btn) {
                btn.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');

                    // Cerrar todos los demás para mantener la vista limpia
                    faqItems.forEach(otherItem => {
                        otherItem.classList.remove('active');
                        const otherBtn = otherItem.querySelector('.faq-question');
                        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                    });

                    // Si no estaba activo, abrirlo
                    if (!isActive) {
                        item.classList.add('active');
                        btn.setAttribute('aria-expanded', 'true');
                    }
                });
            }
        });
    }

    // F. Modal Legal (Política de Privacidad y Términos de Servicio)
    const legalModalOverlay = document.getElementById('legal-modal-overlay');
    const legalModalCloseBtn = document.getElementById('legal-modal-close-btn');
    const legalModalOkBtn = document.getElementById('legal-modal-ok-btn');
    const legalModalTitle = document.getElementById('legal-modal-title');
    const legalModalBadge = document.getElementById('legal-modal-badge');
    const legalModalBody = document.getElementById('legal-modal-body');
    const openPrivacyBtn = document.getElementById('open-privacy-btn');
    const openTermsBtn = document.getElementById('open-terms-btn');

    const legalContents = {
        privacy: {
            badge: "Protección de Datos & Privacidad",
            title: "Política de Privacidad",
            html: `
                <h4>1. Compromiso de Confidencialidad</h4>
                <p>En <strong>Tiger Systems</strong> (Caracas, Venezuela), la protección y seguridad de los datos de nuestros clientes y empresas aliadas es un principio rector de ingeniería de software y ética corporativa. Este aviso regula el tratamiento de datos recopilados en nuestra plataforma web oficial.</p>

                <h4>2. Tratamiento de Datos del Cotizador Interactivo</h4>
                <p>La información técnica seleccionada en nuestro cotizador de proyectos (tipo de desarrollo, requerimientos específicos y número de contacto) tiene como <strong>única y exclusiva finalidad</strong> calcular la estimación presupuestaria y abrir un canal de asesoría directa por WhatsApp.</p>
                <ul>
                    <li><strong>No vendemos, no transferimos ni comercializamos</strong> información personal o comercial a terceras partes bajo ninguna circunstancia.</li>
                    <li>No generamos cadenas de correo masivo ni comunicaciones publicitarias no autorizadas.</li>
                </ul>

                <h4>3. Analítica y Tecnologías de Navegación</h4>
                <p>Nuestra web utiliza <strong>Google Analytics 4</strong> y <strong>Microsoft Clarity</strong> con anonimización de direcciones IP, <strong>únicamente si aceptas las cookies analíticas</strong> en el aviso de cookies. Si eliges \"Solo Necesarias\", estas herramientas no se cargan. Puedes cambiar tu decisión en cualquier momento desde \"Preferencias de cookies\" en el pie de página. Dichas herramientas recopilan datos agregados de rendimiento (tiempo de carga, secciones visitadas e interacción en pantalla) exclusivamente para auditoría técnica de usabilidad y optimización del servicio.</p>

                <h4>4. Derechos de Acceso y Supresión</h4>
                <p>Cualquier usuario puede revocar su consentimiento o solicitar la eliminación total de sus datos de contacto de nuestras comunicaciones activas enviando un mensaje directo a nuestro canal verificado de WhatsApp (+58 424-6072880).</p>
            `
        },
        terms: {
            badge: "Condiciones de Contratación & Servicio",
            title: "Términos de Servicio",
            html: `
                <h4>1. Alcance de los Servicios Profesionales</h4>
                <p><strong>Tiger Systems</strong> ofrece servicios integrales de arquitectura de sistemas, desarrollo de software a medida, implementación de plataformas ERP/CRM y automatización de flujos con Inteligencia Artificial.</p>

                <h4>2. Naturaleza de las Estimaciones Web</h4>
                <p>Los precios y tiempos proyectados por el cotizador interactivo de esta landing page representan <strong>estimaciones referenciales</strong> que sirven como base para la planificación inicial. Toda cotización definitiva, cronograma de entregables y especificación técnica se formaliza mediante propuesta técnica personalizada tras la sesión de levantamiento de requerimientos.</p>

                <h4>3. 100% Código Propietario</h4>
                <p>A diferencia de los modelos SaaS tradicionales con suscripciones perpetuas, los proyectos a medida entregados por Tiger Systems son de <strong>código 100% propietario</strong>, transfiriéndose la titularidad del software y sus componentes al cliente conforme a las condiciones contractuales acordadas.</p>

                <h4>4. Acuerdos de Confidencialidad (NDA)</h4>
                <p>Mantenemos estricto secreto profesional y confidencialidad industrial sobre cualquier modelo de negocio, proceso operativo, propiedad intelectual o dato estratégico compartido con nosotros en fases de cotización o desarrollo.</p>
            `
        },
        cookies: {
            badge: "Transparencia & Cumplimiento RGPD",
            title: "Política de Cookies",
            html: `
                <h4>1. ¿Qué son las Cookies?</h4>
                <p>Las cookies son pequeños fragmentos de información digital que un sitio web almacena en tu dispositivo para recordar tus preferencias, optimizar la carga de la plataforma y generar estadísticas de usabilidad.</p>

                <h4>2. Cookies que utilizamos en Tiger Systems</h4>
                <p>Nuestra plataforma opera con los siguientes grupos de cookies:</p>
                <ul>
                    <li><strong>Cookies Técnicas (Estrictamente Necesarias)</strong>: Permiten la navegación fluida, el funcionamiento del menú responsivo, el carrusel de servicios, el cálculo del cotizador y recordar tu elección de cookies en <code>localStorage</code>.</li>
                    <li><strong>Cookies Analíticas y de Rendimiento</strong>:
                        <ul>
                            <li><strong>Google Analytics 4 (<code>_ga</code>, <code>_ga_*</code>)</strong>: Recopila métricas anonimizadas de tráfico, procedencia de visitas y tiempo en pantalla para evaluar la relevancia técnica de nuestro contenido.</li>
                            <li><strong>Microsoft Clarity (<code>_clck</code>, <code>_clsk</code>, etc.)</strong>: Genera mapas de calor de clics y registros de sesión anónimos para auditar la usabilidad visual y corregir errores de interacción.</li>
                        </ul>
                    </li>
                </ul>

                <h4>3. Privacidad y Datos Sensibles</h4>
                <p><strong>Tiger Systems no utiliza cookies de seguimiento comercial de terceros para venta de publicidad ni monetiza perfiles de navegación.</strong> Los identificadores analíticos no se cruzan con datos de tarjetas de crédito o identidades personales.</p>

                <h4>4. Control y Desactivación</h4>
                <p>Puedes revocar tu consentimiento, borrar o bloquear cookies en cualquier momento desde el panel de Privacidad y Seguridad de tu navegador web (Google Chrome, Mozilla Firefox, Safari, Microsoft Edge). Ten en cuenta que desactivar cookies técnicas podría limitar la interactividad del cotizador en línea.</p>
            `
        }
    };

    const openCookiesBtn = document.getElementById('open-cookies-btn');
    const openCookiesFromBanner = document.getElementById('open-cookies-from-banner');

    if (legalModalOverlay && legalModalTitle && legalModalBody) {
        let lastFocusedElement = null;

        const openLegalModal = (type) => {
            const data = legalContents[type];
            if (!data) return;

            lastFocusedElement = document.activeElement;

            legalModalBadge.textContent = data.badge;
            legalModalTitle.textContent = data.title;
            legalModalBody.innerHTML = data.html;
            legalModalBody.scrollTop = 0;

            legalModalOverlay.classList.add('active');
            legalModalOverlay.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';

            // Accesibilidad: llevar el foco al modal
            // (con una mínima espera: el modal debe estar ya visible para poder recibir el foco)
            setTimeout(() => {
                if (legalModalCloseBtn) legalModalCloseBtn.focus();
            }, 60);
        };

        const closeLegalModal = () => {
            legalModalOverlay.classList.remove('active');
            legalModalOverlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';

            // Devolver el foco al botón que abrió el modal
            if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
                lastFocusedElement.focus();
            }
        };

        // Accesibilidad: mantener el foco del teclado dentro del modal mientras está abierto
        legalModalOverlay.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab' || !legalModalOverlay.classList.contains('active')) return;

            const focusables = legalModalOverlay.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])');
            if (focusables.length === 0) return;

            const first = focusables[0];
            const last = focusables[focusables.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        });

        if (openPrivacyBtn) {
            openPrivacyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                openLegalModal('privacy');
            });
        }

        if (openTermsBtn) {
            openTermsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                openLegalModal('terms');
            });
        }

        if (openCookiesBtn) {
            openCookiesBtn.addEventListener('click', (e) => {
                e.preventDefault();
                openLegalModal('cookies');
            });
        }

        if (openCookiesFromBanner) {
            openCookiesFromBanner.addEventListener('click', (e) => {
                e.preventDefault();
                openLegalModal('cookies');
            });
        }

        if (legalModalCloseBtn) {
            legalModalCloseBtn.addEventListener('click', closeLegalModal);
        }

        if (legalModalOkBtn) {
            legalModalOkBtn.addEventListener('click', closeLegalModal);
        }

        legalModalOverlay.addEventListener('click', (e) => {
            if (e.target === legalModalOverlay) {
                closeLegalModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && legalModalOverlay.classList.contains('active')) {
                closeLegalModal();
            }
        });
    }

    // I. Animación de entrada al hacer scroll (se omite si el usuario prefiere menos movimiento)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        const revealTargets = document.querySelectorAll(
            '.section-header, .metric-card, .process-step-card, .configurator-box, .about-text-column, .terminal-box, .feature-card, .faq-item, .final-cta-box'
        );
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealTargets.forEach((el, i) => {
            el.classList.add('reveal');
            // Escalonado ligero dentro de rejillas
            el.style.transitionDelay = `${(i % 4) * 70}ms`;
            revealObserver.observe(el);
        });
    }

    // G. Banner Flotante de Consentimiento de Cookies
    const cookieBanner = document.getElementById('cookie-consent-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept-btn');
    const cookieRejectBtn = document.getElementById('cookie-reject-btn');
    const cookiePrefsBtn = document.getElementById('open-cookie-prefs-btn');

    const showBanner = () => cookieBanner && cookieBanner.classList.add('show');
    const hideBanner = () => cookieBanner && cookieBanner.classList.remove('show');

    if (cookieBanner) {
        const consentChoice = getConsent();

        if (consentChoice === 'accepted') {
            loadAnalytics();
        } else if (!consentChoice) {
            // Mostrar banner con una pequeña pausa para no saturar al usuario
            setTimeout(showBanner, 800);
        }

        if (cookieAcceptBtn) {
            cookieAcceptBtn.addEventListener('click', () => {
                setConsent('accepted');
                loadAnalytics();
                hideBanner();
            });
        }

        if (cookieRejectBtn) {
            cookieRejectBtn.addEventListener('click', () => {
                setConsent('necessary_only');
                revokeAnalytics();
                hideBanner();
            });
        }

        // Permite cambiar de decisión en cualquier momento desde el footer
        if (cookiePrefsBtn) {
            cookiePrefsBtn.addEventListener('click', showBanner);
        }
    }

    // H. Medición de conversiones (solo se envían si el usuario aceptó cookies analíticas)
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="https://wa.me"]');
        if (link) {
            const section = link.closest('section, footer, .floating-whatsapp-wrapper');
            track('generate_lead', {
                method: 'whatsapp',
                location: (section && (section.id || section.className)) || 'unknown'
            });
        }

        const cta = e.target.closest('.nav-cta-btn, .btn-primary-hero');
        if (cta) track('cta_click', { cta_text: cta.textContent.trim() });
    });
});


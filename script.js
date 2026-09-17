/* ==========================================================================
   TIGER SYSTEMS - INTERACTIVIDAD Y LÓGICA DE CONVERSIÓN (script.js)
   ========================================================================== */

// 1. Datos de los Servicios en Pestañas (Tabs Showcase)
const serviciosData = {
    web: {
        titulo: "Desarrollo Web & Apps a Medida",
        categoria: "DESARROLLO FULL STACK",
        descripcion: "Construimos aplicaciones web modernas, plataformas e-commerce y sistemas nativos rápidos, seguros y diseñados para convertir visitantes en clientes.",
        beneficios: [
            "Diseño 100% responsivo y optimizado para móviles.",
            "Arquitectura escalable y SEO integrado de alto rendimiento.",
            "Integración de pasarelas de pago y APIs de terceros."
        ],
        badgeIcon: `<svg viewBox="0 0 24 24" class="service-svg-large"><path d="M8 7L4 12l4 5M16 7l4 5-4 5M13.5 5l-3 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    },
    erp: {
        titulo: "Sistemas ERP & CRM Integrados",
        categoria: "GESTIÓN DE NEGOCIOS",
        descripcion: "Centraliza las operaciones de tu empresa: ventas, control de inventario, facturación y gestión de clientes en una sola plataforma centralizada.",
        beneficios: [
            "Automatización de control de stock e inventarios en tiempo real.",
            "Seguimiento completo de clientes (CRM) y tuberías de ventas.",
            "Reportes analíticos interactivos y exportación de datos."
        ],
        badgeIcon: `<svg viewBox="0 0 24 24" class="service-svg-large"><rect x="3" y="4" width="8" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="13" y="4" width="8" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="3" y="13" width="8" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="13" y="13" width="8" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`
    },
    ia: {
        titulo: "Chatbots & Asistentes con IA",
        categoria: "INTELIGENCIA ARTIFICIAL",
        descripcion: "Revoluciona la atención al cliente instalando asistentes inteligentes entrenados con la información de tu empresa para responder y vender 24/7.",
        beneficios: [
            "Atención inmediata y automatizada a través de WhatsApp y Web.",
            "Entrenamiento personalizado con la base de conocimientos de tu empresa.",
            "Reducción de costos de soporte y mayor tasa de conversión."
        ],
        badgeIcon: `<svg viewBox="0 0 24 24" class="service-svg-large"><path d="M12 2a2 2 0 0 1 2 2v1h.5A3.5 3.5 0 0 1 18 8.5V9a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3h-.5A3.5 3.5 0 0 1 14 21.5V22a2 2 0 0 1-4 0v-.5A3.5 3.5 0 0 1 6.5 18H6a3 3 0 0 1-3-3v-3a3 3 0 0 1 3-3v-.5A3.5 3.5 0 0 1 9.5 5H10V4a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="9" cy="12" r="1.2" fill="currentColor"/><circle cx="15" cy="12" r="1.2" fill="currentColor"/></svg>`
    },
    auto: {
        titulo: "Automatización de Procesos & Agentes",
        categoria: "OPTIMIZACIÓN DE FLUJOS",
        descripcion: "Elimina tareas repetitivas conectando tus herramientas y desplegando agentes autónomos de IA que procesan documentos, correos y reportes.",
        beneficios: [
            "Flujos automatizados que conectan tus aplicaciones favoritas.",
            "Agentes multi-tarea para clasificación y extracción de datos.",
            "Mayor productividad y eliminación de errores humanos."
        ],
        badgeIcon: `<svg viewBox="0 0 24 24" class="service-svg-large"><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`
    }
};

// 2. Base de Respuestas del Simulador Demo de IA
const demoChatResponses = {
    whatsapp: {
        pregunta: "¿Cómo conectan la IA a mi WhatsApp de ventas?",
        respuesta: "Conectamos tu número a un modelo de IA entrenado específicamente con tus productos, servicios y políticas de venta. El agente responde de inmediato las 24 horas, califica a los clientes potenciales y, si la consulta requiere atención humana especializada, transfiere el chat al instante a tu equipo."
    },
    erp: {
        pregunta: "¿Pueden sincronizar inventario con mi tienda online?",
        respuesta: "Sí, de manera totalmente bidireccional. Cada vez que registras una venta en tu tienda física o en tu ecommerce, nuestro sistema actualiza el stock en tiempo real, genera reportes de alerta de reposición y evita ventas sin disponibilidad."
    },
    tiempo: {
        pregunta: "¿Cuánto tiempo toma desarrollar una plataforma a medida?",
        respuesta: "Dependiendo de la complejidad: prototipos rápidos o integraciones con agentes de IA pueden desplegarse en 1 a 2 semanas. Sistemas integrales (ERP/CRM) suelen estructurarse en sprints de 3 a 6 semanas con entregas funcionales semanales para tu revisión."
    },
    costo: {
        pregunta: "¿Cómo se calcula el presupuesto de mi proyecto?",
        respuesta: "Trabajamos con presupuestos cerrados y transparentes basados en el alcance exacto de tu solución. Puedes usar nuestro cotizador interactivo más abajo o enviarnos un mensaje para agendar un diagnóstico técnico gratuito sin compromiso."
    }
};

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
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

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

    // C. Simulador Demo de IA
    const chatBody = document.getElementById('chat-messages-body');
    const quickButtons = document.querySelectorAll('.quick-btn');
    let isBotTyping = false;

    if (chatBody && quickButtons.length > 0) {
        quickButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (isBotTyping) return; // Evitar spam mientras escribe

                const queryKey = btn.getAttribute('data-query');
                const qa = demoChatResponses[queryKey];
                if (!qa) return;

                // 1. Insertar mensaje del usuario
                const userMsgEl = document.createElement('div');
                userMsgEl.className = 'chat-msg user-msg';
                userMsgEl.innerHTML = `
                    <div class="msg-bubble">${qa.pregunta}</div>
                    <span class="msg-time">Tú • Ahora</span>
                `;
                chatBody.appendChild(userMsgEl);
                chatBody.scrollTop = chatBody.scrollHeight;

                // 2. Insertar indicador de escribiendo
                isBotTyping = true;
                const typingEl = document.createElement('div');
                typingEl.className = 'chat-msg bot-msg typing-wrapper';
                typingEl.innerHTML = `
                    <div class="typing-indicator">
                        <span class="typing-dot"></span>
                        <span class="typing-dot"></span>
                        <span class="typing-dot"></span>
                    </div>
                `;
                chatBody.appendChild(typingEl);
                chatBody.scrollTop = chatBody.scrollHeight;

                // 3. Responder tras retardo simulado (850ms)
                setTimeout(() => {
                    typingEl.remove();

                    const botMsgEl = document.createElement('div');
                    botMsgEl.className = 'chat-msg bot-msg';
                    botMsgEl.innerHTML = `
                        <div class="msg-bubble">${qa.respuesta}</div>
                        <span class="msg-time">Tiger AI • Ahora</span>
                    `;
                    chatBody.appendChild(botMsgEl);
                    chatBody.scrollTop = chatBody.scrollHeight;
                    isBotTyping = false;
                }, 850);
            });
        });
    }

    // D. Configurador / Cotizador Interactivo a WhatsApp
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
});

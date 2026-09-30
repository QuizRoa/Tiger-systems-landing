# Tiger Systems - Soluciones de Software & Inteligencia Artificial

Landing corporativa y de captación de clientes de **Tiger Systems** (desarrollo a medida, ERP/CRM, chatbots con IA y automatización). Sitio estático sin dependencias, con conversión directa hacia WhatsApp.

---

## Secciones

- **Hero** con propuesta de valor y doble llamada a la acción (cotizar / explorar servicios).
- **Métricas** de confianza (atención 24/7 y 100 % código propietario).
- **Servicios**: pestañas accesibles por teclado en escritorio y carrusel táctil (`scroll-snap`) en móvil.
- **Proceso** en 4 pasos.
- **Cotizador**: el visitante elige servicio, etapa y plazo; se genera un mensaje prellenado a WhatsApp.
- **Sobre nosotros** con terminal de código estilo macOS.
- **FAQ** en acordeón.
- **CTA final** antes del footer.
- **Legal**: modal de Política de Privacidad, Términos y Cookies, y banner de consentimiento.
- **Botón flotante de WhatsApp** (`+58 424 6072880`).

## Privacidad y analítica

Google Analytics 4 y Microsoft Clarity **no se cargan** hasta que el usuario pulsa *Aceptar Todo* (Consent Mode v2). *Solo Necesarias* no carga nada, y la decisión se puede cambiar desde *Preferencias de cookies* en el footer. Con consentimiento se envían estos eventos a GA4:

| Evento | Cuándo |
| --- | --- |
| `generate_lead` (`method: whatsapp`, `location`) | Clic en cualquier enlace a WhatsApp |
| `cta_click` | Clic en el CTA del menú o del hero |
| `select_content` | Cambio de pestaña de servicio |
| `cotizador_option` | Selección de opción en el cotizador |

Para contar conversiones en GA4, marca `generate_lead` como evento clave en *Admin > Eventos*.

## Stack

HTML5 semántico, CSS3 con variables y JavaScript vanilla (ES6+). Sin build ni librerías.

## Estructura

```text
├── img/                  # Logos (SVG/PNG), favicons, hero-bg.webp y og-image.jpg (1200x630)
├── index.html            # Estructura, SEO, Open Graph y JSON-LD
├── styles.css            # Estilos, responsive, accesibilidad
├── script.js             # Consentimiento, analítica, servicios, cotizador, FAQ, modal legal
├── robots.txt
└── sitemap.xml
```

## Ejecución local

```bash
python -m http.server 5173
```

Abre `http://localhost:5173`. También sirve cualquier servidor estático (Live Server, `pnpm dlx serve`).

## Despliegue

Es un sitio estático: GitHub Pages (rama `main`, carpeta raíz), Vercel o Netlify.
Si cambias de dominio, actualiza la URL en `index.html` (`canonical`, `og:*`, `twitter:*`, JSON-LD), `robots.txt` y `sitemap.xml`.

Al modificar `styles.css` o `script.js`, sube el parámetro `?v=` en `index.html` para invalidar la caché.

## Licencia

© 2026 **Tiger Systems**. Todos los derechos reservados.

# Prompt — Carousel de proyectos + Contact view (vista /v3)

Pega este prompt completo en una nueva sesión. Está pensado para implementar **solo dos piezas**: un carousel de proyectos y un contact view, ambos pertenecientes a una nueva ruta `/v3` del portfolio. Asume que la ruta `/v3` aún no existe; lo demás del portfolio sí.

---

## Contexto del proyecto

Estoy trabajando en `monNewPortfolio` (Next.js 16, App Router, React 19, Tailwind v4, TypeScript, Turbopack). Ya tengo instalado `framer-motion` (^12) y `lucide-react`. **No instales nada nuevo a menos que sea estrictamente necesario** — si lo necesitas, prefiere `embla-carousel-react` para el carousel.

Voy a crear una nueva vista experimental en `/v3` que reusa el hero existente (`src/components/v2/hero-v2.tsx`) intacto y luego despliega varias secciones scroll-driven con estética editorial dark (paleta `#08080a` fondo, `#edeae0` texto, `#c8a84a` oro como acento, `#d4502e` ember para énfasis, fuentes Bebas Neue + Cormorant Garamond italic + Space Mono).

En esta sesión **solo me interesa que construyas dos componentes**:

1. `src/components/v3/projects-carousel.tsx` — el carousel de proyectos
2. `src/components/v3/contact-editorial.tsx` — el contact view

No crees la página `/v3` completa todavía, ni las demás secciones. Solo esos dos componentes, con un `src/app/v3/preview/page.tsx` que los renderice uno tras otro sobre fondo dark para poder verlos aislados.

## Datos a reusar

### Proyectos
La fuente de verdad está en `src/components/v2/projects-v2.tsx`. Ahí hay arrays `featured` y `hackathon` con: `kind` ("video" | "image" | "blue-card"), `media` (path), `badge`, `title`, `desc`, `links[]`. Cópialos a un nuevo archivo `src/components/v3/data/projects.ts` adaptados a la forma que necesite el carousel (sugiero: `id`, `media`, `mediaType`, `badge`, `title`, `tagline`, `description`, `tags[]`, `links[]`, `accent` color opcional). Incluye los 7 proyectos: Plebes DAO, Andrea & Aldo, MK1 Presale, PokeFolio, UANL Interface+, mpBot, Birdlypay.

### i18n
El portfolio tiene un `LanguageContext` en `src/components/lang-context.tsx`. Usa `const { language } = useLanguage(); const isEs = language === "es";` para alternar copy ES/EN.

## Spec — Carousel de proyectos

Quiero un **carousel real**, no un horizontal-hijack pegado al scroll. Que se sienta como una pieza a la que se entra, se interactúa y se sale.

### Comportamiento

- **Snap horizontal** card por card, con peek visual del siguiente y anterior (~10–15% asomando).
- **Controles**: flechas izquierda/derecha (botones discretos al estilo editorial dark), navegación por teclado (← →), drag/swipe en mobile y desktop.
- **Indicador de progreso**: línea horizontal fina que se llena (no dots redondos) + contador `01 / 07` con tipografía Bebas Neue.
- **Sin autoplay**. El usuario manda.
- **No bloquees el scroll vertical** del documento. La sección debe tener altura natural; el carousel vive dentro de ella sin secuestrar nada.
- Soporte responsive: en mobile (<720px) las cards ocupan ~85vw; en desktop ~520–620px de ancho con peek de las laterales.

### Diseño de las cards

Cada card debe sentirse como una "ficha de archivo" editorial:

- Fondo `var(--v3-surf)` (#0f0f12), borde 1px `var(--v3-line)` (#222226).
- Esquinas duras (0 radius).
- Padding generoso (~clamp(1.5rem, 3vw, 2.5rem)).
- Layout de la card de arriba a abajo:
  1. **Eyebrow** ("ARCHIVO / 001" en Space Mono uppercase, letterspacing 0.3em, color oro, font-size 0.6rem).
  2. **Media** (video o imagen) ocupando ~45% del alto de la card. Aspect ratio respetado, object-fit cover, con overlay sutil de gradient negro al 20% bottom.
  3. **Badge** (categoría tipo "DAO · ICP", "Wedding · 2024") en mono, muted.
  4. **Título** en Bebas Neue, font-size clamp(1.8rem, 3vw, 2.6rem), line-height 1, color texto.
  5. **Tagline corta** (1 línea, ~10 palabras) en Cormorant italic color oro, font-size 1.1rem.
  6. **Descripción** en Cormorant italic muted, ~2–3 líneas, max-width 38ch.
  7. **Tags de stack** (3–5 chips pequeños tipo "Next.js", "PostgreSQL") con borde fino oro al 30%, fondo transparente, font-size 0.65rem mono uppercase.
  8. **Links** ("Demo en vivo", "GitHub") como underlines oro en mono uppercase con flecha ↗.
- Ghost number (I, II, III...) en numeral romano gigante en la esquina inferior derecha de la card, en Bebas Neue, color transparente con `-webkit-text-stroke: 1px var(--v3-faint)`, font-size ~14rem, sin pointer-events.
- Hover: borde se vuelve oro, ghost number gana opacidad ligera. Transición 0.3s.
- Card activa: opacidad 1, filtro normal. Cards laterales (peek): opacidad 0.55, grayscale(0.6) en su media. Transición suave.

### Tecnología sugerida

Mi recomendación: usa `embla-carousel-react` (lightweight, sin dependencias, accesible). Si lo prefieres puro framer-motion, usa el componente `motion.div` con `drag="x"`, `dragConstraints`, y `onDragEnd` para snap manual — pero embla ya resuelve esto bien.

Si usas embla:
```bash
npm install embla-carousel-react
```
Configura: `loop: false, align: "center", containScroll: "trimSnaps", dragFree: false, slidesToScroll: 1`. Suscríbete a `select` para actualizar el indicador de progreso.

### Encabezado de la sección

Antes del carousel, un section header al estilo editorial:

```
[ SECCIÓN 04 / PROYECTOS ]              ARCHIVO              [ scroll horizontal · drag ]
```

Tres columnas en una fila, separadas por `border-bottom: 1px solid var(--v3-line)`, padding `2rem clamp(1.5rem, 6vw, 5rem)`.

### Pre-cargado de videos

Las cards llevan video. Solo deben reproducir las cards visibles (activa + 1 vecina a cada lado). Las demás `pause()`. Usa el callback `select` de embla (o `onChange` del state) para hacer este toggle. Atributo `preload="metadata"` en todos.

---

## Spec — Contact view editorial

Es la última sección de `/v3`. Debe sentirse como **el cierre del manifiesto editorial** — no como un formulario corporativo.

### Layout

Página completa con padding generoso (`padding: clamp(4rem, 10vw, 8rem) clamp(1.5rem, 6vw, 5rem)`). Fondo `#08080a` con noise overlay (SVG fractalNoise al 3.5% opacity en `::after`).

Estructura vertical:

1. **Eyebrow** "ALEXIS · DISPONIBLE" en mono uppercase oro, con un punto verde animado (`#84cc16`, opacity pulsando 1↔0.4 con `motion.div` infinito) a la izquierda.
2. **Headline gigante** en Bebas Neue, font-size clamp(3rem, 8vw, 7rem), line-height 0.92, max-width 18ch:
   - ES: "Cuéntame qué quieres **construir**."
   - EN: "Tell me what you want to **build**."
   - La palabra "construir"/"build" en color oro `#c8a84a`.
   - Reveal por mask: usa `clip-path: inset(0 100% 0 0)` que va a `inset(0 0 0 0)` con `useScroll` + `useTransform` cuando entra al viewport.
3. **Sub-copy** en Cormorant italic 1.2rem muted, max-width 42ch:
   - "Cuéntame la idea, el flujo o el producto que tienes en mente. Te respondo con el siguiente paso más claro."
4. **Grid de 2 columnas** (1.4fr / 1fr en desktop, 1 col en mobile):
   - **Izquierda — formulario** (ver abajo).
   - **Derecha — info lateral**: bloque con título "PRÓXIMA RESPUESTA" mono uppercase oro, debajo un texto Cormorant italic "Suelo responder en menos de 24h en zona horaria America/Monterrey." Más abajo lista de links sociales con divisor 1px line: GitHub, LinkedIn, Email (`alexis.rs@inverater.com`), Calendly (si aplica). Cada link en mono uppercase con `↗` a la derecha; hover cambia color a oro y borde inferior a oro. Más abajo aún, un mini bloque "AHORA ESCUCHANDO" o "AHORA TRABAJANDO EN" con copy estático corto en italic muted (puedes inventar copy editorial corto).

### Formulario

- Campos sin label visible, solo placeholder. Inputs con `background: transparent`, `border: none`, `border-bottom: 1px solid var(--v3-line)`, padding `1rem 0`, font Space Mono, color texto.
- Focus: borde inferior cambia a oro, transición 0.3s. Sin outline.
- Placeholder en color muted, letterspacing 0.05em.
- Campos:
  1. `name` (text, requerido)
  2. `email` (email, requerido, validación HTML5)
  3. `subject` ("ASUNTO BREVE", text, opcional, max 80 chars con contador a la derecha tipo `0/80` en mono pequeño oro)
  4. `message` (textarea, 4 rows, requerido, resize vertical only)
  5. **Checkbox de tipo** opcional: pills horizontales seleccionables (single-choice) con opciones "PROYECTO NUEVO", "CONSULTORÍA", "COLABORACIÓN", "SOLO SALUDAR". Pill activa: fondo oro, texto negro. Pill inactiva: borde line, texto muted.
- **Submit POST a `/api/contact`** (la ruta existe en `src/app/api/contact/route.ts` — léela primero para confirmar el shape del body que espera). Maneja `loading`, `success`, `error`. Si la ruta no acepta los nuevos campos, envía solo los que sí, y deja un comentario `// TODO: extender API` para los nuevos.
- Botón submit grande en la parte inferior, full-width en mobile, auto en desktop:
  - Background oro, color negro, font Bebas Neue 1.3rem letterspacing 0.15em uppercase, padding `1.2rem 2.5rem`, sin border-radius.
  - Hover: background ember `#d4502e`, color texto `#edeae0`. Transición 0.3s.
  - Estados: idle "ENVIAR →" / loading "ENVIANDO..." con `<motion.div>` rotando `↻` / success se reemplaza el botón entero por un bloque verde oscuro "✓ MENSAJE RECIBIDO · TE ESCRIBO PRONTO" con animación fade+slide.
  - Disabled si form inválido: opacity 0.4, cursor not-allowed.

### Footer line

Al fondo de todo, separado por `border-top: 1px solid var(--v3-line)`, padding-top 2rem, dos columnas:

```
ALEXIS REYNA · 2026                                    FIN / SCROLL COMPLETE
```

Mono uppercase letterspacing 0.3em color muted; "FIN / SCROLL COMPLETE" en oro.

### Detalles de animación

- Headline: clip-path reveal por scroll (descrito arriba).
- Eyebrow + punto pulsante: aparece con `whileInView` opacity 0→1, y 12→0, duration 0.5s.
- Cada campo del form: stagger fade-in y 16→0 al entrar al viewport, delay incremental 0.08s.
- Botón submit: aparece con un slight scale 0.96→1 + fade.
- Transiciones de estados (loading/success/error) con `AnimatePresence` y `motion.div`.

---

## Página de preview

Crea `src/app/v3/preview/page.tsx`:

```tsx
"use client";
import { useEffect } from "react";
import ProjectsCarousel from "@/components/v3/projects-carousel";
import ContactEditorial from "@/components/v3/contact-editorial";

export default function V3Preview() {
  useEffect(() => {
    const original = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#08080a";
    return () => { document.body.style.backgroundColor = original; };
  }, []);

  return (
    <main className="relative" style={{ minHeight: "100vh" }}>
      <ProjectsCarousel />
      <ContactEditorial />
    </main>
  );
}
```

Layout opcional `src/app/v3/preview/layout.tsx` que cargue las fonts:

```tsx
import { Bebas_Neue, Cormorant_Garamond, Space_Mono } from "next/font/google";

const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas" });
const cormorant = Cormorant_Garamond({ weight: ["300","400","600"], style: ["normal","italic"], subsets: ["latin"], variable: "--font-cormorant" });
const spaceMono = Space_Mono({ weight: ["400","700"], subsets: ["latin"], variable: "--font-space-mono" });

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${bebas.variable} ${cormorant.variable} ${spaceMono.variable}`}>{children}</div>;
}
```

Y un `src/components/v3/v3.css` mínimo con las CSS variables (`--v3-bg`, `--v3-surf`, `--v3-text`, `--v3-muted`, `--v3-faint`, `--v3-gold`, `--v3-ember`, `--v3-line`) para que ambos componentes puedan referenciarlas.

## Reglas de calidad

- TypeScript estricto. Cero `any`.
- Componentes `"use client"` cuando uses hooks.
- Accesibilidad: labels sr-only en form, `aria-pressed` en pills, `aria-label` en flechas del carousel, focus-visible bien marcado.
- Sin emojis en código a menos que sean parte del copy.
- No toques nada fuera de `src/components/v3/`, `src/app/v3/preview/`, y opcionalmente `src/app/api/contact/route.ts` si necesitas extender el body que acepta.
- Antes de empezar, **lee** `src/components/v2/projects-v2.tsx`, `src/components/lang-context.tsx`, `src/app/api/contact/route.ts` y `src/app/globals.css` para entender el sistema actual.
- Al terminar, corre `npx tsc --noEmit` y reporta el resultado.

## Lo que **no** quiero

- Nada de horizontal-hijack que secuestre el scroll vertical.
- Nada de cursor custom que interfiera con el resto del sitio.
- Nada de carouseles infinitos que loopeen sin fin.
- Nada de stock animations genéricas (fade-in everywhere).
- Nada de form que no haga POST real al endpoint.

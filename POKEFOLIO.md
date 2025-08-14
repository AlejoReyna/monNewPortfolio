## Alexis Reyna — Developer Portfolio

- Live: add your deployment URL here
- Stack: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, next/font (Geist)

---

## Overview

This portfolio is a modern, bilingual (EN/ES) single‑page experience with:

- Typewriter intro and a language toggle in `Hero`
- A services section with intersection‑based reveal animations
- A projects timeline with inline video previews
- A lightweight canvas mini‑game
- A contact form (“Let’s Talk”)

Top‑level composition lives in `app/page.tsx`, wrapped globally by `app/layout.tsx` which provides navigation, footer, and language context.

```tsx
// app/page.tsx
export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <Showcase />
      <MiniGame />
      <LetsTalk />
    </main>
  );
}
```

---

## Getting started

- Install: `npm install`
- Dev: `npm run dev` then open `http://localhost:3000`
- Build/Start: `npm run build` → `npm start`

Project paths: `@/*` resolves to `src/*` (see `tsconfig.json`).

---

## Application shell and language

The root layout in `app/layout.tsx` applies fonts and wraps all routes with `Navbar`, `Footer`, and the bilingual language context.

```tsx
// app/layout.tsx (excerpt)
export const metadata = {
  title: "Alexis Reyna | Software Engineer",
  description: "Fullstack Developer | Building modern, fast, and accessible web experiences.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <LanguageProvider>
          <LanguageFade>
            <a id="top" />
            <Navbar />
            {children}
            <Footer />
          </LanguageFade>
        </LanguageProvider>
      </body>
    </html>
  );
}
```

Language state lives in `src/components/lang-context.tsx` and is persisted to `localStorage`. `LanguageFade` provides a smooth opacity transition during toggles.

```tsx
// src/components/lang-context.tsx (essentials)
export type Language = "en" | "es";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    setLanguage("en");
    try { window.localStorage.setItem("app_lang", "en"); } catch {}
  }, []);

  const toggleWithFade = useCallback(() => {
    setIsFading(true);
    window.setTimeout(() => {
      setLanguage((prev) => (prev === "en" ? "es" : "en"));
      window.setTimeout(() => setIsFading(false), 180);
    }, 180);
  }, []);

  return <LanguageContext.Provider value={{ language, toggleLanguage: () => setLanguage((p)=>p==="en"?"es":"en"), isFading, toggleWithFade }}>{children}</LanguageContext.Provider>;
}
```

---

## Sections

### Hero — `src/components/hero.tsx`

- Bilingual typewriter title/subtitle with a side tab to toggle language (`toggleWithFade`).
- Animated background (grid overlay, aurora gradients, glow orbs) and cursor spotlight.
- Desktop character GIF (`/public/16.gif`) with a mobile‑optimized variant.
- Post‑typing CTAs to `#projects` and `#contact`.
- Tech “marquee” chips appear after the subtitle completes; tech icons come from `raw.githubusercontent.com` (per `next.config.ts`).

Typing sequence (title first, then subtitle):

```tsx
// hero.tsx (typewriter core)
const prefixText = isEs ? "Hola, soy " : "Hey, I'm ";
const nameText = title;
const fullLength = prefixText.length + nameText.length;
const subtitleText = isEs
  ? "Desarrollador full‑stack creando experiencias..."
  : subtitle;

useEffect(() => { // title
  if (typedIndex >= fullLength) return;
  const t = setTimeout(() => setTypedIndex((v) => v + 1), 70);
  return () => clearTimeout(t);
}, [typedIndex, fullLength]);

useEffect(() => { // subtitle
  if (typedIndex < fullLength || subtitleTypedIndex >= subtitleText.length) return;
  const t = setTimeout(() => setSubtitleTypedIndex((v) => v + 1), 30);
  return () => clearTimeout(t);
}, [typedIndex, fullLength, subtitleTypedIndex, subtitleText]);
```

Language toggle tab:

```tsx
<a href="#toggle-lang" onClick={(e) => { e.preventDefault(); toggleWithFade(); }}>
  {isEs ? 'Click for English' : 'Click aquí para ver en español'}
</a>
```

### Navbar — `src/components/navbar.tsx`

- Sticky glass navbar with an animated scroll progress bar.
- Bilingual labels from `useLanguage()`.
- Mobile drawer with smooth height/opacity transitions.

### Services — `src/components/services.tsx`

- Bilingual services arrays (`servicesEs`, `servicesEn`).
- IntersectionObserver reveals each card with staggered transitions.
- Gradient backgrounds, icons, and hover ring effects.

```tsx
// services.tsx (data shape)
type Service = { title: string; description: string; highlights: string[]; gradientFromTo: string; icon: (props:{className?:string})=>ReactElement };
const servicesEn: Service[] = [ { title: 'Web Apps', description: 'Modern apps...', highlights: ['SSR/SSG','Performance','Accessibility'], gradientFromTo: 'from-sky-500/20 to-cyan-500/10', icon: ... }, /* ... */ ];
```

### Projects Timeline — `src/components/showcase.tsx`

- Alternating left/right timeline, animated nodes, year markers for 2024 and 2025.
- Inline muted video previews (tap overlay toggles play/pause).
- Data‑driven from the `projects` array. Edit this array to add/update cards.

```tsx
// showcase.tsx (projects excerpt)
export const projects = [
  { title: "Presale website of the videogame 'Mortal Kombat 1'", info: "Simulates preorder flow...", video: "/videos/preview-mk.mp4", url: "https://next-mk.vercel.app/", repo: "https://github.com/AlejoReyna/MortalKombat" },
  // ... other projects
];
```

### Mini‑Game — `src/components/mini-game.tsx`

- Canvas dodge game with keyboard and touch/pointer controls.
- Responsive canvas sizing with devicePixelRatio; progressive difficulty.
- Maintains current and best score; restart on Space or click/tap.

```tsx
// mini-game.tsx (update core)
function update(dt: number) {
  if (!isRunning) return;
  const moveSpeed = 360; // px/s
  // ... keyboard/touch movement → clamp to bounds
  // spawn enemies over time with increasing velocity
  // detect collision → setIsRunning(false), update best score
  setScore((s) => s + dt * 60);
}
```

### Let’s Talk — `src/components/lets-talk.tsx`

- Bilingual contact form with select‑chips for interest, name/email/message fields.
- Current submit handler simulates latency; integrate an API route or external service to send real emails.

### Footer — `src/components/footer.tsx`

- Brand block, quick links, contact, and social icons; “Back to top”.
- Shares animated background orb effects with other sections.

---

## Styling and effects

Global styles live in `app/globals.css` using Tailwind v4 and extra keyframes/utilities:

- `aurora` animated radial gradient backdrop
- `fade-in-up`, `float-soft` micro‑interactions
- `glow-ring`, `gradient-border` conic gradient borders
- `cursor-spotlight` follows the mouse using CSS variables

```css
/* app/globals.css (excerpt) */
@import "tailwindcss";
:root { --background: #ffffff; --foreground: #171717; }
@media (prefers-color-scheme: dark) { :root { --background: #0a0a0a; --foreground: #ededed; } }
.aurora { /* blurred animated gradients */ }
.glow-ring { /* conic gradient ring */ }
```

Images: `next.config.ts` allows remote icons from `raw.githubusercontent.com` (used by `Hero`). Consider mirroring locally if you prefer no external fetches.

---

## Internationalization (EN/ES)

- `useLanguage()` provides `language`, `toggleLanguage`, and `toggleWithFade`.
- Language is persisted to `localStorage`. The app forces English on first mount to avoid post‑hydration flips; `LanguageFade` masks the transition.
- For SSR‑consistent language, consider promoting language to cookies and reading it server‑side.

---

## Extending and editing

- Add a project: edit `projects` in `src/components/showcase.tsx`. Prefer compressed MP4 previews (H.264/AAC, ~1–4 Mbps).
- Update services: edit `servicesEs` / `servicesEn` in `src/components/services.tsx`.
- Replace contact info and social links in `src/components/lets-talk.tsx` and `src/components/footer.tsx`.
- Swap the hero GIF at `/public/16.gif` (consider MP4/WebM animation for better performance).

---

## Accessibility

- Semantic sections and headings; ARIA labels on the mini‑game wrapper and canvas.
- Visible focus styles; sufficient text contrast over gradients.

---

## Performance notes

- `next/image` used for icons; the animated GIF is `unoptimized`. Switching to MP4/WebM improves decode/CPU.
- IntersectionObserver defers expensive work until content is near viewport.
- Tailwind v4 utilities with small custom keyframes; minimal runtime JS for animations.

---

## Known limitations / TODO

- Contact form is client‑only; wire to an API route or service (Resend, Formspree, etc.).
- Some `projects` entries have empty `url`/`repo` — already handled to hide buttons when missing.
- Remote tech icons may be rate‑limited; mirror locally if needed and update `next.config.ts`.




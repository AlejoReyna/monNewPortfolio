"use client";

import { useMemo } from "react";
// @ts-ignore
import { motion, useScroll, useSpring } from "framer-motion";
import Link from "next/link";

// ===== Utilities =====
const cn = (...cls: (string | false | undefined)[]) => cls.filter(Boolean).join(" ");

// ===== Reusable Section =====
function ServiceSection({
  id,
  emoji,
  title,
  subtitle,
  bullets,
  cta,
  bg,
  reverse,
}: {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  bullets: string[];
  cta: { label: string; href: string }[];
  bg: string; // tailwind bg classes or inline gradient
  reverse?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "snap-start h-screen w-full relative overflow-hidden",
        "flex items-center",
        bg
      )}
      aria-label={title}
    >
      {/* subtle vignette overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />

      <div
        className={cn(
          "relative z-10 mx-auto grid w-full max-w-6xl gap-10 px-6 md:px-10",
          "md:grid-cols-2"
        )}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className={cn("flex flex-col justify-center", reverse && "md:order-2")}
        >
          <div className="mb-4 text-6xl md:text-7xl select-none">{emoji}</div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            {title}
          </h2>
          <p className="mt-3 text-lg text-white/80 max-w-prose">{subtitle}</p>

          <ul className="mt-6 space-y-2 text-white/80">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-white/80" />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            {cta.map((c) => (
              <Link
                key={c.label}
                href={c.href}
                className={cn(
                  "rounded-2xl px-5 py-3 text-sm font-semibold",
                  "bg-white text-black hover:bg-white/90 transition",
                  "shadow-lg shadow-black/20"
                )}
              >
                {c.label}
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Visual / Mockup column */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className={cn("grid place-items-center", reverse && "md:order-1")}
        >
          <div className="relative aspect-[16/10] w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 shadow-2xl">
            {/* simple decorative lines to simulate a mockup */}
            <div className="h-3 w-3 rounded-full bg-rose-400/90 absolute left-4 top-4" />
            <div className="h-3 w-3 rounded-full bg-amber-300/90 absolute left-8 top-4" />
            <div className="h-3 w-3 rounded-full bg-emerald-400/90 absolute left-12 top-4" />
            <div className="mt-6 space-y-3">
              <div className="h-6 w-2/3 rounded-md bg-white/20" />
              <div className="h-4 w-5/6 rounded-md bg-white/10" />
              <div className="h-4 w-4/6 rounded-md bg-white/10" />
              <div className="h-4 w-3/6 rounded-md bg-white/10" />
              <div className="h-40 w-full rounded-xl bg-gradient-to-r from-white/10 to-white/5" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ===== Dots Nav =====
function DotNav() {
  const items = [
    { id: "web" },
    { id: "mobile" },
    { id: "cloud" },
    { id: "ai" },
    { id: "consulting" },
  ];
  return (
    <nav className="fixed right-5 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3 z-50">
      {items.map((it) => (
        <a
          key={it.id}
          href={`#${it.id}`}
          className="group"
          aria-label={`Ir a ${it.id}`}
        >
          <span className="block h-3 w-3 rounded-full bg-white/40 group-hover:bg-white transition" />
        </a>
      ))}
    </nav>
  );
}

// ===== Progress Bar (scroll) =====
function TopProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, mass: 0.2 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 h-1 origin-left bg-white/80 z-50"
    />
  );
}

// ===== Page =====
export default function ServicesPage() {
  const sections = useMemo(
    () => [
      {
        id: "web",
        emoji: "🌐",
        title: "Web Development",
        subtitle:
          "Modern, fast and responsive web apps using React/Next.js, Vue 3 and TypeScript.",
        bullets: [
          "Landing pages, dashboards y sistemas internos",
          "SSR/SSG con Next.js, accesibilidad y SEO técnico",
          "Testing (Vitest/Jest) y CI/CD",
        ],
        cta: [
          { label: "Ver proyectos web", href: "/projects?type=web" },
          { label: "Cotizar", href: "/contact" },
        ],
        bg: "bg-[radial-gradient(60%_80%_at_50%_10%,rgba(99,102,241,.35),transparent_70%)] bg-neutral-950 text-white",
      },
      {
        id: "mobile",
        emoji: "📱",
        title: "Mobile Apps",
        subtitle:
          "Experiencia nativa y multiplataforma. Prototipos rápidos y publicación en stores.",
        bullets: [
          "Flutter y React Native",
          "Integración con APIs, auth y notificaciones",
          "UI/UX con motion y theming",
        ],
        cta: [
          { label: "Ver apps", href: "/projects?type=mobile" },
          { label: "Hablemos", href: "/contact" },
        ],
        bg: "bg-[radial-gradient(60%_80%_at_50%_10%,rgba(244,114,182,.28),transparent_70%)] bg-neutral-950 text-white",
        reverse: true,
      },
      {
        id: "cloud",
        emoji: "☁️",
        title: "Cloud Computing",
        subtitle:
          "Infraestructura escalable, contenedores y despliegues confiables (AWS/GCP/Vercel).",
        bullets: [
          "Docker, CI/CD, observabilidad básica",
          "APIs Node/Express y PostgreSQL gestionado",
          "CDN, edge y caching inteligente",
        ],
        cta: [
          { label: "Infra demo", href: "/projects?type=cloud" },
          { label: "Revisar tu arquitectura", href: "/contact" },
        ],
        bg: "bg-[radial-gradient(60%_80%_at_50%_10%,rgba(45,212,191,.28),transparent_70%)] bg-neutral-950 text-white",
      },
      {
        id: "ai",
        emoji: "🤖",
        title: "AI & Machine Learning",
        subtitle:
          "Integración de LLMs, clasificación de datos y automatización con pipelines sólidos.",
        bullets: [
          "Chatbots/agents, embeddings y retrieval",
          "Etiquetado, evaluación y guardrails",
          "Integraciones con productos existentes",
        ],
        cta: [
          { label: "Casos de AI", href: "/projects?type=ai" },
          { label: "Prototipar idea", href: "/contact" },
        ],
        bg: "bg-[radial-gradient(60%_80%_at_50%_10%,rgba(147,51,234,.28),transparent_70%)] bg-neutral-950 text-white",
        reverse: true,
      },
      {
        id: "consulting",
        emoji: "🧭",
        title: "Product Consulting",
        subtitle:
          "Auditorías técnicas, performance review y roadmaps priorizados para acelerar el delivery.",
        bullets: [
          "Descubrimiento y estimación",
          "Revisiones de código y arquitectura",
          "Mentoría para equipos junior",
        ],
        cta: [
          { label: "Agenda una sesión", href: "/contact" },
          { label: "Ver casos", href: "/projects?type=consulting" },
        ],
        bg: "bg-[radial-gradient(60%_80%_at_50%_10%,rgba(250,204,21,.25),transparent_70%)] bg-neutral-950 text-white",
      },
    ],
    []
  );

  return (
    <main className="relative min-h-screen bg-neutral-950 text-white">
      <TopProgress />
      <DotNav />

      {/* Scroll container with snap */}
      <div className="snap-y snap-mandatory h-screen overflow-y-scroll no-scrollbar">
        {sections.map((s, i) => (
          <ServiceSection key={s.id} {...s} />
        ))}
      </div>

      {/* Footer CTA pinned after last screen */}
      <footer className="sticky bottom-0 z-40">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-4 flex items-center justify-between text-sm text-white/70">
          <span>¿Listo para construir algo? </span>
          <Link
            href="/contact"
            className="rounded-xl bg-white px-4 py-2 font-semibold text-black shadow-md hover:bg-white/90"
          >
            Contáctame
          </Link>
        </div>
      </footer>
    </main>
  );
}


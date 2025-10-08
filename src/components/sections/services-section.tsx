"use client";

import type React from "react";
import { useMemo } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

/* =========================
   Util
========================= */
const cn = (...cls: (string | false | undefined)[]) => cls.filter(Boolean).join(" ");

/* =========================
   Tilt / parallax en hover
========================= */
function withTilt(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  const el = e.currentTarget as HTMLDivElement;
  const rect = el.getBoundingClientRect();
  const px = (e.clientX - rect.left) / rect.width;
  const py = (e.clientY - rect.top) / rect.height;
  el.style.setProperty("--px", String(px));
  el.style.setProperty("--py", String(py));
}

/* =========================
   Tarjeta visual estilo "projects"
========================= */
function VisualCard({
  kind = "image",
  media,
  title,
  badge,
  gradient = "from-black/80 via-black/40 to-transparent",
}: {
  kind?: "image" | "video" | "empty";
  media?: string;
  title: string;
  badge?: string;
  gradient?: string;
}) {
  return (
    <div
      onMouseMove={withTilt}
      className={cn(
        "group relative w-full max-w-lg aspect-[16/10] rounded-3xl overflow-hidden",
        "border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl will-change-transform"
      )}
      style={{
        transform:
          "perspective(900px) rotateX(calc((0.5 - var(--py, .5)) * 3deg)) rotateY(calc((var(--px, .5) - 0.5) * 6deg))",
        transition: "transform 120ms ease-out",
      }}
    >
      {/* Media */}
      {kind !== "empty" && media && (
        <>
          {kind === "video" ? (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={media} type="video/mp4" />
            </video>
          ) : (
            <Image
              src={media}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          )}
          <div className={`absolute inset-0 bg-gradient-to-t ${gradient}`} />
          <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-white/5" />
        </>
      )}

      {/* Chrome dots deco */}
      <div className="absolute left-4 top-4 z-20 flex gap-2">
        <span className="h-3 w-3 rounded-full bg-rose-400/90" />
        <span className="h-3 w-3 rounded-full bg-amber-300/90" />
        <span className="h-3 w-3 rounded-full bg-emerald-400/90" />
      </div>

      {/* Badge */}
      {badge && (
        <span className="absolute top-4 right-4 z-20 rounded-full bg-white/15 border border-white/20 backdrop-blur px-3 py-1 text-[10px] tracking-wide text-white">
          {badge}
        </span>
      )}

      {/* Footer strip */}
      <div className="absolute inset-x-0 bottom-0 z-20">
        <div className="m-3 rounded-xl bg-black/55 backdrop-blur-sm border border-white/10 px-4 py-3">
          <h3 className="font-mono font-light text-white leading-tight">{title}</h3>
        </div>
      </div>
    </div>
  );
}

/* =========================
   Sección reusable
========================= */
function ServiceSection({
  id,
  title,
  subtitle,
  bullets,
  cta,
  reverse,
  visual, // { kind, media, badge, gradient }
}: {
  id: string;
  title: string;
  subtitle: string;
  bullets: string[];
  cta: { label: string; href: string }[];
  reverse?: boolean;
  visual?: {
    kind?: "image" | "video" | "empty";
    media?: string;
    badge?: string;
    gradient?: string;
  };
}) {
  return (
    <section
      id={id}
      className={cn(
        "snap-start h-screen w-full relative overflow-hidden",
        "flex items-center",
        "bg-black text-white"
      )}
      aria-label={title}
    >
      {/* Vignette suave */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />

      <div
        className={cn(
          "relative z-10 mx-auto grid w-full max-w-6xl gap-10 px-6 md:px-10",
          "md:grid-cols-2"
        )}
      >
        {/* Texto */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className={cn("flex flex-col justify-center", reverse && "md:order-2")}
        >
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

        {/* Visual tipo "projects" */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className={cn(
            "grid place-items-center",
            reverse && "md:order-1"
          )}
        >
          <VisualCard
            kind={visual?.kind}
            media={visual?.media}
            badge={visual?.badge}
            title={title}
            gradient={visual?.gradient}
          />
        </motion.div>
      </div>
    </section>
  );
}

/* =========================
   Dots Nav
========================= */
function DotNav() {
  const items = [
    { id: "web" },
    { id: "mobile" }, // (UX/UI) mantenemos id para no romper anclas
    { id: "cloud" },  // (AWS)   mantenemos id para no romper anclas
  ];
  return (
    <nav className="fixed right-5 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3 z-50">
      {items.map((it) => (
        <a key={it.id} href={`#${it.id}`} className="group" aria-label={`Ir a ${it.id}`}>
          <span className="block h-3 w-3 rounded-full bg-white/40 group-hover:bg-white transition" />
        </a>
      ))}
    </nav>
  );
}

/* =========================
   Barra de progreso scroll
========================= */
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

/* =========================
   Página
========================= */
type VisualKind = "image" | "video" | "empty";
type ServiceDef = {
  id: string;
  title: string;
  subtitle: string;
  bullets: string[];
  cta: { label: string; href: string }[];
  reverse?: boolean;
  visual?: {
    kind?: VisualKind;
    media?: string;
    badge?: string;
    gradient?: string;
  };
};
export default function ServicesPage() {
  const sections = useMemo<ServiceDef[]>(
    () => [
      {
        id: "web",
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
        visual: {
          kind: "image",
          media: "/services/web.jpg",
          badge: "NEXT.JS · VUE",
          gradient: "from-black/85 via-black/45 to-transparent",
        },
      },
      {
        id: "mobile",
        title: "UX/UI Design", // <— solicitado
        subtitle:
          "Diseño centrado en el usuario con prototipos interactivos, design systems y microinteracciones atractivas.",
        bullets: [
          "Wireframes → prototipos de alta fidelidad",
          "Design tokens y componentes reusables",
          "Motion/UI states, accesibilidad y handoff",
        ],
        cta: [
          { label: "Ver casos de diseño", href: "/projects?type=design" },
          { label: "Hablemos", href: "/contact" },
        ],
        reverse: true,
        visual: {
          kind: "image",
          media: "/services/uxui.jpg",
          badge: "FIGMA · MOTION",
          gradient: "from-black/80 via-black/40 to-transparent",
        },
      },
      {
        id: "cloud",
        title: "AWS Managment", // <— solicitado (misma ortografía)
        subtitle:
          "Infraestructura escalable, automatizada y observable sobre AWS (ECS, Lambda, RDS, S3, CloudFront).",
        bullets: [
          "Docker + CI/CD (GitHub Actions) con despliegues azules/verdes",
          "PostgreSQL gestionado, secrets y parámetros",
          "Observabilidad: logs, alarms y costos bajo control",
        ],
        cta: [
          { label: "Infra demo", href: "/projects?type=cloud" },
          { label: "Revisar tu arquitectura", href: "/contact" },
        ],
        visual: {
          kind: "image",
          media: "/services/aws.jpg",
          badge: "ECS · LAMBDA · RDS",
          gradient: "from-black/85 via-black/45 to-transparent",
        },
      },
    ],
    []
  );

  return (
    <main className="relative min-h-screen bg-neutral-950 text-white lg:pl-24 xl:pl-28 sm:pt-7">
      {/* Background image: focal.png */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/focal.png"
          alt="Background"
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="relative z-10">
        <TopProgress />
        <DotNav />

        {/* Contenedor scroll con snap */}
        <div className="snap-y snap-mandatory h-screen overflow-y-scroll no-scrollbar">
          {sections.map((s) => (
            <ServiceSection key={s.id} {...s} />
          ))}
        </div>

        {/* Footer CTA */}
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
      </div>
    </main>
  );
}
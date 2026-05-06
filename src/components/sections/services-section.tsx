"use client";

import { useMemo } from "react";
import { motion, MotionConfig } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/components/lang-context";

type ServiceDef = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  bullets: string[];
  cta: { label: string; href: string }[];
  featured?: boolean;
};

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

function ServiceCard({ service }: { service: ServiceDef }) {
  const isFeatured = service.featured;

  return (
    <motion.article
      id={service.id}
      variants={cardVariant}
      className="relative overflow-hidden flex flex-col justify-between"
      style={{
        minHeight: isFeatured ? "360px" : "320px",
        padding: isFeatured ? "clamp(32px, 5vw, 64px)" : "var(--gic-spacing-24)",
        borderRadius: isFeatured ? "var(--gic-radius-cards-large)" : "var(--gic-radius-cards-small)",
        background: isFeatured ? "var(--gic-cofounder-blue)" : "var(--gic-off-white)",
        boxShadow: isFeatured ? "var(--gic-shadow-subtle-3)" : "var(--gic-shadow-subtle-2)",
      }}
    >
      {isFeatured && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 80% 18%, rgba(255,255,255,0.16), transparent 34%), linear-gradient(135deg, rgba(255,255,255,0.08), transparent 46%)",
          }}
        />
      )}

      <div className="relative z-10 flex flex-col gap-4">
        <span
          style={{
            fontFamily: "var(--gic-font-sans)",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: isFeatured ? "rgba(255,255,255,0.62)" : "var(--gic-medium-gray)",
          }}
        >
          {service.eyebrow}
        </span>

        <h3
          style={{
            fontFamily: "var(--gic-font-serif)",
            fontSize: isFeatured ? "clamp(32px, 4vw, var(--gic-text-heading-lg))" : "var(--gic-text-heading)",
            fontWeight: 400,
            lineHeight: "var(--gic-leading-heading)",
            letterSpacing: "var(--gic-tracking-heading)",
            color: isFeatured ? "var(--gic-canvas-white)" : "var(--gic-dark-charcoal)",
            maxWidth: isFeatured ? "620px" : "420px",
          }}
        >
          {service.title}
        </h3>

        <p
          style={{
            fontFamily: "var(--gic-font-sans)",
            fontSize: "16px",
            lineHeight: 1.5,
            letterSpacing: "-0.012em",
            color: isFeatured ? "rgba(255,255,255,0.78)" : "var(--gic-medium-gray)",
            maxWidth: "560px",
          }}
        >
          {service.subtitle}
        </p>

        <ul className="grid gap-2 pt-2">
          {service.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-3">
              <span
                className="mt-2 h-1.5 w-1.5 rounded-full shrink-0"
                style={{
                  backgroundColor: isFeatured ? "rgba(255,255,255,0.72)" : "var(--gic-action-azure)",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--gic-font-sans)",
                  fontSize: "15px",
                  lineHeight: 1.45,
                  letterSpacing: "-0.012em",
                  color: isFeatured ? "rgba(255,255,255,0.72)" : "var(--gic-slate-gray)",
                }}
              >
                {bullet}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative z-10 flex flex-wrap gap-4 pt-8">
        {service.cta.map((action) => (
          <Link
            key={action.href + action.label}
            href={action.href}
            style={{
              fontFamily: "var(--gic-font-sans)",
              fontSize: "var(--gic-text-caption)",
              fontWeight: 500,
              letterSpacing: "var(--gic-tracking-caption)",
              color: isFeatured ? "var(--gic-canvas-white)" : "var(--gic-cofounder-blue)",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            }}
          >
            {action.label} ↗
          </Link>
        ))}
      </div>
    </motion.article>
  );
}

export default function ServicesPage() {
  const { language } = useLanguage();
  const isEs = language === "es";

  const sections = useMemo<ServiceDef[]>(
    () => [
      {
        id: "web",
        eyebrow: isEs ? "Ingeniería web" : "Web engineering",
        title: isEs ? "Productos web rápidos, claros y escalables." : "Fast, clear, scalable web products.",
        subtitle: isEs
          ? "Construyo interfaces y sistemas con Next.js, React, Vue y TypeScript, cuidando rendimiento, accesibilidad y mantenibilidad."
          : "I build interfaces and systems with Next.js, React, Vue and TypeScript, with attention to performance, accessibility and maintainability.",
        bullets: [
          isEs ? "Landing pages, dashboards y sistemas internos" : "Landing pages, dashboards and internal tools",
          isEs ? "SSR/SSG, SEO técnico y componentes reutilizables" : "SSR/SSG, technical SEO and reusable components",
          isEs ? "Testing, CI/CD y despliegues confiables" : "Testing, CI/CD and reliable deployments",
        ],
        cta: [
          { label: isEs ? "Ver trabajo" : "View work", href: "#projects" },
          { label: isEs ? "Hablemos" : "Start a conversation", href: "#contact" },
        ],
        featured: true,
      },
      {
        id: "mobile",
        eyebrow: "UX/UI",
        title: isEs ? "Diseño que se siente simple." : "Design that feels simple.",
        subtitle: isEs
          ? "De wireframes a interfaces finales, convierto flujos complejos en experiencias limpias, usables y consistentes."
          : "From wireframes to final interfaces, I turn complex flows into clean, usable and consistent experiences.",
        bullets: [
          isEs ? "Prototipos de alta fidelidad" : "High-fidelity prototypes",
          isEs ? "Design tokens y sistemas visuales" : "Design tokens and visual systems",
          isEs ? "Estados, motion y handoff" : "States, motion and handoff",
        ],
        cta: [
          { label: isEs ? "Casos de diseño" : "Design cases", href: "#projects" },
        ],
      },
      {
        id: "cloud",
        eyebrow: "AWS",
        title: isEs ? "Infraestructura lista para crecer." : "Infrastructure ready to grow.",
        subtitle: isEs
          ? "Automatizo despliegues, datos y observabilidad para que los productos puedan operar con menos fricción."
          : "I automate deployments, data and observability so products can operate with less friction.",
        bullets: [
          "Docker + CI/CD",
          isEs ? "PostgreSQL, secrets y parámetros" : "PostgreSQL, secrets and parameters",
          isEs ? "Logs, alarmas y costos bajo control" : "Logs, alarms and costs under control",
        ],
        cta: [
          { label: isEs ? "Revisar arquitectura" : "Review architecture", href: "#contact" },
        ],
      },
    ],
    [isEs]
  );

  return (
    <MotionConfig transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}>
      <section
        id="services"
        className="relative overflow-hidden"
        style={{ backgroundColor: "var(--gic-off-white)" }}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-24"
          style={{
            background: "linear-gradient(to bottom, var(--gic-night-sky), var(--gic-off-white))",
          }}
        />

        <div
          className="relative mx-auto px-6 md:px-10 lg:px-16 pt-32 pb-24"
          style={{
            maxWidth: "var(--gic-max-width)",
            paddingLeft: "clamp(24px, 5vw, 64px)",
            paddingRight: "clamp(24px, 5vw, 64px)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            className="mb-12 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 items-end"
          >
            <div className="flex items-center gap-4">
              <div style={{ height: "1px", width: "32px", backgroundColor: "var(--gic-steel-gray)" }} />
              <span
                style={{
                  fontFamily: "var(--gic-font-sans)",
                  fontSize: "var(--gic-text-caption)",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--gic-light-gray)",
                }}
              >
                {isEs ? "Servicios" : "Services"}
              </span>
            </div>

            <h2
              style={{
                fontFamily: "var(--gic-font-serif)",
                fontSize: "clamp(34px, 4.8vw, var(--gic-text-display))",
                fontWeight: 400,
                lineHeight: "var(--gic-leading-display)",
                letterSpacing: "var(--gic-tracking-display)",
                color: "var(--gic-dark-charcoal)",
                maxWidth: "660px",
              }}
            >
              {isEs
                ? "Un stack completo para llevar ideas a producción."
                : "A full stack for bringing ideas into production."}
            </h2>
          </motion.div>

          <motion.div
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.12 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <div className="lg:col-span-2">
              <ServiceCard service={sections[0]} />
            </div>
            {sections.slice(1).map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}
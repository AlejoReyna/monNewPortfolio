"use client";

import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Terminal,
  LayoutDashboard,
  CalendarDays,
  LineChart,
  Send,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  icon: React.ElementType;
  extraFeatures: string[];
}

function timelineEs(): TimelineEvent[] {
  return [
    {
      id: "step-1",
      date: "27 de abril, 2026",
      title: "La evolución del dashboard",
      description:
        "El primer paso fue romper el cascarón de los frames heredados. Se diseñó un dashboard moderno, inyectado directamente en el portal existente. Organizamos la información académica, habilitamos temas personalizados y creamos una navegación lateral limpia que respeta los colores institucionales.",
      icon: LayoutDashboard,
      extraFeatures: [
        "Reskin moderno para los frames 'top', 'left' y 'center'.",
        "Barra lateral categorizada con búsqueda y anclaje.",
        "Landing experience para eselcarrera.htm.",
        "Navegación persistente en todo el ecosistema.",
      ],
    },
    {
      id: "step-2",
      date: "5 de mayo, 2026",
      title: "Sincronizando el tiempo: Nexus",
      description:
        "Conectamos los hilos invisibles entre SIASE y Nexus. Resolviendo bloqueos de sesión y expiración de tokens, construimos un widget nativo para las actividades próximas. Ahora, con un clic, las fechas límite se exportan a Google Calendar o Outlook.",
      icon: CalendarDays,
      extraFeatures: [
        "Widget de 'Próximas a vencer' integrado.",
        "Deep links para Outlook y Microsoft 365.",
        "Exportación nativa de archivos .ics.",
        "Gestión de tokens en segundo plano.",
      ],
    },
    {
      id: "step-3",
      date: "6 de mayo, 2026",
      title: "El conocimiento es poder: kardex automático",
      description:
        "La extensión comenzó a leer el kardex en segundo plano. Analizando créditos, calculando porcentajes de progreso y determinando el promedio aritmético sin la intervención del estudiante. Todo resumido en una sola tira de métricas visuales.",
      icon: LineChart,
      extraFeatures: [
        "Scraping asíncrono sin alertas intrusivas.",
        "Cálculo de promedio y progreso de créditos.",
        "Notificaciones de cambios en notas vía Worker.",
        "Popup de acceso rápido con caché inteligente.",
      ],
    },
  ];
}

export default function HistoriaPage() {
  const [inputValue, setInputValue] = useState("");
  const [ack, setAck] = useState(false);
  const timelineData = timelineEs();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setInputValue("");
      setAck(true);
      window.setTimeout(() => setAck(false), 3200);
    }
  };

  return (
    <main
      className="w-full selection:bg-[var(--gic-action-azure)] selection:text-[var(--gic-canvas-white)]"
      style={{
        backgroundColor: "var(--gic-canvas-white)",
        color: "var(--gic-pitch-black)",
        fontFamily: "var(--gic-font-sans)",
      }}
    >
      <Link
        href="/"
        className="fixed left-4 top-4 z-50 transition-opacity hover:opacity-80 sm:left-6 sm:top-6"
        style={{
          fontFamily: "var(--gic-font-sans)",
          fontSize: "var(--gic-text-caption)",
          letterSpacing: "var(--gic-tracking-caption)",
          color: "var(--gic-slate-gray)",
        }}
      >
        ← Inicio
      </Link>

      {/* 1. Hero: Mind-breaking Reveal */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 overflow-hidden">
        <motion.div
          initial={{ clipPath: "inset(100% 0% 0% 0%)", filter: "blur(20px)", y: 100 }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)", filter: "blur(0px)", y: 0 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl text-center"
        >
          <Terminal
            className="mx-auto mb-8 text-[var(--gic-slate-gray)]"
            size={48}
            strokeWidth={1}
          />
          <h1
            className="mb-12 leading-tight"
            style={{
              fontFamily: "var(--gic-font-serif)",
              fontSize: "clamp(2.25rem, 7vw, var(--gic-text-display))",
              lineHeight: "var(--gic-leading-display)",
              letterSpacing: "var(--gic-tracking-display)",
              color: "var(--gic-pitch-black)",
            }}
          >
            El sistema heredado.
            <br />
            Una nueva realidad.
          </h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mx-auto max-w-2xl italic"
            style={{
              fontFamily: "var(--gic-font-sans)",
              fontSize: "1.125rem",
              lineHeight: 1.6,
              color: "var(--gic-charcoal)",
            }}
          >
            {
              "\u201cSIASE es un laberinto de frames y CGI de otra época. Pero debajo de ese código hay una experiencia esperando ser liberada. Esto no es solo un reskin: es una reconstrucción total.\u201d"
            }
          </motion.p>
        </motion.div>
        
        {/* Línea de progreso infinita lateral */}
        <motion.div 
          className="absolute right-10 top-0 w-px h-full bg-gradient-to-b from-transparent via-[var(--gic-steel-gray)] to-transparent"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 2 }}
        />
      </section>

      {/* 2. Timeline Sections: Parallax & Masking */}
      {timelineData.map((step, index) => (
        <TimelineSection key={step.id} step={step} index={index} />
      ))}

      {/* 3. Footer: Minimalist CTA */}
      <section className="flex min-h-screen flex-col items-center justify-center px-6 border-t border-[var(--gic-off-white)]">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-16 max-w-4xl text-center leading-tight"
          style={{
            fontFamily: "var(--gic-font-serif)",
            fontSize: "clamp(2rem, 5vw, var(--gic-text-display))",
            lineHeight: "var(--gic-leading-display)",
            color: "var(--gic-pitch-black)",
          }}
        >
          Este proyecto sigue en desarrollo,
          <br />
          ¿hay alguna feature que te gustaría ver?
        </motion.h2>

        <form onSubmit={handleSubmit} className="relative w-full max-w-2xl">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="# SIASE Plus"
            className="w-full bg-transparent py-6 text-left transition-all focus:outline-none"
            style={{
              fontFamily: "var(--gic-font-sans)",
              fontSize: "var(--gic-text-heading)",
              color: "var(--gic-pitch-black)",
              borderBottom: "2px solid var(--gic-steel-gray)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderBottomColor = "var(--gic-action-azure)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderBottomColor = "var(--gic-steel-gray)";
            }}
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-[var(--gic-medium-gray)] transition-colors hover:text-[var(--gic-action-azure)] disabled:opacity-30"
          >
            <Send size={28} />
          </button>
        </form>
        {ack && (
          <p
            className="mt-8 font-bold text-[var(--gic-action-azure)]"
            style={{
              fontFamily: "var(--gic-font-sans)",
              fontSize: "var(--gic-text-caption)",
            }}
          >
            Sugerencia recibida. Gracias por construir el futuro de la UANL.
          </p>
        )}
      </section>
    </main>
  );
}

function TimelineSection({ step, index }: { step: TimelineEvent; index: number }) {
  const container = useRef(null);
  const Icon = step.icon;
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1]);
  const isEven = index % 2 === 0;

  return (
    <motion.section
      ref={container}
      style={{ opacity }}
      className="relative flex min-h-screen flex-col items-center justify-center px-6 py-32 lg:px-24"
    >
      <div className={`flex w-full max-w-7xl flex-col items-center gap-20 lg:flex-row ${isEven ? "" : "lg:flex-row-reverse"}`}>
        
        {/* Contenido Narrativo */}
        <div className="flex-1 space-y-8">
          <motion.div
            initial={{ x: isEven ? -100 : 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span
              className="mb-4 block uppercase tracking-widest opacity-70"
              style={{
                fontFamily: "var(--gic-font-serif)",
                fontSize: "var(--gic-text-button-label)",
                color: "var(--gic-slate-gray)",
              }}
            >
              {step.date}
            </span>
            <h2
              className="mb-8"
              style={{
                fontFamily: "var(--gic-font-serif)",
                fontSize: "var(--gic-text-display)",
                lineHeight: "var(--gic-leading-display)",
                color: "var(--gic-cofounder-blue)",
              }}
            >
              {step.title}
            </h2>
            <p
              className="text-balance"
              style={{
                fontFamily: "var(--gic-font-sans)",
                fontSize: "var(--gic-text-heading)",
                lineHeight: 1.6,
                color: "var(--gic-charcoal)",
              }}
            >
              {step.description}
            </p>
          </motion.div>

          <motion.div 
            className="pt-8 space-y-4 border-t border-[var(--gic-off-white)]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {step.extraFeatures.map((f, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="h-px w-8 bg-[var(--gic-pitch-black)] transition-all group-hover:w-12" />
                <span
                  style={{
                    fontFamily: "var(--gic-font-sans)",
                    fontSize: "var(--gic-text-subheading)",
                    color: "var(--gic-dark-charcoal)",
                  }}
                >
                  {f}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Visual Parallax Wrapper */}
        <motion.div 
          style={{ y, scale }}
          className="flex-1 w-full"
        >
          <div className="relative aspect-[4/5] bg-[var(--gic-off-white)] rounded-[var(--gic-radius-cards-large)] border border-[var(--gic-cool-gray)] overflow-hidden shadow-2xl">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-[var(--gic-slate-gray)] opacity-30">
              <Icon size={64} strokeWidth={0.5} />
              <p
                className="italic"
                style={{ fontFamily: "var(--gic-font-serif)" }}
              >
                Vista de proceso: {step.title}
              </p>
            </div>
            {/* Efecto de ruido/textura sutil */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
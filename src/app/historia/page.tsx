"use client";

import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
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
import { useLanguage } from "@/components/lang-context";

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
    <main className="w-full bg-[var(--gic-canvas-white)] selection:bg-[var(--gic-pitch-black)] selection:text-[var(--gic-canvas-white)]">
      <Link
        href="/"
        className="fixed left-6 top-6 z-50 mix-blend-difference font-[var(--gic-font-serif)] text-[var(--gic-text-caption)] text-[var(--gic-slate-gray)] uppercase tracking-widest"
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
          <Terminal className="mx-auto mb-8 text-[var(--gic-pitch-black)] opacity-20" size={40} />
          <h1 className="font-[var(--gic-font-serif)] text-[clamp(3rem,8vw,5rem)] leading-[0.9] text-[var(--gic-pitch-black)] tracking-tighter mb-12">
            EL SISTEMA HEREDADO.<br />
            UNA NUEVA REALIDAD.
          </h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="font-[var(--gic-font-serif)] text-[var(--gic-text-heading)] text-[var(--gic-pitch-black)] max-w-2xl mx-auto leading-relaxed opacity-80"
          >
            SIASE es un laberinto de frames y CGI de otra época. Pero debajo de ese código hay una experiencia esperando ser liberada.
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
          className="font-[var(--gic-font-serif)] text-[clamp(2rem,5vw,3.5rem)] text-[var(--gic-pitch-black)] text-center mb-16 leading-tight max-w-4xl"
        >
          ¿Hay alguna feature que te gustaría ver?
        </motion.h2>

        <form onSubmit={handleSubmit} className="relative w-full max-w-2xl">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="# SIASE Plus"
            className="w-full bg-transparent py-8 font-[var(--gic-font-serif)] text-[var(--gic-text-heading)] text-[var(--gic-pitch-black)] border-b-2 border-[var(--gic-pitch-black)] focus:outline-none placeholder:opacity-20"
          />
          <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 hover:scale-110 transition-transform">
            <Send size={32} className="text-[var(--gic-pitch-black)]" />
          </button>
        </form>
        {ack && <p className="mt-8 font-[var(--gic-font-serif)] text-[var(--gic-action-azure)]">Registrado en la bitácora.</p>}
      </section>
    </main>
  );
}

function TimelineSection({ step, index }: { step: TimelineEvent; index: number }) {
  const container = useRef(null);
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
            <span className="font-[var(--gic-font-serif)] text-[var(--gic-text-caption)] text-[var(--gic-slate-gray)] uppercase tracking-[0.4em] mb-4 block">
              {step.date}
            </span>
            <h2 className="font-[var(--gic-font-serif)] text-[var(--gic-text-display)] text-[var(--gic-pitch-black)] leading-[1.1] mb-8">
              {step.title.toUpperCase()}
            </h2>
            <p className="font-[var(--gic-font-serif)] text-[var(--gic-text-heading)] text-[var(--gic-pitch-black)] leading-relaxed opacity-80">
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
                <span className="font-[var(--gic-font-serif)] text-[var(--gic-text-subheading)] text-[var(--gic-pitch-black)]">
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
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20">
              <step.icon size={80} strokeWidth={0.5} className="text-[var(--gic-pitch-black)] mb-4" />
              <p className="font-[var(--gic-font-serif)] text-[var(--gic-text-caption)] uppercase tracking-widest">
                Visual Assets / Phase {index + 1}
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
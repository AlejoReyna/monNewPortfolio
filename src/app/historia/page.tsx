"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Terminal,
  LayoutDashboard,
  CalendarDays,
  LineChart,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/lang-context";

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  icon: React.ElementType;
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
    },
    {
      id: "step-2",
      date: "5 de mayo, 2026",
      title: "Sincronizando el tiempo: Nexus",
      description:
        "Conectamos los hilos invisibles entre SIASE y Nexus. Resolviendo bloqueos de sesión y expiración de tokens, construimos un widget nativo para las actividades próximas. Ahora, con un clic, las fechas límite se exportan a Google Calendar, Outlook o .ics.",
      icon: CalendarDays,
    },
    {
      id: "step-3",
      date: "6 de mayo, 2026",
      title: "El conocimiento es poder: kardex automático",
      description:
        "La extensión comenzó a leer el kardex en segundo plano. Analizando créditos, calculando porcentajes de progreso y determinando el promedio aritmético sin la intervención del estudiante. Todo resumido en una sola tira de métricas visuales.",
      icon: LineChart,
    },
  ];
}

function timelineEn(): TimelineEvent[] {
  return [
    {
      id: "step-1",
      date: "April 27, 2026",
      title: "Evolving the dashboard",
      description:
        "First we broke out of inherited frames. A modern dashboard was designed and injected into the existing portal. We organized academic data, enabled custom themes, and built a clean side navigation that respects institutional colors.",
      icon: LayoutDashboard,
    },
    {
      id: "step-2",
      date: "May 5, 2026",
      title: "Syncing time: Nexus",
      description:
        "We connected SIASE and Nexus behind the scenes—session locks and token expiry included—and shipped a native widget for upcoming tasks. Deadlines export to Google Calendar, Outlook, or .ics in one click.",
      icon: CalendarDays,
    },
    {
      id: "step-3",
      date: "May 6, 2026",
      title: "Knowledge is power: automatic transcript",
      description:
        "The extension reads the transcript in the background—credits, progress percentage, and GPA without manual input—summarized in a single strip of visual metrics.",
      icon: LineChart,
    },
  ];
}

export default function HistoriaPage() {
  const { language } = useLanguage();
  const isEs = language === "es";
  const [inputValue, setInputValue] = useState("");
  const [ack, setAck] = useState(false);

  const timelineData = isEs ? timelineEs() : timelineEn();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      console.log("Feature requested:", inputValue);
      setInputValue("");
      setAck(true);
      window.setTimeout(() => setAck(false), 3200);
    }
  };

  return (
    <main
      className="min-h-screen selection:bg-[var(--gic-action-azure)] selection:text-[var(--gic-canvas-white)]"
      style={{
        backgroundColor: "var(--gic-canvas-white)",
        color: "var(--gic-pitch-black)",
        fontFamily: "var(--gic-font-sans)",
      }}
    >
      <Link
        href="/"
        className="fixed left-4 top-4 z-40 px-3 py-2 transition-opacity hover:opacity-80 sm:left-6 sm:top-6"
        style={{
          fontFamily: "var(--gic-font-sans)",
          fontSize: "var(--gic-text-caption)",
          letterSpacing: "var(--gic-tracking-caption)",
          color: "var(--gic-slate-gray)",
        }}
      >
        {isEs ? "← Inicio" : "← Home"}
      </Link>

      {/* 1. Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center sm:px-8">
        <motion.div
          initial={{ opacity: 0, filter: "blur(12px)", scale: 0.95, y: 20 }}
          animate={{ opacity: 1, filter: "blur(0px)", scale: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <Terminal
            className="mx-auto mb-10 md:mb-12"
            size={48}
            strokeWidth={1.5}
            style={{ color: "var(--gic-slate-gray)" }}
            aria-hidden
          />
          <h1
            className="mb-8 md:mb-10 leading-tight"
            style={{
              fontFamily: "var(--gic-font-serif)",
              fontSize: "var(--gic-text-display)",
              lineHeight: "var(--gic-leading-display)",
              letterSpacing: "var(--gic-tracking-display)",
              color: "var(--gic-pitch-black)",
            }}
          >
            {isEs ? (
              <>
                El sistema heredado.
                <br />
                La nueva realidad.
              </>
            ) : (
              <>
                The legacy system.
                <br />A new reality.
              </>
            )}
          </h1>
          <p
            className="mx-auto max-w-2xl"
            style={{
              fontSize: "max(1.125rem, 1.15vw)",
              lineHeight: 1.55,
              letterSpacing: "-0.012em",
              color: "var(--gic-charcoal)",
            }}
          >
            {isEs
              ? "SIASE es un laberinto de frames y CGI de otra época. Pero debajo de ese código hay una experiencia esperando ser liberada. Esto no es solo un reskin: es una reconstrucción de la experiencia académica en la UANL."
              : "SIASE is a maze of frames and another-era CGI—but underneath, an experience waiting to be freed. This isn’t just a reskin: it’s a rebuild of the academic experience at UANL."}
          </p>
          <p
            className="mt-6"
            style={{
              fontSize: "var(--gic-text-subheading)",
              lineHeight: "var(--gic-leading-subheading)",
              letterSpacing: "var(--gic-tracking-subheading)",
              color: "var(--gic-slate-gray)",
            }}
          >
            {isEs
              ? "Sigue haciendo scroll para ver el proceso."
              : "Keep scrolling to see how it came together."}
          </p>
        </motion.div>
      </section>

      {/* 2. Timeline */}
      <div
        className="mx-auto max-w-4xl py-16 md:py-24"
        style={{
          paddingLeft: "var(--gic-spacing-24)",
          paddingRight: "var(--gic-spacing-24)",
        }}
      >
        {timelineData.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.section
              key={step.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-16 flex flex-col items-start gap-8 last:mb-0 md:mb-24 md:flex-row md:gap-10"
            >
              <div className="hidden flex-col items-center md:flex" style={{ marginTop: "var(--gic-spacing-8)" }}>
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: "var(--gic-off-white)",
                    boxShadow: "var(--gic-shadow-subtle-2)",
                  }}
                >
                  <Icon
                    size={24}
                    strokeWidth={1.5}
                    style={{ color: "var(--gic-dark-charcoal)" }}
                    aria-hidden
                  />
                </div>
                {index !== timelineData.length - 1 && (
                  <div
                    className="mt-4 w-px opacity-30"
                    style={{
                      height: "160px",
                      backgroundColor: "var(--gic-steel-gray)",
                    }}
                  />
                )}
              </div>

              <div
                className="flex-1 p-6 md:p-10"
                style={{
                  borderRadius: "var(--gic-radius-cards-large)",
                  backgroundColor: "var(--gic-canvas-white)",
                  boxShadow: "var(--gic-shadow-sm)",
                  border: "1px solid var(--gic-cool-gray)",
                }}
              >
                <div className="mb-4 flex items-center gap-3 md:hidden">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: "var(--gic-ash-gray)" }}
                  >
                    <Icon
                      size={20}
                      strokeWidth={1.5}
                      style={{ color: "var(--gic-dark-charcoal)" }}
                      aria-hidden
                    />
                  </div>
                </div>
                <span
                  className="uppercase tracking-wider"
                  style={{
                    fontFamily: "var(--gic-font-serif)",
                    fontSize: "var(--gic-text-button-label)",
                    color: "var(--gic-slate-gray)",
                  }}
                >
                  {step.date}
                </span>
                <h2
                  className="mt-2"
                  style={{
                    fontFamily: "var(--gic-font-serif)",
                    fontSize: "var(--gic-text-heading-lg)",
                    lineHeight: "var(--gic-leading-heading-lg)",
                    letterSpacing: "var(--gic-tracking-heading-lg)",
                    color: "var(--gic-cofounder-blue)",
                  }}
                >
                  {step.title}
                </h2>
                <p
                  className="mt-4 leading-relaxed"
                  style={{
                    fontSize: "var(--gic-text-subheading)",
                    lineHeight: "var(--gic-leading-subheading)",
                    letterSpacing: "var(--gic-tracking-subheading)",
                    color: "var(--gic-charcoal)",
                  }}
                >
                  {step.description}
                </p>
              </div>
            </motion.section>
          );
        })}
      </div>

      {/* 3. CTA */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "0%" }}
        transition={{ duration: 1 }}
        className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-20 text-center sm:px-8 sm:py-24"
        style={{
          backgroundColor: "var(--gic-canvas-white)",
          borderTop: "1px solid var(--gic-cool-gray)",
        }}
      >
        <h2
          className="mb-10 max-w-4xl leading-tight md:mb-12"
          style={{
            fontFamily: "var(--gic-font-serif)",
            fontSize: "var(--gic-text-display)",
            lineHeight: "var(--gic-leading-display)",
            letterSpacing: "var(--gic-tracking-display)",
            color: "var(--gic-pitch-black)",
          }}
        >
          {isEs
            ? "Este proyecto sigue en desarrollo. ¿Hay alguna feature que te gustaría ver?"
            : "This project is still in motion. Is there a feature you’d like to see?"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="relative flex w-full max-w-2xl items-center"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isEs ? "# SIASE Plus" : "# SIASE Plus"}
            aria-label={
              isEs
                ? "Sugiere una funcionalidad para SIASE Plus"
                : "Suggest a SIASE Plus feature"
            }
            className="w-full bg-transparent py-4 pl-0 pr-14 transition-colors focus:outline-none placeholder:opacity-50"
            style={{
              fontSize: "var(--gic-text-subheading)",
              lineHeight: "var(--gic-leading-subheading)",
              letterSpacing: "var(--gic-tracking-subheading)",
              color: "var(--gic-pitch-black)",
              borderBottomWidth: "2px",
              borderBottomStyle: "solid",
              borderBottomColor: "var(--gic-steel-gray)",
            }}
            onFocus={(e) => {
              e.target.style.borderBottomColor = "var(--gic-action-azure)";
            }}
            onBlur={(e) => {
              e.target.style.borderBottomColor = "var(--gic-steel-gray)";
            }}
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            aria-label={isEs ? "Enviar sugerencia" : "Send suggestion"}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 transition-colors disabled:opacity-50"
            style={{ color: "var(--gic-medium-gray)" }}
            onMouseEnter={(e) => {
              if (!inputValue.trim()) return;
              (e.currentTarget as HTMLButtonElement).style.color =
                "var(--gic-action-azure)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                "var(--gic-medium-gray)";
            }}
          >
            <Send size={24} strokeWidth={1.5} />
          </button>
        </form>
        {ack && (
          <p
            className="mt-6"
            style={{
              fontSize: "var(--gic-text-caption)",
              color: "var(--gic-cofounder-blue)",
            }}
          >
            {isEs ? "Gracias — lo anoté." : "Thanks — noted."}
          </p>
        )}
      </motion.section>
    </main>
  );
}

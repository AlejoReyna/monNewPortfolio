"use client";

import { useEffect } from "react";
import { useNavigation } from "@/contexts/navigation-context";

type Section = "home" | "about" | "services" | "projects" | "contact";

const SECTION_IDS: Section[] = ["home", "about", "services", "projects", "contact"];

/**
 * Detecta automáticamente qué sección está visible en el viewport
 * y actualiza el NavigationContext. Activa la sección cuando cruza
 * el centro del viewport (rootMargin -45% top/bottom).
 */
export function useScrollSection() {
  const { setCurrentSection } = useNavigation();

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setCurrentSection(id);
          }
        },
        {
          threshold: 0,
          // Activa cuando el borde de la sección cruza el 45% superior/inferior del viewport
          // → el elemento "activo" es el que está en la franja central del viewport
          rootMargin: "-45% 0px -45% 0px",
        }
      );

      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [setCurrentSection]);
}

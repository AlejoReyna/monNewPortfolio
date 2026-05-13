"use client";

import { useScrollSection } from "@/hooks/useScrollSection";
import HeroCarouselSequence from "@/components/v3/hero-carousel-sequence";
// import ProjectsCarousel from "@/components/v3/projects-carousel";
import ServicesSection from "@/components/sections/services-section";
import ContactSection from "@/components/sections/contact-section";

export default function Home() {
  // Detecta la sección visible y actualiza el navbar automáticamente
  useScrollSection();

  return (
    <main className="relative">
      {/* Hero → Revolut fan morph (sticky 600vh) */}
      <HeroCarouselSequence />

      {/* Full projects carousel — comentado: el fan de 3 tarjetas es el estado final */}
      {/* <div className="v3-root">
        <ProjectsCarousel />
      </div> */}

      <ServicesSection />
      <ContactSection />
    </main>
  );
}

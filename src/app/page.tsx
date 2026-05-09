"use client";

import { useScrollSection } from "@/hooks/useScrollSection";
import HeroCarouselSequence from "@/components/v3/hero-carousel-sequence";
import ServicesSection from "@/components/sections/services-section";
import ContactSection from "@/components/sections/contact-section";

export default function Home() {
  // Detecta la sección visible y actualiza el navbar automáticamente
  useScrollSection();

  return (
    <main className="relative">
      {/* Hero + Projects carousel — scroll-driven reveal */}
      <HeroCarouselSequence />
      <ServicesSection />
      <ContactSection />
    </main>
  );
}

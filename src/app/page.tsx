"use client";

import { useScrollSection } from "@/hooks/useScrollSection";
import HomeSection from "@/components/sections/home-section";
import ServicesSection from "@/components/sections/services-section";
import ProjectsSection from "@/components/sections/projects-section";
import ContactSection from "@/components/sections/contact-section";

export default function Home() {
  // Detecta la sección visible y actualiza el navbar automáticamente
  useScrollSection();

  return (
    <main className="relative">
      <HomeSection />
      <ServicesSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  );
}

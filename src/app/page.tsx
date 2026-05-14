"use client";

import { useScrollSection } from "@/hooks/useScrollSection";
import HeroV2 from "@/components/v2/hero-v2";
import AboutMeMinimal from "@/components/v2/about-me-minimal";
import IntegrationsShowcase from "@/components/v2/integrations-showcase";
import ProjectsScrollSequence from "@/components/v3/projects-scroll-sequence";
import ContactSection from "@/components/sections/contact-section";

export default function Home() {
  useScrollSection();

  return (
    <main className="relative">
      {/* Fixed background — persists across all sections */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          background: "#08080a",
          zIndex: -1,
        }}
      />

      <HeroV2 noBgImage />
      <AboutMeMinimal />
      <IntegrationsShowcase />
      <ProjectsScrollSequence />
      <ContactSection />
    </main>
  );
}

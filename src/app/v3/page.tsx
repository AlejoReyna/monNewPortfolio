"use client";

import { useEffect } from "react";
import HeroV2 from "@/components/v2/hero-v2";
import ClipReveal from "@/components/v3/clip-reveal";
import KineticWords from "@/components/v3/kinetic-words";
import ParallaxDepth from "@/components/v3/parallax-depth";
import ProjectsCarousel from "@/components/v3/projects-carousel";
import RollingCounter from "@/components/v3/rolling-counter";
import MosaicWave from "@/components/v3/mosaic-wave";
import ContactEditorial from "@/components/v3/contact-editorial";

export default function V3Page() {
  // Toggle dark editorial body color while this view is mounted
  useEffect(() => {
    const original = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#08080a";
    return () => {
      document.body.style.backgroundColor = original;
    };
  }, []);

  return (
    <main className="relative">
      {/* Hero intacto */}
      <HeroV2 />

      {/* Editorial dark scroll-driven sections */}
      <div className="v3-root">
        {/* Transición visual del hero al fondo dark */}
        <div
          aria-hidden
          style={{
            height: "120px",
            background: "linear-gradient(to bottom, var(--gic-night-sky), #08080a)",
          }}
        />

        <ClipReveal />
        <KineticWords />
        <ParallaxDepth />
        <ProjectsCarousel />
        <RollingCounter />
        <MosaicWave />
        <ContactEditorial />
      </div>
    </main>
  );
}

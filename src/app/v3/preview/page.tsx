"use client";

import { useEffect } from "react";
import ProjectsCarousel from "@/components/v3/projects-carousel";
import ContactEditorial from "@/components/v3/contact-editorial";

export default function V3Preview() {
  /* Force dark background on body while this route is mounted */
  useEffect(() => {
    const original = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#08080a";
    return () => {
      document.body.style.backgroundColor = original;
    };
  }, []);

  return (
    <main
      className="v3-root"
      style={{ minHeight: "100vh", position: "relative" }}
    >
      <ProjectsCarousel />
      <ContactEditorial />
    </main>
  );
}

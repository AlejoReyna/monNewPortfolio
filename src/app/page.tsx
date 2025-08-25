"use client";

import { useNavigation } from "@/contexts/navigation-context";
import HomeSection from "@/components/sections/home-section";
import ServicesSection from "@/components/sections/services-section";
import ProjectsSection from "@/components/sections/projects-section";
import ContactSection from "@/components/sections/contact-section";

export default function Home() {
  const { currentSection, isTransitioning } = useNavigation();

  const renderSection = () => {
    switch (currentSection) {
      case "home":
        return <HomeSection />;
      case "services":
        return <ServicesSection />;
      case "projects":
        return <ProjectsSection />;
      case "contact":
        return <ContactSection />;
      default:
        return <HomeSection />;
    }
  };

  return (
    <main className="relative">

      
      {/* Contenedor con transiciones fade */}
      <div 
        className={`transition-opacity duration-300 ease-in-out ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        {renderSection()}
      </div>
    </main>
  );
}

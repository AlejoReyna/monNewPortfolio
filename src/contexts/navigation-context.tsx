"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Section = "home" | "about" | "services" | "projects" | "contact";

interface NavigationContextType {
  currentSection: Section;
  setCurrentSection: (section: Section) => void;
  navigateToSection: (section: Section) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentSection, setCurrentSection] = useState<Section>("home");

  const navigateToSection = (section: Section) => {
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <NavigationContext.Provider value={{ currentSection, setCurrentSection, navigateToSection }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}

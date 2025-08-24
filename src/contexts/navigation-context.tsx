"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Section = "home" | "services" | "projects" | "contact";

interface NavigationContextType {
  currentSection: Section;
  isTransitioning: boolean;
  navigateToSection: (section: Section) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentSection, setCurrentSection] = useState<Section>("home");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigateToSection = (section: Section) => {
    if (section === currentSection || isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Tiempo para fade out
    setTimeout(() => {
      setCurrentSection(section);
      // Tiempo para fade in
      setTimeout(() => {
        setIsTransitioning(false);
      }, 150);
    }, 150);
  };

  return (
    <NavigationContext.Provider value={{ currentSection, isTransitioning, navigateToSection }}>
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

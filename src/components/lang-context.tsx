"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Language = "en" | "es";

type LanguageContextValue = {
  language: Language;
  toggleLanguage: () => void;
  isFading: boolean;
  toggleWithFade: () => void;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [isFading, setIsFading] = useState(false);

  // Initialize: force English to avoid post-mount flips caused by stored values
  useEffect(() => {
    setLanguage("en");
    try {
      window.localStorage.setItem("app_lang", "en");
    } catch {}
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem("app_lang", language);
    } catch {}
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === "en" ? "es" : "en"));
  }, []);

  const toggleWithFade = useCallback(() => {
    // Fade out, switch language, fade in
    setIsFading(true);
    window.setTimeout(() => {
      setLanguage((prev) => (prev === "en" ? "es" : "en"));
      window.setTimeout(() => setIsFading(false), 180);
    }, 180);
  }, []);

  const value = useMemo(
    () => ({ language, toggleLanguage, isFading, toggleWithFade }),
    [language, toggleLanguage, isFading, toggleWithFade]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

// Helper wrapper that applies an opacity transition across content during language switch
export function LanguageFade({ children }: { children: React.ReactNode }) {
  const { isFading } = useLanguage();
  return (
    <div
      className={`transition-opacity duration-300 ${isFading ? "opacity-0" : "opacity-100"}`}
      aria-busy={isFading}
    >
      {children}
    </div>
  );
}



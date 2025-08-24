"use client";

import { useLanguage } from "@/components/lang-context";
import Hero from "@/components/hero";

export default function HomeSection() {
  const { language } = useLanguage();
  const isEs = language === 'es';

  return (
    <div className="min-h-screen">
      <Hero />
    </div>
  );
}

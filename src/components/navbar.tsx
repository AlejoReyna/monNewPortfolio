"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/lang-context";
import { useNavigation } from "@/contexts/navigation-context";

export default function Navbar() {
  const { language } = useLanguage();
  const { navigateToSection, currentSection } = useNavigation();
  const isEs = language === 'es';
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* macOS-style Top Menu Bar */}
      <div className="hidden lg:fixed lg:inset-x-0 lg:top-0 lg:z-[70] lg:flex lg:h-7 lg:bg-black/60 lg:backdrop-blur-xl lg:border-b lg:border-white/10">
        <div className="flex w-full items-center justify-between px-4">
          {/* Left side - App name */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer" />
              <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors cursor-pointer" />
              <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors cursor-pointer" />
            </div>
            <span className="text-white/90 text-sm font-medium">Alexis&#39; desktop</span>
          </div>

          {/* Center - Current section indicator */}
          <div className="flex items-center">
            <span className="text-white/70 text-xs font-mono">
              {currentSection === "home" && (isEs ? "Inicio" : "Home")}
              {currentSection === "services" && (isEs ? "Servicios" : "Services")}
              {currentSection === "projects" && (isEs ? "Proyectos" : "Projects")}
              {currentSection === "contact" && (isEs ? "Contacto" : "Contact")}
            </span>
          </div>

          {/* Right side - System icons */}
          <div className="flex items-center gap-3">
            {/* WiFi icon */}
            <svg className="w-4 h-4 text-white/70 hover:text-white transition-colors cursor-pointer" fill="currentColor" viewBox="0 0 24 24">
              <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
            </svg>
            
            {/* Battery icon */}
            <svg className="w-4 h-4 text-white/70 hover:text-white transition-colors cursor-pointer" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/>
            </svg>

            {/* Time */}
            <span className="text-white/70 text-xs font-mono tabular-nums">
              {currentTime.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop macOS-style Sidebar */}
      <aside className="hidden lg:fixed lg:top-11 lg:bottom-4 lg:left-4 lg:z-[60] lg:flex lg:w-16 xl:w-18 lg:flex-col">
        <div className="flex grow flex-col gap-y-3 overflow-y-auto bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl p-3">
          {/* Brand Section */}
          <div className="flex shrink-0 items-center justify-center">
            <button 
              onClick={() => navigateToSection("home")}
              className="group relative flex items-center justify-center w-10 h-10 xl:w-11 xl:h-11 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
            >
              {/* User/Profile icon */}
              <svg className="w-5 h-5 xl:w-6 xl:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              {/* Active indicator */}
              {currentSection === "home" && (
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-full" />
              )}
            </button>
          </div>

          {/* Separator */}
          <div className="h-px bg-white/20 mx-1" />

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-2">
              {[
                { 
                  section: "home", 
                  label: isEs ? "Inicio" : "Home",
                  icon: (
                    <svg className="w-5 h-5 xl:w-6 xl:h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                    </svg>
                  ),
                  bgColor: "from-orange-500 to-red-500"
                },
                { 
                  section: "services", 
                  label: isEs ? "Servicios" : "Services",
                  icon: (
                    <svg className="w-5 h-5 xl:w-6 xl:h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ),
                  bgColor: "from-yellow-500 to-orange-500"
                },
                { 
                  section: "projects", 
                  label: isEs ? "Proyectos" : "Projects",
                  icon: (
                    <svg className="w-5 h-5 xl:w-6 xl:h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
                    </svg>
                  ),
                  bgColor: "from-purple-500 to-pink-500"
                }
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => navigateToSection(item.section as "home" | "services" | "projects" | "contact")}
                    className={`group relative flex items-center justify-center w-10 h-10 xl:w-11 xl:h-11 rounded-xl shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-xl ${
                      currentSection === item.section
                        ? `bg-gradient-to-br ${item.bgColor} text-white`
                        : `bg-white/20 text-white/80 hover:bg-white/30 hover:text-white`
                    }`}
                  >
                    {item.icon}
                    {/* Active indicator */}
                    {currentSection === item.section && (
                      <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-full" />
                    )}
                    {/* Tooltip */}
                    <div className="absolute left-full ml-3 px-2 py-1 bg-black/80 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  </button>
                </li>
              ))}
            </ul>

            {/* Separator */}
            <div className="h-px bg-white/20 mx-1 my-2" />

            {/* Contact CTA */}
            <div className="pb-2">
              <button
                onClick={() => navigateToSection("contact")}
                className={`group relative flex items-center justify-center w-10 h-10 xl:w-11 xl:h-11 rounded-xl shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-xl ${
                  currentSection === "contact"
                    ? "bg-gradient-to-br from-green-500 to-teal-500 text-white"
                    : "bg-white/20 text-white/80 hover:bg-white/30 hover:text-white"
                }`}
              >
                {/* Message/Chat icon */}
                <svg className="w-5 h-5 xl:w-6 xl:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                </svg>
                {/* Active indicator */}
                {currentSection === "contact" && (
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-full" />
                )}
                {/* Tooltip */}
                <div className="absolute left-full ml-3 px-2 py-1 bg-black/80 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {isEs ? 'Contacto' : "Contact"}
                </div>
              </button>
            </div>
          </nav>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed inset-x-0 top-0 z-[60]">
        <div className="w-full transition-colors duration-300">
        <div
          className={
            `relative w-full flex items-center justify-between border-b ` +
            `px-4 sm:px-5 h-16 sm:h-20 ` +
            `transition-all duration-300 ` +
            (isScrolled
              ? `bg-black/70 border-white/15`
              : `bg-black/50 border-white/10`)
          }
        >
          {/* Left: Brand */}
          <div className="relative z-10 flex min-w-0 items-center gap-2 h-full">
            <button 
              onClick={() => navigateToSection("home")}
              className="group inline-flex items-center gap-2 h-full"
            >
              <div className="flex flex-col items-start">
                <div className="text-lg tracking-tight text-left">
                  <span className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent group-hover:from-white group-hover:via-white group-hover:to-gray-100 transition-all duration-200 font-mono font-light">
                    Alexis&#39; desktop
                  </span>
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-tight font-mono font-light text-left">
                  Full-Stack Developer
                </div>
              </div>
            </button>
          </div>

            {/* Right: Mobile toggle */}
          <div className="relative z-10 flex items-center gap-2 h-full">
            <button
              aria-label="Toggle menu"
              onClick={() => setIsOpen((v) => !v)}
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-black/30 p-2 text-gray-200 shadow-sm hover:bg-black/40"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
            >
              <svg
                className={`h-5 w-5 transition-transform ${isOpen ? "rotate-90" : "rotate-0"}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile panel */}
        <div
          className={
              `overflow-hidden transition-[max-height,opacity] duration-300 ` +
            (isOpen ? `max-h-64 opacity-100` : `max-h-0 opacity-0`)
          }
        >
          <div className="mx-2 mt-2 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-2">
            {[
              { section: "home", label: isEs ? "Inicio" : "Home" },
              { section: "services", label: isEs ? "Servicios" : "Services" },
              { section: "projects", label: isEs ? "Proyectos" : "Projects" },
              { section: "contact", label: isEs ? "Contacto" : "Contact" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  navigateToSection(item.section as "home" | "services" | "projects" | "contact");
                  setIsOpen(false);
                }}
                className={`block w-full text-left rounded-xl px-3 py-2 text-sm transition-colors font-mono font-extralight ${
                  currentSection === item.section
                    ? "text-white bg-white/10"
                    : "text-gray-200 hover:bg-white/5"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Separator line */}
      <div className="pointer-events-none absolute inset-x-0 top-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    </header>
    </>
  );
}
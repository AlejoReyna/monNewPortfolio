"use client";

import { useNavigation } from "@/contexts/navigation-context";
import { useLanguage } from "@/components/lang-context";
import Image from "next/image";

export default function MobileDock() {
  const { navigateToSection, currentSection } = useNavigation();
  const { language } = useLanguage();
  const isEs = language === 'es';

  const navigationItems = [
    { 
      section: "home" as const, 
      label: isEs ? "Inicio" : "Home",
      icon: "terminal",
      bgColor: "from-orange-500 to-red-500"
    },
    { 
      section: "services" as const, 
      label: isEs ? "Servicios" : "Services",
      icon: "star",
      bgColor: "from-yellow-500 to-orange-500"
    },
    { 
      section: "projects" as const, 
      label: isEs ? "Proyectos" : "Projects",
      icon: "briefcase",
      bgColor: "from-purple-500 to-pink-500"
    },
    { 
      section: "contact" as const, 
      label: isEs ? "Contacto" : "Contact",
      icon: "message",
      bgColor: "from-green-500 to-teal-500"
    },
  ];

  const socialItems = [
    { 
      label: "GitHub",
      href: "https://github.com/AlejoReyna/monNewPortfolio",
      icon: "github"
    },
    { 
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/alexis-alberto-reyna-sánchez-6953102b4",
      icon: "linkedin"
    },
    { 
      label: "SoundCloud",
      href: "https://soundcloud.com/",
      icon: "soundcloud"
    },
  ];

  return (
    <div
      className="lg:hidden fixed z-[60] left-1/2 -translate-x-1/2
                 bottom-4 w-[95vw] max-w-md"
    >
      <nav
        className="flex items-center justify-center gap-2 px-3 py-2.5
                   rounded-2xl backdrop-blur-2xl bg-white/10 
                   border border-white/20 shadow-2xl"
        aria-label="Mobile navigation"
      >
        {/* GitHub */}
        <a
          href={socialItems[0].href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={socialItems[0].label}
          className="group relative shrink-0"
        >
          <div
            className="grid place-items-center h-10 w-10 rounded-xl
                       bg-black shadow-lg transition-all duration-200
                       active:scale-95 hover:shadow-xl"
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.484 2 12.01c0 4.424 2.865 8.18 6.839 9.504.5.092.682-.218.682-.486 0-.24-.009-.876-.014-1.72-2.782.605-3.369-1.343-3.369-1.343-.454-1.157-1.11-1.467-1.11-1.467-.908-.622.069-.609.069-.609 1.003.071 1.53 1.032 1.53 1.032.892 1.542 2.341 1.096 2.91.838.091-.654.35-1.096.636-1.349-2.22-.254-4.555-1.114-4.555-4.957 0-1.095.39-1.991 1.029-2.693-.103-.253-.446-1.274.098-2.656 0 0 .84-.27 2.75 1.028A9.564 9.564 0 0112 6.844c.851.004 1.707.115 2.507.337 1.909-1.298 2.748-1.028 2.748-1.028.546 1.382.203 2.403.1 2.656.64.702 1.028 1.598 1.028 2.693 0 3.854-2.339 4.701-4.566 4.951.359.31.679.924.679 1.862 0 1.344-.012 2.428-.012 2.758 0 .27.18.582.688.483A10.02 10.02 0 0022 12.01C22 6.484 17.523 2 12 2z"/>
            </svg>
          </div>
        </a>

        {/* Separator */}
        <div className="h-8 w-px bg-white/20" />

        {/* Navigation items */}
        {navigationItems.map((item) => (
          <button
            key={item.section}
            onClick={() => navigateToSection(item.section)}
            aria-label={item.label}
            className="group relative shrink-0"
          >
            <div
              className={`grid place-items-center h-10 w-10 rounded-xl
                         shadow-lg transition-all duration-200
                         active:scale-95 overflow-hidden ${
                           item.section === "home"
                             ? "bg-transparent"
                             : currentSection === item.section
                               ? `bg-gradient-to-br ${item.bgColor}`
                               : "bg-white/20 hover:bg-white/30"
                         }`}
            >
              {item.icon === "terminal" && (
                <>
                  <span className="absolute inset-0 rounded-xl bg-white" />
                  <Image
                    src="/terminal_icon.png"
                    alt="Terminal"
                    fill
                    className="relative z-10 object-contain p-0"
                    sizes="2.5rem"
                  />
                </>
              )}
              {item.icon === "star" && (
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              )}
              {item.icon === "briefcase" && (
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
                </svg>
              )}
              {item.icon === "message" && (
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                </svg>
              )}
              {/* Active indicator */}
              {currentSection === item.section && (
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-1 bg-white rounded-full" />
              )}
            </div>
          </button>
        ))}

        {/* Separator */}
        <div className="h-8 w-px bg-white/20" />

        {/* Social items */}
        <a
          href={socialItems[1].href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={socialItems[1].label}
          className="group relative shrink-0"
        >
          <div
            className="grid place-items-center h-10 w-10 rounded-xl
                       bg-white/20 hover:bg-white/30 shadow-lg 
                       transition-all duration-200 active:scale-95"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path fill="#0A66C2" d="M4.983 3.5a2.5 2.5 0 11-.002 5.002A2.5 2.5 0 014.983 3.5zM3.5 9h2.967v11H3.5V9zm6.318 0H12.7v1.507h.046c.446-.846 1.538-1.739 3.167-1.739 3.388 0 4.013 2.234 4.013 5.142V20H16.96v-5.12c0-1.22-.022-2.79-1.7-2.79-1.703 0-1.963 1.33-1.963 2.702V20H9.818V9z"/>
            </svg>
          </div>
        </a>

        <a
          href={socialItems[2].href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={socialItems[2].label}
          className="group relative shrink-0"
        >
          <div
            className="grid place-items-center h-10 w-10 rounded-xl
                       bg-white/20 hover:bg-white/30 shadow-lg 
                       transition-all duration-200 active:scale-95"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <g fill="#FF5500">
                <rect x="2.2" y="13" width="1.2" height="5" rx="0.6" />
                <rect x="4.2" y="11.5" width="1.2" height="6.5" rx="0.6" />
                <rect x="6.2" y="10" width="1.2" height="8" rx="0.6" />
                <rect x="8.2" y="9" width="1.2" height="9" rx="0.6" />
                <rect x="10.2" y="8.2" width="1.2" height="9.8" rx="0.6" />
              </g>
              <path fill="#FF5500" d="M13.5 8.5a4.5 4.5 0 00-4.5 4.5v.05A2.95 2.95 0 007.5 13c-1.66 0-3 1.34-3 3s1.34 3 3 3H18a3.5 3.5 0 000-7 3.6 3.6 0 00-1 .14A4.5 4.5 0 0013.5 8.5z" />
            </svg>
          </div>
        </a>
      </nav>
    </div>
  );
}



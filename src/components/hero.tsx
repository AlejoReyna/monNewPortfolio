"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from "@/components/lang-context";

type HeroProps = {
  title?: string;
  subtitle?: string;
  className?: string;
};

// Helper function to convert Tailwind gradient classes to CSS colors
const getGradientColors = (gradient: string): string => {
  const gradientMap: { [key: string]: string } = {
    'from-blue-500 to-cyan-400': '#3b82f6, #22d3ee',
    'from-purple-500 to-indigo-400': '#a855f7, #818cf8',
    'from-blue-600 to-blue-400': '#2563eb, #60a5fa',
    'from-yellow-500 to-orange-400': '#eab308, #fb923c',
    'from-orange-500 to-red-400': '#f97316, #f87171',
    'from-green-500 to-emerald-400': '#22c55e, #34d399',
    'from-red-500 to-pink-400': '#ef4444, #f472b6'
  };
  return gradientMap[gradient] || '#6b7280, #9ca3af';
};

// Arrays de saludos para primera visita y visitas recurrentes
const firstTimeGreetings = [
  { en: "Howdy visitor", es: "Hola visitante" },
  { en: "Well hello there", es: "Vaya, hola" },
  { en: "Welcome, stranger", es: "Bienvenido, forastero" },
  { en: "Greetings, traveler", es: "Saludos, viajero" },
  { en: "Hey there, friend", es: "Ey amigo" },
  { en: "Good to see you", es: "Qué bueno verte" },
  { en: "Look who's here", es: "Mira quién llegó" },
  { en: "Welcome aboard", es: "Bienvenido a bordo" },
  { en: "Hello, wanderer", es: "Hola, caminante" },
  { en: "Nice to meet you", es: "Un gusto conocerte" }
];

const returningGreetings = [
  { en: "Back again, huh?", es: "¿De vuelta otra vez?" },
  { en: "Missed me already?", es: "¿Ya me extrañabas?" },
  { en: "Welcome back, friend", es: "Bienvenido de vuelta" },
  { en: "Déjà vu, isn't it?", es: "Déjà vu, ¿no?" },
  { en: "We meet again", es: "Nos volvemos a ver" },
  { en: "Couldn't stay away?", es: "¿No pudiste alejarte?" },
  { en: "Back for more?", es: "¿Vienes por más?" },
  { en: "Oh, you again!", es: "¡Oh, tú otra vez!" },
  { en: "Long time no see", es: "Cuánto tiempo sin verte" },
  { en: "The legend returns", es: "La leyenda regresa" },
  { en: "Twice in one day?", es: "¿Dos veces en un día?" },
  { en: "Reload addiction?", es: "¿Adicción al F5?" },
  { en: "Testing my patience?", es: "¿Probando mi paciencia?" },
  { en: "Still here? Nice!", es: "¿Sigues aquí? ¡Genial!" },
  { en: "My favorite visitor", es: "Mi visitante favorito" },
  { en: "You're persistent", es: "Eres persistente" },
  { en: "Round two, fight!", es: "¡Round dos, pelea!" },
  { en: "Ah, a familiar face", es: "Ah, una cara conocida" },
  { en: "The prodigal returns", es: "El pródigo regresa" },
  { en: "Fancy seeing you here", es: "Qué casualidad verte aquí" }
];

export default function Hero({
  title = "Alexis",
  subtitle = "Full-stack developer creating intuitive user experiences and powerful backend architectures for modern businesses.",
  className,
}: HeroProps) {
  const { language, toggleWithFade } = useLanguage();
  const isEs = language === 'es';
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const [typedIndex, setTypedIndex] = useState(0);
  const [subtitleTypedIndex, setSubtitleTypedIndex] = useState(0);
  const [showMobileContainer, setShowMobileContainer] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [userName, setUserName] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);

  // Función para obtener un saludo aleatorio
  const getRandomGreeting = () => {
    const hasVisitedBefore = typeof window !== 'undefined' && localStorage.getItem('hasVisitedBefore');
    const useReturning = hasVisitedBefore && Math.random() < 0.7;
    const greetingsArray = useReturning ? returningGreetings : firstTimeGreetings;
    const randomIndex = Math.floor(Math.random() * greetingsArray.length);
    const selectedGreeting = greetingsArray[randomIndex];
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasVisitedBefore', 'true');
    }
    
    return isEs ? selectedGreeting.es : selectedGreeting.en;
  };

  // Cargar el nombre del usuario y establecer el saludo cuando el componente se monta
  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      setUserName(savedName);
    }
    setGreeting(getRandomGreeting());
  }, []);

  // Mostrar el input después de que termine de escribir el saludo
  useEffect(() => {
    if (!userName && typedIndex >= greeting.length && !showNameInput) {
      setTimeout(() => setShowNameInput(true), 300);
    }
  }, [typedIndex, greeting.length, userName, showNameInput]);

  // Manejar el guardado del nombre
  const handleSaveName = () => {
    if (inputValue.trim()) {
      const name = inputValue.trim();
      setUserName(name);
      localStorage.setItem('userName', name);
      setShowNameInput(false);
      // Continuar el typewriter para el nombre
      setTypedIndex(greeting.length);
    }
  };

  // Manejar el enter y escape en el input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      setShowNameInput(false);
      setInputValue('');
    }
  };

  // Typewriter setup
  const prefixText = greeting || "Howdy visitor";
  const nameText = userName ? `, ${userName}` : "";
  const fullLength = prefixText.length + nameText.length;
  const finalTitle = `${prefixText}${nameText}`;
  const subtitleText = isEs
    ? "Desarrollador full‑stack creando experiencias intuitivas y arquitecturas backend potentes para negocios modernos."
    : subtitle;
  const isSubtitleDone = (userName || showNameInput) && typedIndex >= fullLength && subtitleTypedIndex >= subtitleText.length;

  // Reset typewriter and update greeting when language changes
  useEffect(() => {
    setTypedIndex(0);
    setSubtitleTypedIndex(0);
    const hasVisitedBefore = typeof window !== 'undefined' && localStorage.getItem('hasVisitedBefore');
    const useReturning = hasVisitedBefore && Math.random() < 0.7;
    const greetingsArray = useReturning ? returningGreetings : firstTimeGreetings;
    const randomIndex = Math.floor(Math.random() * greetingsArray.length);
    const selectedGreeting = greetingsArray[randomIndex];
    setGreeting(isEs ? selectedGreeting.es : selectedGreeting.en);
  }, [language, isEs]);

  // Show mobile container after 0.8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMobileContainer(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (spotlightRef.current) {
        spotlightRef.current.style.setProperty('--x', `${e.clientX}px`);
        spotlightRef.current.style.setProperty('--y', `${e.clientY}px`);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Increment typewriter index
  useEffect(() => {
    // Si estamos mostrando el input, detener el typewriter en el saludo
    if (showNameInput && typedIndex >= prefixText.length) return;
    // Si ya escribimos todo, detener
    if (typedIndex >= fullLength) return;
    
    const timeout = setTimeout(() => setTypedIndex((v) => v + 1), 70);
    return () => clearTimeout(timeout);
  }, [typedIndex, fullLength, showNameInput, prefixText.length]);

  // Start subtitle typewriter after title completes or input is shown
  useEffect(() => {
    // No empezar si estamos esperando input
    if (!userName && showNameInput) return;
    // No empezar si no hemos terminado el título
    if (userName && typedIndex < fullLength) return;
    if (!userName && typedIndex < prefixText.length) return;
    // No continuar si ya terminamos
    if (subtitleTypedIndex >= subtitleText.length) return;
    
    const timeout = setTimeout(() => setSubtitleTypedIndex((v) => v + 1), 30);
    return () => clearTimeout(timeout);
  }, [typedIndex, fullLength, subtitleTypedIndex, subtitleText, showNameInput, userName, prefixText.length]);

  // Technologies carousel data
  type Technology = {
    name: string;
    gradient: string;
  } & ({ iconUrl: string } | { icon: string });

  const technologies: Technology[] = [
    {
      name: 'TypeScript',
      gradient: 'from-blue-600 to-blue-400',
      iconUrl: 'https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/typescript.png',
    },
    {
      name: 'Ruby',
      gradient: 'from-red-500 to-pink-400',
      iconUrl: 'https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/ruby.png',
    },
    {
      name: 'AWS',
      gradient: 'from-orange-500 to-red-400',
      iconUrl: 'https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/aws.png',
    },
    {
      name: 'Crypto',
      gradient: 'from-yellow-500 to-orange-400',
      icon: '₿',
    },
  ];

  return (
    <section className={`relative min-h-screen overflow-hidden mb-0 ${className}`}>
      {/* Mobile GIF Background - Full Screen */}
      <div className="md:hidden absolute inset-0 z-0">
        <Image 
          src="/16.gif"
          alt="Alexis background"
          fill
          className="object-contain bg-transparent"
          unoptimized
          priority
        />
      </div>

      {/* Main Content */}
      <div className="relative z-20 mx-auto grid max-w-6xl items-end md:items-center gap-8 md:gap-12 px-6 sm:px-8 py-20 md:py-28 min-h-screen md:grid-cols-2 mb-0 pb-8 md:pb-0">
        
        {/* Left Side - Text Content */}
        <div className="space-y-6 relative z-20 mt-auto md:-mt-6 lg:-mt-10 sm:z-30">
          
          {/* Content Wrapper with Dark Overlay for Mobile */}
          <div className={`relative z-40 sm:z-50 md:bg-transparent md:border-none md:p-0 bg-black/70 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl transition-all duration-800 ease-out md:opacity-100 md:translate-y-0 ${
            showMobileContainer ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>

          {/* Main Title with Inline Input */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight text-center md:text-left hero-title font-mono tracking-tight drop-shadow-2xl relative" 
              style={{ textShadow: '2px 2px 10px rgba(0, 0, 0, 0.9)' }}>
            <span className="inline-block w-full">
              {/* Typed greeting text */}
              <span className="inline">
                {prefixText.slice(0, Math.min(typedIndex, prefixText.length))}
              </span>
              
              {/* Comma and space before name/input */}
              {typedIndex >= prefixText.length && (
                <span className="inline">, </span>
              )}
              
              {/* Name input inline - appears after greeting is typed */}
              {showNameInput && !userName && typedIndex >= prefixText.length && (
                <span className="inline-block relative">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isEs ? "tu nombre" : "your name"}
                    className="bg-transparent border-b-4 border-cyan-400 text-cyan-400 placeholder-cyan-400/50 outline-none font-mono font-bold min-w-[200px] max-w-[400px] pb-1 animate-pulse-border text-4xl md:text-5xl lg:text-6xl"
                    style={{ 
                      width: inputValue ? `${Math.max(200, inputValue.length * 35)}px` : '250px',
                      textShadow: '0 0 20px rgba(100, 255, 218, 0.5)'
                    }}
                    autoFocus
                  />
                  <span className="absolute -bottom-10 left-0 text-xs text-white/60 whitespace-nowrap">
                    🔒 {isEs ? "Solo en tu navegador" : "Browser only"}
                  </span>
                </span>
              )}
              
              {/* Typed name if already saved */}
              {userName && (
                <span
                  className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent font-extrabold inline"
                  style={{ textShadow: '0 0 20px rgba(100, 255, 218, 0.5)' }}
                >
                  {typedIndex > prefixText.length
                    ? nameText.slice(0, Math.min(typedIndex - prefixText.length, nameText.length))
                    : ''}
                </span>
              )}
              
              {/* Caret */}
              {!showNameInput && typedIndex < fullLength && (
                <span className="ml-[1px] inline-block w-[2px] h-[1em] align-[-0.1em] bg-white/80 animate-pulse" />
              )}
            </span>
          </h1>

          {/* Description */}
          <div className="text-base sm:text-lg lg:text-xl text-gray-100 md:text-gray-300 mb-8 font-light md:font-extralight font-mono relative text-center md:text-left max-w-xl md:max-w-none mx-auto md:mx-0 hero-subtitle" style={{ textShadow: '1px 1px 6px rgba(0, 0, 0, 0.9)' }}>
            {/* Placeholder to reserve final height */}
            <p className="opacity-0 select-none text-gray-400">{subtitleText}</p>
            {/* Overlay typed content */}
            <div className="absolute inset-0">
              <span className="text-gray-100 md:text-sky-200">
                {subtitleText.slice(0, subtitleTypedIndex)}
              </span>
              {((userName && typedIndex >= fullLength) || (showNameInput)) && subtitleTypedIndex < subtitleText.length && (
                <span className="ml-[1px] inline-block w-[2px] h-[1em] align-[-0.1em] bg-sky-200/80 animate-pulse" />
              )}
            </div>
          </div>

          {/* CTA Buttons - Matching Let's Talk Style */}
          <div className={`mb-8 transition-all duration-700 ${isSubtitleDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
            <div className="flex flex-row justify-center md:justify-start items-center gap-3 w-full">
              <a 
                href="#projects"
                className="lets-talk-btn lets-talk-btn-primary flex-1"
              >
                <span>{isEs ? 'VER MI TRABAJO' : 'VIEW MY WORK'}</span>
              </a>
              
              <a 
                href="#contact"
                className="lets-talk-btn lets-talk-btn-glass flex-1"
              >
                <span>{isEs ? 'CONTÁCTAME' : 'CONTACT ME'}</span>
              </a>
            </div>
          </div>

          {/* Technologies Carousel - Hidden by default */}
          <div className="hidden mt-2 block transition-all duration-700">
            <div
              className="relative overflow-x-auto md:overflow-hidden rounded-full border border-gray-700/40 bg-gray-800/20 -mx-6 px-6 md:mx-0 md:px-0"
              style={{ 
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)', 
                maskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)' 
              }}
            >
              <div className={`flex items-center gap-3 whitespace-nowrap will-change-transform md:${isSubtitleDone ? 'animate-[marquee_30s_linear_infinite]' : ''}`}>
                {technologies.map((tech) => (
                  <span
                    key={`${tech.name}-a`}
                    className="inline-flex items-center gap-1.5 px-4 py-1 text-xs font-medium text-gray-300 rounded-full mr-2 backdrop-blur-sm hover:scale-110 transition-transform duration-300 cursor-pointer"
                    style={{
                      background: `linear-gradient(rgb(31 41 55 / 0.5), rgb(31 41 55 / 0.5)) padding-box, linear-gradient(to right, ${getGradientColors(tech.gradient)}) border-box`,
                      border: '1px solid transparent',
                    }}
                  >
                    {'iconUrl' in tech ? (
                      <Image
                        src={tech.iconUrl}
                        alt={`${tech.name} icon`}
                        width={16}
                        height={16}
                        className="h-4 w-4 object-contain"
                      />
                    ) : (
                      <span className="text-sm">{tech.icon}</span>
                    )}
                    {tech.name}
                  </span>
                ))}
                
                {technologies.map((tech) => (
                  <span
                    key={`${tech.name}-b`}
                    className="inline-flex items-center gap-1.5 px-4 py-1 text-xs font-medium text-gray-300 rounded-full mr-2 backdrop-blur-sm hover:scale-110 transition-transform duration-300 cursor-pointer"
                    style={{
                      background: `linear-gradient(rgb(31 41 55 / 0.5), rgb(31 41 55 / 0.5)) padding-box, linear-gradient(to right, ${getGradientColors(tech.gradient)}) border-box`,
                      border: '1px solid transparent',
                    }}
                    aria-hidden="true"
                  >
                    {'iconUrl' in tech ? (
                      <Image
                        src={tech.iconUrl}
                        alt={`${tech.name} icon`}
                        width={16}
                        height={16}
                        className="h-4 w-4 object-contain"
                      />
                    ) : (
                      <span className="text-sm">{tech.icon}</span>
                    )}
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          </div> {/* End Content Wrapper */}
        </div>

        {/* Right Side - Character (Desktop Only) */}
        <div className="hidden md:block relative w-full max-w-[811px] sm:max-w-[905px] md:max-w-[998px] lg:max-w-[1123px] aspect-[768/1211] mt-32">
          <div className="relative transform h-full w-full">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl blur-3xl opacity-20 scale-110"></div>
            
            {/* Character Image */}
            <Image 
              src="/16.gif" 
              alt="Avatar animado" 
              fill 
              unoptimized 
              priority 
              className="z-10 rounded-xl object-contain bg-transparent brightness-110 contrast-105 saturate-110" 
              style={{ transform: 'scale(1.3)' }}
            />
          </div>
        </div>
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        @keyframes pulse-border {
          0%, 100% { 
            border-color: rgb(34 211 238);
            box-shadow: 0 4px 20px rgba(34, 211, 238, 0.4);
          }
          50% { 
            border-color: rgb(167 139 250);
            box-shadow: 0 4px 20px rgba(167, 139, 250, 0.4);
          }
        }
        
        .animate-pulse-border {
          animation: pulse-border 2s ease-in-out infinite;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleX {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        .lets-talk-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border-radius: 9999px;
          padding: 0.875rem 1.75rem;
          text-sm: 0.875rem;
          font-family: 'Geist Mono', monospace;
          font-weight: 700;
          letter-spacing: 0.025em;
          color: white;
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
          white-space: nowrap;
          box-sizing: border-box;
          min-height: 52px;
          max-height: 52px;
          height: 52px;
        }
        
        .lets-talk-btn-primary {
          background: linear-gradient(to right, rgb(30 41 59 / 0.8), rgb(30 58 138 / 0.6), rgb(91 33 182 / 0.7));
          box-shadow: inset 0 1px 0 rgb(34 211 238 / 0.1);
          border: 1px solid transparent;
        }
        
        .lets-talk-btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(from 0deg, #60a5fa, #22d3ee, #a78bfa, #60a5fa);
          -webkit-mask: 
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
        
        .lets-talk-btn-primary:hover {
          background: linear-gradient(to right, rgb(15 23 42 / 0.9), rgb(30 64 175 / 0.7), rgb(109 40 217 / 0.8));
          box-shadow: inset 0 1px 0 rgb(34 211 238 / 0.2);
          transform: scale(1.02);
        }
        
        .lets-talk-btn-glass {
          background: linear-gradient(to right, rgba(30, 41, 59, 0.3), rgba(30, 58, 138, 0.2), rgba(91, 33, 182, 0.3));
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          box-shadow: 
            inset 0 1px 0 rgba(34, 211, 238, 0.1),
            0 4px 20px rgba(0, 0, 0, 0.3);
        }
        
        .lets-talk-btn-glass::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(from 0deg, rgba(96, 165, 250, 0.6), rgba(34, 211, 238, 0.6), rgba(167, 139, 250, 0.6), rgba(96, 165, 250, 0.6));
          -webkit-mask: 
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
        
        .lets-talk-btn-glass:hover {
          background: linear-gradient(to right, rgba(15, 23, 42, 0.4), rgba(30, 64, 175, 0.3), rgba(109, 40, 217, 0.4));
          box-shadow: 
            inset 0 1px 0 rgba(34, 211, 238, 0.2),
            0 8px 30px rgba(0, 0, 0, 0.4);
          transform: scale(1.02);
          border-color: rgba(255, 255, 255, 0.2);
        }
        
        .lets-talk-btn span {
          position: relative;
          z-index: 10;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .lets-talk-btn:active {
          transform: scale(0.98);
          transition: all 0.1s ease;
        }
        
        .lets-talk-btn:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.3);
        }
        
        @media (min-width: 768px) {
          .lets-talk-btn {
            padding: 0.875rem 1.75rem;
            font-size: 0.875rem;
            min-height: 50px;
            max-height: 50px;
            height: 50px;
          }
        }
        
        @media (min-width: 1024px) {
          .lets-talk-btn {
            padding: 1rem 2rem;
            font-size: 1rem;
            min-height: 54px;
            max-height: 54px;
            height: 54px;
          }
        }
        
        @media (max-width: 767px) {
          .lets-talk-btn {
            padding: 1rem 2rem;
            font-size: 0.95rem;
            font-weight: 800;
            letter-spacing: 0.05em;
          }
          
          .lets-talk-btn:hover {
            transform: scale(1.01);
          }
        }
        
        @media (max-width: 640px) {
          .lets-talk-btn {
            padding: 0.95rem 1.8rem;
            font-size: 0.9rem;
            min-height: 48px;
            max-height: 48px;
            height: 48px;
          }
        }
      `}</style>
    </section>
  );
}

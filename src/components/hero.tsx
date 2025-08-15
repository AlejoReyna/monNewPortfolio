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

  // Typewriter setup
  const prefixText = isEs ? "Hola, soy " : "Hey, I'm ";
  const nameText = title;
  const fullLength = prefixText.length + nameText.length;
  const finalTitle = `${prefixText}${nameText}`;
  const subtitleText = isEs
    ? "Desarrollador full‑stack creando experiencias intuitivas y arquitecturas backend potentes para negocios modernos."
    : subtitle;
  const isSubtitleDone = typedIndex >= fullLength && subtitleTypedIndex >= subtitleText.length;

  // Reset typewriter when language changes
  useEffect(() => {
    setTypedIndex(0);
    setSubtitleTypedIndex(0);
  }, [language]);

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

  // Increment typewriter index until full text is rendered
  useEffect(() => {
    if (typedIndex >= fullLength) return;
    const timeout = setTimeout(() => setTypedIndex((v) => v + 1), 70);
    return () => clearTimeout(timeout);
  }, [typedIndex, fullLength]);

  // Start subtitle typewriter after title completes
  useEffect(() => {
    if (typedIndex < fullLength) return;
    if (subtitleTypedIndex >= subtitleText.length) return;
    const timeout = setTimeout(() => setSubtitleTypedIndex((v) => v + 1), 30);
    return () => clearTimeout(timeout);
  }, [typedIndex, fullLength, subtitleTypedIndex, subtitleText]);

  // ===== TIPO Y DATOS DEL CAROUSEL =====
  // Tipo que define la estructura de cada tecnología en el carousel
  // Puede tener iconUrl (imagen) O icon (emoji/símbolo)
  type Technology = {
    name: string;
    gradient: string;
  } & ({ iconUrl: string } | { icon: string });

  // Array de tecnologías que se muestran en el carousel
  // Cada tecnología tiene: nombre, gradiente de color, y icono (URL o emoji)
  const technologies: Technology[] = [
    {
      name: 'TypeScript',
      gradient: 'from-blue-600 to-blue-400', // Gradiente azul para TypeScript
      iconUrl:
        'https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/typescript.png',
    },
    {
      name: 'Ruby',
      gradient: 'from-red-500 to-pink-400', // Gradiente rojo-rosa para Ruby
      iconUrl:
        'https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/ruby.png',
    },
    {
      name: 'AWS',
      gradient: 'from-orange-500 to-red-400', // Gradiente naranja-rojo para AWS
      iconUrl:
        'https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/aws.png',
    },
    {
      name: 'Crypto',
      gradient: 'from-yellow-500 to-orange-400', // Gradiente amarillo-naranja para Crypto
      icon: '₿', // Emoji de Bitcoin en lugar de imagen
    },
  ];

  return (
    <section className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* Side language tab */}
      <a
        href="#toggle-lang"
        onClick={(e) => { e.preventDefault(); toggleWithFade(); }}
        aria-label={isEs ? "Click for English" : "Click aquí para ver en español"}
        className="absolute left-0 top-24 z-40 translate-x-0 bg-gray-800/70 text-gray-200 text-[11px] sm:text-xs font-medium px-3 py-1.5 rounded-r-full border border-gray-700/60 backdrop-blur-sm shadow-md shadow-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
      >
        {isEs ? 'Click for English' : 'Click aquí para ver en español'}
      </a>
      {/* Black background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-8 md:gap-12 px-6 sm:px-8 py-20 md:py-28 min-h-screen md:grid-cols-2">
        
        {/* Mobile Background Character removed */}

        {/* Left Side - Text Content */}
        <div className="space-y-6 relative z-20 md:-mt-6 lg:-mt-10">
          
          {/* Content Wrapper */}
          <div className="relative z-30">

          {/* Main Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight text-center md:text-left hero-title font-mono tracking-tight" aria-label={`Hey, I'm ${title}`}>
            <span className="relative block">
              {/* Placeholder to reserve final height */}
              <span className="opacity-0 select-none">{finalTitle}</span>
              {/* Overlay typed content */}
              <span className="absolute inset-0">
                <span>
                  {prefixText.slice(0, Math.min(typedIndex, prefixText.length))}
                </span>
                <span
                  className={
                    typedIndex >= fullLength
                      ? "bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent"
                      : "text-white"
                  }
                >
                  {typedIndex > prefixText.length
                    ? nameText.slice(0, Math.min(typedIndex - prefixText.length, nameText.length))
                    : ''}
                </span>
                {/* Caret */}
                {typedIndex < fullLength && (
                  <span className="ml-[1px] inline-block w-[2px] h-[1em] align-[-0.1em] bg-white/80 animate-pulse" />
                )}
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full transform scale-x-0 animate-[scaleX_1s_ease-out_1s_forwards]"></div>
              </span>
            </span>
          </h1>

          {/* Mobile circular avatar */}
          <div className="md:hidden flex justify-center mb-8">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur animate-pulse"></div>
              <Image 
                src="/avatar.jpg"
                alt="Alexis"
                width={128}
                height={128}
                className="relative rounded-full border-4 border-black/50"
              />
            </div>
          </div>

          {/* Description */}
          <div className="text-lg lg:text-xl text-gray-300 mb-8 font-extralight font-mono relative text-center md:text-left max-w-xl md:max-w-none mx-auto md:mx-0 hero-subtitle">
            {/* Placeholder to reserve final height */}
            <p className="opacity-0 select-none text-gray-400">{subtitleText}</p>
            {/* Overlay typed content */}
            <div className="absolute inset-0">
              <span className="text-sky-200">
                {subtitleText.slice(0, subtitleTypedIndex)}
              </span>
              {typedIndex >= fullLength && subtitleTypedIndex < subtitleText.length && (
                <span className="ml-[1px] inline-block w-[2px] h-[1em] align-[-0.1em] bg-sky-200/80 animate-pulse" />
              )}
            </div>
          </div>

          {/* CTA Buttons - Cyberpunk Style */}
          <div className={`mb-8 transition-all duration-700 ${isSubtitleDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start items-center gap-4 w-full">
              <a 
                href="#projects"
                className="cyberpunk-btn cyberpunk-btn-primary w-full sm:w-auto"
              >
                <span>{isEs ? 'VER MI TRABAJO' : 'VIEW MY WORK'}</span>
              </a>
              
              <a 
                href="#contact"
                className="cyberpunk-btn cyberpunk-btn-secondary w-full sm:w-auto"
              >
                <span>{isEs ? 'CONTÁCTAME' : 'CONTACT ME'}</span>
              </a>
            </div>
          </div>

          {/* ===== CAROUSEL DE TECNOLOGÍAS ===== */}
          {/* 
            Este carousel muestra las tecnologías que manejo de forma animada.
            Funciona de manera diferente en móvil vs desktop:
            - Móvil: Scroll horizontal manual
            - Desktop: Animación automática infinita (marquee)
            
            NOTA: Actualmente oculto - cambiar 'hidden' por 'block' para mostrarlo
          */}
          <div className="hidden mt-2 block transition-all duration-700">
            
            {/* Contenedor principal del carousel */}
            <div
              className="relative overflow-x-auto md:overflow-hidden rounded-full border border-gray-700/40 bg-gray-800/20 -mx-6 px-6 md:mx-0 md:px-0"
              style={{ 
                // Máscara de gradiente para crear efecto de desvanecimiento en los bordes
                // En móvil: permite scroll horizontal con desvanecimiento suave
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)', 
                maskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)' 
              }}
            >
              
              {/* Contenedor interno con los elementos del carousel */}
              <div className={`flex items-center gap-3 whitespace-nowrap will-change-transform md:${isSubtitleDone ? 'animate-[marquee_30s_linear_infinite]' : ''}`}>
                
                {/* ===== PRIMERA ITERACIÓN - Elementos originales ===== */}
                {technologies.map((tech) => (
                  <span
                    key={`${tech.name}-a`}
                    className="inline-flex items-center gap-1.5 px-4 py-1 text-xs font-medium text-gray-300 rounded-full mr-2 backdrop-blur-sm hover:scale-110 transition-transform duration-300 cursor-pointer"
                    style={{
                      // Fondo con gradiente personalizado usando la función helper
                      // padding-box: color de fondo interno
                      // border-box: gradiente en el borde
                      background: `linear-gradient(rgb(31 41 55 / 0.5), rgb(31 41 55 / 0.5)) padding-box, linear-gradient(to right, ${getGradientColors(tech.gradient)}) border-box`,
                      border: '1px solid transparent',
                    }}
                  >
                    {/* Renderizado condicional del icono */}
                    {'iconUrl' in tech ? (
                      // Si tiene URL de icono, renderiza imagen
                      <Image
                        src={tech.iconUrl}
                        alt={`${tech.name} icon`}
                        width={16}
                        height={16}
                        className="h-4 w-4 object-contain"
                      />
                    ) : (
                      // Si no tiene URL, renderiza emoji/símbolo
                      <span className="text-sm">{tech.icon}</span>
                    )}
                    {tech.name}
                  </span>
                ))}
                
                {/* ===== SEGUNDA ITERACIÓN - Duplicados para efecto infinito ===== */}
                {/* 
                  En desktop, se duplican los elementos para crear el efecto de carousel infinito.
                  Los elementos duplicados tienen aria-hidden="true" para accesibilidad.
                  La animación marquee mueve todo el contenedor hacia la izquierda,
                  y cuando termina, se reinicia sin saltos visibles.
                */}
                {technologies.map((tech) => (
                  <span
                    key={`${tech.name}-b`}
                    className="inline-flex items-center gap-1.5 px-4 py-1 text-xs font-medium text-gray-300 rounded-full mr-2 backdrop-blur-sm hover:scale-110 transition-transform duration-300 cursor-pointer"
                    style={{
                      background: `linear-gradient(rgb(31 41 55 / 0.5), rgb(31 41 55 / 0.5)) padding-box, linear-gradient(to right, ${getGradientColors(tech.gradient)}) border-box`,
                      border: '1px solid transparent',
                    }}
                    aria-hidden="true" // Oculto para lectores de pantalla
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

          {/* CTA Buttons moved above; removed duplicate here */}
          </div> {/* End Content Wrapper */}
        </div>

        {/* Right Side - Character (Desktop Only) */}
        <div className="hidden md:block relative w-full max-w-[811px] sm:max-w-[905px] md:max-w-[998px] lg:max-w-[1123px] aspect-[768/1211] mt-32">
          <div 
            className="relative transform h-full w-full"
          >
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

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400/80">
        <div className="flex flex-col items-center gap-2">
          <div className="w-5 h-8 rounded-full border border-gray-500/50 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-gray-400/80 rounded-full animate-bounce"></div>
          </div>
          <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ animationDelay: '0.15s' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* ===== ESTILOS CSS PERSONALIZADOS ===== */}
      <style jsx>{`
        /* Animación de entrada desde abajo hacia arriba */
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
        
        /* Animación de la línea debajo del título */
        @keyframes scaleX {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        
        /* ===== ANIMACIÓN DEL CAROUSEL INFINITO ===== */
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        /* ===== BOTONES MODERNOS CON GRADIENTES ===== */
        .cyberpunk-btn {
          position: relative;
          padding: 1rem 2rem;
          border: 2px solid transparent;
          border-radius: 12px;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 1rem;
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          overflow: hidden;
          text-align: center;
          backdrop-filter: blur(10px);
        }
        
        /* Botón principal con gradiente azul-púrpura */
        .cyberpunk-btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
          box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
        }
        
        .cyberpunk-btn-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
          z-index: -1;
        }
        
        .cyberpunk-btn-primary::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          opacity: 1;
          z-index: -2;
        }
        
        .cyberpunk-btn-primary:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4), 0 0 0 2px rgba(118, 75, 162, 0.3);
        }
        
        .cyberpunk-btn-primary:hover::before {
          opacity: 1;
        }
        
        /* Botón secundario con gradiente coral-naranja */
        .cyberpunk-btn-secondary {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: #ffffff;
          box-shadow: 0 8px 32px rgba(240, 147, 251, 0.3);
        }
        
        .cyberpunk-btn-secondary::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
          z-index: -1;
        }
        
        .cyberpunk-btn-secondary::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          opacity: 1;
          z-index: -2;
        }
        
        .cyberpunk-btn-secondary:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 15px 40px rgba(245, 87, 108, 0.4), 0 0 0 2px rgba(240, 147, 251, 0.3);
        }
        
        .cyberpunk-btn-secondary:hover::before {
          opacity: 1;
        }
        
        /* Animación suave de pulso para botones */
        @keyframes pulse-glow {
          0%, 100% { 
            opacity: 0.8; 
          }
          50% { 
            opacity: 1; 
          }
        }
        
        /* Efecto de brillo al hacer hover */
        .cyberpunk-btn:hover {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        /* Asegurar que el span interno esté visible */
        .cyberpunk-btn span {
          position: relative;
          z-index: 10;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        
        /* Estados adicionales para mejor UX */
        .cyberpunk-btn:active {
          transform: translateY(-1px) scale(0.98);
          transition: all 0.1s ease;
        }
        
        .cyberpunk-btn:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
        }
        
        /* Responsive para móvil */
        @media (max-width: 768px) {
          .cyberpunk-btn {
            padding: 0.9rem 1.8rem;
            font-size: 0.9rem;
            border-radius: 10px;
          }
          
          .cyberpunk-btn:hover {
            transform: translateY(-2px) scale(1.01);
          }
        }
        
        /* Mejoras para pantallas pequeñas */
        @media (max-width: 640px) {
          .cyberpunk-btn {
            padding: 0.8rem 1.5rem;
            font-size: 0.85rem;
            letter-spacing: 0.3px;
          }
        }
      `}</style>
    </section>
  );
}

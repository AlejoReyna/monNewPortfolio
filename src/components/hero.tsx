"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from 'react';

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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const [typedIndex, setTypedIndex] = useState(0);
  const [subtitleTypedIndex, setSubtitleTypedIndex] = useState(0);

  // Typewriter setup
  const prefixText = "Hey, I'm ";
  const nameText = title;
  const fullLength = prefixText.length + nameText.length;
  const finalTitle = `${prefixText}${nameText}`;
  const isSubtitleDone = typedIndex >= fullLength && subtitleTypedIndex >= subtitle.length;

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
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
    if (subtitleTypedIndex >= subtitle.length) return;
    const timeout = setTimeout(() => setSubtitleTypedIndex((v) => v + 1), 30);
    return () => clearTimeout(timeout);
  }, [typedIndex, fullLength, subtitleTypedIndex, subtitle]);

  const technologies = [
    {
      name: 'TypeScript',
      gradient: 'from-blue-600 to-blue-400',
      iconUrl:
        'https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/typescript.png',
    },
    {
      name: 'Ruby',
      gradient: 'from-red-500 to-pink-400',
      iconUrl:
        'https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/ruby.png',
    },
    {
      name: 'AWS',
      gradient: 'from-orange-500 to-red-400',
      iconUrl:
        'https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/aws.png',
    },
    {
      name: 'Crypto',
      gradient: 'from-yellow-500 to-orange-400',
      icon: '₿',
    },
  ];

  return (
    <section className={`relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden ${className}`}>
      {/* Side language tab */}
      <a
        href="#es"
        aria-label="Click aquí para ver en español"
        className="absolute left-0 top-24 z-40 -translate-x-6 sm:-translate-x-8 hover:translate-x-0 transition-transform duration-300 bg-gray-800/70 text-gray-200 text-[11px] sm:text-xs font-medium px-3 py-1.5 rounded-r-full border border-gray-700/60 backdrop-blur-sm shadow-md shadow-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
      >
        Click aquí para ver en español
      </a>
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 gap-4 h-full">
            {[...Array(144)].map((_, i) => (
              <div key={i} className="border border-gray-300"></div>
            ))}
          </div>
        </div>

        {/* Aurora backdrop */}
        <div className="aurora absolute inset-0" />

        {/* Gradient Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-gray-600 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-gray-500 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>

        {/* Cursor spotlight layer */}
        <div ref={spotlightRef} className="cursor-spotlight" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-6 py-24 min-h-screen md:grid-cols-2">
        
        {/* Mobile Background Character - Only visible on mobile */}
        <div className="md:hidden absolute inset-0 z-10 flex items-center justify-center">
          <div 
            className="relative w-full max-w-[400px] aspect-[768/1211]"
          >
            <Image 
              src="/16.gif" 
              alt="Avatar animado" 
              fill 
              unoptimized 
              priority 
              className="z-10 rounded-xl object-contain bg-transparent brightness-110 contrast-105 saturate-110" 
            />
          </div>
        </div>

        {/* Left Side - Text Content */}
        <div className="space-y-6 relative z-20 md:-mt-6 lg:-mt-10">
          
          {/* Content Wrapper */}
          <div className="relative z-30">
          {/* Floating Tech Stack - Hidden on mobile (Marquee) */}
          <div className={`mb-8 hidden md:block transition-all duration-700 ${isSubtitleDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
            <div className="relative overflow-hidden">

              {/* Track (duplicated for seamless loop) */}
              <div className={`flex items-center gap-3 whitespace-nowrap will-change-transform ${isSubtitleDone ? 'animate-[marquee_30s_linear_infinite]' : ''}`}>
                {technologies.map((tech) => (
                  <span
                    key={`${tech.name}-a`}
                    className="inline-flex items-center gap-1.5 px-5 py-1 text-xs font-medium text-gray-300 rounded-full mr-2 backdrop-blur-sm hover:scale-110 transition-transform duration-300 cursor-pointer"
                    style={{
                      background: `linear-gradient(rgb(31 41 55 / 0.5), rgb(31 41 55 / 0.5)) padding-box, linear-gradient(to right, ${getGradientColors(tech.gradient)}) border-box`,
                      border: '1px solid transparent',
                    }}
                  >
                    {('iconUrl' in tech && tech.iconUrl) ? (
                      <Image
                        src={(tech as any).iconUrl}
                        alt={`${tech.name} icon`}
                        width={16}
                        height={16}
                        className="h-4 w-4 object-contain"
                      />
                    ) : (
                      <span className="text-sm">{(tech as any).icon}</span>
                    )}
                    {tech.name}
                  </span>
                ))}
                {technologies.map((tech) => (
                  <span
                    key={`${tech.name}-b`}
                    className="inline-flex items-center gap-1.5 px-5 py-1 text-xs font-medium text-gray-300 rounded-full mr-2 backdrop-blur-sm hover:scale-110 transition-transform duration-300 cursor-pointer"
                    style={{
                      background: `linear-gradient(rgb(31 41 55 / 0.5), rgb(31 41 55 / 0.5)) padding-box, linear-gradient(to right, ${getGradientColors(tech.gradient)}) border-box`,
                      border: '1px solid transparent',
                    }}
                    aria-hidden="true"
                  >
                    {('iconUrl' in tech && tech.iconUrl) ? (
                      <Image
                        src={(tech as any).iconUrl}
                        alt={`${tech.name} icon`}
                        width={16}
                        height={16}
                        className="h-4 w-4 object-contain"
                      />
                    ) : (
                      <span className="text-sm">{(tech as any).icon}</span>
                    )}
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight" aria-label={`Hey, I'm ${title}`}>
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
                      ? "bg-gradient-to-r from-sky-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent"
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

          {/* Description */}
          <div className="text-lg lg:text-xl text-gray-300 mb-8 font-light relative">
            {/* Placeholder to reserve final height */}
            <p className="opacity-0 select-none text-gray-400">{subtitle}</p>
            {/* Overlay typed content */}
            <div className="absolute inset-0">
              <span className="text-gray-400">
                {subtitle.slice(0, subtitleTypedIndex)}
              </span>
              {typedIndex >= fullLength && subtitleTypedIndex < subtitle.length && (
                <span className="ml-[1px] inline-block w-[2px] h-[1em] align-[-0.1em] bg-gray-300/80 animate-pulse" />
              )}
            </div>
          </div>

          {/* CTA Buttons (replacing metrics), centered */}
          <div className={`mb-12 transition-all duration-700 ${isSubtitleDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <a 
                href="#projects"
                className="group relative gradient-border px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-gray-500/25 text-center border border-transparent text-sm"
              >
                <span className="relative z-10">View my work</span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -top-1 -left-1 w-full h-full border-2 border-gray-600 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"></div>
              </a>
              
              <a 
                href="#contact"
                className="group relative gradient-border px-6 py-3 text-gray-300 font-semibold rounded-full bg-transparent hover:bg-gray-600 hover:text-white transition-all duration-300 hover:scale-105 backdrop-blur-sm text-center text-sm border border-transparent"
              >
                <span className="flex items-center justify-center gap-2">
                  Contact me
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </a>
            </div>
          </div>

          {/* CTA Buttons moved above; removed duplicate here */}
          </div> {/* End Content Wrapper */}
        </div>

        {/* Right Side - Character (Desktop Only) */}
        <div className="hidden md:block relative w-full max-w-[624px] sm:max-w-[696px] md:max-w-[768px] lg:max-w-[864px] aspect-[768/1211]">
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
            />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-400 animate-bounce">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
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
      `}</style>
    </section>
  );
}

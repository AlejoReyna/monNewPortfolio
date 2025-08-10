"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from 'react';

type HeroProps = {
  title?: string;
  subtitle?: string;
  className?: string;
};

export default function Hero({
  title = "Alexis",
  subtitle = "Fullstack Developer — I build clean, fast and accessible interfaces.",
  className,
}: HeroProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const spotlightRef = useRef<HTMLDivElement | null>(null);

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

  const technologies = ['React', 'TypeScript', 'Next.js', 'Tailwind', 'Node.js', 'JavaScript'];

  return (
    <section className={`relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden ${className}`}>
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
            style={mounted ? {
              transform: `translate(${(mousePos.x - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)) / 200}px, ${(mousePos.y - (typeof window !== 'undefined' ? window.innerHeight / 2 : 0)) / 200}px)`
            } : {}}
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
        <div className="space-y-6 relative z-20">
          
          {/* Content Wrapper */}
          <div className="relative z-30">
          {/* Floating Tech Stack - Hidden on mobile */}
          <div className="mb-8 hidden md:block">
            {technologies.map((tech, index) => (
              <span
                key={tech}
                className="inline-block px-3 py-1 text-xs font-medium text-gray-300 bg-gray-800/50 rounded-full mr-2 mb-2 backdrop-blur-sm border border-gray-600/30 hover:scale-110 transition-transform duration-300 opacity-0 animate-[fadeInUp_0.8s_ease-out_forwards]"
                style={{
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Main Title */}
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Hi! I&apos;m{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent shimmer-text">
                {title}
              </span>
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full transform scale-x-0 animate-[scaleX_1s_ease-out_1s_forwards]"></div>
            </span>
          </h1>

          {/* Description */}
          <div className="text-lg lg:text-xl text-gray-300 mb-8 font-light">
            <span className="text-gray-100 font-semibold">Fullstack Developer</span>
            <br />
            <span className="text-gray-400">
              {subtitle}
            </span>
          </div>

          {/* Stats - Hidden on mobile */}
          <div className="grid grid-cols-3 gap-8 mb-12 hidden md:grid">
            {[
              { number: '50+', label: 'Projects' },
              { number: '3+', label: 'Years exp.' },
              { number: '100%', label: 'Dedication' }
            ].map((stat, index) => (
              <div key={index} className="text-center opacity-0 animate-[fadeInUp_0.8s_ease-out_forwards]" style={{ animationDelay: `${1.5 + index * 0.2}s` }}>
                <div className="text-2xl lg:text-3xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
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
          </div> {/* End Content Wrapper */}
        </div>

        {/* Right Side - Character (Desktop Only) */}
        <div className="hidden md:block relative w-full max-w-[624px] sm:max-w-[696px] md:max-w-[768px] lg:max-w-[864px] aspect-[768/1211]">
          <div 
            className="relative transform transition-transform duration-300 hover:scale-105 h-full w-full"
            style={mounted ? {
              transform: `translate(${(mousePos.x - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)) / 100}px, ${(mousePos.y - (typeof window !== 'undefined' ? window.innerHeight / 2 : 0)) / 100}px)`
            } : {}}
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
      `}</style>
    </section>
  );
}

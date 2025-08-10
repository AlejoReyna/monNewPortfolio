"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Project = {
  title: string;
  imageSrc: string;
  description: string;
  tags: string[];
  gradientFromTo: string;
};

const projects: Project[] = [
  {
    title: "Realtime Globe",
    imageSrc: "/globe.svg",
    description: "WebGL-powered globe with live data overlays.",
    tags: ["Next.js", "WebGL", "TypeScript"],
    gradientFromTo: "from-sky-500/20 to-cyan-500/10",
  },
  {
    title: "Code Studio",
    imageSrc: "/window.svg",
    description: "Minimal, fast UI system for complex apps.",
    tags: ["TypeScript", "UI", "Accessibility"],
    gradientFromTo: "from-violet-500/20 to-fuchsia-500/10",
  },
  {
    title: "Docs Engine",
    imageSrc: "/file.svg",
    description: "MDX documentation engine with live previews.",
    tags: ["Node.js", "MDX", "Tooling"],
    gradientFromTo: "from-amber-500/20 to-orange-500/10",
  },
];

export default function Showcase() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [heroFadeProgress, setHeroFadeProgress] = useState(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (!wrapper) return;
        
        // Calculate showcase section progress
        const rect = wrapper.getBoundingClientRect();
        const totalScrollable = rect.height - window.innerHeight;
        const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(totalScrollable, 1));
        const showcaseProgress = Math.min(Math.max(scrolled / Math.max(totalScrollable, 1), 0), 1);
        setScrollProgress(showcaseProgress);
        
        // Calculate hero fade progress (transition happens earlier)
        const heroRect = wrapper.getBoundingClientRect();
        const heroTransitionStart = window.innerHeight * 0.3; // Start fading when 30% scrolled
        const heroTransitionEnd = window.innerHeight * 1.2; // Complete fade at 120% scroll
        const heroScroll = heroTransitionStart - heroRect.top;
        const heroProgress = Math.min(Math.max(heroScroll / (heroTransitionEnd - heroTransitionStart), 0), 1);
        setHeroFadeProgress(heroProgress);
        
        ticking = false;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
  
  // Smooth easing function
  const easeInOutQuad = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  
  // Apply easing to progress values
  const easedHeroFade = easeInOutQuad(heroFadeProgress);
  const easedScrollProgress = easeInOutQuad(scrollProgress);
  
  // Transform calculations with smooth transitions
  const fadeInOpacity = easedHeroFade;
  const fadeInScale = 0.95 + easedHeroFade * 0.05;
  const fadeInBlur = (1 - easedHeroFade) * 10;
  
  // Content reveal timings
  const titleOpacity = clamp(easedHeroFade * 1.2, 0, 1);
  const titleTranslateY = (1 - titleOpacity) * 40;
  const subtitleOpacity = clamp((easedHeroFade - 0.2) * 1.5, 0, 1);
  
  // Parallax for background elements
  const bgTranslateY = easedScrollProgress * -80;
  const bgScale = 1 + easedScrollProgress * 0.1;
  
  // Cards animation
  const cardsContainerOpacity = clamp((easedHeroFade - 0.3) * 2, 0, 1);
  const trackTranslateX = -clamp(easedScrollProgress * 65, 0, 65);

  return (
    <section 
      id="projects" 
      className="relative h-[220vh] bg-gradient-to-b from-black via-gray-950 to-black"
    >
      {/* Smooth gradient overlay for transition */}
      <div 
        className="pointer-events-none fixed inset-0 z-40 bg-gradient-to-b from-black via-transparent to-transparent"
        style={{
          opacity: 1 - easedHeroFade,
          transition: 'opacity 0.3s ease-out',
        }}
      />
      
      {/* Main wrapper */}
      <div ref={wrapperRef} className="absolute inset-0">
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Entire section with smooth fade and scale */}
          <div
            className="relative h-full w-full"
            style={{
              opacity: fadeInOpacity,
              transform: `scale(${fadeInScale})`,
              filter: `blur(${fadeInBlur}px)`,
              transition: 'filter 0.5s ease-out',
            }}
          >
            {/* Animated background gradient orbs */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{ 
                transform: `translateY(${bgTranslateY}px) scale(${bgScale})`,
                transition: 'transform 0.3s ease-out',
              }}
            >
              {/* Gradient orbs with smooth animation */}
              <div 
                className="absolute top-20 left-20 h-96 w-96 rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/10 blur-3xl"
                style={{
                  animation: 'float 8s ease-in-out infinite',
                  animationDelay: '0s',
                }}
              />
              <div 
                className="absolute bottom-32 right-32 h-80 w-80 rounded-full bg-gradient-to-br from-purple-600/20 to-pink-600/10 blur-3xl"
                style={{
                  animation: 'float 8s ease-in-out infinite',
                  animationDelay: '2s',
                }}
              />
              <div 
                className="absolute top-1/2 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-indigo-600/15 to-cyan-600/10 blur-3xl"
                style={{
                  animation: 'float 8s ease-in-out infinite',
                  animationDelay: '4s',
                }}
              />
            </div>

            {/* Section heading with staggered fade */}
            <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-6 text-center">
              <div className="mb-20">
                {/* Main title */}
                <h2 
                  className="mb-4 text-5xl font-bold tracking-tight text-white md:text-7xl"
                  style={{
                    opacity: titleOpacity,
                    transform: `translateY(${titleTranslateY}px)`,
                    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <span className="bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">
                    Selected Work
                  </span>
                </h2>
                
                {/* Subtitle */}
                <p 
                  className="mx-auto max-w-2xl text-lg text-gray-400 md:text-xl"
                  style={{
                    opacity: subtitleOpacity,
                    transform: `translateY(${titleTranslateY * 0.5}px)`,
                    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.1s',
                  }}
                >
                  A curated collection of recent projects showcasing modern web experiences
                </p>
                
                {/* Decorative line */}
                <div 
                  className="mx-auto mt-8 h-px w-24 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  style={{
                    opacity: subtitleOpacity,
                    transform: `scaleX(${subtitleOpacity})`,
                    transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.2s',
                  }}
                />
              </div>
            </div>

            {/* Project cards container */}
            <div 
              className="absolute inset-x-0 bottom-0 top-1/2 z-20"
              style={{
                opacity: cardsContainerOpacity,
                transition: 'opacity 0.6s ease-out',
              }}
            >
              <div className="relative mx-auto flex h-full max-w-[1600px] items-center px-4 md:px-8">
                <div
                  className="flex gap-6 will-change-transform md:gap-8"
                  style={{ 
                    transform: `translateX(${trackTranslateX}%)`,
                    transition: 'transform 0.3s ease-out',
                  }}
                >
                  {projects.map((project, index) => {
                    // Staggered reveal for each card
                    const cardStart = 0.4 + index * 0.1;
                    const cardProgress = clamp((easedHeroFade - cardStart) * 3, 0, 1);
                    const cardTranslateY = (1 - cardProgress) * 60;
                    const cardOpacity = cardProgress;
                    
                    // Individual card scroll animation
                    const scrollStart = index * 0.25;
                    const scrollEnd = scrollStart + 0.5;
                    const localScroll = clamp((easedScrollProgress - scrollStart) / (scrollEnd - scrollStart), 0, 1);
                    const scrollRotate = (1 - localScroll) * 3;
                    const scrollScale = 0.95 + localScroll * 0.05;

                    return (
                      <article
                        key={project.title}
                        className="group relative w-[85vw] max-w-[450px] shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-500 hover:border-white/10 hover:bg-white/[0.05] hover:shadow-2xl md:w-[40vw]"
                        style={{
                          opacity: cardOpacity,
                          transform: `translateY(${cardTranslateY}px) rotate(${scrollRotate}deg) scale(${scrollScale})`,
                          transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      >
                        {/* Gradient background */}
                        <div 
                          className={`pointer-events-none absolute inset-0 opacity-50 ${project.gradientFromTo} bg-gradient-to-br`}
                          style={{
                            transition: 'opacity 0.3s ease',
                          }}
                        />
                        
                        {/* Hover glow effect */}
                        <div 
                          className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        />

                        {/* Image container */}
                        <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-lg bg-gradient-to-br from-gray-900/50 to-gray-800/50">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                          <Image
                            src={project.imageSrc}
                            alt={project.title}
                            fill
                            className="object-contain p-8 transition-transform duration-700 group-hover:scale-110"
                          />
                        </div>

                        {/* Content */}
                        <div className="relative">
                          <h3 className="mb-2 text-xl font-semibold text-white transition-colors group-hover:text-white md:text-2xl">
                            {project.title}
                          </h3>
                          <p className="mb-4 text-sm leading-relaxed text-gray-400 transition-colors group-hover:text-gray-300 md:text-base">
                            {project.description}
                          </p>
                          
                          {/* Tags */}
                          <div className="mb-4 flex flex-wrap gap-2">
                            {project.tags.map((tag, tagIndex) => (
                              <span
                                key={tag}
                                className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-300 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white"
                                style={{
                                  animationDelay: `${tagIndex * 0.05}s`,
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* CTA */}
                          <div className="flex items-center gap-2 text-sm font-medium text-white/60 transition-all group-hover:text-white">
                            <span>View project</span>
                            <svg
                              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="pointer-events-none absolute bottom-8 left-1/2 z-30 -translate-x-1/2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-500">Scroll Progress</span>
                <div className="relative h-1 w-48 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-white/80 to-white/40 transition-all duration-300"
                    style={{ 
                      width: `${clamp(easedScrollProgress * 100, 2, 100)}%`,
                    }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-500">{Math.round(easedScrollProgress * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.15;
          }
          50% {
            transform: translateY(-20px) scale(1.05);
            opacity: 0.25;
          }
        }
      `}</style>
    </section>
  );
}

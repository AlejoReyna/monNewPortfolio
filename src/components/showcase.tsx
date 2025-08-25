"use client";
import { useState, useRef, useEffect } from 'react';

export interface Project {
    title: string;
    info: string;
    video: string;
    url: string;
    repo: string;
    isSpecial?: boolean;
    specialLabel?: string;
}

export const projects: Project[] = [
    {
        title: "Presale website of the videogame 'Mortal Kombat 1'",
        info: "This website simulates the funcionality of a preorders system, where you input your e-mail and in consequence you get a mail, confirming your preorder.",
        video: "/videos/preview-mk.mp4",
        url: "https://next-mk.vercel.app/",
        repo: "https://github.com/AlejoReyna/MortalKombat"
    },
    {
        title: "This cafeteria doesn't exist, and it's awesome",
        info: "A simulated website of a cafeteria, giving users the option to simulate buying coffee bags and looking for information about the cafeteria itself. Features interactive shopping cart, product catalog, and realistic cafe atmosphere simulation.",
        video: "/videos/preview-cafeteria.mp4",
        url: "https://this-cafeteria-doesnt-exist.vercel.app",
        repo: ""
    },
    {
        title: "Birdlypay - A hackathon project",
        info: "This project was built during the OnChainSummer buildathon by Base. Birdlypay is an app able to create payment links for cryptocurrencies, deleting the need to introduce a long wallet, among other services",
        video: "/videos/preview-birdly.mp4",
        url: "https://birdlypay.vercel.app/landingPage",
        repo: "https://github.com/AlejoReyna/Birdlypay"
    },
    {
        title: "Remaster of the UANL college services",
        info: "A browser extension that modifies the styles and structure of the 'https://deimos.dgi.uanl.mx/', which is the selections service page of the UANL, built using JavaScript and Bootstrap. (Deployment doesnt redirect to UANL service as you need a universitary account to access them)",
        video: "/videos/preview-siase.mp4",
        url: "",
        repo: "https://github.com/AlejoReyna/UANLInterface"
    },
    {
        title: "PokeFolio - My developer portfolio",
        info: "A Pokemon-themed developer portfolio featuring typing text animations, interactive dialog boxes, and music player functionality. Built with React and includes navigation between projects and sections with Pokemon-style UI elements.",
        video: "/preview_pokefolio.mp4",
        url: "https://pokefolio.vercel.app/",
        repo: "https://github.com/AlejoReyna/PokeFolio"
    },
    {
        title: "mpBot - a ETH Mérida 2024 project",
        info: "Este proyecto implementa un bot de Telegram utilizando el framework Next.js y la biblioteca Telegraf. El bot está diseñado para proporcionar recomendaciones de inversión y información sobre Meta Pool, un servicio de staking. También integra la API de OpenAI para responder preguntas generales sobre DeFi.",
        video: "/videos/preview-mpbot.mp4",
        url: "",
        repo: ""
    },
    {
        title: "Inverater - Full Stack Developer",
        info: "A real estate investment platform in Mexico that democratizes access to property investments. The platform connects investors with real estate opportunities, making property investment accessible to a broader audience through technology.",
        video: "/videos/preview-inverater.mp4",
        url: "",
        repo: ""
    },
    {
        title: "Plebes | A real NFT project",
        info: "Plebes is a multichain DAO refining non-plutocratic governance and funding open-source, AI, creativity, and public goods through Bitcoin ordinal auctions.",
        video: "/videos/preview-plebes.mp4",
        url: "",
        repo: ""
    },
    {
        title: "Wedding invitation - not sent yet",
        info: "This project card will be updated as soon as the invitation is sent. Stay tuned for what promises to be a unique and memorable digital wedding experience.",
        video: "/videos/preview-wedding.mp4",
        url: "",
        repo: ""
    }
];

// Custom Intersection Observer Hook (sin dependencias externas)
function useIntersectionObserver(options: IntersectionObserverInit = {}) {
    const [hasTriggered, setHasTriggered] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasTriggered) {
                    setHasTriggered(true);
                }
            },
            {
                threshold: 0.3,
                ...options,
            }
        );

        observer.observe(element);

        return () => {
            observer.unobserve(element);
        };
    }, [hasTriggered, options]);

    return [ref, hasTriggered] as const;
}

interface TimelineItemProps {
    project: Project;
    index: number;
    quarter: string;
    year: number;
    isFirstJob?: boolean;
}

function TimelineItem({ project, index, quarter, year, isFirstJob }: TimelineItemProps) {
    const [ref, inView] = useIntersectionObserver();
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const isLeft = index % 2 === 0;

    const handleVideoClick = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div
            ref={ref}
            className={`relative flex items-center w-full mb-16 md:mb-24`}
        >
            {/* Timeline Node */}
            <div className={`absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-2 transition-all duration-700 ${
                inView 
                    ? 'bg-gradient-to-r from-cyan-400 to-violet-400 border-white shadow-lg shadow-cyan-400/30 scale-125' 
                    : 'bg-gray-600 border-gray-500 scale-100'
            }`}>
                <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 transition-opacity duration-700 ${
                    inView ? 'animate-ping opacity-75' : 'opacity-0'
                }`} />
            </div>

            {/* Special Job Achievement Message - Left side when card is on right */}
            {isFirstJob && !isLeft && (
                <div className={`w-full md:w-5/12 md:mr-auto md:pr-8 transition-all duration-700 ${
                    inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 200 + 100}ms` }}
                >
                    <div className="flex items-center justify-center p-6 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 backdrop-blur-sm">
                        <div className="text-center">
                            <div className="text-4xl mb-2">🎉</div>
                            <h4 className="text-lg font-bold text-emerald-300 mb-1">
                                Got my first job in tech!
                            </h4>
                            <p className="text-sm text-emerald-400/80">
                                Professional developer journey begins
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Content Card */}
            <div
                className={`w-full md:w-5/12 transition-all duration-700 ${
                    inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                } ${isLeft ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}
                style={{ transitionDelay: `${index * 200}ms` }}
            >
                {/* Date Badge */}
                <div className={`flex items-center gap-2 mb-4 ${isLeft ? 'md:justify-start' : 'md:justify-end'}`}>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-500/30 backdrop-blur-sm">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                        <span className="text-sm font-medium text-cyan-300">{quarter} {year}</span>
                    </div>
                </div>

                {/* Project Card */}
                <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm transition-all duration-500 hover:border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/10">
                    {/* Video Container */}
                    <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-gray-900/50 to-gray-800/50">
                        <video
                            ref={videoRef}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loop
                            muted
                            playsInline
                            poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23111827'/%3E%3C/svg%3E"
                        >
                            <source src={project.video} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        
                        {/* Video Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        {/* Play Button */}
                        <button
                            onClick={handleVideoClick}
                            className="absolute inset-0 flex items-center justify-center group/play"
                        >
                            <div className={`w-16 h-16 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 group-hover/play:bg-black/80 group-hover/play:scale-110 ${
                                isPlaying ? 'opacity-0' : 'opacity-100'
                            }`}>
                                <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                </svg>
                            </div>
                        </button>

                        {/* Status Badge */}
                        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full backdrop-blur-sm ${
                            isFirstJob 
                                ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30'
                                : 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30'
                        }`}>
                            <span className={`text-xs font-medium ${
                                isFirstJob ? 'text-blue-300' : 'text-green-300'
                            }`}>
                                {isFirstJob ? 'Current Position' : 'Completed'}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors leading-tight">
                            {project.title}
                        </h3>
                        
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            {project.info}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                            {project.url && (
                                <a
                                    href={project.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-mono font-bold rounded-full text-center hover:from-cyan-400 hover:to-violet-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-[1.02]"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        View Live Demo
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </span>
                                </a>
                            )}
                            
                            {project.repo && (
                                <a
                                    href={project.repo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 px-6 py-3 border border-white/20 text-gray-300 font-mono font-bold rounded-full text-center hover:bg-white/10 hover:text-white hover:border-white/30 transition-all duration-300"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        GitHub Repository
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                        </svg>
                                    </span>
                                </a>
                            )}
                            
                            {/* Special message for current job if no links */}
                            {isFirstJob && !project.url && !project.repo && (
                                <div className="flex-1 px-6 py-3 border border-blue-500/30 text-blue-300 font-mono font-bold rounded-full text-center bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
                                    <span className="flex items-center justify-center gap-2">
                                        🏢 Private Company Project
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Special Job Achievement Message - Right side when card is on left */}
            {isFirstJob && isLeft && (
                <div className={`w-full md:w-5/12 md:ml-auto md:pl-8 transition-all duration-700 ${
                    inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 200 + 100}ms` }}
                >
                    <div className="flex items-center justify-center p-6 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 backdrop-blur-sm">
                        <div className="text-center">
                            <div className="text-4xl mb-2">🎉</div>
                            <h4 className="text-lg font-bold text-emerald-300 mb-1">
                                Got my first job in tech!
                            </h4>
                            <p className="text-sm text-emerald-400/80">
                                Professional developer journey begins
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Timeline Continuation removed: now handled by a single central line */}
        </div>
    );
}

export default function Showcase() {
    const [headerRef, headerInView] = useIntersectionObserver();
    
    // Generate quarters for 2024-2025 with year separator
    const timelineData = projects.map((project, index) => {
        // First 7 projects are in 2024 (including Inverater as the last one)
        if (index < 7) {
            return {
                ...project,
                quarter: `Q${(index % 4) + 1}`,
                year: 2024
            };
        }
        // Last 2 projects are in 2025
        else {
            return {
                ...project,
                quarter: `Q${((index - 7) % 4) + 1}`,
                year: 2025
            };
        }
    });

    // Split timeline data by year
    const projects2024 = timelineData.filter(p => p.year === 2024);
    const projects2025 = timelineData.filter(p => p.year === 2025);

    return (
        <section id="projects" className="relative min-h-screen bg-gradient-to-b from-black via-gray-950 to-black py-24 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.02)_0%,transparent_70%)]" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6">
                {/* Header */}
                <div ref={headerRef} className="text-center mb-20">
                    <div className={`transition-all duration-700 ${headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-cyan-500/20 mb-6">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                            <span className="text-sm font-medium text-cyan-300">Development Journey</span>
                        </div>
                        
                        <h2 className="text-5xl md:text-7xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-white via-cyan-200 to-violet-300 bg-clip-text text-transparent">
                                Project Timeline
                            </span>
                        </h2>
                        
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                            A chronological journey through my recent projects, showcasing growth and innovation 
                            throughout 2024. Each milestone represents learning, creativity, and technical excellence.
                        </p>
                    </div>
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Central continuous timeline line */}
                    <div className="pointer-events-none absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500/50 via-violet-500/30 to-cyan-500/50 -z-10" />
                    {/* 2024 Year Marker */}
                    <div className="flex items-center justify-center mb-16">
                        <div className="relative px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-500/30 backdrop-blur-sm">
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-violet-500/10 animate-pulse" />
                            <span className="relative text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">
                                2024
                            </span>
                        </div>
                    </div>

                    {/* 2024 Timeline Items */}
                    <div className="relative">
                        {projects2024.map((project, index) => (
                            <TimelineItem
                                key={`2024-${index}`}
                                project={project}
                                index={index}
                                quarter={project.quarter}
                                year={project.year}
                                isFirstJob={index === projects2024.length - 1} // Last project in 2024 is the job (Inverater)
                            />
                        ))}
                    </div>

                    {/* 2025 Year Marker */}
                    <div className="flex items-center justify-center mb-16 mt-24">
                        <div className="relative px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 backdrop-blur-sm">
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10 animate-pulse" />
                            <span className="relative text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-300 to-blue-300 bg-clip-text text-transparent">
                                2025
                            </span>
                        </div>
                    </div>

                    {/* 2025 Timeline Items */}
                    <div className="relative">
                        {projects2025.map((project, index) => (
                            <TimelineItem
                                key={`2025-${index}`}
                                project={project}
                                index={projects2024.length + index}
                                quarter={project.quarter}
                                year={project.year}
                                isFirstJob={false} // No job markers in 2025 since current job is in 2024
                            />
                        ))}
                    </div>

                    {/* Timeline End */}
                    <div className="flex items-center justify-center pt-8">
                        <div className="relative">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 flex items-center justify-center shadow-lg shadow-cyan-400/30">
                                <div className="w-3 h-3 bg-white rounded-full" />
                            </div>
                            <div className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                                <span className="text-sm font-medium text-gray-400">Journey Continues...</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
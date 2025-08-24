"use client";

import { useLanguage } from "@/components/lang-context";

export default function ProjectsSection() {
  const { language } = useLanguage();
  const isEs = language === 'es';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Icono de proyectos */}
        <div className="mb-8">
          <svg 
            className="mx-auto h-24 w-24 text-gray-400 animate-bounce" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="1.5" 
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
            />
          </svg>
        </div>

        {/* Título principal */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-6 font-mono">
          {isEs ? 'Proyectos' : 'Projects'}
        </h1>

        {/* Mensaje de construcción */}
        <div className="space-y-4 mb-8">
          <p className="text-xl sm:text-2xl text-gray-300 font-mono font-light">
            {isEs ? '🎨 Galería en construcción 🎨' : '🎨 Gallery under construction 🎨'}
          </p>
          <p className="text-lg text-gray-400 font-mono font-extralight">
            {isEs 
              ? 'Preparando mis mejores trabajos para mostrarte...' 
              : 'Preparing my best work to show you...'
            }
          </p>
        </div>

        {/* Animación de carga */}
        <div className="flex justify-center space-x-2 mb-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            ></div>
          ))}
        </div>

        {/* Grid de proyectos placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { 
              icon: "🚀", 
              title: isEs ? "Próximamente..." : "Coming Soon...",
              tech: "React • Next.js • TypeScript"
            },
            { 
              icon: "⚡", 
              title: isEs ? "En desarrollo..." : "In Development...",
              tech: "Node.js • Python • AI"
            },
            { 
              icon: "🌟", 
              title: isEs ? "Ideas brillantes..." : "Brilliant Ideas...",
              tech: "Cloud • DevOps • Blockchain"
            }
          ].map((project, index) => (
            <div 
              key={index}
              className="group p-6 rounded-xl border border-white/10 bg-black/20 backdrop-blur-md hover:bg-black/30 hover:border-white/20 transition-all duration-300 hover:scale-105"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {project.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-3 font-mono">
                {project.title}
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.split(' • ').map((tech, i) => (
                  <span 
                    key={i}
                    className="px-2 py-1 text-xs bg-white/10 rounded-full text-gray-300 font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="w-full h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center opacity-50">
                <div className="text-6xl opacity-30">📷</div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje motivacional */}
        <div className="mt-12 p-6 rounded-xl border border-white/10 bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-md">
          <p className="text-lg text-gray-300 font-mono font-light">
            {isEs 
              ? '🔥 Cada línea de código cuenta una historia increíble...' 
              : '🔥 Every line of code tells an incredible story...'
            }
          </p>
        </div>
      </div>
    </div>
  );
}

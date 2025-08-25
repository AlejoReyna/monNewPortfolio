"use client";

import { useLanguage } from "@/components/lang-context";

export default function ServicesSection() {
  const { language } = useLanguage();
  const isEs = language === 'es';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-black">
      <div className="max-w-4xl mx-auto text-center">


        {/* Título principal */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-6 font-mono">
          {isEs ? 'Servicios' : 'Services'}
        </h1>

        {/* Mensaje de construcción */}
        <div className="space-y-4 mb-8">
          <p className="text-xl sm:text-2xl text-gray-300 font-mono font-light">
            {isEs ? '🚧 Esta sección está en construcción 🚧' : '🚧 This section is under construction 🚧'}
          </p>
          <p className="text-lg text-gray-400 font-mono font-extralight">
            {isEs 
              ? 'Estoy trabajando en algo increíble para ti...' 
              : 'I\'m working on something amazing for you...'
            }
          </p>
        </div>

        {/* Barra de progreso animada */}
        <div className="w-full max-w-md mx-auto mb-8">
          <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-full rounded-full animate-pulse w-3/4"></div>
          </div>
          <p className="text-sm text-gray-500 mt-2 font-mono">
            {isEs ? 'Progreso: 75%' : 'Progress: 75%'}
          </p>
        </div>

        {/* Lista de servicios futuros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {[
            { 
              icon: "💻", 
              title: isEs ? "Desarrollo Web" : "Web Development",
              desc: isEs ? "Aplicaciones modernas y responsivas" : "Modern and responsive applications"
            },
            { 
              icon: "📱", 
              title: isEs ? "Apps Móviles" : "Mobile Apps",
              desc: isEs ? "iOS y Android nativo" : "Native iOS and Android"
            },
            { 
              icon: "☁️", 
              title: isEs ? "Cloud Computing" : "Cloud Computing",
              desc: isEs ? "Infraestructura escalable" : "Scalable infrastructure"
            },
            { 
              icon: "🤖", 
              title: isEs ? "IA & Machine Learning" : "AI & Machine Learning",
              desc: isEs ? "Soluciones inteligentes" : "Intelligent solutions"
            }
          ].map((service, index) => (
            <div 
              key={index}
              className="p-6 rounded-xl border border-white/10 bg-black/20 backdrop-blur-md hover:bg-black/30 transition-all duration-300"
            >
              <div className="text-3xl mb-3">{service.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2 font-mono">{service.title}</h3>
              <p className="text-gray-400 text-sm font-mono font-extralight">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

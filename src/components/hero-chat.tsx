"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from "@/components/lang-context";
import { useChat, ChatMessage } from "@/hooks/useChat";

type HeroChatProps = {
  title?: string;
  subtitle?: string;
  className?: string;
};

const firstTimeGreetings = [
  { en: "Howdy visitor", es: "Hola visitante" },
  { en: "Well hello there", es: "Vaya, hola" },
  { en: "Welcome, stranger", es: "Bienvenido, forastero" },
  { en: "Greetings, traveler", es: "Saludos, viajero" },
  { en: "Hey there, friend", es: "Ey amigo" },
];

const returningGreetings = [
  { en: "Back again, huh?", es: "¿De vuelta otra vez?" },
  { en: "Missed me already?", es: "¿Ya me extrañabas?" },
  { en: "Welcome back, friend", es: "Bienvenido de vuelta" },
  { en: "We meet again", es: "Nos volvemos a ver" },
];

const quickSuggestions = [
  { en: "About me", es: "Sobre mí" },
  { en: "Projects", es: "Proyectos" },
  { en: "Technologies", es: "Tecnologías" },
  { en: "Contact", es: "Contacto" },
];

export default function HeroChat({
  title = "Alexis",
  subtitle = "Full-stack developer creating intuitive user experiences and powerful backend architectures for modern businesses.",
  className,
}: HeroChatProps) {
  const { language } = useLanguage();
  const isEs = language === 'es';
  const [showMobileContainer, setShowMobileContainer] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [userName, setUserName] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const [isChatMode, setIsChatMode] = useState(false);
  const [showIntroChat, setShowIntroChat] = useState(false);
  
  const { messages, isLoading, error, sendMessage, isWakingUp } = useChat(userName);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

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

  // Mostrar el input después de un tiempo
  useEffect(() => {
    if (!userName && !showNameInput) {
      setTimeout(() => setShowNameInput(true), 2000);
    }
  }, [userName, showNameInput]);

  // Manejar el guardado del nombre
  const handleSaveName = () => {
    if (inputValue.trim()) {
      const name = inputValue.trim();
      setUserName(name);
      localStorage.setItem('userName', name);
      setShowNameInput(false);
      // Mostrar chat intro después de guardar nombre
      setTimeout(() => setShowIntroChat(true), 1000);
    }
  };

  // Auto-scroll en chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Manejar el enter en inputs
  const handleKeyPress = (e: React.KeyboardEvent, isChat = false) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isChat) {
        handleSendMessage();
      } else {
        handleSaveName();
      }
    }
  };

  const handleSendMessage = () => {
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const toggleChatMode = () => {
    setIsChatMode(!isChatMode);
    if (!isChatMode) {
      setTimeout(() => chatInputRef.current?.focus(), 100);
    }
  };

  // Mostrar intro del chat automáticamente si el usuario ya tiene nombre
  useEffect(() => {
    if (userName && !showIntroChat) {
      setTimeout(() => setShowIntroChat(true), 1500);
    }
  }, [userName, showIntroChat]);

  // Mostrar contenedor móvil después de 0.8 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMobileContainer(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className={`relative min-h-screen overflow-hidden mb-0 ${className}`}>
      {/* Mobile GIF Background */}
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
        
        {/* Left Side - Chat Interface */}
        <div className="space-y-6 relative z-20 mt-auto md:-mt-6 lg:-mt-10 sm:z-30">
          
          {/* Content Wrapper */}
          <div className={`relative z-40 sm:z-50 md:bg-transparent md:border-none md:p-0 bg-black/70 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl transition-all duration-800 ease-out md:opacity-100 md:translate-y-0 ${
            showMobileContainer ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>

          {!isChatMode ? (
            // Modo tradicional con greeting
            <div className="space-y-6">
              {/* Title con Name Input */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight text-center md:text-left hero-title font-mono tracking-tight drop-shadow-2xl relative" 
                  style={{ textShadow: '2px 2px 10px rgba(0, 0, 0, 0.9)' }}>
                <span className="inline-block w-full">
                  <span className="inline">{greeting}</span>
                  
                  {showNameInput && !userName && (
                    <span className="inline-block relative">
                      , <input
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
                  
                  {userName && (
                    <span
                      className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent font-extrabold inline"
                      style={{ textShadow: '0 0 20px rgba(100, 255, 218, 0.5)' }}
                    >
                      , {userName}
                    </span>
                  )}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg lg:text-xl text-gray-100 md:text-gray-300 mb-8 font-light md:font-extralight font-mono text-center md:text-left max-w-xl md:max-w-none mx-auto md:mx-0" 
                 style={{ textShadow: '1px 1px 6px rgba(0, 0, 0, 0.9)' }}>
                {isEs
                  ? "Desarrollador full‑stack creando experiencias intuitivas y arquitecturas backend potentes para negocios modernos."
                  : subtitle}
              </p>

              {/* Chat Introduction */}
              {showIntroChat && (
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/30 rounded-xl p-4 backdrop-blur-sm animate-fadeInUp">
                  <p className="text-cyan-200 text-sm mb-3 font-mono">
                    💬 {isEs ? "¡Hola! Soy Alexis. Pregúntame lo que quieras sobre mi trabajo." : "Hi! I'm Alexis. Ask me anything about my work."}
                  </p>
                  <button
                    onClick={toggleChatMode}
                    className="text-xs bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-4 py-2 rounded-lg font-bold transition-all duration-300 transform hover:scale-105"
                  >
                    💬 {isEs ? "Iniciar Chat" : "Start Chat"}
                  </button>
                </div>
              )}

              {/* Traditional CTA Buttons */}
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
          ) : (
            // Modo Chat
            <div className="space-y-4">
              {/* Chat Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white font-mono">
                  💬 Chat with Alexis
                </h2>
                <button
                  onClick={toggleChatMode}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Chat Messages */}
              <div className="h-80 overflow-y-auto space-y-3 bg-black/20 rounded-xl p-4 border border-white/10">
                {messages.length === 0 && (
                  <div className="text-center text-gray-400 py-8">
                    <p className="font-mono">
                      {isEs ? "¡Hola! Pregúntame sobre mis proyectos, tecnologías o experiencia." : "Hi! Ask me about my projects, technologies, or experience."}
                    </p>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-xl font-mono text-sm ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                          : 'bg-gray-700/50 text-gray-100 border border-gray-600/30'
                      }`}
                    >
                      <p>{message.content}</p>
                      <span className="text-xs opacity-60 mt-1 block">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-700/50 text-gray-100 border border-gray-600/30 p-3 rounded-xl font-mono text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span>Alexis está escribiendo...</span>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-500/20 border border-red-400/30 text-red-200 p-3 rounded-xl font-mono text-sm">
                    <p>{error}</p>
                    {isWakingUp && (
                      <p className="text-xs mt-2 opacity-80">
                        ⏳ {isEs ? "El servidor está iniciando..." : "Server is waking up..."}
                      </p>
                    )}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestions */}
              {messages.length === 0 && !isLoading && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {quickSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.en}
                      onClick={() => handleSuggestionClick(isEs ? suggestion.es : suggestion.en)}
                      className="text-xs bg-gray-700/30 hover:bg-gray-600/40 text-gray-300 hover:text-white px-3 py-2 rounded-lg border border-gray-600/30 transition-all duration-300 font-mono"
                    >
                      {isEs ? suggestion.es : suggestion.en}
                    </button>
                  ))}
                </div>
              )}

              {/* Chat Input */}
              <div className="flex gap-2">
                <input
                  ref={chatInputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, true)}
                  placeholder={isEs ? "Escribe tu mensaje..." : "Type your message..."}
                  className="flex-1 bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400 px-4 py-3 rounded-xl outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 font-mono text-sm"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 disabled:scale-100"
                >
                  {isLoading ? '⏳' : '🚀'}
                </button>
              </div>
            </div>
          )}

          </div>
        </div>

        {/* Right Side - Character (Desktop Only) */}
        <div className="hidden md:block relative w-full max-w-[811px] sm:max-w-[905px] md:max-w-[998px] lg:max-w-[1123px] aspect-[768/1211] mt-32">
          <div className="relative transform h-full w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl blur-3xl opacity-20 scale-110"></div>
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
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }

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
      `}</style>
    </section>
  );
}

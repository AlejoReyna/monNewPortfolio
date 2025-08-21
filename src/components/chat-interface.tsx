"use client";
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from "@/components/lang-context";
import { useChat, ChatMessage } from "@/hooks/useChat";

const quickSuggestions = [
  { en: "About me", es: "Sobre mí" },
  { en: "Projects", es: "Proyectos" },
  { en: "Technologies", es: "Tecnologías" },
  { en: "Contact", es: "Contacto" },
];

export default function ChatInterface() {
  const { language } = useLanguage();
  const isEs = language === 'es';
  
  // Typewriter
  const [displayed, setDisplayed] = useState("");
  const text = isEs
    ? "Hola, soy Alexis. Construyo experiencias web rápidas y cuidadas."
    : "Hi, I'm Alexis. I build fast, polished web experiences.";

  // Chat functionality with GPT-5 nano
  const [userName, setUserName] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [showChat, setShowChat] = useState(false);
  const { messages, isLoading, error, sendMessage, isRateLimit, usage } = useChat(userName);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  // Cargar el nombre del usuario cuando el componente se monta
  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  // Typewriter effect
  useEffect(() => {
    let i = 0;
    setDisplayed("");
    const id = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(id);
      }
    }, 28);
    return () => clearInterval(id);
  }, [text]);

  // Chat functions
  const handleSendMessage = () => {
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue.trim());
      setInputValue('');
      if (!showChat) {
        setShowChat(true);
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
    if (!showChat) {
      setShowChat(true);
    }
  };

  // Auto-scroll en chat
  useEffect(() => {
    if (messagesEndRef.current && showChat) {
      const chatContainer = messagesEndRef.current.closest('.overflow-y-auto');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }
  }, [messages, showChat]);

  // Handle key press for chat input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="relative z-30 flex flex-col gap-4 px-4 w-full max-w-3xl mx-auto mb-20">
      {/* Textbox */}
      <div className="pointer-events-auto w-full rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md px-5 py-6 shadow-2xl shadow-black/30">
        <p className="relative text-base sm:text-lg text-gray-200 font-mono font-light leading-relaxed">
          {displayed}
          {displayed.length < text.length && (
            <span className="ml-1 inline-block h-5 w-0.5 align-[-0.15em] bg-cyan-300 animate-pulse" />
          )}
        </p>
      </div>

      {/* Chat Messages - Show when there are messages */}
      {showChat && messages.length > 0 && (
        <div className="h-80 overflow-y-auto space-y-3 bg-black/20 rounded-xl p-4 border border-white/10">
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
              {isRateLimit && (
                <p className="text-xs mt-2 opacity-80">
                  ⏳ {isEs ? "Rate limit alcanzado. Intenta en unos segundos." : "Rate limit reached. Try in a few seconds."}
                </p>
              )}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Quick Suggestions - Show when no messages yet */}
      {!showChat && messages.length === 0 && (
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

      {/* Input del usuario - Always visible and functional */}
      <div className="w-full">
        <div className="flex gap-2">
          <input
            ref={chatInputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isEs ? "Pregúntame algo..." : "Ask me something..."}
            className="flex-1 rounded-xl border border-white/10 bg-black/30 backdrop-blur-md px-4 py-3 text-gray-200 placeholder-gray-400 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-xl"
            disabled={isLoading}
            maxLength={500}
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
    </div>
  );
}

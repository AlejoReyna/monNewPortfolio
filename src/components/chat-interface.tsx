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
  const [typewriterComplete, setTypewriterComplete] = useState(false);
  const [visibleButtons, setVisibleButtons] = useState(0);
  const [showInput, setShowInput] = useState(false);
  
  const text = isEs
    ? "Hola, soy Alexis. Construyo experiencias web rápidas y cuidadas, y esta es una instancia potenciada por GPT de mí. ¿Cómo estás?"
    : "Hi, I'm Alexis. I build fast, polished web experiences, and this is a GPT powered instance of me. How are you?";

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

  // Typewriter effect - only for initial message
  useEffect(() => {
    if (!showChat) {
      let i = 0;
      setDisplayed("");
      setTypewriterComplete(false);
      const id = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(id);
          setTypewriterComplete(true);
        }
      }, 34);
      return () => clearInterval(id);
    }
  }, [text, showChat]);

  // Efecto para mostrar botones uno por uno después del typewriter
  useEffect(() => {
    if (typewriterComplete && !showChat && visibleButtons < quickSuggestions.length) {
      const timer = setTimeout(() => {
        setVisibleButtons(prev => prev + 1);
      }, 200); // 200ms entre cada botón
      
      return () => clearTimeout(timer);
    }
  }, [typewriterComplete, visibleButtons, showChat]);

  // Efecto para mostrar el input después de todos los botones
  useEffect(() => {
    if (typewriterComplete && !showChat && visibleButtons === quickSuggestions.length && !showInput) {
      const timer = setTimeout(() => {
        setShowInput(true);
      }, 300); // 300ms después del último botón
      
      return () => clearTimeout(timer);
    }
  }, [typewriterComplete, visibleButtons, showChat, showInput]);

  // Reset animation states when showing chat
  useEffect(() => {
    if (showChat) {
      setVisibleButtons(quickSuggestions.length);
      setShowInput(true);
      setTypewriterComplete(true);
    }
  }, [showChat]);

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

  // Get the latest assistant message to display in the main textbox
  const latestAssistantMessage = messages
    .filter(msg => msg.role === 'assistant')
    .pop();

  // Get user messages only
  const userMessages = messages.filter(msg => msg.role === 'user');

  return (
    <div className="relative z-30 flex flex-col gap-4 px-4 w-full max-w-3xl mx-auto mb-20">
      {/* Main Textbox - Shows initial message or latest assistant response */}
      <div className="pointer-events-auto w-full rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md px-5 py-6 shadow-2xl shadow-black/30">
        <p className="relative text-base sm:text-lg text-gray-200 font-mono font-light leading-relaxed">
          {showChat && latestAssistantMessage 
            ? latestAssistantMessage.content
            : displayed}
          {!showChat && displayed.length < text.length && (
            <span className="ml-1 inline-block h-5 w-0.5 align-[-0.15em] bg-cyan-300 animate-pulse" />
          )}
          {showChat && isLoading && (
            <span className="ml-1 inline-block h-5 w-0.5 align-[-0.15em] bg-cyan-300 animate-pulse" />
          )}
        </p>
      </div>

      {/* User Messages - Show when there are user messages */}
      {showChat && userMessages.length > 0 && (
        <div className="space-y-3">
          {userMessages.map((message) => (
            <div
              key={message.id}
              className="flex justify-end"
            >
              <div className="pointer-events-auto w-full max-w-[80%] rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md px-5 py-4 shadow-2xl shadow-black/30">
                <p className="text-base sm:text-lg text-gray-200 font-mono font-light leading-relaxed">
                  {message.content}
                </p>
                <span className="text-xs opacity-60 mt-2 block">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
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

      {/* Quick Suggestions - Show when no messages yet with staggered animation */}
      {!showChat && messages.length === 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {quickSuggestions.map((suggestion, index) => (
            <button
              key={suggestion.en}
              onClick={() => handleSuggestionClick(isEs ? suggestion.es : suggestion.en)}
              className={`text-xs bg-gray-700/30 hover:bg-gray-600/40 text-gray-300 hover:text-white px-3 py-2 rounded-lg border border-gray-600/30 transition-all duration-500 font-mono transform ${
                index < visibleButtons 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-2'
              }`}
              style={{
                transitionDelay: `${index * 100}ms`
              }}
            >
              {isEs ? suggestion.es : suggestion.en}
            </button>
          ))}
        </div>
      )}

      {/* Input del usuario - Show with animation after buttons */}
      <div className={`w-full transition-all duration-500 transform ${
        showInput || showChat 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4'
      }`}>
        <div className="flex gap-2">
          <input
            ref={chatInputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isEs ? "Pregúntame algo..." : "Ask me something..."}
            className="flex-1 rounded-xl border border-white/10 bg-black/30 backdrop-blur-md px-4 py-3 text-gray-200 placeholder-gray-400 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-xl transition-all duration-300"
            disabled={isLoading}
            maxLength={500}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="text-xs bg-cyan-600/40 hover:bg-cyan-500/50 text-cyan-200 hover:text-white px-4 py-3 rounded-lg border border-cyan-500/30 transition-all duration-300 font-mono disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '⏳' : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m22 2-7 20-4-9-9-4 20-7z"/>
                <path d="M22 2 11 13"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
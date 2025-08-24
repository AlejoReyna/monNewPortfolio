"use client";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/components/lang-context";
import { useChat } from "@/hooks/useChat";

const quickSuggestions = [
  { en: "About me", es: "Sobre mí" },
  { en: "Projects", es: "Proyectos" },
  { en: "Technologies", es: "Tecnologías" },
  { en: "Contact", es: "Contacto" },
];

// Frases tipo “Ask me something…”, en ambos idiomas
const inputPlaceholders = [
  { en: "Ask me something...", es: "Pregúntame algo..." },
  { en: "Ask about my projects...", es: "Pregunta por mis proyectos..." },
  { en: "Ask about my tech stack...", es: "Pregunta por mi stack..." },
  { en: "Ask for a quick bio...", es: "Pide una bio rápida..." },
  { en: "Ask what I'm working on...", es: "Pregunta en qué estoy trabajando..." },
  { en: "Ask for a code sample...", es: "Pide un ejemplo de código..." },
  { en: "Ask how I built this...", es: "Pregunta cómo hice esto..." },
  { en: "Ask for performance tips...", es: "Pide tips de performance..." },
  { en: "Ask for learning resources...", es: "Pide recursos para aprender..." },
  { en: "Ask for a project idea...", es: "Pide una idea de proyecto..." },
  { en: "Ask to review your code...", es: "Pide revisión de tu código..." },
  { en: "Ask for career highlights...", es: "Pregunta por logros de carrera..." },
];

export default function ChatInterface() {
  // Tomamos el contexto pero sin asumir que expone setLanguage (lo usamos opcionalmente)
  const langCtx = useLanguage() as any;
  const initialCtxLang: "en" | "es" = langCtx?.language === "es" ? "es" : "en";
  const setCtxLanguage: ((l: "en" | "es") => void) | undefined =
    typeof langCtx?.setLanguage === "function" ? langCtx.setLanguage : undefined;

  // Preferencias del usuario almacenadas localmente
  const [preferredLang, setPreferredLang] = useState<"en" | "es" | null>(null);
  const currentLang: "en" | "es" = preferredLang ?? initialCtxLang;
  const isEs = currentLang === "es";

  // --- Nombre de usuario (no GPT) ---
  const [userName, setUserName] = useState("");
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [nameInput, setNameInput] = useState("");

  // Cargar nombre e idioma al montar
  useEffect(() => {
    try {
      const savedName = typeof window !== "undefined" ? (localStorage.getItem("userName") || "").trim() : "";
      const savedLang = typeof window !== "undefined" ? localStorage.getItem("preferredLanguage") : null;

      if (savedLang === "en" || savedLang === "es") {
        setPreferredLang(savedLang);
        setCtxLanguage?.(savedLang);
      }

      if (savedName) setUserName(savedName);

      // Mostrar modal si falta nombre o idioma
      setShowNamePrompt(!(savedName && (savedLang === "en" || savedLang === "es")));
    } catch {
      setShowNamePrompt(true);
    }
  }, []);

  const confirmNameAndLang = () => {
    const trimmed = nameInput.trim();
    const langToSave: "en" | "es" = preferredLang ?? initialCtxLang;
    if (!trimmed || !langToSave) return;
    try {
      localStorage.setItem("userName", trimmed);
      localStorage.setItem("preferredLanguage", langToSave);
    } catch {}
    setUserName(trimmed);
    setPreferredLang(langToSave);
    setCtxLanguage?.(langToSave);
    setShowNamePrompt(false);
  };

  const handleNameKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      confirmNameAndLang();
    }
  };

  // --- Typewriter / UI inicial ---
  const [displayed, setDisplayed] = useState("");
  const [typewriterComplete, setTypewriterComplete] = useState(false);
  const [visibleButtons, setVisibleButtons] = useState(0);
  const [showInput, setShowInput] = useState(false);

  const baseGreeting = isEs
    ? "Hola, soy Alexis. Construyo experiencias web rápidas y cuidadas, y esta es una instancia potenciada por GPT de mí."
    : "Hi, I'm Alexis. I build fast, polished web experiences, and this is a GPT powered instance of me.";

  const text = userName
    ? isEs
      ? `${baseGreeting} ¿Cómo estás, ${userName}?`
      : `${baseGreeting} How are you, ${userName}?`
    : isEs
      ? `${baseGreeting} ¿Cómo estás?`
      : `${baseGreeting} How are you?`;

  // Chat (usa GPT, pero NO para el nombre)
  const [inputValue, setInputValue] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(
    isEs ? "Pregúntame algo..." : "Ask me something..."
  );
  const { messages, isLoading, error, sendMessage, isRateLimit } = useChat(userName);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  // Placeholder aleatorio según idioma
  useEffect(() => {
    const pool = inputPlaceholders.map((p) => (isEs ? p.es : p.en));
    const random = pool[Math.floor(Math.random() * pool.length)];
    setCurrentPlaceholder(random);
  }, [isEs]);

  // Typewriter solo mensaje inicial
  useEffect(() => {
    if (!showChat && !showNamePrompt) {
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
  }, [text, showChat, showNamePrompt]);

  // Mostrar botones uno por uno
  useEffect(() => {
    if (!showNamePrompt && typewriterComplete && !showChat && visibleButtons < quickSuggestions.length) {
      const timer = setTimeout(() => setVisibleButtons((prev) => prev + 1), 200);
      return () => clearTimeout(timer);
    }
  }, [typewriterComplete, visibleButtons, showChat, showNamePrompt]);

  // Mostrar input luego de los botones
  useEffect(() => {
    if (!showNamePrompt && typewriterComplete && !showChat && visibleButtons === quickSuggestions.length && !showInput) {
      const timer = setTimeout(() => setShowInput(true), 300);
      return () => clearTimeout(timer);
    }
  }, [typewriterComplete, visibleButtons, showChat, showNamePrompt, showInput]);

  // Reset animaciones al abrir chat
  useEffect(() => {
    if (showChat) {
      setVisibleButtons(quickSuggestions.length);
      setShowInput(true);
      setTypewriterComplete(true);
    }
  }, [showChat]);

  // Enviar mensaje
  const handleSendMessage = () => {
    if (!userName) {
      setShowNamePrompt(true);
      return;
    }
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue.trim());
      setInputValue("");
      if (!showChat) setShowChat(true);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!userName) {
      setShowNamePrompt(true);
      return;
    }
    sendMessage(suggestion);
    if (!showChat) setShowChat(true);
  };

  // Auto-scroll en chat
  useEffect(() => {
    if (messagesEndRef.current && showChat) {
      const chatContainer = messagesEndRef.current.closest(".overflow-y-auto");
      if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages, showChat]);

  // Enter en input de chat
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Último mensaje del asistente y lista de mensajes de usuario
  const latestAssistantMessage = messages.filter((m) => m.role === "assistant").pop();
  const userMessages = messages.filter((m) => m.role === "user");

  return (
    <div className="relative z-30 flex flex-col gap-4 px-4 w-full max-w-3xl mx-auto mb-20">
      {/* Modal para nombre e idioma (NO usa GPT) */}
      {showNamePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900/90 p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-white mb-2">
              {isEs ? "Personaliza tu experiencia" : "Personalize your experience"}
            </h2>

            <div className="mb-4">
              <p className="text-sm text-gray-300 mb-2">
                {isEs ? "¿Qué idioma prefieres?" : "Which language do you prefer?"}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPreferredLang("es")}
                  className={`text-xs px-4 py-2 rounded-lg border transition ${
                    currentLang === "es"
                      ? "border-cyan-500/30 bg-cyan-600/40 text-cyan-100"
                      : "border-gray-600/30 bg-gray-700/30 text-gray-200 hover:bg-gray-600/40"
                  }`}
                >
                  Español
                </button>
                <button
                  type="button"
                  onClick={() => setPreferredLang("en")}
                  className={`text-xs px-4 py-2 rounded-lg border transition ${
                    currentLang === "en"
                      ? "border-cyan-500/30 bg-cyan-600/40 text-cyan-100"
                      : "border-gray-600/30 bg-gray-700/30 text-gray-200 hover:bg-gray-600/40"
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            <label className="text-sm text-gray-300 mb-2 block">
              {isEs ? "¿Cómo te llamas?" : "What's your name?"}
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-gray-200 placeholder-gray-400 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder={isEs ? "Escribe tu nombre..." : "Type your name..."}
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={handleNameKey}
              autoFocus
              maxLength={60}
            />

            <div className="mt-4 flex gap-2 justify-end">
              <button
                onClick={() => setShowNamePrompt(false)}
                className="text-xs px-4 py-2 rounded-lg border border-gray-600/30 text-gray-300 hover:text-white hover:bg-gray-600/20 transition"
              >
                {isEs ? "Ahora no" : "Not now"}
              </button>
              <button
                onClick={confirmNameAndLang}
                disabled={!nameInput.trim() || !currentLang}
                className="text-xs px-4 py-2 rounded-lg border border-cyan-500/30 bg-cyan-600/40 text-cyan-200 hover:bg-cyan-500/50 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEs ? "Guardar" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cabecera / textbox principal */}
      <div className="pointer-events-auto w-full rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md px-5 py-6 shadow-2xl shadow-black/30">
        <p className="relative text-base sm:text-lg text-gray-200 font-mono font-light leading-relaxed">
          {showChat && latestAssistantMessage ? latestAssistantMessage.content : displayed}
          {!showChat && !showNamePrompt && displayed.length < text.length && (
            <span className="ml-1 inline-block h-5 w-0.5 align-[-0.15em] bg-cyan-300 animate-pulse" />
          )}
          {showChat && isLoading && (
            <span className="ml-1 inline-block h-5 w-0.5 align-[-0.15em] bg-cyan-300 animate-pulse" />
          )}
        </p>
      </div>

      {/* Mensajes del usuario */}
      {showChat && userMessages.length > 0 && (
        <div className="space-y-3">
          {userMessages.map((message) => (
            <div key={message.id} className="flex justify-end">
              <div className="pointer-events-auto w-full max-w-[80%] rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md px-5 py-4 shadow-2xl shadow-black/30">
                <p className="text-base sm:text-lg text-gray-200 font-mono font-light leading-relaxed">
                  {message.content}
                </p>
                <span className="text-xs opacity-60 mt-2 block">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Error */}
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

      {/* Sugerencias rápidas */}
      {!showNamePrompt && !showChat && messages.length === 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {quickSuggestions.map((suggestion, index) => (
            <button
              key={suggestion.en}
              onClick={() => handleSuggestionClick(isEs ? suggestion.es : suggestion.en)}
              className={`text-xs bg-gray-700/30 hover:bg-gray-600/40 text-gray-300 hover:text-white px-3 py-2 rounded-lg border border-gray-600/30 transition-all duration-500 font-mono transform ${
                index < visibleButtons ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {isEs ? suggestion.es : suggestion.en}
            </button>
          ))}
        </div>
      )}

      {/* Input del chat */}
      <div
        className={`w-full transition-all duration-500 transform ${
          (showInput || showChat) && !showNamePrompt ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="flex gap-2">
          <input
            ref={chatInputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={currentPlaceholder || (isEs ? "Pregúntame algo..." : "Ask me something...")}
            className="flex-1 rounded-xl border border-white/10 bg-black/30 backdrop-blur-md px-4 py-3 text-gray-200 placeholder-gray-400 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-xl transition-all duration-300"
            disabled={isLoading || showNamePrompt}
            maxLength={500}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading || showNamePrompt || !userName}
            className="text-xs bg-cyan-600/40 hover:bg-cyan-500/50 text-cyan-200 hover:text-white px-4 py-3 rounded-lg border border-cyan-500/30 transition-all duration-300 font-mono disabled:opacity-50 disabled:cursor-not-allowed"
            aria-disabled={!userName}
            title={!userName ? (isEs ? "Primero escribe tu nombre" : "Please enter your name first") : undefined}
          >
            {isLoading ? (
              "⏳"
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m22 2-7 20-4-9-9-4 20-7z" />
                <path d="M22 2 11 13" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
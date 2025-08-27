"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import type React from "react";
import { useLanguage } from "@/components/lang-context";
import { useChat } from "@/hooks/useChat";

/* ========= TypewriterText Component ========= */
type TypewriterTextProps = {
  text: string;
  className?: string;
  speed?: number;
  onComplete?: () => void;
};

function TypewriterText({ text, className = "", speed = 50, onComplete }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (currentIndex === text.length && onComplete) {
      // Llamar onComplete cuando termine de escribir
      const timer = setTimeout(onComplete, 1000); // Esperar 1 segundo después de terminar
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed, onComplete]);

  useEffect(() => {
    // Reset when text changes
    setDisplayedText("");
    setCurrentIndex(0);
  }, [text]);

  return (
    <p className={className}>
      {displayedText}
    </p>
  );
}

import { alexisData, getRandomMusicArtist, getRandomTech } from "./data/user-data";
import {
  detectEnhancedIntent,
  buildEnhancedHint,
  ENHANCED_SUGGESTIONS,
  ENHANCED_PLACEHOLDERS,
} from "./data/chat-enhancements";

type Lang = "en" | "es";
type Intent =
  | "casual"
  | "work"
  | "about"
  | "projects"
  | "contact"
  | "music"
  | "travel"
  | "tech";
type Suggestion = { en: string; es: string; intent: Intent };

/* ========= Utils ========= */
const getRandomSuggestions = (all: Suggestion[], count = 5) =>
  [...all].sort(() => 0.5 - Math.random()).slice(0, count);
const suggestions: Suggestion[] = getRandomSuggestions(ENHANCED_SUGGESTIONS, 5);

/* ========= Easter Egg (resumido, igual que antes) ========= */
const EASTER_GIBBERISH_ES = ["weuhruqw wefhuqsbdchja scuwqe hfqusdncu"];
const EASTER_GIBBERISH_EN = ["weuhruqw wefhuqsbdchja scuwqe hfqusdncu"];
const buildEasterFull = (seed: string) =>
  Array.from({ length: 80 })
    .map((_, i) => (i % 5 === 4 ? `${seed}\n` : `${seed} `))
    .join("");

/* ========= Intents & Hints ========= */
const HINT_START = "[[SYS]]";
const HINT_END = "[[/SYS]]";
const deriveIntent = detectEnhancedIntent;
const buildHint = (intent: Intent, lang: Lang, userText: string) =>
  buildEnhancedHint(intent, lang, userText);
const stripHintFromUserMessage = (raw: unknown) => {
  const text = (raw ?? "").toString();
  if (text.startsWith(HINT_START)) {
    const end = text.indexOf(HINT_END);
    if (end !== -1) {
      let out = text.slice(end + HINT_END.length);
      if (out.startsWith("\r\n")) out = out.slice(2);
      else if (out.startsWith("\n")) out = out.slice(1);
      return out;
    }
  }
  return text;
};

export default function ChatInterface() {
  const langCtx = useLanguage();
  const initialCtxLang: Lang = langCtx?.language === "es" ? "es" : "en";
  const setCtxLanguage = useCallback(
    (l: Lang) => {
      if (l !== langCtx.language) langCtx.toggleLanguage();
    },
    [langCtx]
  );

  /* ========= Estado base ========= */
  const [preferredLang, setPreferredLang] = useState<Lang | null>(null);
  const currentLang: Lang = preferredLang ?? initialCtxLang;
  const isEs = currentLang === "es";

  const [userName, setUserName] = useState("");
  const [showNamePrompt, setShowNamePrompt] = useState(false);

  // Overlays/column-left flow
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeOpacity, setWelcomeOpacity] = useState(0);
  const [showNameStep, setShowNameStep] = useState(false);
  const [nameOpacity, setNameOpacity] = useState(0);
  const [showLangStep, setShowLangStep] = useState(false);
  const [langOpacity, setLangOpacity] = useState(0);

  // Nombre (antes de idioma)
  const [showNameInput, setShowNameInput] = useState(false);
  const [nameInputOpacity, setNameInputOpacity] = useState(0);
  const [nameInput, setNameInput] = useState("");

  // Chat
  const { messages, isLoading, error, sendMessage, isRateLimit } = useChat(userName);
  const [showChat, setShowChat] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(
    isEs ? "Pregúntame algo..." : "Ask me something..."
  );
  const [inputValue, setInputValue] = useState("");

  const rootRef = useRef<HTMLDivElement>(null);
  const [chatHeightPx, setChatHeightPx] = useState<number | undefined>();
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const h = entries[0].contentRect.height || el.clientHeight;
      setChatHeightPx(Math.max(300, Math.floor(h * 0.75)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ========= Load persisted ========= */
  useEffect(() => {
    try {
      const savedName =
        typeof window !== "undefined"
          ? (localStorage.getItem("userName") || "").trim()
          : "";
      const savedLang =
        typeof window !== "undefined"
          ? (localStorage.getItem("preferredLanguage") as Lang | null)
          : null;

      if (savedLang === "en" || savedLang === "es") {
        setPreferredLang(savedLang);
        setCtxLanguage?.(savedLang);
      }
      if (savedName) setUserName(savedName);

      const needsSetup = !(savedName && (savedLang === "en" || savedLang === "es"));
      setShowNamePrompt(needsSetup);

      // Flow inicial:
      if (needsSetup) {
        // 1) Welcome (columna izquierda)
        setShowWelcome(true);
        requestAnimationFrame(() => setWelcomeOpacity(1));
        const t1 = setTimeout(() => setWelcomeOpacity(0), 1400);
        const t2 = setTimeout(() => {
          setShowWelcome(false);
          // 2) Language step en columna izquierda (con interacción)
          setShowLangStep(true);
          requestAnimationFrame(() => setLangOpacity(1));
        }, 2100);
        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
        };
      } else {
        // Si ya hay datos, directo al chat
        setShowChat(true);
      }
    } catch {
      setShowNamePrompt(true);
      setShowWelcome(true);
      requestAnimationFrame(() => setWelcomeOpacity(1));
    }
  }, [setCtxLanguage]);

  // Placeholders dinámicos
  const pickPlaceholder = useCallback(() => {
    const pool = ENHANCED_PLACEHOLDERS[isEs ? "es" : "en"];
    setCurrentPlaceholder(pool[Math.floor(Math.random() * pool.length)]);
  }, [isEs]);
  useEffect(() => { pickPlaceholder(); }, [pickPlaceholder]);

  // Messages end ref para autoscroll
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  /* ========= Handlers ========= */
  const handleLanguageSelection = (lang: Lang) => {
    setPreferredLang(lang);
    setCtxLanguage?.(lang);

    // Fade-out del bloque de idioma y continuar a nombre
    setLangOpacity(0);
    setTimeout(() => {
      setShowLangStep(false);
      setShowNameStep(true);
      requestAnimationFrame(() => setNameOpacity(1));
    }, 350);
  };

  const handleNameStepComplete = () => {
    // Mostrar el input con fade in
    setShowNameInput(true);
    requestAnimationFrame(() => setNameInputOpacity(1));
  };

  const handleNameSubmit = () => {
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    setUserName(trimmed);
    
    // Guardar datos y continuar al chat
    const langToSave: Lang = preferredLang ?? initialCtxLang;
    try {
      localStorage.setItem("userName", trimmed);
      localStorage.setItem("preferredLanguage", langToSave);
    } catch {}
    
    // Ocultar todo el step de nombre y continuar al chat
    setNameOpacity(0);
    setNameInputOpacity(0);
    setTimeout(() => {
      setShowNameStep(false);
      setShowNameInput(false);
      setShowNamePrompt(false);
      setShowChat(true);
    }, 350);
  };



  const handleNameKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleNameSubmit();
    }
  };

  const handleSendMessage = () => {
    const raw = inputValue.trim();
    if (!raw || isLoading) return;
    if (!userName) return setShowNamePrompt(true);
    const intent = deriveIntent(raw, currentLang);
    const payload = buildHint(intent, currentLang, raw) + "\n" + raw;
    sendMessage(payload);
    setInputValue("");
    if (!showChat) setShowChat(true);
    pickPlaceholder();
  };

  /* ========= EARLY RETURN: mientras Welcome/Language/Name están activos ========= */
  if (showWelcome || showLangStep || showNameStep || showNameInput) {
    return (
      <div
        ref={rootRef}
        className="relative flex flex-col items-center justify-center gap-6 px-4 w-full max-w-3xl mx-auto mb-20 min-h-screen"
      >
        {/* Columna centrada */}
        <div className="flex flex-col items-center text-center">
          {/* Welcome (solo texto grande, fade) */}
          {showWelcome && (
            <h1
              className={`transition-opacity duration-700 ease-out ${
                welcomeOpacity ? "opacity-100" : "opacity-0"
              } text-5xl md:text-7xl font-mono font-light text-white/90`}
            >
              {currentLang === "es" ? "¡Bienvenido!" : "Welcome!"}
            </h1>
          )}

          {/* Language (texto + botones, con interacción) */}
          {showLangStep && (
            <div
              className={`transition-opacity duration-500 ease-out ${
                langOpacity ? "opacity-100" : "opacity-0"
              }`}
            >
              <TypewriterText 
                text="Which language do you prefer?"
                className="mt-6 text-2xl md:text-4xl font-mono font-light text-white/90"
              />
              <div className="mt-5 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => handleLanguageSelection("es")}
                  className="text-xs font-mono font-light px-4 py-2 rounded-lg border transition-all duration-300 border-gray-600/30 bg-gray-700/30 text-gray-200 hover:bg-gray-600/40"
                >
                  Español
                </button>
                <button
                  type="button"
                  onClick={() => handleLanguageSelection("en")}
                  className="text-xs font-mono font-light px-4 py-2 rounded-lg border transition-all duration-300 border-gray-600/30 bg-gray-700/30 text-gray-200 hover:bg-gray-600/40"
                >
                  English
                </button>
              </div>
            </div>
          )}

          {/* Name Step (texto con typewriter + input) */}
          {showNameStep && (
            <div
              className={`transition-opacity duration-500 ease-out ${
                nameOpacity ? "opacity-100" : "opacity-0"
              } flex flex-col items-center`}
            >
              <TypewriterText 
                text="What's your name?"
                className="mt-6 text-2xl md:text-6xl font-mono font-light text-white/90 mb-8"
                onComplete={handleNameStepComplete}
              />
              
              {/* Name Input aparece debajo del texto */}
              {showNameInput && (
                <div 
                  className={`flex flex-col items-center w-full transition-opacity duration-500 ease-out ${
                    nameInputOpacity ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {/* Input y botón en la misma línea - ancho completo */}
                  <div className="flex items-center w-full max-w-4xl gap-3">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        className="w-full bg-transparent border-none border-b-2 border-white/70 focus:border-cyan-400 outline-none px-0 py-3 text-xl text-white placeholder-gray-400 font-mono transition-all duration-300"
                        placeholder={currentLang === "es" ? "Escribe tu nombre..." : "Type your name..."}
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        onKeyDown={handleNameKey}
                        maxLength={60}
                        autoFocus
                      />
                    </div>
                    
                    {/* Button al lado del input */}
                    <button
                      onClick={handleNameSubmit}
                      disabled={!nameInput.trim()}
                      className="text-sm font-mono font-light px-4 py-2 rounded-lg border border-cyan-500/30 bg-cyan-600/40 text-cyan-200 hover:bg-cyan-500/50 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      →
                    </button>
                  </div>
                  
                  {/* Disclaimer reactivo al idioma */}
                  <p className="text-xs text-gray-400 mt-3 text-center font-mono">
                    {currentLang === "es" 
                      ? "Estos datos son sólo almacenados en tu navegador. " 
                      : "This data is only stored in your browser. "}
                    <button className="text-cyan-400 hover:text-cyan-300 underline transition-colors">
                      {currentLang === "es" ? "Ver más" : "See more"}
                    </button>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>


      </div>
    );
  }

  /* ========= UI normal del chat (ya sin la burbuja de la imagen) ========= */
  const sorted = [...messages].sort((a, b) => +a.timestamp - +b.timestamp);

  return (
    <div
      ref={rootRef}
      className="relative z-10 flex flex-col gap-4 px-4 w-full max-w-3xl mx-auto mb-20"
    >
      {/* Ventana de chat (el contenedor clásico solo se monta después) */}
      {(sorted.length > 0 || showChat) && (
        <div
          className="relative w-full rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md shadow-2xl shadow-black/30 overflow-y-auto"
          style={{
            height: chatHeightPx ? `${chatHeightPx}px` : undefined,
            maxHeight: chatHeightPx ? `${chatHeightPx}px` : undefined,
          }}
        >
          <div className="p-4 space-y-3">
            {sorted.map((m) => {
              const isUser = m.role === "user";
              const key = (m.id ?? String(+m.timestamp)) as string;
              const content = isUser
                ? stripHintFromUserMessage(m.content)
                : (m.content ?? "");
              return (
                <div
                  key={key}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`pointer-events-auto w-full max-w-[80%] rounded-2xl px-5 py-4 border ${
                      isUser
                        ? "bg-black/40 border-white/10"
                        : "bg-zinc-800/60 border-white/10"
                    }`}
                  >
                    <p className="text-base sm:text-lg text-gray-200 font-mono font-light leading-relaxed whitespace-pre-wrap">
                      {content}
                    </p>
                    <span className="text-xs opacity-60 mt-2 block">
                      {m.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="flex justify-start">
                <div className="pointer-events-auto w-full max-w-[80%] rounded-2xl px-5 py-4 border bg-zinc-800/60 border-white/10">
                  <p className="text-base sm:text-lg text-gray-200 font-mono font-light leading-relaxed">
                    ▍
                  </p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-500/20 border border-red-400/30 text-red-200 p-3 rounded-xl font-mono text-sm">
          <p>{error}</p>
          {isRateLimit && (
            <p className="text-xs mt-2 opacity-80">
              ⏳ {isEs
                ? "Rate limit alcanzado. Intenta en unos segundos."
                : "Rate limit reached. Try in a few seconds."}
            </p>
          )}
        </div>
      )}

      {/* Input */}
      <div className="w-full">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={
              currentPlaceholder || (isEs ? "Pregúntame algo..." : "Ask me something...")
            }
            className="flex-1 rounded-xl border border-white/10 bg-black/30 backdrop-blur-md px-4 py-3 text-gray-200 placeholder-gray-400 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-xl transition-all duration-300"
            disabled={isLoading || !showChat}
            maxLength={500}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading || !showChat || !userName}
            className="text-xs bg-cyan-600/40 hover:bg-cyan-500/50 text-cyan-200 hover:text-white px-4 py-3 rounded-lg border border-cyan-500/30 transition-all duration-300 font-mono disabled:opacity-50 disabled:cursor-not-allowed"
            aria-disabled={!userName}
          >
            {isLoading ? "⏳" : (
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
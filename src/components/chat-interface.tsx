"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import type React from "react";
import { useLanguage } from "@/components/lang-context";
import { useChat } from "@/hooks/useChat";

// Removed unused TypewriterText component and its props type

/* ========= Loading Spinner Component ========= */
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center p-1">
      <div className="relative w-4 h-4">
        <div className="absolute inset-0 rounded-full border-2 border-orange-400/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-orange-400 animate-spin" />
        <div className="absolute inset-1 rounded-full border border-orange-300/40" />
      </div>
    </div>
  );
}

// Removed unused imports: alexisData, getRandomMusicArtist, getRandomTech
// Debug imports
import {
  detectEnhancedIntent,
  buildEnhancedHint,
  ENHANCED_SUGGESTIONS,
  ENHANCED_PLACEHOLDERS,
} from "./data/chat-enhancements";

console.log("Imported ENHANCED_PLACEHOLDERS:", ENHANCED_PLACEHOLDERS);

type Lang = "en" | "es";
type Intent = "casual" | "work" | "about" | "projects" | "contact" | "music" | "travel" | "tech";
type Suggestion = { en: string; es: string; intent: Intent };

/* ========= Utils ========= */
const getRandomSuggestions = (all: Suggestion[], count = 5) =>
  [...all].sort(() => 0.5 - Math.random()).slice(0, count);

/* ========= Easter Egg (resumido, igual que antes) ========= */
// Removed unused easter egg variables: EASTER_GIBBERISH_ES, EASTER_GIBBERISH_EN, buildEasterFull

/* ========= Intents & Hints ========= */
const HINT_START = "[[SYS]]";
const HINT_END = "[[/SYS]]";
const deriveIntent = detectEnhancedIntent;
const buildHint = (intent: Intent, lang: Lang) =>
  buildEnhancedHint(intent, lang);
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

  // Removed unused overlay state variables: showWelcome, setShowWelcome, welcomeOpacity, setWelcomeOpacity, 
  // showNameStep, setNameOpacity, showLangStep, langOpacity, showNameInput, nameInputOpacity, setNameInput

  // Chat
  const { messages, isLoading, error, sendMessage, isRateLimit } = useChat(userName);
  const [showChat, setShowChat] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(
    isEs ? "Pregúntame algo..." : "Ask me something..."
  );
  console.log("showChat:", showChat);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  // Removed unused pendingUserText state

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
        typeof window !== "undefined" ? (localStorage.getItem("userName") || "").trim() : "";
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

      if (!needsSetup) {
        setShowChat(true);
      }
    } catch {
      setShowNamePrompt(true);
    }
  }, [setCtxLanguage]);

  // Placeholders dinámicos
  const pickPlaceholder = useCallback(() => {
    const pool = ENHANCED_PLACEHOLDERS[isEs ? "es" : "en"];
    const randomIndex = Math.floor(Math.random() * pool.length);
    const newPlaceholder = pool[randomIndex];
    console.log("New placeholder:", newPlaceholder);
    setCurrentPlaceholder(newPlaceholder);
  }, [isEs]);

  useEffect(() => {
    console.log("Setting up placeholder effect");
    pickPlaceholder();
    const interval = setInterval(pickPlaceholder, 5000);
    return () => clearInterval(interval);
  }, [pickPlaceholder]);

  // Initialize suggestions on client side to prevent hydration mismatch
  useEffect(() => {
    setSuggestions(getRandomSuggestions(ENHANCED_SUGGESTIONS, 5));
  }, []);

  // Messages end ref para autoscroll
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  /* ========= Handlers ========= */
  // Removed unused handlers: handleLanguageSelection, handleNameStepComplete

  // Removed unused handlers: handleNameSubmit, handleNameKey (these were for name input functionality that's not being used)

  const handleSendMessage = () => {
    const raw = inputValue.trim();
    if (!raw || isLoading) return;
    if (!userName) {
      const autoName = isEs ? "Amigo" : "Guest";
      setUserName(autoName);
      try {
        localStorage.setItem("userName", autoName);
      } catch {}
      setShowNamePrompt(false);
      setShowChat(true);
    }
    const intent = deriveIntent(raw, currentLang);
    const payload = buildHint(intent, currentLang) + "\n" + raw;
    sendMessage(payload);
    setInputValue("");
    if (!showChat) setShowChat(true);
    pickPlaceholder();
  };

  const handleSuggestionClick = (text: string, intent: Intent) => {
    if (isLoading) return;
    if (!userName) {
      const autoName = isEs ? "Amigo" : "Guest";
      setUserName(autoName);
      try {
        localStorage.setItem("userName", autoName);
      } catch {}
      setShowNamePrompt(false);
      setShowChat(true);
    }
    const payload = buildHint(intent, currentLang) + "\n" + text;
    sendMessage(payload);
    if (!showChat) setShowChat(true);
    pickPlaceholder();
  };

  /* ========= Intro text (portada) ========= */
  const [displayed, setDisplayed] = useState("");
  const [typewriterComplete, setTypewriterComplete] = useState(false);
  const [visibleButtons, setVisibleButtons] = useState(0);
  const [showInput, setShowInput] = useState(false);

  const greetings = [
    {
      en: "Hey there! I'm Alexis. I code things that live on the internet, and this GPT version of me is here to chat.",
      es: "¡Hey! Soy Alexis. Programo cosas que viven en internet, y esta versión GPT de mí está aquí para charlar.",
    },
    {
      en: "Hi, I'm Alexis. Web developer by day, debugging wizard by night. This is my AI twin.",
      es: "Hola, soy Alexis. Desarrollador web de día, mago del debugging de noche. Este es mi gemelo AI.",
    },
    {
      en: "Hello! Alexis here. I turn coffee into code, and this GPT knows most of my tricks.",
      es: "¡Hola! Alexis aquí. Convierto café en código, y este GPT conoce la mayoría de mis trucos.",
    },
    {
      en: "Hey, I'm Alexis. I make pixels dance on screens, powered by GPT magic.",
      es: "Hey, soy Alexis. Hago que los píxeles bailen en pantallas, con magia GPT.",
    },
  ];

  const [greetingIndex, setGreetingIndex] = useState(0);

  useEffect(() => {
    setGreetingIndex(Math.floor(Math.random() * greetings.length));
  }, [greetings.length]);

  const baseGreeting = isEs ? greetings[greetingIndex].es : greetings[greetingIndex].en;
  const text = userName
    ? isEs
      ? `${baseGreeting} ¿Cómo estás, ${userName}?`
      : `${baseGreeting} How are you, ${userName}?`
    : isEs
    ? `${baseGreeting} ¿Cómo estás?`
    : `${baseGreeting} How are you?`;

  useEffect(() => {
    if (!showChat) {
      let i = 0;
      setDisplayed("");
      setTypewriterComplete(false);
      const id = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(id);
          setTypewriterComplete(true);
        }
      }, 40);
      return () => clearInterval(id);
    }
  }, [text, showChat]);

  useEffect(() => {
    if (!showNamePrompt && typewriterComplete && !showChat && visibleButtons < suggestions.length) {
      const timer = setTimeout(() => setVisibleButtons((p) => p + 1), 200);
      return () => clearTimeout(timer);
    }
  }, [typewriterComplete, visibleButtons, showChat, showNamePrompt, suggestions.length]);

  useEffect(() => {
    if (!showNamePrompt && typewriterComplete && !showChat && visibleButtons === suggestions.length && !showInput) {
      const timer = setTimeout(() => setShowInput(true), 300);
      return () => clearTimeout(timer);
    }
  }, [typewriterComplete, visibleButtons, showChat, showNamePrompt, showInput, suggestions.length]);

  /* ========= UI normal del chat ========= */
  const sorted = [...messages].sort((a, b) => +a.timestamp - +b.timestamp);

  return (
    <div ref={rootRef} className="relative z-10 flex flex-col px-0 lg:px-4 w-full max-w-3xl mx-auto mb-0 lg:mb-12 h-full lg:h-auto">
      {/* Terminal unificada */}
      <div className="pointer-events-auto w-full rounded-lg border border-orange-500/30 bg-black/30 backdrop-blur-md shadow-2xl shadow-orange-500/10 overflow-hidden max-h-[35vh] lg:h-auto flex flex-col">
        {/* Terminal header */}
        <div
          className="flex items-center justify-between px-4 py-3 bg-black/40 border-b border-orange-500/30 cursor-move"
          data-drag-handle
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 border border-red-600" />
            <div className="w-3 h-3 rounded-full bg-yellow-500 border border-yellow-600" />
            <div className="w-3 h-3 rounded-full bg-green-500 border border-green-600" />
          </div>
          <div className="text-xs text-gray-300 font-mono">admin — alexis@portfolio — ~ — zsh — 80x24</div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-orange-400 font-mono">●</div>
          </div>
        </div>

        {/* Contenido de la terminal */}
        <div className="p-2 lg:p-4 flex-1 flex flex-col overflow-hidden">
          {/* Mensaje inicial o última línea de login */}
          <div className="text-xs text-gray-500 font-mono mb-2">
            Last login: {new Date().toDateString()} {new Date().toTimeString().split(" ")[0]} on ttys009
          </div>

          {/* Portada (misma línea con el $, envuelve debajo si falta ancho) */}
          {!showChat && (
            <div className="mb-4 font-mono text-[13px] leading-6">
              <span className="text-green-400">➜</span>
              <span className="text-blue-400 ml-2">~</span>
              <span className="text-orange-400 ml-2">alexis@portfolio:</span>
              <span className="text-blue-400">~</span>
              <span className="text-orange-400">$</span>
              <span className="text-gray-100 ml-2">
                {displayed || text}
                {!showNamePrompt && displayed.length < text.length && (
                  <span className="ml-1 inline-block h-4 w-0.5 align-[-0.15em] bg-gray-300 animate-pulse" />
                )}
              </span>
            </div>
          )}

          {/* Chat messages */}
          {(sorted.length > 0 || showChat) && (
            <div
              className="space-y-4 overflow-y-auto mb-4 flex-1 lg:flex-initial"
              style={{
                height: chatHeightPx ? `${chatHeightPx - 120}px` : "400px",
                maxHeight: chatHeightPx ? `${chatHeightPx - 120}px` : "400px",
              }}
            >
              {sorted.map((m) => {
                const isUser = m.role === "user";
                const key = (m.id ?? String(+m.timestamp)) as string;
                const content = isUser ? stripHintFromUserMessage(m.content) : m.content ?? "";
                return (
                  <div key={key} className="font-mono text-[13px] leading-6 animate-fadeIn">
                    {isUser ? (
                      // Usuario - estilo comando de terminal con wrap correcto
                      <div className="mb-2">
                        <div className="text-[13px]">
                          <span className="text-green-400">➜</span>
                          <span className="text-blue-400 ml-2">~</span>
                          <span className="text-orange-400 ml-2">alexis@portfolio:</span>
                          <span className="text-blue-400">~</span>
                          <span className="text-orange-400">$</span>
                          <span className="text-gray-100 ml-2">{content}</span>
                        </div>
                        <div className="text-[11px] text-gray-500 mt-1">
                          {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    ) : (
                      // Respuesta del sistema
                      <div className="mb-2">
                        <div className="text-gray-100 bg-black/10 rounded p-3 border-l-4 border-orange-500 text-[13px] leading-6">
                          {content}
                        </div>
                        <div className="text-[11px] text-gray-500 mt-1">
                          {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {isLoading && (
                <div className="font-mono text-[13px] animate-fadeIn">
                  <div className="text-gray-100 bg-black/10 rounded p-3 border-l-4 border-orange-500 flex items-center gap-3">
                    <LoadingSpinner />
                    <span>Procesando respuesta...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-black/30 border-l-4 border-red-500 text-red-100 p-4 rounded font-mono text-[13px] animate-fadeIn mb-4">
              <div className="flex items-center text-[13px] mb-2">
                <span className="text-green-400">➜</span>
                <span className="text-blue-400 ml-2">~</span>
                <span className="text-red-400 ml-2">alexis@portfolio:</span>
                <span className="text-blue-400">~</span>
                <span className="text-red-400">$</span>
                <span className="text-red-300 ml-2">error</span>
              </div>
              <div className="ml-6">
                <p className="text-red-200">bash: {error}</p>
                {isRateLimit && (
                  <p className="text-xs mt-2 opacity-80 text-red-300">
                    {isEs ? "Límite de velocidad alcanzado. Intenta en unos segundos..." : "Rate limit reached. Try in a few seconds..."}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Sugerencias antes de iniciar chat */}
          {!showNamePrompt && !showChat && sorted.length === 0 && (
            <div className="space-y-2 mb-4">
              <div className="text-xs text-gray-400 font-mono mb-3">Comandos disponibles:</div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s, index) => (
                  <button
                    key={s.en}
                    onClick={() => handleSuggestionClick(isEs ? s.es : s.en, s.intent)}
                    className={`text-xs bg-black/20 hover:bg-orange-900/30 text-gray-300 hover:text-orange-200 px-3 py-2 rounded border border-orange-500/30 hover:border-orange-400/60 transition-all duration-300 font-mono transform hover:scale-105 ${
                      index < visibleButtons ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    ./{isEs ? s.es.replace(/\s+/g, "_").toLowerCase() : s.en.replace(/\s+/g, "_").toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input - siempre al final */}
          <div className="border-t border-orange-500/20 pt-3 shrink-0">
            <div className="flex items-center font-mono text-[13px]">
              <span className="text-blue-400 ml-2">~</span>

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
                placeholder={currentPlaceholder || (isEs ? "Pregúntame algo..." : "Ask me something...")}
                onFocus={() => {
                  console.log("Input focus - States:", {
                    showChat,
                    isLoading,
                    currentPlaceholder,
                    isDisabled: isLoading,
                  });
                }}
                className="flex-1 bg-transparent text-gray-100 placeholder-gray-400 font-mono text-[13px] focus:outline-none disabled:opacity-50 caret-gray-300 ml-2"
                disabled={isLoading}
                maxLength={500}
              />

              {isLoading && (
                <div className="ml-2">
                  <LoadingSpinner />
                </div>
              )}
            </div>

            {/* Terminal status line */}
            <div className="flex justify-between items-center mt-1 text-xs text-gray-500 font-mono">
              <span>{inputValue.length}/500</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
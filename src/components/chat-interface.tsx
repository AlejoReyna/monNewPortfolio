"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import type React from "react";
import { useLanguage } from "@/components/lang-context";
import { useChat } from "@/hooks/useChat";

type Lang = "en" | "es";
type Intent = "casual" | "work";
type Suggestion = { en: string; es: string; intent: Intent };

/* ========= Sugerencias/Prompts (NO reducidas) ========= */
const suggestions: Suggestion[] = [
  { en: "Music you're into lately", es: "Música que escuchas últimamente", intent: "casual" },
  { en: "Movies or series you loved", es: "Películas o series que te gustaron", intent: "casual" },
  { en: "A trip you'd like to take", es: "Un viaje que te gustaría hacer", intent: "casual" },
  { en: "Hobbies or free-time stuff", es: "Hobbies o cosas de tu tiempo libre", intent: "casual" },
  { en: "Projects", es: "Proyectos", intent: "work" },
  { en: "Technologies", es: "Tecnologías", intent: "work" },
  { en: "About me", es: "Sobre mí", intent: "work" },
  { en: "Contact", es: "Contacto", intent: "work" },
];

const inputPlaceholders = [
  { en: "What's on your mind?", es: "¿Qué tienes en mente?" },
  { en: "Hit me with your best question...", es: "Dale con tu mejor pregunta..." },
  { en: "Let's talk code (or anything else)...", es: "Hablemos de código (o lo que sea)..." },
  { en: "Curious about something?", es: "¿Curioso por algo?" },
  { en: "Type away, I don't bite...", es: "Escribe tranquilo, no muerdo..." },
  { en: "What would you like to know?", es: "¿Qué te gustaría saber?" },
  { en: "Got a tech question? Or just wanna chat?", es: "¿Pregunta técnica? ¿O solo charlar?" },
  { en: "Fire away with your questions...", es: "Dispara tus preguntas..." },
  { en: "Let's geek out together...", es: "Hagamos nerdismo juntos..." },
  { en: "Ask me anything (within reason)...", es: "Pregunta lo que sea (dentro de lo razonable)..." },
  { en: "Your question, my attempt at wisdom...", es: "Tu pregunta, mi intento de sabiduría..." },
  { en: "What can this digital me help with?", es: "¿En qué puede ayudar este yo digital?" },
  { en: "Ready when you are...", es: "Listo cuando tú lo estés..." },
  { en: "Drop your question here...", es: "Suelta tu pregunta aquí..." },
  { en: "Let's build something cool together...", es: "Construyamos algo cool juntos..." },
  { en: "Coffee break chat? I'm here...", es: "¿Chat de coffee break? Aquí estoy..." },
  { en: "What brings you here today?", es: "¿Qué te trae por aquí hoy?" },
  { en: "Penny for your thoughts?", es: "¿Un centavo por tus pensamientos?" },
];

/* ========= Detección de intención ========= */
const WORK_EN = ["project","portfolio","resume","cv","hire","job","work","code","coding","programming","developer","stack","react","next","typescript","node","api","deploy","github","experience","tech","technology"];
const WORK_ES = ["proyecto","portafolio","currículum","curriculum","cv","contratar","empleo","trabajo","código","codigo","programación","desarrollador","stack","react","next","typescript","node","api","deploy","github","experiencia","tecnología","tecnologias"];
const GREET_EN = ["hi","hello","hey","how are you","i'm fine","and you","good morning","good evening","what's up"];
const GREET_ES = ["hola","buenas","¿cómo estás","como estas","estoy bien","¿y tú","y tu","qué tal","que tal"];

const isWorky = (t: string, lang: Lang) => (lang === "es" ? WORK_ES : WORK_EN).some(k => t.includes(k));
const isGreetingish = (t: string, lang: Lang) => (lang === "es" ? GREET_ES : GREET_EN).some(g => t.includes(g)) && t.length <= 120;

const deriveIntent = (text: string, lang: Lang): Intent => {
  const t = text.toLowerCase();
  if (isWorky(t, lang)) return "work";
  if (isGreetingish(t, lang)) return "casual";
  return "casual";
};

/* ========= Hints ocultos ========= */
const HINT_START = "[[SYS]]";
const HINT_END = "[[/SYS]]";

const buildHint = (intent: Intent, lang: Lang) => {
  if (intent === "casual") {
    return lang === "es" ? `${HINT_START}
Modo: CASUAL (ES)
- Responde ESTRICTAMENTE en español.
- Tono cálido y ligero; no menciones trabajo salvo que el usuario lo pida.
- 1–2 oraciones, 25–40 palabras máx.
- UNA pregunta abierta O UNA sugerencia breve.
${HINT_END}` : `${HINT_START}
Mode: CASUAL (EN)
- Respond STRICTLY in English.
- Warm, light tone; do not mention work unless the user asks.
- 1–2 sentences, 25–40 words max.
- ONE open-ended question OR ONE brief suggestion.
${HINT_END}`;
  }
  return lang === "es" ? `${HINT_START}
Modo: WORK (ES)
- Español, claro y conciso, enfocado a lo que el usuario pida.
${HINT_END}` : `${HINT_START}
Mode: WORK (EN)
- English, clear and concise, focused on what the user asks.
${HINT_END}`;
};

const withHint = (userText: string, intent: Intent, lang: Lang) => `${buildHint(intent, lang)}\n${userText.trim()}`;

// Remueve solo el bloque [[SYS]]...[[/SYS]] (sin regex dinámico)
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
  return text; // no más “fallbacks” que puedan borrar contenido
};

export default function ChatInterface() {
  const langCtx = useLanguage();
  const initialCtxLang: Lang = langCtx?.language === "es" ? "es" : "en";
  const setCtxLanguage = useCallback((l: Lang) => {
    if (l !== langCtx.language) {
      langCtx.toggleLanguage();
    }
  }, [langCtx]);

  const [preferredLang, setPreferredLang] = useState<Lang | null>(null);
  const currentLang: Lang = preferredLang ?? initialCtxLang;
  const isEs = currentLang === "es";

  // Nombre/idioma
  const [userName, setUserName] = useState("");
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [nameInput, setNameInput] = useState("");

  // Estados para animaciones del modal
  const [showWelcome, setShowWelcome] = useState(true);
  const [welcomeText, setWelcomeText] = useState("");
  const [showLanguageQuestion, setShowLanguageQuestion] = useState(false);
  const [languageQuestionText, setLanguageQuestionText] = useState("");
  const [showNameQuestion, setShowNameQuestion] = useState(false);
  const [languageSelected, setLanguageSelected] = useState(false);

  // Medir 50% de la altura del padre en px (para ocultar burbujas previas de la vista)
  const rootRef = useRef<HTMLDivElement>(null);
  const [chatHeightPx, setChatHeightPx] = useState<number | undefined>();

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const h = entries[0].contentRect.height || el.clientHeight;
      setChatHeightPx(Math.max(160, Math.floor(h * 0.5))); // mínimo razonable
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Cargar datos
  useEffect(() => {
    try {
      const savedName = typeof window !== "undefined" ? (localStorage.getItem("userName") || "").trim() : "";
      const savedLang = typeof window !== "undefined" ? (localStorage.getItem("preferredLanguage") as Lang | null) : null;
      if (savedLang === "en" || savedLang === "es") { setPreferredLang(savedLang); setCtxLanguage?.(savedLang); }
      if (savedName) setUserName(savedName);
      const shouldShowPrompt = !(savedName && (savedLang === "en" || savedLang === "es"));
      setShowNamePrompt(shouldShowPrompt);
      
      // Si no hay que mostrar el prompt, resetear estados de animación
      if (!shouldShowPrompt) {
        setShowWelcome(false);
        setShowLanguageQuestion(false);
        setShowNameQuestion(false);
        setLanguageSelected(true);
      }
    } catch { setShowNamePrompt(true); }
  }, [setCtxLanguage]);

  // Animación del Welcome! (fade-in y fade-out)
  useEffect(() => {
    if (!showNamePrompt || !showWelcome) return;
    
    const welcomeMsg = "Welcome!";
    
    // Fade-in del texto Welcome!
    let i = 0;
    const typeInterval = setInterval(() => {
      setWelcomeText(welcomeMsg.slice(0, i + 1));
      i++;
      if (i >= welcomeMsg.length) {
        clearInterval(typeInterval);
        
        // Esperar 1.5s y hacer fade-out
        setTimeout(() => {
          setShowWelcome(false);
          // Iniciar pregunta de idioma después del fade-out
          setTimeout(() => {
            setShowLanguageQuestion(true);
          }, 500);
        }, 1500);
      }
    }, 80);

    return () => clearInterval(typeInterval);
  }, [showNamePrompt, showWelcome]);

  // Typewriting para la pregunta de idioma
  useEffect(() => {
    if (!showLanguageQuestion) return;

    const languageMsg = currentLang === "es" ? "¿Qué idioma prefieres?" : "Which language do you prefer?";
    let i = 0;
    setLanguageQuestionText("");
    
    const typeInterval = setInterval(() => {
      setLanguageQuestionText(languageMsg.slice(0, i + 1));
      i++;
      if (i >= languageMsg.length) {
        clearInterval(typeInterval);
      }
    }, 60);

    return () => clearInterval(typeInterval);
  }, [showLanguageQuestion, currentLang]);

  // Mostrar pregunta del nombre después de seleccionar idioma
  useEffect(() => {
    if (languageSelected && !showNameQuestion && showNamePrompt) {
      setTimeout(() => {
        setShowNameQuestion(true);
      }, 800);
    }
  }, [languageSelected, showNameQuestion, showNamePrompt]);

  const handleLanguageSelection = (lang: Lang) => {
    setPreferredLang(lang);
    setCtxLanguage?.(lang);
    setLanguageSelected(true);
    // Ocultar la pregunta de idioma después de seleccionar
    setShowLanguageQuestion(false);
  };

  const confirmNameAndLang = () => {
    const trimmed = nameInput.trim();
    const langToSave: Lang = preferredLang ?? initialCtxLang;
    if (!trimmed || !langToSave) return;
    try { localStorage.setItem("userName", trimmed); localStorage.setItem("preferredLanguage", langToSave); } catch {}
    setUserName(trimmed); setPreferredLang(langToSave); setCtxLanguage?.(langToSave); setShowNamePrompt(false);
  };
  const handleNameKey = (e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter") { e.preventDefault(); confirmNameAndLang(); } };

  // Typewriter de portada
  const [displayed, setDisplayed] = useState("");
  const [typewriterComplete, setTypewriterComplete] = useState(false);
  const [visibleButtons, setVisibleButtons] = useState(0);
  const [showInput, setShowInput] = useState(false);

  const greetings = [
    { en: "Hey there! I'm Alexis. I code things that live on the internet, and this GPT version of me is here to chat.", es: "¡Hey! Soy Alexis. Programo cosas que viven en internet, y esta versión GPT de mí está aquí para charlar." },
    { en: "Hi, I'm Alexis. Web developer by day, debugging wizard by night. This is my AI twin.", es: "Hola, soy Alexis. Desarrollador web de día, mago del debugging de noche. Este es mi gemelo AI." },
    { en: "Hello! Alexis here. I turn coffee into code, and this GPT knows most of my tricks.", es: "¡Hola! Alexis aquí. Convierto café en código, y este GPT conoce la mayoría de mis trucos." },
    { en: "Hey, I'm Alexis. I make pixels dance on screens, powered by GPT magic.", es: "Hey, soy Alexis. Hago que los píxeles bailen en pantallas, con magia GPT." },
    { en: "Hi there! I'm Alexis, your friendly neighborhood web developer (now in AI flavor).", es: "¡Hola! Soy Alexis, tu desarrollador web de confianza (ahora en versión AI)." },
    { en: "Greetings! I'm Alexis. I craft digital experiences, and this is my GPT stunt double.", es: "¡Saludos! Soy Alexis. Creo experiencias digitales, y este es mi doble de acción GPT." },
    { en: "Hey! Alexis here. I speak fluent JavaScript and broken human. Let's chat!", es: "¡Hey! Alexis aquí. Hablo JavaScript fluido y humano a medias. ¡Charlemos!" },
    { en: "Hi, I'm Alexis. Building the web, one component at a time. This GPT knows my story.", es: "Hola, soy Alexis. Construyendo la web, un componente a la vez. Este GPT conoce mi historia." },
  ];
  const [greetingIndex] = useState(() => Math.floor(Math.random() * greetings.length));
  const baseGreeting = isEs ? greetings[greetingIndex].es : greetings[greetingIndex].en;
  const text = userName ? (isEs ? `${baseGreeting} ¿Cómo estás, ${userName}?` : `${baseGreeting} How are you, ${userName}?`) : (isEs ? `${baseGreeting} ¿Cómo estás?` : `${baseGreeting} How are you?`);

  const [inputValue, setInputValue] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(isEs ? "Pregúntame algo..." : "Ask me something...");
  const { messages, isLoading, error, sendMessage, isRateLimit } = useChat(userName);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pool = inputPlaceholders.map((p) => (isEs ? p.es : p.en));
    setCurrentPlaceholder(pool[Math.floor(Math.random() * pool.length)]);
  }, [isEs]);

  useEffect(() => {
    if (!showChat && !showNamePrompt) {
      let i = 0; setDisplayed(""); setTypewriterComplete(false);
      const id = setInterval(() => { setDisplayed(text.slice(0, i + 1)); i++; if (i >= text.length) { clearInterval(id); setTypewriterComplete(true); } }, 34);
      return () => clearInterval(id);
    }
  }, [text, showChat, showNamePrompt]);

  useEffect(() => {
    if (!showNamePrompt && typewriterComplete && !showChat && visibleButtons < suggestions.length) {
      const timer = setTimeout(() => setVisibleButtons((p) => p + 1), 200);
      return () => clearTimeout(timer);
    }
  }, [typewriterComplete, visibleButtons, showChat, showNamePrompt]);

  useEffect(() => {
    if (!showNamePrompt && typewriterComplete && !showChat && visibleButtons === suggestions.length && !showInput) {
      const timer = setTimeout(() => setShowInput(true), 300);
      return () => clearTimeout(timer);
    }
  }, [typewriterComplete, visibleButtons, showChat, showNamePrompt, showInput]);

  useEffect(() => { if (showChat) { setVisibleButtons(suggestions.length); setShowInput(true); setTypewriterComplete(true); } }, [showChat]);

  /* ========= Typewriter para respuestas del asistente ========= */
  const [typedById, setTypedById] = useState<Record<string, string>>({});
  const [doneById, setDoneById] = useState<Record<string, boolean>>({});

  // animar última respuesta nueva; iniciar con 1 char para evitar burbuja vacía
  useEffect(() => {
    const lastAssistant = [...messages].filter(m => m.role === "assistant").pop();
    if (!lastAssistant) return;

    const key = (lastAssistant.id ?? String(+lastAssistant.timestamp)) as string;
    if (doneById[key] || typedById[key] !== undefined) return;

    const full = (lastAssistant.content ?? "").toString();
    if (full.length === 0) { // nada que animar
      setDoneById(prev => ({ ...prev, [key]: true }));
      return;
    }

    // preseed para evitar burbuja vacía
    setTypedById(prev => ({ ...prev, [key]: full.slice(0, 1) }));

    let i = 1;
    let rafId = 0;
    const step = () => {
      i = Math.min(i + 2, full.length);
      setTypedById(prev => ({ ...prev, [key]: full.slice(0, i) }));
      if (i < full.length) {
        rafId = window.requestAnimationFrame(step);
      } else {
        setDoneById(prev => ({ ...prev, [key]: true }));
      }
      // autoscroll durante la animación
      if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    };
    rafId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(rafId);
  }, [messages, doneById, typedById]);

  // autoscroll al fondo al cambiar la lista o lo tipeado
  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typedById]);

  const handleSendMessage = () => {
    if (!userName) return setShowNamePrompt(true);
    const raw = inputValue.trim();
    if (raw && !isLoading) {
      const intent = deriveIntent(raw, currentLang);
      const payload = withHint(raw, intent, currentLang);
      sendMessage(payload);
      setInputValue("");
      if (!showChat) setShowChat(true);
    }
  };
  const handleSuggestionClick = (label: string, intent: Intent) => {
    if (!userName) return setShowNamePrompt(true);
    const payload = withHint(label.trim(), intent, currentLang);
    sendMessage(payload);
    if (!showChat) setShowChat(true);
  };


  const sorted = [...messages].sort((a, b) => +a.timestamp - +b.timestamp);

  return (
    <div ref={rootRef} className="relative z-30 flex flex-col gap-4 px-4 w-full max-w-3xl mx-auto mb-20">

      {/* Portada (se oculta cuando inicia el chat) */}
      {!showChat && (
        <div className="pointer-events-auto w-full rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md px-5 py-6 shadow-2xl shadow-black/30">
          <p className="relative text-base sm:text-lg text-gray-200 font-mono font-light leading-relaxed">
            {displayed}
            {!showNamePrompt && displayed.length < text.length && (
              <span className="ml-1 inline-block h-5 w-0.5 align-[-0.15em] bg-cyan-300 animate-pulse" />
            )}
          </p>
        </div>
      )}

      {/* Ventana de chat limitada al 50% del alto del padre */}
      {sorted.length > 0 && (
        <div
          className="relative w-full rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md shadow-2xl shadow-black/30 overflow-y-auto"
          style={{ height: chatHeightPx ? `${chatHeightPx}px` : undefined, maxHeight: chatHeightPx ? `${chatHeightPx}px` : undefined }}
        >
          <div className="p-4 space-y-3">
            {sorted.map((m) => {
              const isUser = m.role === "user";
              const key = (m.id ?? String(+m.timestamp)) as string;
              const content = isUser ? stripHintFromUserMessage(m.content) : (doneById[key] ? (m.content ?? "") : (typedById[key] ?? (m.content ?? "").slice(0, 1)));
              return (
                <div key={key} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div className={`pointer-events-auto w-full max-w-[80%] rounded-2xl px-5 py-4 border ${isUser ? "bg-black/40 border-white/10" : "bg-zinc-800/60 border-white/10"}`}>
                    <p className="text-base sm:text-lg text-gray-200 font-mono font-light leading-relaxed whitespace-pre-wrap">
                      {content}
                      {!isUser && !doneById[key] ? " ▍" : null}
                    </p>
                    <span className="text-xs opacity-60 mt-2 block">
                      {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="flex justify-start">
                <div className="pointer-events-auto w-full max-w-[80%] rounded-2xl px-5 py-4 border bg-zinc-800/60 border-white/10">
                  <p className="text-base sm:text-lg text-gray-200 font-mono font-light leading-relaxed">▍</p>
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
              ⏳ {isEs ? "Rate limit alcanzado. Intenta en unos segundos." : "Rate limit reached. Try in a few seconds."}
            </p>
          )}
        </div>
      )}

      {/* Sugerencias antes de iniciar chat */}
      {!showNamePrompt && !showChat && sorted.length === 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s, index) => (
            <button
              key={s.en}
              onClick={() => handleSuggestionClick(isEs ? s.es : s.en, s.intent)}
              className={`text-xs bg-gray-700/30 hover:bg-gray-600/40 text-gray-300 hover:text-white px-3 py-2 rounded-lg border border-gray-600/30 transition-all duration-500 font-mono transform ${
                index < visibleButtons ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
              title={s.intent === "casual" ? (isEs ? "Conversación casual" : "Casual chat") : (isEs ? "Tema de trabajo" : "Work topic")}
            >
              {isEs ? s.es : s.en}
            </button>
          ))}
        </div>
      )}

      {/* Input siempre abajo */}
      <div className={`w-full ${!showNamePrompt ? "opacity-100" : "opacity-0"} transition-all`}>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSendMessage(); } }}
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
            {isLoading ? "⏳" : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m22 2-7 20-4-9-9-4 20-7z" />
                <path d="M22 2 11 13" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Modal nombre/idioma con animaciones */}
      {showNamePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900/90 p-6 shadow-2xl">
            
            {/* Welcome! fade-in/fade-out */}
            {showWelcome && (
              <div className={`transition-opacity duration-1000 ${showWelcome ? 'opacity-100' : 'opacity-0'}`}>
                <h2 className="text-2xl font-mono font-light text-white mb-4 text-center">
                  {welcomeText}
                  {welcomeText.length < "Welcome!".length && (
                    <span className="ml-1 inline-block h-6 w-0.5 bg-cyan-300 animate-pulse" />
                  )}
                </h2>
              </div>
            )}

            {/* Pregunta de idioma con typewriting */}
            {showLanguageQuestion && (
              <div className={`transition-opacity duration-500 ${showLanguageQuestion ? 'opacity-100' : 'opacity-0'}`}>
                <div className="mb-4">
                  <p className="text-sm font-mono font-light text-gray-300 mb-3">
                    {languageQuestionText}
                    {languageQuestionText.length < (currentLang === "es" ? "¿Qué idioma prefieres?" : "Which language do you prefer?").length && (
                      <span className="ml-1 inline-block h-4 w-0.5 bg-cyan-300 animate-pulse" />
                    )}
                  </p>
                  <div className="flex gap-2 justify-center">
                    <button 
                      type="button" 
                      onClick={() => handleLanguageSelection("es")}
                      className={`text-xs font-mono font-light px-4 py-2 rounded-lg border transition-all duration-300 ${
                        currentLang === "es" 
                          ? "border-cyan-500/30 bg-cyan-600/40 text-cyan-100 scale-105" 
                          : "border-gray-600/30 bg-gray-700/30 text-gray-200 hover:bg-gray-600/40 hover:scale-105"
                      }`}
                    >
                      Español
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleLanguageSelection("en")}
                      className={`text-xs font-mono font-light px-4 py-2 rounded-lg border transition-all duration-300 ${
                        currentLang === "en" 
                          ? "border-cyan-500/30 bg-cyan-600/40 text-cyan-100 scale-105" 
                          : "border-gray-600/30 bg-gray-700/30 text-gray-200 hover:bg-gray-600/40 hover:scale-105"
                      }`}
                    >
                      English
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Pregunta del nombre con fade-in */}
            {showNameQuestion && (
              <div className={`transition-all duration-800 transform ${
                showNameQuestion 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4'
              }`}>
                <label className="text-sm font-mono font-light text-gray-300 mb-2 block">
                  {currentLang === "es" ? "¿Cómo te llamas?" : "What's your name?"}
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-gray-200 placeholder-gray-400 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
                  placeholder={currentLang === "es" ? "Escribe tu nombre..." : "Type your name..."}
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={handleNameKey}
                  autoFocus={showNameQuestion}
                  maxLength={60}
                />
                <div className="mt-4 flex gap-2 justify-end">
                  <button 
                    onClick={() => setShowNamePrompt(false)} 
                    className="text-xs font-mono font-light px-4 py-2 rounded-lg border border-gray-600/30 text-gray-300 hover:text-white hover:bg-gray-600/20 transition-all duration-300 hover:scale-105"
                  >
                    {currentLang === "es" ? "Ahora no" : "Not now"}
                  </button>
                  <button 
                    onClick={confirmNameAndLang} 
                    disabled={!nameInput.trim() || !currentLang}
                    className="text-xs font-mono font-light px-4 py-2 rounded-lg border border-cyan-500/30 bg-cyan-600/40 text-cyan-200 hover:bg-cyan-500/50 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100"
                  >
                    {currentLang === "es" ? "Guardar" : "Save"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
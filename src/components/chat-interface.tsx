"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import type React from "react";
import { useLanguage } from "@/components/lang-context";
import { useChat } from "@/hooks/useChat";

// Datos personalizados de Alexis
import { alexisData, getRandomMusicArtist, getRandomTech } from "./data/user-data";
import { 
  detectEnhancedIntent, 
  buildEnhancedHint, 
  ENHANCED_SUGGESTIONS,
  ENHANCED_PLACEHOLDERS 
} from "./data/chat-enhancements";

type Lang = "en" | "es";
type Intent = "casual" | "work" | "about" | "projects" | "contact" | "music" | "travel" | "tech";
type Suggestion = { en: string; es: string; intent: Intent };

/* ========= Sugerencias Personalizadas de Alexis ========= */
// Función para obtener 5 sugerencias aleatorias
const getRandomSuggestions = (allSuggestions: Suggestion[], count: number = 5): Suggestion[] => {
  const shuffled = [...allSuggestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const suggestions: Suggestion[] = getRandomSuggestions(ENHANCED_SUGGESTIONS, 5);

/* ========= Easter Egg (Marthiel) ========= */
const EASTER_GIBBERISH_ES = [
  "weuhruqw wefhuqsbdchja scuwqe hfqusdncu",
  "bzzt bzzt prrrt glitch glitch ajá ajá",
  "pipipí popopó ñeee trrrrr zaaaa",
  "error 404 del universo, jajaja no encontrado",
  "bits bailando en espiral ñam ñam",
  "texto corrupto: asdf ñññ !!!",
  "ruido blanco entrando por los píxeles",
  "la matrix tose: cof cof cof",
  "símbolos sin sentido <> {} ???",
  "estática cósmica ssshhh ssshhh"
];
const EASTER_GIBBERISH_EN = [
  "weuhruqw wefhuqsbdchja scuwqe hfqusdncu",
  "bzzt bzzt prrrt glitch glitch haha",
  "beep boop brrrr zzzzt zaaap",
  "universe 404, not found lol",
  "bits dancing in a spiral nom nom",
  "corrupted text: asdf ### !!!",
  "white noise through the pixels",
  "the matrix coughs: coff coff",
  "nonsense symbols <> {} ???",
  "cosmic static shhhhh shhhhh"
];
const EASTER_PLACEHOLDERS_ES = [
  "¿De verdad vas a continuar escribiendo eso?",
  "¿Seguro que quieres invocar eso?",
  "Mmm… ¿seguimos por ahí?",
  "¿Estás seguro de lo que haces?",
  "Última oportunidad para arrepentirte…",
  "Esto podría salir mal, ¿continuar?",
  "¿No te da cosita escribir eso?",
  "Ok… pero luego no digas que no avisé",
  "¿De veritas vas a seguir?",
  "Respira hondo… ¿listo?"
];
const EASTER_PLACEHOLDERS_EN = [
  "Are you really going to keep typing that?",
  "Sure you want to summon that?",
  "Hmm… still going with that?",
  "Are you certain about this?",
  "Last chance to back out…",
  "This could go sideways—continue?",
  "Doesn’t this feel risky to type?",
  "Okay… don’t say I didn’t warn you",
  "For real—you’re proceeding?",
  "Deep breath… ready?"
];
const buildEasterFull = (seed: string) => Array.from({ length: 80 })
  .map((_, i) => (i % 5 === 4 ? `${seed}\n` : `${seed} `))
  .join("");

// Placeholders personalizados se obtienen de ENHANCED_PLACEHOLDERS

/* ========= Detección de intención ========= */
const WORK_EN = ["project","portfolio","resume","cv","hire","job","work","code","coding","programming","developer","stack","react","next","typescript","node","api","deploy","github","experience","tech","technology"];
const WORK_ES = ["proyecto","portafolio","currículum","curriculum","cv","contratar","empleo","trabajo","código","codigo","programación","desarrollador","stack","react","next","typescript","node","api","deploy","github","experiencia","tecnología","tecnologias"];
const GREET_EN = ["hi","hello","hey","how are you","i'm fine","and you","good morning","good evening","what's up"];
const GREET_ES = ["hola","buenas","¿cómo estás","como estas","estoy bien","¿y tú","y tu","qué tal","que tal"];

const isWorky = (t: string, lang: Lang) => (lang === "es" ? WORK_ES : WORK_EN).some(k => t.includes(k));
const isGreetingish = (t: string, lang: Lang) => (lang === "es" ? GREET_ES : GREET_EN).some(g => t.includes(g)) && t.length <= 120;

// Usar sistema mejorado de detección de intenciones
const deriveIntent = detectEnhancedIntent;

/* ========= Hints ocultos ========= */
const HINT_START = "[[SYS]]";
const HINT_END = "[[/SYS]]";

// Usar sistema mejorado de hints con información personalizada
const buildHint = (intent: Intent, lang: Lang, userText: string) => {
  return buildEnhancedHint(intent, lang, userText);
};

const withHint = (userText: string, intent: Intent, lang: Lang) => `${buildHint(intent, lang, userText)}\n${userText.trim()}`;

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
      setChatHeightPx(Math.max(300, Math.floor(h * 0.75))); // Aumentar tamaño: 75% del alto y mínimo 300px
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
    // Trigger easter egg if name contains Marthiel/Marthi
    if (/marthiel/i.test(trimmed) || /marthi/i.test(trimmed)) {
      triggerEasterEgg();
    }
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

  // Easter egg state
  const [easterActive, setEasterActive] = useState(false);
  const [easterText, setEasterText] = useState("");
  const easterRafRef = useRef<number | null>(null);
  const [easterGifVisible, setEasterGifVisible] = useState(false);
  const [easterGifScale, setEasterGifScale] = useState(0.001);

  const pickPlaceholder = useCallback(() => {
    const pool = ENHANCED_PLACEHOLDERS[isEs ? 'es' : 'en'];
    setCurrentPlaceholder(pool[Math.floor(Math.random() * pool.length)]);
  }, [isEs]);

  useEffect(() => {
    pickPlaceholder();
  }, [pickPlaceholder]);

  useEffect(() => {
    if (!showChat && !showNamePrompt) {
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
      }, 40); // Velocidad más lenta para mejor visibilidad
      
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

  // Reusable easter egg trigger
  const triggerEasterEgg = useCallback(() => {
    if (!showChat) setShowChat(true);
    setEasterActive(true);
    setEasterGifVisible(true);
    setEasterGifScale(0.15);
    setTimeout(() => setEasterGifScale(6), 50);
    setTimeout(() => setEasterGifScale(12), 350);
    setTimeout(() => setEasterGifVisible(false), 1800);

    setEasterText("");
    let i = 0;
    const pool = isEs ? EASTER_GIBBERISH_ES : EASTER_GIBBERISH_EN;
    const seed = pool[Math.floor(Math.random() * pool.length)];
    const full = buildEasterFull(seed);
    const step = () => {
      i = Math.min(i + (2 + Math.floor(Math.random() * 5)), full.length);
      setEasterText(full.slice(0, i));
      if (i < full.length && easterActive) {
        easterRafRef.current = window.requestAnimationFrame(step);
      }
    };
    easterRafRef.current = window.requestAnimationFrame(step);
  }, [isEs, showChat, easterActive]);

  // animar última respuesta nueva - con dependencia estable
  useEffect(() => {
    const lastAssistant = [...messages].filter(m => m.role === "assistant").pop();
    if (!lastAssistant) return;

    const key = (lastAssistant.id ?? String(+lastAssistant.timestamp)) as string;
    if (doneById[key] || typedById[key] !== undefined) return;

    const full = (lastAssistant.content ?? "").toString();
    if (full.length === 0) {
      setDoneById(prev => ({ ...prev, [key]: true }));
      return;
    }

    // Iniciar con primera letra
    let currentIndex = 1;
    setTypedById(prev => ({ ...prev, [key]: full.slice(0, 1) }));
    
    const typeInterval = setInterval(() => {
      if (currentIndex < full.length) {
        currentIndex = Math.min(currentIndex + 2, full.length);
        // Forzar actualización inmediata
        setTypedById(prev => {
          const newState = { ...prev, [key]: full.slice(0, currentIndex) };
          return newState;
        });
        
        // Autoscroll
        setTimeout(() => {
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
          }
        }, 10);
      } else {
        // Completar y marcar como terminado
        setTypedById(prev => ({ ...prev, [key]: full }));
        setDoneById(prev => ({ ...prev, [key]: true }));
        clearInterval(typeInterval);
      }
    }, 50);
    
    return () => clearInterval(typeInterval);
  }, [messages.length, messages.map(m => m.id || m.timestamp).join(',')]); // Usar dependencias estables

  // autoscroll al fondo al cambiar la lista o lo tipeado
  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typedById]);

  // Al cambiar el número de mensajes, refrescar placeholder
  useEffect(() => {
    pickPlaceholder();
  }, [messages.length, pickPlaceholder]);

  // Autoscroll for Easter egg typing
  useEffect(() => {
    if (!easterActive) return;
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [easterText, easterActive]);

  // Cleanup RAF when Easter egg deactivates/unmounts
  useEffect(() => {
    return () => {
      if (easterRafRef.current) {
        window.cancelAnimationFrame(easterRafRef.current);
        easterRafRef.current = null;
      }
    };
  }, []);

  const handleSendMessage = () => {
    const raw = inputValue.trim();
    if (!raw || isLoading) return;

    // Easter egg trigger: "Marthiel" (case-insensitive). Do NOT call API.
    if (/marthiel/i.test(raw) || /marthi/i.test(raw)) {
      setInputValue("");
      if (!showChat) setShowChat(true);
      pickPlaceholder();

      // Activate gif burst
      triggerEasterEgg();
      return;
    }

    // Beatles Easter Egg - respuesta especial
    if (/beatles/i.test(raw) || /paul mccartney/i.test(raw) || /john lennon/i.test(raw) || /george harrison/i.test(raw) || /ringo starr/i.test(raw)) {
      const beatlesResponse = isEs 
        ? "🎸 ¡FINALMENTE ALGUIEN HABLA DE LOS BEATLES! Son mi obsesión absoluta. Paul McCartney es un genio, George Harrison subestimado, y ni hablar del groove de Ringo. ¿Cuál es tu canción favorita?"
        : "🎸 FINALLY SOMEONE TALKS ABOUT THE BEATLES! They're my absolute obsession. Paul McCartney is a genius, George Harrison underrated, and don't get me started on Ringo's groove. What's your favorite song?";
      
      // Simular respuesta inmediata
      setInputValue("");
      if (!showChat) setShowChat(true);
      pickPlaceholder();
      
      // Simular respuesta del asistente de inmediato
      const mockResponse = {
        role: "assistant" as const,
        content: beatlesResponse,
        timestamp: new Date(),
        id: `beatles-${Date.now()}`
      };
      
      // Esto requerirías agregar al hook useChat para respuestas mock
      // Por ahora, continúa con el flujo normal
    }

    if (!userName) return setShowNamePrompt(true);
    const intent = deriveIntent(raw, currentLang);
    const payload = buildHint(intent, currentLang, raw) + '\n' + raw;
    sendMessage(payload);
    setInputValue("");
    if (!showChat) setShowChat(true);
    pickPlaceholder();
  };
  const handleSuggestionClick = (label: string, intent: Intent) => {
    if (!userName) return setShowNamePrompt(true);
    const payload = buildHint(intent, currentLang, label) + '\n' + label;
    sendMessage(payload);
    if (!showChat) setShowChat(true);
    pickPlaceholder();
  };


  const sorted = [...messages].sort((a, b) => +a.timestamp - +b.timestamp);
  // Identify the most recent assistant message to animate only that one
  const lastAssistant = [...sorted].filter(m => m.role === "assistant").pop();
  const lastAssistantKey = lastAssistant ? ((lastAssistant.id ?? String(+lastAssistant.timestamp)) as string) : null;

  return (
    <div ref={rootRef} className="relative z-10 sm:z-10 md:z-10 lg:z-30 flex flex-col gap-4 px-4 w-full max-w-3xl mx-auto mb-20">

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
      {(sorted.length > 0 || easterActive) && (
        <div
          className="relative w-full rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md shadow-2xl shadow-black/30 overflow-y-auto"
          style={{ height: chatHeightPx ? `${chatHeightPx}px` : undefined, maxHeight: chatHeightPx ? `${chatHeightPx}px` : undefined }}
        >
          <div className="p-4 space-y-3">
            {sorted.map((m) => {
              const isUser = m.role === "user";
              const key = (m.id ?? String(+m.timestamp)) as string;
              const isLastAssistant = !isUser && lastAssistantKey === key;
              const content = isUser
                ? stripHintFromUserMessage(m.content)
                : isLastAssistant
                  ? (doneById[key] ? (m.content ?? "") : (typedById[key] ?? (m.content ?? "").slice(0, 1)))
                  : (m.content ?? "");
              return (
                <div key={key} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div className={`pointer-events-auto w-full max-w-[80%] rounded-2xl px-5 py-4 border ${isUser ? "bg-black/40 border-white/10" : "bg-zinc-800/60 border-white/10"}`}>
                    <p className="text-base sm:text-lg text-gray-200 font-mono font-light leading-relaxed whitespace-pre-wrap">
                      {content}
                      {!isUser && (lastAssistantKey === key) && !doneById[key] ? " ▍" : null}
                    </p>
                    <span className="text-xs opacity-60 mt-2 block">
                      {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              );
            })}
            {easterActive && (
              <div className="flex justify-start">
                <div className="pointer-events-auto w-full max-w-[80%] rounded-2xl px-5 py-4 border bg-zinc-800/60 border-white/10">
                  <p className="text-base sm:text-lg text-gray-200 font-mono font-light leading-relaxed whitespace-pre-wrap">{easterText || "▍"}</p>
                </div>
              </div>
            )}
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

      {/* Easter egg GIF overlay (expands dramatically) */}
      {easterActive && easterGifVisible && (
        <img
          src="/16.gif"
          alt="glitch"
          className="fixed left-1/2 top-1/2 z-50 sm:z-10 md:z-10 lg:z-50 pointer-events-none select-none opacity-90"
          style={{ transform: `translate(-50%, -50%) scale(${easterGifScale}) rotate(${(easterGifScale * 8).toFixed(2)}deg)` }}
        />
      )}
    </div>
  );
}
"use client";
import { useState, useRef, useEffect } from "react";
import type React from "react";
import { useLanguage } from "@/components/lang-context";
import { useChat } from "@/hooks/useChat";

type Lang = "en" | "es";
type Intent = "casual" | "work";
type Suggestion = { en: string; es: string; intent: Intent };

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

/** ---------------- Intent detection ---------------- */
const WORK_EN = [
  "project","portfolio","resume","cv","hire","job","work","code","coding","programming","developer",
  "stack","react","next","typescript","node","api","deploy","github","experience","tech","technology"
];
const WORK_ES = [
  "proyecto","portafolio","currículum","curriculum","cv","contratar","empleo","trabajo","código","codigo","programación",
  "desarrollador","stack","react","next","typescript","node","api","deploy","github","experiencia","tecnología","tecnologias"
];
const GREET_EN = ["hi","hello","hey","how are you","i'm fine","and you","good morning","good evening","what's up"];
const GREET_ES = ["hola","buenas","¿cómo estás","como estas","estoy bien","¿y tú","y tu","qué tal","que tal"];

const isWorky = (t: string, lang: Lang) =>
  (lang === "es" ? WORK_ES : WORK_EN).some(k => t.includes(k));
const isGreetingish = (t: string, lang: Lang) =>
  (lang === "es" ? GREET_ES : GREET_EN).some(g => t.includes(g)) && t.length <= 120;

const deriveIntent = (text: string, lang: Lang): Intent => {
  const t = text.toLowerCase();
  if (isWorky(t, lang)) return "work";
  if (isGreetingish(t, lang)) return "casual";
  return "casual";
};

/** ---------------- Hidden hint block ----------------
 * We wrap the hint between [[SYS]] ... [[/SYS]].
 * Before rendering user messages, we strip this block.
 */
const HINT_START = "[[SYS]]";
const HINT_END = "[[/SYS]]";

const buildHint = (intent: Intent, lang: Lang) => {
  if (intent === "casual") {
    return lang === "es"
      ? `${HINT_START}
Modo: CASUAL (ES)
- Responde ESTRICTAMENTE en español.
- Tono cálido y ligero, sin mencionar trabajo ni proyectos salvo que el usuario lo pida.
- 1–2 oraciones, 25–40 palabras máximo.
- Incluye UNA pregunta abierta o UNA sugerencia breve, no más.
${HINT_END}`
      : `${HINT_START}
Mode: CASUAL (EN)
- Respond STRICTLY in English.
- Warm, light tone; do not mention work or projects unless the user asks.
- 1–2 sentences, 25–40 words max.
- Include ONE open-ended question OR ONE brief suggestion, not both.
${HINT_END}`;
  }
  // work
  return lang === "es"
    ? `${HINT_START}
Modo: WORK (ES)
- Responde ESTRICTAMENTE en español.
- Enfócate en temas profesionales que el usuario mencione.
- Sé claro y conciso.
${HINT_END}`
    : `${HINT_START}
Mode: WORK (EN)
- Respond STRICTLY in English.
- Focus on professional topics the user mentions.
- Be clear and concise.
${HINT_END}`;
};

const withHint = (userText: string, intent: Intent, lang: Lang) =>
  `${buildHint(intent, lang)}\n${userText.trim()}`;

// Quita el bloque [[SYS]]...[[/SYS]] sin usar RegExp dinámico
const stripHintFromUserMessage = (raw: unknown) => {
  const text = (raw ?? "").toString();

  // 1) Si empieza con [[SYS]], corta hasta [[/SYS]]
  if (text.startsWith("[[SYS]]")) {
    const endMarker = "[[/SYS]]";
    const end = text.indexOf(endMarker);
    if (end !== -1) {
      let out = text.slice(end + endMarker.length);
      // Limpia salto inicial si quedó
      if (out.startsWith("\r\n")) out = out.slice(2);
      else if (out.startsWith("\n")) out = out.slice(1);
      return out;
    }
  }

  // 2) Fallback: si alguien pegó bullets al inicio, quítalos línea por línea
  const lines = text.split("\n");
  while (lines.length && (/^\s*[-•]/.test(lines[0]))) lines.shift();
  return lines.join("\n").replace(/^\s+/, "");
};

export default function ChatInterface() {
  const langCtx = useLanguage() as any;
  const initialCtxLang: Lang = langCtx?.language === "es" ? "es" : "en";
  const setCtxLanguage: ((l: Lang) => void) | undefined =
    typeof langCtx?.setLanguage === "function" ? langCtx.setLanguage : undefined;

  const [preferredLang, setPreferredLang] = useState<Lang | null>(null);
  const currentLang: Lang = preferredLang ?? initialCtxLang;
  const isEs = currentLang === "es";

  // --- User name & onboarding ---
  const [userName, setUserName] = useState("");
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [nameInput, setNameInput] = useState("");

  useEffect(() => {
    try {
      const savedName = typeof window !== "undefined" ? (localStorage.getItem("userName") || "").trim() : "";
      const savedLang = typeof window !== "undefined" ? (localStorage.getItem("preferredLanguage") as Lang | null) : null;

      if (savedLang === "en" || savedLang === "es") {
        setPreferredLang(savedLang);
        setCtxLanguage?.(savedLang);
      }
      if (savedName) setUserName(savedName);
      setShowNamePrompt(!(savedName && (savedLang === "en" || savedLang === "es")));
    } catch {
      setShowNamePrompt(true);
    }
  }, []);

  const confirmNameAndLang = () => {
    const trimmed = nameInput.trim();
    const langToSave: Lang = preferredLang ?? initialCtxLang;
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

  const greetings = [
    {
      en: "Hey there! I'm Alexis. I code things that live on the internet, and this GPT version of me is here to chat.",
      es: "¡Hey! Soy Alexis. Programo cosas que viven en internet, y esta versión GPT de mí está aquí para charlar.",
    },
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

  const text = userName
    ? isEs ? `${baseGreeting} ¿Cómo estás, ${userName}?` : `${baseGreeting} How are you, ${userName}?`
    : isEs ? `${baseGreeting} ¿Cómo estás?` : `${baseGreeting} How are you?`;

  // --- Chat hook ---
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

  useEffect(() => {
    if (showChat) {
      setVisibleButtons(suggestions.length);
      setShowInput(true);
      setTypewriterComplete(true);
    }
  }, [showChat]);

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

  useEffect(() => {
    if (messagesEndRef.current && showChat) {
      const chatContainer = messagesEndRef.current.closest(".overflow-y-auto");
      if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages, showChat]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const latestAssistantMessage = messages.filter((m) => m.role === "assistant").pop();
  const userMessages = messages.filter((m) => m.role === "user");

  return (
    <div className="relative z-30 flex flex-col gap-4 px-4 w-full max-w-3xl mx-auto mb-20">
      {/* Modal nombre/idioma */}
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

      {/* Cabecera */}
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
                  {stripHintFromUserMessage(message.content)}
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

      {/* Sugerencias */}
      {!showNamePrompt && !showChat && messages.length === 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
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

      {/* Input */}
      <div
        className={`w-full transition-all duration-500 transform ${
          (showInput || showChat) && !showNamePrompt ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="flex gap-2">
          <input
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
            {isLoading ? "⏳" : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
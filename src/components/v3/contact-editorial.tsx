"use client";

import {
  useRef,
  useState,
  useEffect,
  type FormEvent,
  type ChangeEvent,
} from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import { useLanguage } from "@/components/lang-context";
import "@/components/v3/v3.css";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
type FormStatus = "idle" | "loading" | "success" | "error";
type IntentOption = "" | "PROYECTO NUEVO" | "CONSULTORÍA" | "COLABORACIÓN" | "SOLO SALUDAR";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
  intent: IntentOption;
}

const INTENT_OPTIONS: IntentOption[] = [
  "PROYECTO NUEVO",
  "CONSULTORÍA",
  "COLABORACIÓN",
  "SOLO SALUDAR",
];

const SUBJECT_MAX = 80;

/* ─────────────────────────────────────────
   Social links
───────────────────────────────────────── */
const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/AlejoReyna" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/alexis-alberto-reyna-sánchez-6953102b4" },
  { label: "Email", href: "mailto:alexis.rs@inverater.com" },
];

/* ─────────────────────────────────────────
   Stagger entry animation
───────────────────────────────────────── */
const fieldVariant = (delay: number) => ({
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const, delay },
  },
});

/* ─────────────────────────────────────────
   Submit button inner content
───────────────────────────────────────── */
function SubmitButtonContent({ status, isEs }: { status: FormStatus; isEs: boolean }) {
  if (status === "loading") {
    return (
      <span style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
          style={{ display: "inline-block" }}
          aria-hidden="true"
        >
          ↻
        </motion.span>
        {isEs ? "ENVIANDO..." : "SENDING..."}
      </span>
    );
  }
  return <>{isEs ? "ENVIAR →" : "SEND →"}</>;
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
export default function ContactEditorial() {
  const { language } = useLanguage();
  const isEs = language === "es";

  /* ── Refs ── */
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const isFormInView = useInView(formRef, { once: true, amount: 0.15 });
  const isEyebrowInView = useInView(eyebrowRef, { once: true, amount: 0.8 });

  /* ── Headline clip-path reveal via scroll ── */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.85", "start 0.3"],
  });
  const headlineClip = useTransform(
    scrollYProgress,
    [0, 1],
    ["inset(0% 100% 0% 0%)", "inset(0% 0% 0% 0%)"]
  );

  /* ── Form state ── */
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
    intent: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const setField = (field: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const val = field === "subject"
        ? e.target.value.slice(0, SUBJECT_MAX)
        : e.target.value;
      setForm((prev) => ({ ...prev, [field]: val }));
    };

  const toggleIntent = (option: IntentOption) => {
    setForm((prev) => ({
      ...prev,
      intent: prev.intent === option ? "" : option,
    }));
  };

  const isValid =
    form.name.trim().length > 0 &&
    form.email.trim().length > 0 &&
    form.message.trim().length > 0;

  /* ── Submit ── */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid || status === "loading") return;
    setStatus("loading");
    setErrorMsg("");

    try {
      // API accepts: name, email, message, interest
      // subject is appended to message; intent maps to interest
      // TODO: extender API para aceptar `subject` como campo independiente
      const body: Record<string, string> = {
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.subject.trim()
          ? `[${form.subject.trim()}]\n\n${form.message.trim()}`
          : form.message.trim(),
        ...(form.intent ? { interest: form.intent } : {}),
      };

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data: unknown = await res.json().catch(() => ({}));
        const msg = (data as { error?: string }).error ?? (isEs ? "Error al enviar." : "Failed to send.");
        throw new Error(msg);
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : (isEs ? "Algo salió mal." : "Something went wrong."));
    }
  };

  /* Reset error on field change */
  useEffect(() => {
    if (status === "error") setStatus("idle");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  return (
    <section
      ref={sectionRef}
      className="v3-noise"
      style={{
        background: "var(--v3-bg)",
        padding: "clamp(4rem, 10vw, 8rem) clamp(1.5rem, 6vw, 5rem)",
        position: "relative",
        overflow: "hidden",
      }}
      aria-label={isEs ? "Contacto" : "Contact"}
    >
      {/* ── Eyebrow with pulsing availability dot ── */}
      <motion.div
        ref={eyebrowRef}
        initial={{ opacity: 0, y: 12 }}
        animate={isEyebrowInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.55rem",
          marginBottom: "2rem",
        }}
      >
        {/* Pulsing green dot */}
        <motion.span
          aria-label={isEs ? "Disponible" : "Available"}
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          style={{
            display: "inline-block",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "#84cc16",
            flexShrink: 0,
          }}
        />
        <span
          className="v3-mono"
          style={{
            fontSize: "0.6rem",
            letterSpacing: "0.4em",
            color: "var(--v3-gold)",
            textTransform: "uppercase",
          }}
        >
          {isEs ? "ALEXIS · DISPONIBLE" : "ALEXIS · AVAILABLE"}
        </span>
      </motion.div>

      {/* ── Giant headline with clip-path reveal ── */}
      <motion.h2
        ref={headlineRef}
        className="v3-display"
        style={{
          fontSize: "clamp(3rem, 8vw, 7rem)",
          lineHeight: 0.92,
          maxWidth: "18ch",
          marginBottom: "1.75rem",
          clipPath: headlineClip,
          WebkitClipPath: headlineClip as unknown as string,
          fontWeight: 400,
        }}
      >
        {isEs ? (
          <>
            Cuéntame qué quieres{" "}
            <span style={{ color: "var(--v3-gold)" }}>construir</span>.
          </>
        ) : (
          <>
            Tell me what you want to{" "}
            <span style={{ color: "var(--v3-gold)" }}>build</span>.
          </>
        )}
      </motion.h2>

      {/* ── Sub-copy ── */}
      <p
        className="v3-serif"
        style={{
          fontStyle: "italic",
          fontSize: "clamp(1rem, 1.4vw, 1.2rem)",
          color: "var(--v3-muted)",
          maxWidth: "42ch",
          lineHeight: 1.7,
          marginBottom: "clamp(2.5rem, 6vw, 4rem)",
        }}
      >
        {isEs
          ? "Cuéntame la idea, el flujo o el producto que tienes en mente. Te respondo con el siguiente paso más claro."
          : "Tell me the idea, flow or product you have in mind. I'll reply with the clearest next step."}
      </p>

      {/* ── 2-col grid: form (left) + sidebar (right) ── */}
      <div className="v3-contact-layout">
        {/* ── LEFT: Form ── */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          style={{ display: "flex", flexDirection: "column", gap: "0" }}
        >
          {/* name */}
          <motion.div
            variants={fieldVariant(0)}
            initial="hidden"
            animate={isFormInView ? "visible" : "hidden"}
            style={{ position: "relative" }}
          >
            <label htmlFor="contact-name" className="sr-only">
              {isEs ? "Tu nombre" : "Your name"}
            </label>
            <input
              id="contact-name"
              className="v3-contact-input"
              placeholder={isEs ? "TU NOMBRE" : "YOUR NAME"}
              value={form.name}
              onChange={setField("name")}
              required
              autoComplete="name"
            />
          </motion.div>

          {/* email */}
          <motion.div
            variants={fieldVariant(0.08)}
            initial="hidden"
            animate={isFormInView ? "visible" : "hidden"}
          >
            <label htmlFor="contact-email" className="sr-only">
              {isEs ? "Tu correo" : "Your email"}
            </label>
            <input
              id="contact-email"
              className="v3-contact-input"
              type="email"
              placeholder={isEs ? "TU CORREO" : "YOUR EMAIL"}
              value={form.email}
              onChange={setField("email")}
              required
              autoComplete="email"
            />
          </motion.div>

          {/* subject + char counter */}
          <motion.div
            variants={fieldVariant(0.16)}
            initial="hidden"
            animate={isFormInView ? "visible" : "hidden"}
            style={{ position: "relative" }}
          >
            <label htmlFor="contact-subject" className="sr-only">
              {isEs ? "Asunto breve (opcional)" : "Brief subject (optional)"}
            </label>
            <input
              id="contact-subject"
              className="v3-contact-input"
              placeholder={isEs ? "ASUNTO BREVE" : "BRIEF SUBJECT"}
              value={form.subject}
              onChange={setField("subject")}
              maxLength={SUBJECT_MAX}
              autoComplete="off"
              style={{ paddingRight: "3.5rem" }}
            />
            {/* char counter */}
            <span
              aria-live="polite"
              aria-label={`${form.subject.length} de ${SUBJECT_MAX} caracteres`}
              className="v3-mono"
              style={{
                position: "absolute",
                right: 0,
                bottom: "0.9rem",
                fontSize: "0.6rem",
                color: form.subject.length >= SUBJECT_MAX * 0.9
                  ? "var(--v3-ember)"
                  : "var(--v3-gold)",
                letterSpacing: "0.05em",
                pointerEvents: "none",
              }}
            >
              {form.subject.length}/{SUBJECT_MAX}
            </span>
          </motion.div>

          {/* message */}
          <motion.div
            variants={fieldVariant(0.24)}
            initial="hidden"
            animate={isFormInView ? "visible" : "hidden"}
          >
            <label htmlFor="contact-message" className="sr-only">
              {isEs ? "Tu mensaje" : "Your message"}
            </label>
            <textarea
              id="contact-message"
              className="v3-contact-input"
              placeholder={isEs ? "TU MENSAJE" : "YOUR MESSAGE"}
              value={form.message}
              onChange={setField("message")}
              required
              rows={4}
              style={{ resize: "vertical" }}
            />
          </motion.div>

          {/* Intent pills */}
          <motion.div
            variants={fieldVariant(0.32)}
            initial="hidden"
            animate={isFormInView ? "visible" : "hidden"}
            style={{ marginTop: "1.25rem", marginBottom: "0.5rem" }}
          >
            <span
              className="v3-mono"
              style={{
                display: "block",
                fontSize: "0.58rem",
                letterSpacing: "0.25em",
                color: "var(--v3-muted)",
                textTransform: "uppercase",
                marginBottom: "0.65rem",
              }}
            >
              {isEs ? "TIPO DE CONVERSACIÓN" : "TYPE OF CONVERSATION"}
            </span>
            <div
              role="group"
              aria-label={isEs ? "Tipo de conversación" : "Conversation type"}
              style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
            >
              {INTENT_OPTIONS.map((option) => {
                const active = form.intent === option;
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleIntent(option)}
                    className="v3-mono v3-intent-pill"
                    style={{
                      background: active ? "var(--v3-gold)" : "transparent",
                      color: active ? "var(--v3-bg)" : "var(--v3-muted)",
                      border: active
                        ? "1px solid var(--v3-gold)"
                        : "1px solid var(--v3-line)",
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Submit button + states */}
          <motion.div
            variants={fieldVariant(0.4)}
            initial="hidden"
            animate={isFormInView ? "visible" : "hidden"}
            style={{ marginTop: "1.75rem" }}
          >
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    background: "rgba(34, 85, 34, 0.25)",
                    border: "1px solid rgba(34, 160, 34, 0.4)",
                    padding: "1.1rem 1.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <span style={{ color: "#84cc16", fontSize: "1.1rem" }}>✓</span>
                  <span
                    className="v3-mono"
                    style={{
                      fontSize: "0.65rem",
                      letterSpacing: "0.22em",
                      color: "#a3e63a",
                      textTransform: "uppercase",
                    }}
                  >
                    {isEs
                      ? "MENSAJE RECIBIDO · TE ESCRIBO PRONTO"
                      : "MESSAGE RECEIVED · I'LL WRITE SOON"}
                  </span>
                </motion.div>
              ) : (
                <motion.button
                  key="submit"
                  type="submit"
                  disabled={!isValid || status === "loading"}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35 }}
                  className="v3-contact-btn v3-contact-btn--full"
                  style={{
                    opacity: !isValid ? 0.4 : 1,
                    cursor: !isValid ? "not-allowed" : "pointer",
                  }}
                >
                  <SubmitButtonContent status={status} isEs={isEs} />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Error message */}
            <AnimatePresence>
              {status === "error" && errorMsg && (
                <motion.p
                  key="error"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    marginTop: "0.75rem",
                    fontSize: "0.65rem",
                    letterSpacing: "0.15em",
                    color: "var(--v3-ember)",
                    fontFamily: "var(--font-space-mono, monospace)",
                    textTransform: "uppercase",
                  }}
                  role="alert"
                >
                  ✗ {errorMsg}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </form>

        {/* ── RIGHT: Sidebar info ── */}
        <aside>
          {/* Response time */}
          <div style={{ marginBottom: "2rem" }}>
            <span
              className="v3-mono"
              style={{
                display: "block",
                fontSize: "0.6rem",
                letterSpacing: "0.3em",
                color: "var(--v3-gold)",
                textTransform: "uppercase",
                marginBottom: "0.65rem",
              }}
            >
              {isEs ? "PRÓXIMA RESPUESTA" : "NEXT RESPONSE"}
            </span>
            <p
              className="v3-serif"
              style={{
                fontStyle: "italic",
                fontSize: "1rem",
                color: "var(--v3-muted)",
                lineHeight: 1.65,
                maxWidth: "28ch",
              }}
            >
              {isEs
                ? "Suelo responder en menos de 24 h en zona horaria America/Monterrey."
                : "I usually reply within 24 h — America/Monterrey timezone."}
            </p>
          </div>

          {/* Social links */}
          <div style={{ marginBottom: "2.5rem" }}>
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="v3-mono v3-sidebar-link"
              >
                <span>{link.label}</span>
                <span style={{ color: "var(--v3-muted)" }}>↗</span>
              </a>
            ))}
          </div>

          {/* Now working on */}
          <div>
            <span
              className="v3-mono"
              style={{
                display: "block",
                fontSize: "0.58rem",
                letterSpacing: "0.3em",
                color: "var(--v3-gold)",
                textTransform: "uppercase",
                marginBottom: "0.55rem",
              }}
            >
              {isEs ? "AHORA TRABAJANDO EN" : "CURRENTLY BUILDING"}
            </span>
            <p
              className="v3-serif"
              style={{
                fontStyle: "italic",
                fontSize: "0.95rem",
                color: "var(--v3-muted)",
                lineHeight: 1.6,
                maxWidth: "26ch",
              }}
            >
              {isEs
                ? "Inverater — plataforma de inversión con flujos de masterbroker y onboarding KYC."
                : "Inverater — investment platform with masterbroker flows and KYC onboarding."}
            </p>
          </div>
        </aside>
      </div>

      {/* ── Footer line ── */}
      <div
        style={{
          marginTop: "clamp(4rem, 10vw, 8rem)",
          paddingTop: "2rem",
          borderTop: "1px solid var(--v3-line)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <span
          className="v3-mono"
          style={{
            fontSize: "0.6rem",
            letterSpacing: "0.3em",
            color: "var(--v3-muted)",
            textTransform: "uppercase",
          }}
        >
          ALEXIS REYNA · 2026
        </span>
        <span
          className="v3-mono"
          style={{
            fontSize: "0.6rem",
            letterSpacing: "0.3em",
            color: "var(--v3-gold)",
            textTransform: "uppercase",
          }}
        >
          FIN / SCROLL COMPLETE
        </span>
      </div>
    </section>
  );
}

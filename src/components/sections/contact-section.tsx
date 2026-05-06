"use client";

import { useState, FormEvent } from "react";
import { useLanguage } from "@/components/lang-context";

type Interest =
  | "UI/UX design"
  | "Web design"
  | "Graphic design"
  | "Design system"
  | "Other";

const fieldStyle = {
  background: "var(--gic-ash-gray)",
  border: "1px solid var(--gic-cool-gray)",
  borderRadius: 0,
  padding: "13px 14px",
  fontFamily: "var(--gic-font-sans)",
  fontSize: "15px",
  color: "var(--gic-dark-charcoal)",
  letterSpacing: "-0.012em",
};

export default function LetsTalk() {
  const { language } = useLanguage();
  const isEs = language === "es";
  const [selectedInterest, setSelectedInterest] = useState<Interest | null>("UI/UX design");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const interests: Interest[] = [
    "UI/UX design",
    "Web design",
    "Graphic design",
    "Design system",
    "Other",
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
      setSelectedInterest("UI/UX design");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden py-24 sm:py-28"
      style={{ backgroundColor: "var(--gic-off-white)" }}
      aria-labelledby="contact-title"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ backgroundColor: "var(--gic-steel-gray)" }}
      />

      <div
        className="relative z-20 mx-auto grid grid-cols-1 gap-8 px-6 md:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-16"
        style={{
          maxWidth: "var(--gic-max-width)",
          paddingLeft: "clamp(24px, 5vw, 64px)",
          paddingRight: "clamp(24px, 5vw, 64px)",
        }}
      >
        <div className="flex flex-col justify-center gap-7">
          <div className="flex items-center gap-4">
            <div style={{ height: "1px", width: "32px", backgroundColor: "var(--gic-steel-gray)" }} />
            <span
              style={{
                fontFamily: "var(--gic-font-sans)",
                fontSize: "var(--gic-text-caption)",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--gic-light-gray)",
              }}
            >
              {isEs ? "Contacto" : "Contact"}
            </span>
          </div>

          <h2
            id="contact-title"
            style={{
              fontFamily: "var(--gic-font-serif)",
              fontSize: "clamp(40px, 5vw, var(--gic-text-display))",
              fontWeight: 400,
              lineHeight: "var(--gic-leading-display)",
              letterSpacing: "var(--gic-tracking-display)",
              color: "var(--gic-dark-charcoal)",
              maxWidth: "560px",
            }}
          >
            {isEs ? "Hablemos sobre lo que quieres construir." : "Let's talk about what you want to build."}
          </h2>

          <p
            style={{
              fontFamily: "var(--gic-font-sans)",
              fontSize: "var(--gic-text-subheading)",
              lineHeight: 1.45,
              letterSpacing: "var(--gic-tracking-subheading)",
              color: "var(--gic-medium-gray)",
              maxWidth: "520px",
            }}
          >
            {isEs
              ? "Cuéntame la idea, el flujo o el producto que tienes en mente. Te respondo con el siguiente paso más claro."
              : "Share the idea, flow or product you have in mind. I will reply with the clearest next step."}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            {[
              { label: "GitHub", href: "https://github.com/AlejoReyna" },
              { label: "LinkedIn", href: "https://www.linkedin.com/in/alexis-alberto-reyna-sánchez-6953102b4" },
              { label: "Email", href: "mailto:hello@example.com" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                style={{
                  fontFamily: "var(--gic-font-sans)",
                  fontSize: "var(--gic-text-caption)",
                  fontWeight: 500,
                  color: "var(--gic-cofounder-blue)",
                  letterSpacing: "var(--gic-tracking-caption)",
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                }}
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="relative z-10 p-6 sm:p-8"
          style={{
            background: "var(--gic-canvas-white)",
            borderRadius: "var(--gic-radius-cards-large)",
            boxShadow: "var(--gic-shadow-subtle-2)",
          }}
          aria-live="polite"
        >
          <fieldset>
            <legend
              className="mb-4 block"
              style={{
                fontFamily: "var(--gic-font-sans)",
                fontSize: "var(--gic-text-caption)",
                fontWeight: 600,
                letterSpacing: "0.06em",
                color: "var(--gic-medium-gray)",
                textTransform: "uppercase",
              }}
            >
              {isEs ? "Me interesa..." : "I'm interested in..."}
            </legend>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => {
                const isActive = selectedInterest === interest;
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => setSelectedInterest(interest)}
                    className="transition-all active:scale-[0.98]"
                    style={{
                      border: isActive ? "1px solid var(--gic-action-azure)" : "1px solid var(--gic-cool-gray)",
                      background: isActive ? "rgba(65,161,207,0.08)" : "var(--gic-ash-gray)",
                      color: isActive ? "var(--gic-dark-charcoal)" : "var(--gic-slate-gray)",
                      borderRadius: "var(--gic-radius-nav-items-small)",
                      padding: "8px 12px",
                      fontFamily: "var(--gic-font-sans)",
                      fontSize: "var(--gic-text-caption)",
                      letterSpacing: "var(--gic-tracking-caption)",
                    }}
                    aria-pressed={isActive}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-6 space-y-5">
            <div>
              <label htmlFor="name" className="sr-only">
                {isEs ? "Tu nombre" : "Your name"}
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isEs ? "Tu nombre" : "Your name"}
                className="w-full focus:outline-none"
                style={fieldStyle}
                required
                autoComplete="name"
              />
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                {isEs ? "Tu correo" : "Your email"}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isEs ? "Tu correo" : "Your email"}
                className="w-full focus:outline-none"
                style={fieldStyle}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="message" className="sr-only">
                {isEs ? "Tu mensaje" : "Your message"}
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={isEs ? "Tu mensaje" : "Your message"}
                rows={5}
                className="w-full resize-y focus:outline-none"
                style={fieldStyle}
                required
              />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p
                style={{
                  fontFamily: "var(--gic-font-sans)",
                  fontSize: "var(--gic-text-caption)",
                  lineHeight: 1.5,
                  color: "var(--gic-medium-gray)",
                  letterSpacing: "var(--gic-tracking-caption)",
                }}
              >
                {isEs
                  ? "Al enviar aceptas ser contactado respecto a tu solicitud."
                  : "By sending, you agree to be contacted about your request."}
              </p>

              <button
                type="submit"
                disabled={isSubmitting || !name || !email || !message}
                className="group relative inline-flex items-center justify-center gap-2 transition-all active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  background: "var(--gic-night-sky)",
                  border: "1px solid var(--gic-rich-black)",
                  borderRadius: "var(--gic-radius-nav-items-small)",
                  color: "var(--gic-canvas-white)",
                  fontFamily: "var(--gic-font-sans)",
                  fontSize: "var(--gic-text-button-label)",
                  fontWeight: 500,
                  letterSpacing: "var(--gic-tracking-button-label)",
                  lineHeight: 1,
                  padding: "11px 16px",
                }}
              >
                <span>
                  {isSubmitting
                    ? isEs ? "Enviando..." : "Sending..."
                    : isEs ? "Enviar mensaje" : "Send Message"}
                </span>
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {submitted && (
              <p
                className="mt-2"
                style={{
                  fontFamily: "var(--gic-font-sans)",
                  fontSize: "15px",
                  color: "var(--gic-cofounder-blue)",
                  letterSpacing: "-0.012em",
                }}
              >
                {isEs
                  ? "Gracias! Me pondre en contacto pronto."
                  : "Thanks! I'll get back to you shortly."}
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

"use client";

import { useState, FormEvent } from "react";
import { useLanguage } from "@/components/lang-context";
import Image from "next/image";

type Interest =
  | "UI/UX design"
  | "Web design"
  | "Graphic design"
  | "Design system"
  | "Other";

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
      // Placeholder de envío
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
      className="relative overflow-hidden bg-black py-24 sm:py-28 lg:pl-24 xl:pl-28 sm:pt-7"
      aria-labelledby="contact-title"
    >
      {/* Background image: focal.png */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/focal.png"
          alt="Background"
          fill
          priority
          className="object-cover"
        />
      </div>
      {/* Orbes sutiles (match con tu estética) */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-24 left-10 h-96 w-96 rounded-full bg-gradient-to-br from-cyan-500/15 to-violet-600/10 blur-3xl"
          style={{ animation: "float-soft 8s ease-in-out infinite" }}
        />
        <div
          className="absolute -bottom-24 right-10 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-fuchsia-500/15 to-purple-700/10 blur-3xl"
          style={{ animation: "float-soft 8s ease-in-out infinite 2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-cyan-600/10 to-violet-800/10 blur-3xl"
          style={{ animation: "float-soft 10s ease-in-out infinite 1s" }}
        />
      </div>

      <div className="relative z-20 mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-2">
        {/* Columna izquierda: copy + contacto */}
        <div className="flex flex-col justify-center gap-6">
          <h2
            id="contact-title"
            className="text-4xl sm:text-5xl font-bold tracking-tight ml-8"
          >
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              {isEs ? "Hablemos" : "Let's discuss"}
            </span>
            <br />
            <span className="font-mono font-light text-gray-300">
              {isEs ? "de algo " : "on something "}
            </span>
            <span className="bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-violet-300 bg-clip-text text-transparent">
              {isEs ? "genial" : "cool"}
            </span>
            <span className="font-mono font-light text-gray-300">
              {isEs ? " juntos" : " together"}
            </span>
          </h2>

          <p className="text-gray-300/90 font-mono font-light leading-relaxed">
            {isEs
              ? "Cuéntame sobre tu idea, proyecto o lo que te gustaría construir. Respondo lo antes posible."
              : "Tell me about your idea, project, or what you'd like to build. I'll get back to you ASAP."}
          </p>

          {/* All icons in a single horizontal row aligned to the right */}
          <div className="flex items-center justify-end gap-3">
            {/* Social media icons */}
            <a
              aria-label="GitHub"
              href="#"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/40 text-gray-200 hover:text-white hover:bg-black/50 backdrop-blur-md transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .5a12 12 0 00-3.79 23.4c.6.11.82-.26.82-.58V20.9c-3.34.73-4.04-1.61-4.04-1.61-.55-1.38-1.34-1.75-1.34-1.75-1.09-.75.08-.73.08-.73 1.2.08 1.83 1.24 1.83 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.66-.31-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.31-.54-1.57.12-3.27 0 0 1.01-.32 3.3 1.23a11.48 11.48 0 016 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.7.24 2.96.12 3.27.77.84 1.23 1.9 1.23 3.22 0 4.61-2.8 5.61-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.83.58A12 12 0 0012 .5z" />
              </svg>
            </a>
            <a
              aria-label="LinkedIn"
              href="https://www.linkedin.com/in/alexis-alberto-reyna-sánchez-6953102b4"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/40 text-gray-200 hover:text-white hover:bg-black/50 backdrop-blur-md transition-colors"
            >
              {/* Real LinkedIn glyph from footer.tsx */}
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" role="img">
                <path d="M22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.205 24 24 23.227 24 22.271V1.729C24 .774 23.205 0 22.225 0zM7.034 20.452H3.89V9h3.144v11.452zM5.462 7.433a2.062 2.062 0 110-4.124 2.062 2.062 0 010 4.124zM20.452 20.452h-3.142v-5.569c0-1.328-.027-3.037-1.854-3.037-1.855 0-2.139 1.445-2.139 2.939v5.667H10.18V9h3.017v1.561h.043c.421-.8 1.451-1.852 3.352-1.852 3.584 0 3.86 2.36 3.86 5.425v6.318z" />
              </svg>
            </a>

            {/* WhatsApp icon */}
            <a
              aria-label="WhatsApp"
              href="#"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/40 text-gray-200 hover:text-white hover:bg-black/50 backdrop-blur-md transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
              </svg>
            </a>

            {/* Email icon */}
            <a
              aria-label="Email"
              href="mailto:hello@example.com"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/40 text-gray-200 hover:text-white hover:bg-black/50 backdrop-blur-md transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Columna derecha: tarjeta del formulario */}
        <div className="relative">
          {/* Halo suave */}
          <div className="pointer-events-none absolute -inset-0.5 -z-0 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-fuchsia-500/20 to-violet-600/20 blur-2xl opacity-40" />
          <form
            onSubmit={handleSubmit}
            className="relative z-10 rounded-3xl border border-white/10 bg-black/40 p-6 sm:p-8 shadow-2xl backdrop-blur-md"
            aria-live="polite"
          >
            <fieldset>
              <legend className="mb-3 block text-xs uppercase tracking-wider text-gray-300/80 font-mono">
                {isEs ? "Me interesa…" : "I’m interested in…"}
              </legend>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => {
                  const isActive = selectedInterest === interest;
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => setSelectedInterest(interest)}
                      className={`text-xs px-3 py-2 rounded-lg border font-mono transition-all
                        ${isActive
                          ? "border-cyan-500/30 bg-cyan-600/40 text-cyan-100 shadow-inner shadow-cyan-400/20"
                          : "border-gray-600/30 bg-gray-700/30 text-gray-200 hover:bg-gray-600/40"}`}
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
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-gray-200 placeholder-gray-400 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400"
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
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-gray-200 placeholder-gray-400 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400"
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
                  className="w-full resize-y rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-gray-200 placeholder-gray-400 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  required
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-gray-400 font-mono">
                  {isEs
                    ? "Al enviar aceptas ser contactado respecto a tu solicitud."
                    : "By sending, you agree to be contacted about your request."}
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting || !name || !email || !message}
                  className="group relative inline-flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-600/40 px-5 py-2.5 text-sm font-mono font-semibold text-cyan-100 shadow-inner shadow-cyan-400/10 transition-all hover:bg-cyan-500/50 hover:text-white hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>
                    {isSubmitting
                      ? isEs ? "Enviando…" : "Sending…"
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
                <p className="mt-2 text-sm text-emerald-400 font-mono">
                  {isEs
                    ? "¡Gracias! Me pondré en contacto pronto."
                    : "Thanks! I’ll get back to you shortly."}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Separador sutil (match Navbar/Hero) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    </section>
  );
}
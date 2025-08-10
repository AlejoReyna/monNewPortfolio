"use client";

import { useState, FormEvent } from "react";

type Interest =
  | "UI/UX design"
  | "Web design"
  | "Graphic design"
  | "Design system"
  | "Other";

export default function LetsTalk() {
  const [selectedInterest, setSelectedInterest] = useState<Interest | null>(
    "UI/UX design"
  );
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
      // Placeholder: here you could POST to an API route or external service
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
      className="relative overflow-hidden bg-gradient-to-b from-black via-gray-950 to-black py-24 sm:py-28"
      aria-labelledby="contact-title"
    >
      {/* Background gradient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-24 left-10 h-96 w-96 rounded-full bg-gradient-to-br from-fuchsia-600/20 to-violet-600/10 blur-3xl"
          style={{ animation: "float-soft 8s ease-in-out infinite" }}
        />
        <div
          className="absolute -bottom-24 right-10 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-cyan-600/20 to-blue-600/10 blur-3xl"
          style={{ animation: "float-soft 8s ease-in-out infinite 2s" }}
        />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 md:grid-cols-2">
        {/* Left column: copy + contact info */}
        <div className="flex flex-col justify-center gap-6">
          <h2
            id="contact-title"
            className="text-4xl font-bold text-white sm:text-5xl"
          >
            Let’s discuss
            <br />
            on something <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">cool</span>
            <br />
            together
          </h2>

          <ul className="mt-2 space-y-4 text-gray-300">
            <li className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/30 text-gray-200">
                {/* Mail icon */}
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16v12H4z" />
                  <path d="M22 6l-10 7L2 6" />
                </svg>
              </span>
              <a className="hover:text-white" href="mailto:hello@example.com">hello@example.com</a>
            </li>
            <li className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/30 text-gray-200">
                {/* Phone icon */}
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 5l4-2 4 8-3 1c1 2 3 4 5 5l1-3 8 4-2 4c-6 1-13-6-17-13z" />
                </svg>
              </span>
              <span>+1 234 567 890</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/30 text-gray-200">
                {/* Location icon */}
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 21s-7-5.686-7-11a7 7 0 1114 0c0 5.314-7 11-7 11z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              <span>Remote • Worldwide</span>
            </li>
          </ul>

          <div className="mt-4 flex items-center gap-3 text-gray-300">
            <a
              aria-label="GitHub"
              href="#"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/30 transition-colors hover:text-white"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .5a12 12 0 00-3.79 23.4c.6.11.82-.26.82-.58V20.9c-3.34.73-4.04-1.61-4.04-1.61-.55-1.38-1.34-1.75-1.34-1.75-1.09-.75.08-.73.08-.73 1.2.08 1.83 1.24 1.83 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.66-.31-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.31-.54-1.57.12-3.27 0 0 1.01-.32 3.3 1.23a11.48 11.48 0 016 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.7.24 2.96.12 3.27.77.84 1.23 1.9 1.23 3.22 0 4.61-2.8 5.61-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.83.58A12 12 0 0012 .5z" />
              </svg>
            </a>
            <a
              aria-label="LinkedIn"
              href="#"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/30 transition-colors hover:text-white"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4zM8.5 8h3.8v2.2h.05c.53-1 1.82-2.2 3.75-2.2 4 0 4.75 2.63 4.75 6v7.99h-4V15.5c0-2 0-4.5-2.75-4.5s-3.17 2.15-3.17 4.36V24h-4z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Right column: form card */}
        <div className="relative">
          <div className="glow-ring absolute -inset-0.5 -z-0 rounded-3xl opacity-40" />
          <form
            onSubmit={handleSubmit}
            className="relative z-10 rounded-3xl border border-white/10 bg-white/[0.02] p-6 shadow-2xl backdrop-blur-sm sm:p-8"
          >
            <fieldset>
              <legend className="mb-3 block text-sm font-medium text-gray-300">
                I’m interested in…
              </legend>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => {
                  const isActive = selectedInterest === interest;
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => setSelectedInterest(interest)}
                      className={
                        "rounded-full border px-3 py-1.5 text-sm transition-all " +
                        (isActive
                          ? "border-transparent bg-gradient-to-r from-fuchsia-600/70 to-violet-600/70 text-white shadow-inner"
                          : "border-white/15 bg-black/30 text-gray-300 hover:bg-white/5")
                      }
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
                  Your name
                </label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-md border border-white/10 bg-black/20 px-4 py-3 text-gray-200 placeholder-gray-400 outline-none ring-0 transition focus:border-white/20 focus:bg-black/30"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">
                  Your email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="w-full rounded-md border border-white/10 bg-black/20 px-4 py-3 text-gray-200 placeholder-gray-400 outline-none transition focus:border-white/20 focus:bg-black/30"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">
                  Your message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your message"
                  rows={5}
                  className="w-full resize-y rounded-md border border-white/10 bg-black/20 px-4 py-3 text-gray-200 placeholder-gray-400 outline-none transition focus:border-white/20 focus:bg-black/30"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">
                  By sending, you agree to be contacted about your request.
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting || !name || !email || !message}
                  className="group relative inline-flex items-center gap-2 rounded-full gradient-border bg-gradient-to-r from-slate-800/80 via-blue-900/60 to-violet-900/70 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-60"
                >
                  <span>{isSubmitting ? "Sending…" : "Send Message"}</span>
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {submitted && (
                <p className="mt-2 text-sm text-emerald-400">Thanks! I’ll get back to you shortly.</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}



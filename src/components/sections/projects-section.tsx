"use client";

import { useMemo } from "react";
import { motion, MotionConfig } from "framer-motion";
import { useLanguage } from "@/components/lang-context";

/* -------------------------------------------
   Motion helpers
------------------------------------------- */
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { when: "beforeChildren", staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// Tilt/parallax on hover (sin librerías)
function withTilt(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  const el = e.currentTarget as HTMLDivElement;
  const rect = el.getBoundingClientRect();
  const px = (e.clientX - rect.left) / rect.width;
  const py = (e.clientY - rect.top) / rect.height;
  el.style.setProperty("--px", String(px));
  el.style.setProperty("--py", String(py));
}

/* -------------------------------------------
   Reusable Card
------------------------------------------- */
type CardProps = {
  kind?: "video" | "image" | "empty";
  media?: string;
  badge?: string;
  date?: string;
  kicker?: string;
  title: string;
  desc?: string;
  links?: { href: string; label: string }[];
  className?: string;
  gradient?: string;
};

function Card({
  kind = "image",
  media,
  badge,
  date,
  kicker,
  title,
  desc,
  links = [],
  className = "",
  gradient = "from-black/70 via-black/40 to-transparent",
}: CardProps) {
  return (
    <motion.article
      variants={item}
      className={[
        "group relative overflow-hidden border border-white/10 rounded-2xl",
        "bg-black/40 backdrop-blur-sm will-change-transform",
        className,
      ].join(" ")}
      onMouseMove={withTilt}
      style={{
        transform:
          "perspective(900px) rotateX(calc((0.5 - var(--py, .5)) * 3deg)) rotateY(calc((var(--px, .5) - 0.5) * 6deg))",
        transition: "transform 120ms ease-out",
      }}
    >
      {/* Media */}
      {kind !== "empty" && (
        <>
          {kind === "video" ? (
            <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline>
              <source src={media} type="video/mp4" />
            </video>
          ) : (
            <img
              src={media}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          )}
          <div className={`absolute inset-0 bg-gradient-to-t ${gradient}`} />
          <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-white/5" />
        </>
      )}

      {/* Badge */}
      {badge && (
        <span className="absolute top-4 right-4 z-20 rounded-full bg-white/15 border border-white/20 backdrop-blur px-3 py-1 text-[10px] tracking-wide text-white">
          {badge}
        </span>
      )}

      {/* Content */}
      <div className="relative z-10 flex h-full items-end">
        <div className="w-full text-white bg-black/55 backdrop-blur-sm p-6 md:p-7 rounded-t-xl">
          {date && <p className="text-white/70 text-xs md:text-sm mb-2">{date}</p>}
          {kicker && <p className="text-white/70 text-xs mb-1">{kicker}</p>}
          <h3 className="font-mono font-light leading-tight text-xl md:text-2xl">{title}</h3>
          {desc && <p className="mt-2 text-white/85 text-sm md:text-[15px]">{desc}</p>}

          {!!links.length && (
            <div className="mt-3 flex flex-wrap items-center gap-4 text-[12px] text-white/80">
              {links.map((l) => (
                <a
                  key={l.href + l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-white"
                >
                  {l.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

/* -------------------------------------------
   Page
------------------------------------------- */
export default function ProjectsSection() {
  const { language } = useLanguage();
  const isEs = language === "es";

  const copy = useMemo(
    () => ({
      featured: {
        title: isEs ? "Proyectos destacados" : "Featured projects",
        desc: isEs
          ? "Selección curada de trabajos recientes: diseño editorial, branding y experiencias interactivas."
          : "A curated selection of recent work: editorial design, branding, and interactive experiences.",
      },
      hack: isEs ? "Proyectos de hackathon" : "Hackathon projects",
    }),
    [isEs]
  );

  return (
    <MotionConfig transition={{ duration: 0.5, ease: "easeOut" }}>
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-black mt-24">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="w-full max-w-none px-4 text-center"
        >
          {/* Header */}
          <motion.div variants={item} className="text-left mb-4">
            <h4 className="font-mono text-2xl md:text-3xl text-white/90 tracking-wide">
              {copy.featured.title}
            </h4>
            <p className="text-white/70 text-sm md:text-base">{copy.featured.desc}</p>
          </motion.div>

          {/* FILA SUPERIOR: 2/3 + 1/3 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 auto-rows-[180px] md:auto-rows-[200px] xl:auto-rows-[240px] gap-6 lg:gap-8 text-left mx-auto">
            <Card
              kind="video"
              media="/plebes_video.mp4"
              badge={isEs ? "MODA" : "FASHION"}
              date={isEs ? "Hace 1 día" : "1 day ago"}
              title={isEs ? "Plebes DAO | Diseño UX/UI" : "Plebes DAO | UX/UI Design"}
              desc={
                isEs
                  ? "Breve descripción del post: lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod."
                  : "Short post description: lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod."
              }
              className="lg:col-span-2 lg:row-span-2 min-h-[360px]"
              gradient="from-black/85 via-black/50 to-transparent"
            />

            <Card
              kind="image"
              media="/wedding_cover.jpg"
              badge={isEs ? "BODAS" : "WEDDINGS"}
              date={isEs ? "Hace 2 días" : "2 days ago"}
              title="Andrea & Aldo | Wedding invitation"
              desc={
                isEs
                  ? "Breve descripción del post: lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod."
                  : "Short post description: lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod."
              }
              className="lg:row-span-2 min-h-[360px]"
              gradient="from-black/70 via-black/40 to-transparent"
            />
          </div>

          {/* FILA INFERIOR 55% / 45% */}
          <div className="mt-6 grid grid-cols-1 lg:[grid-template-columns:55%_45%] gap-6 lg:gap-8 text-left mx-auto">
            <Card
              kind="image"
              media="/mk-banner.png"
              badge="LANDING"
              kicker={isEs ? "Caso de estudio" : "Case study"}
              title={`MK1 Presale — ${isEs ? "Landing inmersiva" : "Immersive landing"}`}
              desc={
                isEs
                  ? "Next.js + backend de correos / pre-registros en PostgreSQL; confirmación con Nodemailer."
                  : "Next.js + backend for emails / preorders in PostgreSQL; confirmation via Nodemailer."
              }
              links={[
                { href: "https://github.com/AlejoReyna/MortalKombat", label: "GitHub" },
                { href: "https://next-mk.vercel.app", label: isEs ? "Demo en vivo" : "Live demo" },
              ]}
              className="min-h-[240px] xl:min-h-[280px]"
              gradient="from-[#5e0032]/40 via-[#28175e]/40 to-black/60"
            />

            <Card
              kind="empty"
              badge={isEs ? "PORTAFOLIO" : "PORTFOLIO"}
              title={`PokeFolio — ${isEs ? "Portfolio estilo Pokémon" : "Pokémon-style portfolio"}`}
              desc={
                isEs
                  ? "Typewriter + diálogo estilo Pokémon, reproductor de música y navegación a proyectos. Next.js + Tailwind."
                  : "Typewriter + Pokémon-style dialog, music player, and projects navigation. Built with Next.js + Tailwind."
              }
              links={[
                { href: "https://github.com/AlejoReyna/PokeFolio", label: "GitHub" },
                { href: "https://poke-folio.vercel.app", label: isEs ? "Demo en vivo" : "Live demo" },
              ]}
              className="min-h-[200px] xl:min-h-[240px]"
              gradient="from-black/45 via-[#28175e]/30 to-[#5e0032]/40"
            />
          </div>

          {/* -------- OPEN SOURCE: 100vh -------- */}
          <motion.div
            variants={item}
            id="open-source"
            className="h-screen flex flex-col justify-center text-left mt-10"
          >
            <div className="h-px bg-gradient-to-r from-white/30 via-white/15 to-transparent mb-4" />
            <h4 className="font-mono text-2xl md:text-3xl text-white/90 tracking-wide">
              Open source project:{" "}
              <span className="text-xs text-gray-400 uppercase tracking-tight font-mono font-light">
                UANL Scholar services UI update
              </span>
            </h4>

            <section className="mt-6 flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-stretch">
              {/* Texto */}
              <motion.article
                variants={item}
                className="relative lg:col-span-3 overflow-hidden bg-black/40 p-6 md:p-8 text-white rounded-2xl border border-white/10 flex flex-col justify-center"
              >
                <span className="absolute top-4 right-4 z-20 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[10px] font-medium text-white backdrop-blur shadow-sm">
                  status: still working on it
                </span>

                <p className="text-white/70 text-sm mb-2">
                  {isEs ? "Extensión Chrome/Firefox (MV3) · Vite + TypeScript" : "Chrome/Firefox Extension (MV3) · Vite + TypeScript"}
                </p>

                <h5 className="text-2xl md:text-3xl font-mono font-light leading-tight">
                  UANL Interface+ — {isEs ? "Actualiza la UI de SIASE/Deimos" : "Modernizes SIASE/Deimos UI"}
                </h5>

                <p className="mt-3 text-white/85 text-sm max-w-2xl">
                  {isEs
                    ? "Inyecta UI propia, reorganiza menús y mejora la UX en páginas con frames. Content scripts + Shadow DOM."
                    : "Injects a custom UI layer, reorganizes menus and improves UX on frame-based pages. Content scripts + Shadow DOM."}
                </p>

                <h6 className="mt-5 font-mono text-lg">{isEs ? "Cómo ejecutar" : "How to run"}</h6>
                <pre className="mt-2 rounded-lg bg-black/60 p-4 text-[12px] leading-relaxed overflow-x-auto border border-white/10">
{`git clone https://github.com/AlejoReyna/UANLInterface.git
cd UANLInterface
npm install   # pnpm i / yarn
npm run build # genera /dist con manifest.json`}
                </pre>

                <div className="mt-5 flex flex-wrap items-center gap-4 text-[12px] text-white/80">
                  <a
                    href="https://github.com/AlejoReyna/UANLInterface"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-white"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://uanl-interface.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-white"
                  >
                    {isEs ? "Sitio / Demo" : "Site / Demo"}
                  </a>
                </div>
              </motion.article>

              {/* Video */}
              <motion.aside
                variants={item}
                className="relative lg:col-span-2 overflow-hidden border border-white/10 rounded-2xl"
              >
                <video className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline>
                  <source src="/preview-siase.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40" />
              </motion.aside>
            </section>
          </motion.div>

          {/* -------- Hackathon -------- */}
          <motion.section variants={item} className="mt-10 text-left">
            <div className="h-px bg-gradient-to-r from-white/30 via-white/15 to-transparent mb-4" />
            <h4 className="font-mono text-2xl md:text-3xl text-white/90 tracking-wide mb-6">
              {copy.hack}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              <Card
                kind="image"
                media="/eth_merida.png"
                title={`mpBot — ${isEs ? "DeFi en un chatbot" : "DeFi in a chatbot"}`}
                desc={
                  isEs
                    ? "Bot de Telegram para staking Meta Pool y Q&A. Next.js + Telegraf + OpenAI."
                    : "Telegram bot for Meta Pool staking & DeFi Q&A. Next.js + Telegraf + OpenAI."
                }
                date="Sep 2024 · ETH Mérida"
                links={[
                  { href: "https://github.com/AlejoReyna/mpBOT", label: "GitHub" },
                  { href: "https://t.me/PoolitoAssistantBot", label: isEs ? "Probar en Telegram" : "Try on Telegram" },
                ]}
                className="min-h-[520px]"
                gradient="from-[#5e0032]/40 via-[#28175e]/40 to-black/60"
              />

              <Card
                kind="image"
                media="https://raw.githubusercontent.com/AlejoReyna/Birdlypay/main/BIRDLY_PAY_BANNER.jpg"
                badge="BASE · ONCHAIN SUMMER"
                title={`Birdlypay — ${isEs ? "Links de pago on-chain" : "On-chain payment links"}`}
                desc={
                  isEs
                    ? "Crear enlaces de pago compartibles. Next.js + TS + Thirdweb; contratos en Solidity."
                    : "Create shareable payment links. Next.js + TS + Thirdweb; Solidity contracts."
                }
                links={[
                  { href: "https://github.com/AlejoReyna/Birdlypay", label: "GitHub" },
                  { href: "https://birdlypay.vercel.app", label: isEs ? "Demo en vivo" : "Live demo" },
                ]}
                className="min-h-[520px]"
              />

              <Card
                kind="image"
                media="/avocado.PNG"
                title={`NiftyRewards — ${isEs ? "Lealtad con NFTs + tokens" : "Loyalty with NFTs + tokens"}`}
                desc={
                  isEs
                    ? "Sistema de recompensas con tokens y NFTs. Front TS + lógica/contratos en Rust."
                    : "Rewards system with fungible tokens & NFTs. TS frontend + Rust logic/contracts."
                }
                date={isEs ? "Jun 2023 · Proyecto personal" : "Jun 2023 · Side project"}
                links={[{ href: "https://github.com/eliasg24/NiftyRewards", label: "GitHub" }]}
                className="min-h-[520px]"
                gradient="from-[#5e0032]/30 via-black/40 to-[#28175e]/50"
              />
            </div>
          </motion.section>
        </motion.div>
      </div>
    </MotionConfig>
  );
}
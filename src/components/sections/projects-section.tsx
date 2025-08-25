"use client";

import { useLanguage } from "@/components/lang-context";

export default function ProjectsSection() {
  const { language } = useLanguage();
  const isEs = language === "es";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-black mt-24">
      <div className="w-full max-w-none px-4 text-center">
        {/* --- Responsive editorial grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 auto-rows-[200px] md:auto-rows-[220px] xl:auto-rows-[260px] gap-6 lg:gap-8 text-left mx-auto">
          {/* Lead (big) card */}
          <article className="relative overflow-hidden rounded-2xl lg:col-span-2 lg:row-span-2 group border border-white/10">
            <video
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="/plebes_video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <span className="absolute top-4 right-4 rounded-full bg-white/20 backdrop-blur px-3 py-1 text-xs text-white tracking-wide">
              {isEs ? "MODA" : "FASHION"}
            </span>
            <div className="relative z-10 flex h-full items-end">
              <div className="w-full text-white bg-black/60 backdrop-blur-sm p-6 md:p-8 rounded-t-lg">
                <p className="text-white/70 text-base mb-2">
                  {isEs ? "Hace 1 día" : "1 day ago"}
                </p>
                <h3 className="text-2xl md:text-3xl font-mono font-light leading-tight">
                  {isEs
                    ? "Plebes DAO | Diseño UX/UI"
                    : "Plebes DAO | UX/UI Design"}
                </h3>
                <p className="mt-3 text-white/85 text-base">
                  {isEs
                    ? "Breve descripción del post: lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod."
                    : "Short post description: lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod."}
                </p>
              </div>
            </div>
          </article>

          {/* Tall card */}
          <article className="relative overflow-hidden rounded-2xl lg:row-span-2 group border border-white/10">
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
            <span className="absolute top-4 right-4 rounded-full bg-white/20 backdrop-blur px-3 py-1 text-xs text-white tracking-wide">
              {isEs ? "BODAS" : "WEDDINGS"}
            </span>
            <div className="relative z-10 flex h-full items-end">
              <div className="w-full text-white bg-black/60 backdrop-blur-sm p-6 md:p-8 rounded-t-lg">
                <p className="text-white/70 text-base mb-2">
                  {isEs ? "Hace 2 dias" : "2 days ago"}
                </p>
                <h3 className="text-2xl md:text-3xl font-mono font-light leading-tight">
                  Andrea & Aldo | Wedding invitation
                </h3>
                <p className="mt-3 text-white/85 text-base">
                  {isEs
                    ? "Breve descripción del post: lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod."
                    : "Short post description: lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod."}
                </p>
              </div>
            </div>
          </article>
        </div>

        {/* --- Divider with left-aligned title (Open Source) --- */}
        <div className="mt-10 text-left">
          <div className="h-px bg-gradient-to-r from-white/30 via-white/15 to-transparent mb-4" />
          <h4 className="font-mono text-2xl md:text-3xl text-white/90 tracking-wide">
            Open source project:{" "}
            <span className="text-xs text-gray-400 uppercase tracking-tight font-mono font-light">
              UANL Scholar services UI update
            </span>
          </h4>
        </div>

        {/* --- Hackathon projects --- */}
        <section className="mt-10 text-left">
          {/* Section header */}
          <div className="h-px bg-gradient-to-r from-white/30 via-white/15 to-transparent mb-4" />
          <h4 className="font-mono text-2xl md:text-3xl text-white/90 tracking-wide mb-6">
            {isEs ? "Proyectos de hackathon" : "Hackathon projects"}
          </h4>

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1 */}
            {/* Card 1 (mpBot) */}
{/* Card 1 (mpBot) + badge 3er lugar */}
<article className="relative overflow-hidden rounded-2xl border border-white/10 group min-h-[600px]">
  <img
    src="/eth_merida.png"
    alt="Ethereum México Mérida 2024"
    className="absolute inset-0 w-full h-full object-cover"
  />
  <div className="absolute inset-0 bg-gradient-to-br from-[#5e0032]/40 via-[#28175e]/40 to-black/60" />
  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/5" />

  {/* Badge 3er lugar - positioned at top right with better prominence */}
  <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
    <span className="inline-flex items-center gap-2 rounded-full border-2 border-yellow-400/50 bg-gradient-to-r from-yellow-500/20 to-amber-600/20 px-4 py-2 text-xs font-semibold text-yellow-200 backdrop-blur-md shadow-lg">
      <span aria-hidden className="text-yellow-300">🏆</span>
      {isEs ? "3er lugar" : "3rd place"}
    </span>
    <span className="rounded-full bg-white/15 backdrop-blur px-3 py-1 text-[10px] text-white/80 tracking-wide">
      {isEs ? "48 h" : "48h"}
    </span>
  </div>
  <div className="relative z-10 flex h-full items-end">
    <div className="w-full text-white bg-black/60 backdrop-blur-sm p-5 rounded-t-lg">
      <p className="text-white/70 text-sm mb-1">
        {isEs ? "Sep 2024 · ETH Mérida" : "Sep 2024 · ETH Mérida"}
      </p>
      <h5 className="text-xl font-mono font-light">
        mpBot — {isEs ? "DeFi en un chatbot" : "DeFi in a chatbot"}
      </h5>
      <p className="mt-2 text-white/85 text-sm">
        {isEs
          ? "Bot de Telegram (Poolito) para recomendaciones y staking con Meta Pool, construido con Next.js + Telegraf + OpenAI."
          : "Telegram bot (Poolito) for Meta Pool staking and DeFi Q&A, built with Next.js + Telegraf + OpenAI."}
      </p>

      {/* Links */}
      <div className="mt-3 flex gap-4 text-[12px] text-white/80">
        <a
          href="https://github.com/AlejoReyna/mpBOT"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-white"
        >
          GitHub
        </a>
        <a
          href="https://t.me/PoolitoAssistantBot"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-white"
        >
          {isEs ? "Probar en Telegram" : "Try on Telegram"}
        </a>
      </div>
    </div>
  </div>
</article>

            {/* Card 2 */}
            {/* Card 2 (Birdlypay) */}
<article className="relative overflow-hidden rounded-2xl border border-white/10 group min-h-[600px]">
  <img
    src="https://raw.githubusercontent.com/AlejoReyna/Birdlypay/main/BIRDLY_PAY_BANNER.jpg"
    alt="Birdlypay — Onchain payment links"
    className="absolute inset-0 w-full h-full object-cover"
  />
  <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-[#28175e]/40 to-black/60" />
  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/5" />
  <span className="absolute top-4 right-4 rounded-full bg-white/20 backdrop-blur px-3 py-1 text-[10px] text-white tracking-wide">
    BASE · ONCHAIN SUMMER
  </span>
  <div className="relative z-10 flex h-full items-end">
    <div className="w-full text-white bg-black/60 backdrop-blur-sm p-5 rounded-t-lg">
      <p className="text-white/70 text-sm mb-1">2025 · Base</p>
      <h5 className="text-xl font-mono font-light">
        Birdlypay — {isEs ? "Links de pago on-chain" : "On-chain payment links"}
      </h5>
      <p className="mt-2 text-white/85 text-sm">
        {isEs
          ? "dApp para crear enlaces de pago compartibles a nivel global (con planes de más funciones DeFi). Construido con Next.js + TypeScript + Thirdweb; contratos en Solidity."
          : "dApp to create shareable payment links worldwide (with plans for more DeFi features). Built with Next.js + TypeScript + Thirdweb; Solidity contracts."}
      </p>

      {/* Links */}
      <div className="mt-3 flex flex-wrap items-center gap-4 text-[12px] text-white/80">
        <a
          href="https://github.com/AlejoReyna/Birdlypay"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-white"
        >
          GitHub
        </a>
        <a
          href="https://birdlypay.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-white"
        >
          {isEs ? "Demo en vivo" : "Live demo"}
        </a>
        <span
          className="font-mono text-[11px] text-white/70"
          title="PaymentLink contract: 0xf3F7F05406d9F2B4EcB43Cc240bd6657bB6A8f7f"
        >
          0xf3F7…8f7f
        </span>
      </div>
    </div>
  </div>
</article>

            {/* Card 3 */}
            {/* Card 3 (NiftyRewards) + badge 3er lugar */}
<article className="relative overflow-hidden rounded-2xl border border-white/10 group min-h-[600px]">
  <img
    src="/avocado.PNG"
    alt="NiftyRewards — Loyalty rewards with NFTs"
    className="absolute inset-0 w-full h-full object-cover"
  />
  <div className="absolute inset-0 bg-gradient-to-br from-[#5e0032]/30 via-black/40 to-[#28175e]/50" />
  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/5" />

  {/* Badge 3er lugar - positioned at top right with better prominence */}
  <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
    <span className="inline-flex items-center gap-2 rounded-full border-2 border-yellow-400/50 bg-gradient-to-r from-yellow-500/20 to-amber-600/20 px-4 py-2 text-xs font-semibold text-yellow-200 backdrop-blur-md shadow-lg">
      <span aria-hidden className="text-yellow-300">🏆</span>
      {isEs ? "3er lugar" : "3rd place"}
    </span>
    <span className="rounded-full bg-white/15 backdrop-blur px-3 py-1 text-[10px] text-white/80 tracking-wide">
      Web3
    </span>
  </div>

  <div className="relative z-10 flex h-full items-end">
    <div className="w-full text-white bg-black/60 backdrop-blur-sm p-5 rounded-t-lg">
      <p className="text-white/70 text-sm mb-1">
        {isEs ? "Jun 2023 · Side project" : "Jun 2023 · Side project"}
      </p>

      <h5 className="text-xl font-mono font-light">
        NiftyRewards — {isEs ? "Lealtad con NFTs + tokens" : "Loyalty with NFTs + tokens"}
      </h5>

      <p className="mt-2 text-white/85 text-sm">
        {isEs
          ? "Sistema de recompensas con tokens fungibles y NFTs. Frontend en TypeScript y lógica/contratos en Rust."
          : "Rewards system using fungible tokens and NFTs. TypeScript frontend and Rust logic/contracts."}
      </p>

      {/* Links */}
      <div className="mt-3 flex gap-4 text-[12px] text-white/80">
        <a
          href="https://github.com/eliasg24/NiftyRewards"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-white"
        >
          GitHub
        </a>
      </div>
    </div>
  </div>
</article>
          </div>
        </section>
      </div>
    </div>
  );
}
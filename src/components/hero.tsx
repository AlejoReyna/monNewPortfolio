"use client";
import Image from "next/image";
import ChatInterface from "./chat-interface";

type HeroProps = {
  className?: string;
};

export default function Hero({ className }: HeroProps) {
  return (
    <section className={`relative min-h-screen overflow-hidden bg-black ${className ?? ""}`}>
      {/* Grid: 1 col en mobile; 60/40 desde lg */}
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[60%_40%] items-stretch pt-64 sm:pt-72 lg:pt-80">
        {/* Chat (izquierda) - Mayor z-index en sm/md para estar al frente */}
        <div className="relative flex flex-col justify-center px-4 sm:px-6 lg:px-8 z-20 sm:z-20 md:z-20 lg:z-10">          <ChatInterface />
        </div>

        {/* GIF overlay: detrás de las bubbles en sm/md; layout original en lg+ */}
        <div className="pointer-events-none absolute inset-0 h-full lg:relative lg:h-auto lg:overflow-visible z-0 sm:z-0 md:z-0 lg:z-20">
          <Image
            src="/16.gif"
            alt="Animated background"
            fill
            priority
            unoptimized
            // En mobile y tablet centrado; desde lg, más hacia la izquierda y con zoom
            className="object-contain sm:object-contain lg:object-left origin-left
                       scale-[1.15] sm:scale-[1.25] md:scale-[1.125] lg:scale-[1.55] lg:translate-x-[-20px]"
          />
        </div>
      </div>

      {/* Separador inferior */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    </section>
  );
}
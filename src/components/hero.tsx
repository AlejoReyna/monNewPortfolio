"use client";
import Image from "next/image";
import ChatInterface from "./chat-interface";

type HeroProps = {
  className?: string;
};

export default function Hero({ className }: HeroProps) {
  return (
    <section className={`relative min-h-screen overflow-hidden bg-black ${className ?? ""}`}>
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

        {/* Grid: 1 col en mobile; 60/40 desde lg with padding for macOS-style navbar and top bar */}
        <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[60%_40%] items-stretch lg:pl-24 xl:pl-28 lg:pt-7">
        {/* Chat (izquierda) - Siempre al frente */}
        <div className="relative flex flex-col justify-end sm:justify-end lg:justify-center px-4 sm:px-6 lg:px-8 z-30 min-h-screen pt-16 sm:pt-20 lg:pt-0 pb-0 sm:pb-0">
          <ChatInterface />
        </div>

        {/* GIF overlay: Encima del background pero detrás del chat */}
        <div className="pointer-events-none absolute inset-0 h-full lg:relative lg:h-auto lg:overflow-visible z-10">
          <Image
            src="/16.gif"
            alt="Animated overlay"
            fill
            priority
            unoptimized
            // En mobile y tablet centrado; desde lg, más hacia la izquierda y con zoom
            className="mt-[8vh] md:mt-[20vh] lg:mt-[28vh] object-contain sm:object-contain object-center sm:object-center lg:object-left origin-center lg:origin-left
                       scale-[1.4] sm:scale-[1] md:scale-[1.224] lg:scale-[1.728] xl:scale-[1.50]  lg:translate-x-[-200px]"
          />
        </div>
      </div>

      {/* Separador inferior */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    </section>
  );
}
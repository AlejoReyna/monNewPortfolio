"use client";
import Image from "next/image";
import ChatInterface from "./chat-interface";
import DraggableTerminal from "./DraggableTerminal";

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
      
      {/* GIF debajo del chat */}
      <div className="pointer-events-none absolute inset-0 h-full z-10">
        <Image
          src="/16.gif"
          alt="Animated overlay"
          fill
          priority
          unoptimized
          className="mt-[10vh] md:mt-[20vh] lg:mt-[28vh] object-contain object-center lg:object-right
                     origin-center lg:origin-right scale-[1.1] sm:scale-[0.95] md:scale-[1.2]
                     lg:scale-[1.35] xl:scale-[1.45] lg:translate-x-[200px]"
        />
      </div>

      {/* (Opcional) grilla para otros contenidos; puede quedar vacía */}
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[60%_40%] items-stretch lg:pl-24 xl:pl-28 pt-7" />

      {/* === Overlay con ventana draggable (por encima del GIF) === */}
      <DraggableTerminal
        sidebarWidth={96}
        topSafe={16}
        rightSafe={16}
        bottomSafe={16}
        defaultPos={{ x: 0, y: 120 }}
        zIndex={30}
        rememberPosition={false}
      >
        {/* No cambies ChatInterface por dentro */}
        <div className="px-4 sm:px-0">
          <ChatInterface />
        </div>
      </DraggableTerminal>

      {/* Separador inferior */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    </section>
  );
}
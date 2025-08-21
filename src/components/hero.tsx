"use client";
import Image from "next/image";
import ChatInterface from "./chat-interface";

type HeroProps = {
  className?: string;
};

export default function Hero({ className }: HeroProps) {

  return (
    <section
      className={`relative min-h-screen overflow-hidden flex flex-col justify-end pb-12 bg-black ${className ?? ""}`}
    >
      {/* GIF Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/16.gif"
          alt="Animated background"
          fill
          className="object-contain bg-transparent"
          unoptimized
          priority
        />
      </div>

      {/* Chat Interface Component */}
      <ChatInterface />

      {/* Separator */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    </section>
  );
}

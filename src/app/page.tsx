"use client";

import { useState, useEffect } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: unknown;
    }
  }
}

interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
}

function Typewriter({ text, speed = 50, delay = 0, onComplete }: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (delay > 0) {
      const delayTimer = setTimeout(() => setIsTyping(true), delay);
      return () => clearTimeout(delayTimer);
    } else {
      setIsTyping(true);
    }
  }, [delay]);

  useEffect(() => {
    if (!isTyping) return;

    if (displayedText.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);

      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [displayedText, text, speed, isTyping, onComplete]);

  return (
    <span className="font-mono">
      {displayedText}
      <span className="animate-blink inline-block w-0.5 h-5 bg-black ml-1 align-middle">|</span>
    </span>
  );
}

export default function Home() {
  const [showLine2, setShowLine2] = useState(false);
  const [showLine3, setShowLine3] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#1a1a1a] p-8 text-left text-[#00ff00] font-mono relative overflow-hidden">
      {/* Scan lines effect */}
      <div className="absolute inset-0 pointer-events-none opacity-30" 
           style={{
             backgroundImage: `repeating-linear-gradient(
               0deg,
               transparent,
               transparent 2px,
               rgba(0, 255, 0, 0.1) 2px,
               rgba(0, 255, 0, 0.1) 4px
             )`,
             animation: 'scan-lines 0.1s linear infinite'
           }}
      />
      
      {/* Paper texture overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
           }}
      />

      <div className="max-w-2xl w-full relative z-10">
        {/* Header */}
        <div className="mb-8 border-b border-[#00ff00]/30 pb-4">
          <Typewriter 
            text="╔═══════════════════════════════════════════════════════╗"
            speed={20}
          />
        </div>
        
        <div className="mb-2">
          <Typewriter 
            text="║  CASE FILE #404                                    ║"
            speed={20}
            delay={800}
          />
        </div>
        
        <div className="mb-8 border-b border-[#00ff00]/30 pb-4">
          <Typewriter 
            text="╚═══════════════════════════════════════════════════════╝"
            speed={20}
            delay={1600}
          />
        </div>

        {/* Report content */}
        <div className="space-y-4 text-sm leading-relaxed">
          <div>
            <Typewriter 
              text="STATUS: [REDACTED]"
              speed={30}
              delay={2400}
            />
          </div>
          
          <div>
            <Typewriter 
              text="DATE: [CLASSIFIED]"
              speed={30}
              delay={3200}
            />
          </div>
          
          <div className="mt-6">
            <Typewriter 
              text="REPORT:"
              speed={30}
              delay={4000}
            />
          </div>
          
          <div className="pl-4 border-l-2 border-[#00ff00]/20">
            <Typewriter 
              text="Subject website reported as 'down' due to"
              speed={40}
              delay={4800}
              onComplete={() => setShowLine2(true)}
            />
          </div>
          
          {showLine2 && (
            <div className="pl-4 border-l-2 border-[#00ff00]/20">
              <Typewriter 
                text="alleged Cloudflare interference."
                speed={40}
                delay={0}
                onComplete={() => setShowLine3(true)}
              />
            </div>
          )}
          
          {showLine3 && (
            <div className="mt-6 pl-4 border-l-2 border-[#00ff00]/20 italic text-[#00ff00]/70">
              <Typewriter 
                text="(NOTE: Investigation reveals subject simply"
                speed={40}
                delay={500}
              />
            </div>
          )}
          
          {showLine3 && (
            <div className="pl-4 border-l-2 border-[#00ff00]/20 italic text-[#00ff00]/70">
              <Typewriter 
                text="got tired of the old concept. New concept pending.)"
                speed={40}
                delay={2000}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-4 border-t border-[#00ff00]/30 text-xs text-[#00ff00]/50">
          <Typewriter 
            text="[END OF REPORT]"
            speed={30}
            delay={6000}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes scan-lines {
          0% { background-position: 0 0; }
          100% { background-position: 0 20px; }
        }
      `}</style>
    </main>
  );
}

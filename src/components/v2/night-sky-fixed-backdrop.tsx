"use client";

import Image from "next/image";

/**
 * Full-viewport night sky (hero palette) that stays fixed while sections scroll.
 * Use with transparent hero + projects on the home page only.
 */
export default function NightSkyFixedBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1]"
      style={{ backgroundColor: "var(--gic-night-sky)" }}
    >
      <div className="absolute inset-0 scale-110">
        <Image
          src="/shadersmine.png"
          alt=""
          fill
          priority
          className="object-cover"
          style={{ opacity: 0.28, mixBlendMode: "luminosity" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(31,31,41,0.55) 0%, rgba(31,31,41,0.3) 40%, rgba(31,31,41,0.85) 100%)",
          }}
        />
      </div>
    </div>
  );
}

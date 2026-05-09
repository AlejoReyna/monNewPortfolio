import { Bebas_Neue, Cormorant_Garamond, Space_Mono } from "next/font/google";
import "../../components/v3/v3.css";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

export default function V3Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${bebas.variable} ${cormorant.variable} ${spaceMono.variable}`}>
      {children}
    </div>
  );
}

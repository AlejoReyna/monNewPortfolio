import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Historia del proyecto | Alexis' desktop",
  description:
    "Narrativa del desarrollo: SIASE, dashboard, Nexus y SIASE Plus — experiencia académica UANL.",
};

export default function HistoriaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

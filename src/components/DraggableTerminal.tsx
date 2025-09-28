"use client";
import { useEffect, useRef, useState, PropsWithChildren } from "react";
import { motion, useDragControls } from "framer-motion";

type DraggableTerminalProps = {
  /** Ancho (px) reservado para la barra lateral; la ventana no puede invadirlo */
  sidebarWidth?: number;
  /** Safe areas (px) en cada borde */
  topSafe?: number;
  rightSafe?: number;
  bottomSafe?: number;
  /** Posición inicial dentro del área segura */
  defaultPos?: { x: number; y: number };
  /** z-index de la ventana */
  zIndex?: number;
  /** Recordar posición en localStorage */
  rememberPosition?: boolean;
  /** Clave de storage (si hay varias ventanas) */
  storageKey?: string;
  /** Desactivar drag en móviles si lo necesitas */
  disableDragOnMobile?: boolean;
};

export default function DraggableTerminal({
  children,
  sidebarWidth = 96,
  topSafe = 16,
  rightSafe = 16,
  bottomSafe = 16,
  defaultPos = { x: 0, y: 120 },
  zIndex = 30,
  rememberPosition = true,
  storageKey = "draggable-terminal-pos",
  disableDragOnMobile = false,
}: PropsWithChildren<DraggableTerminalProps>) {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const controls = useDragControls();

  const [initial, setInitial] = useState<{ x: number; y: number }>(defaultPos);
  const [isClient, setIsClient] = useState(false);

  // Evita SSR issues y restaura posición si aplica
  useEffect(() => {
    setIsClient(true);
    if (!rememberPosition) return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const p = JSON.parse(raw);
        if (typeof p?.x === "number" && typeof p?.y === "number") {
          setInitial(p);
        }
      }
    } catch {}
  }, [rememberPosition, storageKey]);

  const handlePointerDown = (e: React.PointerEvent) => {
    const el = e.target as HTMLElement;
    // No arrastrar si clic en elementos interactivos
    if (el.closest("input, textarea, button, a, [data-no-drag]")) return;
    // Solo arrastrar si el click fue en el header marcado
    if (el.closest("[data-drag-handle]")) {
      controls.start(e);
    }
  };

  // Guardar posición al soltar
  const handleDragEnd = (_: any, info: { point: { x: number; y: number } }) => {
    if (!rememberPosition) return;
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ x: info.point.x, y: info.point.y })
      );
    } catch {}
  };

  // Clase opcional para desactivar en mobile
  const mobileClass = disableDragOnMobile ? "hidden md:block" : "";

  return (
    <div className={`pointer-events-none absolute inset-0 ${mobileClass}`} style={{ zIndex }}>
      {/* Área de restricciones con padding = zonas seguras */}
      <div
        ref={constraintsRef}
        className="absolute inset-0"
        style={{
          paddingLeft: sidebarWidth,
          paddingTop: topSafe,
          paddingRight: rightSafe,
          paddingBottom: bottomSafe,
        }}
      />
      {/* Ventana arrastrable */}
      <motion.div
        className="pointer-events-auto absolute"
        drag
        dragControls={controls}
        dragListener={false}          // solo desde el header
        dragConstraints={constraintsRef}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        initial={isClient ? initial : defaultPos}
        whileDrag={{ cursor: "grabbing", scale: 1.005 }}
        style={{
          width: "min(860px, calc(100vw - 140px))",
          willChange: "transform",
        }}
        onPointerDown={handlePointerDown}
      >
        {children}
      </motion.div>
    </div>
  );
}



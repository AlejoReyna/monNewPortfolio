"use client";
import { useEffect, useRef, useState, PropsWithChildren } from "react";
import { motion, useDragControls, PanInfo } from "framer-motion";

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

  const [initial, setInitial] = useState<{ x: number; y: number } | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Evita SSR issues y restaura posición si aplica
  useEffect(() => {
    setIsClient(true);

    // Calcular posición centrada horizontalmente (centro absoluto de la pantalla)
    const calculateCenteredPosition = () => {
      if (typeof window === 'undefined') return defaultPos;

      const viewportWidth = window.innerWidth;
      const terminalWidth = Math.min(860, viewportWidth - 140);
      // Centrar en toda la pantalla
      const centeredX = (viewportWidth - terminalWidth) / 2;
      // Ajustar por el padding del sidebar que tiene el contenedor de restricciones
      const adjustedX = centeredX - sidebarWidth;

      return { x: adjustedX, y: defaultPos.y };
    };

    const centerNow = () => {
      if (!rememberPosition) {
        setInitial(calculateCenteredPosition());
        return;
      }

      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          const p = JSON.parse(raw);
          if (typeof p?.x === "number" && typeof p?.y === "number") {
            setInitial(p);
            return;
          }
        }
        setInitial(calculateCenteredPosition());
      } catch {
        setInitial(calculateCenteredPosition());
      }
    };

    // Ejecutar centrado antes del siguiente paint
    if (typeof window !== 'undefined') {
      if ("requestAnimationFrame" in window) {
        window.requestAnimationFrame(() => {
          centerNow();
        });
      } else {
        centerNow();
      }
    }
  }, [rememberPosition, storageKey, sidebarWidth, rightSafe, defaultPos]);

  // Marca que la animación ya se ejecutó (para evitar repetirla en cada render)
  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 800);
    return () => clearTimeout(timer);
  }, []);

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
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
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
    <>
      {/* Desktop: Ventana draggable (oculta en mobile/tablet) */}
      <div className={`pointer-events-none absolute inset-0 hidden lg:block ${mobileClass}`} style={{ zIndex }}>
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
        {initial && (
        <motion.div
          className="pointer-events-auto absolute"
          drag
          dragControls={controls}
          dragListener={false}          // solo desde el header
          dragConstraints={constraintsRef}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          initial={initial}
          whileDrag={{ cursor: "grabbing", scale: 1.005 }}
          style={{
            width: "min(860px, calc(100vw - 140px))",
            willChange: "transform",
          }}
          onPointerDown={handlePointerDown}
        >
          {/* Animación de aparición tipo macOS */}
          <motion.div
            initial={{ 
              opacity: 0, 
              scale: 0.8,
              y: 20
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: 0
            }}
            transition={{
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1], // Curva de easing tipo macOS
              opacity: { duration: 0.3 },
            }}
          >
            {children}
          </motion.div>
        </motion.div>
        )}
      </div>

      {/* Mobile/Tablet: Ventana fija en la parte inferior (visible solo en mobile/tablet) */}
      <div className="lg:hidden fixed left-0 right-0 pointer-events-auto" style={{ zIndex, margin: '10px', bottom: '80px' }}>
        <motion.div
          initial={{ 
            opacity: 0, 
            scale: 0.8,
            y: 20
          }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: 0
          }}
          transition={{
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1], // Curva de easing tipo macOS
            opacity: { duration: 0.3 },
          }}
        >
          {children}
        </motion.div>
      </div>
    </>
  );
}




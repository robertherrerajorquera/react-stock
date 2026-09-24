import type { WindowId } from "../context/WindowContext";

export interface WindowMeta {
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const windowOrder: WindowId[] = ["tutorial", "code", "stock", "help"];

export const windowMeta: Record<WindowId, WindowMeta> = {
  tutorial: {
    title: "React Tutorial",
    icon: "📖",
    x: 56,
    y: 36,
    width: 540,
    height: 440,
  },
  code: {
    title: "Code Editor",
    icon: "💻",
    x: 140,
    y: 74,
    width: 560,
    height: 400,
  },
  stock: {
    title: "Stock Manager",
    icon: "📦",
    x: 220,
    y: 118,
    width: 600,
    height: 400,
  },
  help: {
    title: "Ayuda",
    icon: "❓",
    x: 320,
    y: 60,
    width: 400,
    height: 280,
  },
};

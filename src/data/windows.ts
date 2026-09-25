import type { WindowId } from "../context/WindowContext";

export interface WindowMeta {
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const windowOrder: WindowId[] = [
  "tutorial",
  "code",
  "stock",
  "help",
  "explorer",
];

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
  explorer: {
    title: "Explorador de lecciones",
    icon: "🗂️",
    x: 720,
    y: 48,
    width: 280,
    height: 430,
  },
};

export function getDesktopArea(): { width: number; height: number } {
  const desk = document.querySelector<HTMLElement>(".win95-desktop");
  if (desk && desk.clientWidth > 0 && desk.clientHeight > 0) {
    return { width: desk.clientWidth, height: desk.clientHeight };
  }
  return { width: window.innerWidth, height: window.innerHeight };
}

export function initialSize(
  meta: WindowMeta
): { width: number; height: number } {
  if (typeof window === "undefined") {
    return { width: meta.width, height: meta.height };
  }
  return {
    width: Math.min(meta.width, window.innerWidth - 8),
    height: Math.min(meta.height, window.innerHeight - 40),
  };
}

export function clampOpenPosition(
  meta: WindowMeta,
  x: number,
  y: number
): { x: number; y: number } {
  if (typeof window === "undefined") return { x, y };
  const area = getDesktopArea();
  const width = Math.min(meta.width, area.width - 8);
  const height = Math.min(meta.height, area.height - 8);
  const maxX = Math.max(0, area.width - width - 8);
  const maxY = Math.max(0, area.height - height - 8);
  return {
    x: Math.min(Math.max(x, 0), maxX),
    y: Math.min(Math.max(y, 0), maxY),
  };
}

export function clampDragPosition(
  meta: WindowMeta,
  x: number,
  y: number
): { x: number; y: number } {
  if (typeof window === "undefined") return { x, y };
  const area = getDesktopArea();
  const width = Math.min(meta.width, area.width - 8);
  const keepVisible = Math.min(100, width);
  const minX = -(width - keepVisible);
  const maxX = Math.max(minX, area.width - keepVisible);
  const maxY = Math.max(0, area.height - 55);
  return {
    x: Math.min(Math.max(x, minX), maxX),
    y: Math.min(Math.max(y, 0), maxY),
  };
}

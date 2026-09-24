import { createContext } from "react";

export type WindowId =
  | "tutorial"
  | "code"
  | "stock"
  | "help"
  | "explorer";

export interface WindowState {
  open: boolean;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
  x: number;
  y: number;
}

export type WindowsState = Record<WindowId, WindowState>;

export interface WindowContextValue {
  windows: WindowsState;
  openWindow: (id: WindowId) => void;
  closeWindow: (id: WindowId) => void;
  minimizeWindow: (id: WindowId) => void;
  maximizeWindow: (id: WindowId) => void;
  restoreWindow: (id: WindowId) => void;
  focusWindow: (id: WindowId) => void;
  moveWindow: (id: WindowId, x: number, y: number) => void;
}

export const WindowContext = createContext<WindowContextValue | null>(null);

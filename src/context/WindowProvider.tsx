import { useRef, useState, type ReactNode } from "react";
import {
  WindowContext,
  type WindowId,
  type WindowState,
  type WindowsState,
} from "./WindowContext";
import {
  clampOpenPosition,
  initialSize,
  windowMeta,
} from "../data/windows";

interface WindowProviderProps {
  children: ReactNode;
}

const initialPos = (id: WindowId): { x: number; y: number } =>
  clampOpenPosition(windowMeta[id], windowMeta[id].x, windowMeta[id].y);

const isNarrowScreen = (): boolean =>
  typeof window !== "undefined" && window.innerWidth <= 600;

const initialState = (id: WindowId, open: boolean, zIndex: number) => ({
  open,
  minimized: false,
  maximized: open && isNarrowScreen(),
  zIndex,
  ...initialPos(id),
  ...initialSize(windowMeta[id]),
});

const createInitialWindows = (): WindowsState => ({
  tutorial: initialState("tutorial", true, 1),
  code: initialState("code", false, 0),
  stock: initialState("stock", false, 0),
  help: initialState("help", false, 0),
  explorer: initialState("explorer", false, 0),
});

export default function WindowProvider({ children }: WindowProviderProps) {
  const [windows, setWindows] = useState<WindowsState>(createInitialWindows);
  const zCounter = useRef(1);

  const patchWindow = (id: WindowId, patch: Partial<WindowState>) => {
    setWindows((current) => {
      const next: WindowsState = { ...current };
      next[id] = { ...next[id], ...patch };
      return next;
    });
  };

  const focusWindow = (id: WindowId) => {
    zCounter.current += 1;
    patchWindow(id, { zIndex: zCounter.current });
  };

  const openWindow = (id: WindowId) => {
    zCounter.current += 1;
    const zIndex = zCounter.current;
    setWindows((current) => {
      const pos = clampOpenPosition(windowMeta[id], current[id].x, current[id].y);
      return {
        ...current,
        [id]: {
          ...current[id],
          open: true,
          minimized: false,
          maximized: isNarrowScreen(),
          zIndex,
          ...pos,
        },
      };
    });
  };

  const closeWindow = (id: WindowId) => {
    patchWindow(id, { open: false, minimized: false, maximized: false });
  };

  const minimizeWindow = (id: WindowId) => {
    patchWindow(id, { minimized: true });
  };

  const maximizeWindow = (id: WindowId) => {
    zCounter.current += 1;
    patchWindow(id, {
      open: true,
      minimized: false,
      maximized: true,
      zIndex: zCounter.current,
    });
  };

  const restoreWindow = (id: WindowId) => {
    zCounter.current += 1;
    patchWindow(id, {
      open: true,
      minimized: false,
      maximized: false,
      zIndex: zCounter.current,
    });
  };

  const moveWindow = (id: WindowId, x: number, y: number) => {
    patchWindow(id, { x, y });
  };

  const resizeWindow = (id: WindowId, width: number, height: number) => {
    patchWindow(id, { width, height });
  };

  return (
    <WindowContext.Provider
      value={{
        windows,
        openWindow,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        restoreWindow,
        focusWindow,
        moveWindow,
        resizeWindow,
      }}
    >
      {children}
    </WindowContext.Provider>
  );
}

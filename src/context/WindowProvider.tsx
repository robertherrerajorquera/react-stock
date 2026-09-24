import { useRef, useState, type ReactNode } from "react";
import {
  WindowContext,
  type WindowId,
  type WindowState,
  type WindowsState,
} from "./WindowContext";
import { clampOpenPosition, windowMeta } from "../data/windows";

interface WindowProviderProps {
  children: ReactNode;
}

const initialPos = (id: WindowId): { x: number; y: number } =>
  clampOpenPosition(windowMeta[id], windowMeta[id].x, windowMeta[id].y);

const createInitialWindows = (): WindowsState => ({
  tutorial: {
    open: true,
    minimized: false,
    maximized: false,
    zIndex: 1,
    ...initialPos("tutorial"),
  },
  code: {
    open: false,
    minimized: false,
    maximized: false,
    zIndex: 0,
    ...initialPos("code"),
  },
  stock: {
    open: false,
    minimized: false,
    maximized: false,
    zIndex: 0,
    ...initialPos("stock"),
  },
  help: {
    open: false,
    minimized: false,
    maximized: false,
    zIndex: 0,
    ...initialPos("help"),
  },
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
        [id]: { ...current[id], open: true, minimized: false, zIndex, ...pos },
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
      }}
    >
      {children}
    </WindowContext.Provider>
  );
}

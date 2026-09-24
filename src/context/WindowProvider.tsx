import { useRef, useState, type ReactNode } from "react";
import {
  WindowContext,
  type WindowId,
  type WindowState,
  type WindowsState,
} from "./WindowContext";
import { windowMeta } from "../data/windows";

interface WindowProviderProps {
  children: ReactNode;
}

const createInitialWindows = (): WindowsState => ({
  tutorial: {
    open: true,
    minimized: false,
    maximized: false,
    zIndex: 1,
    x: windowMeta.tutorial.x,
    y: windowMeta.tutorial.y,
  },
  code: {
    open: false,
    minimized: false,
    maximized: false,
    zIndex: 0,
    x: windowMeta.code.x,
    y: windowMeta.code.y,
  },
  stock: {
    open: false,
    minimized: false,
    maximized: false,
    zIndex: 0,
    x: windowMeta.stock.x,
    y: windowMeta.stock.y,
  },
  help: {
    open: false,
    minimized: false,
    maximized: false,
    zIndex: 0,
    x: windowMeta.help.x,
    y: windowMeta.help.y,
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
    patchWindow(id, { open: true, minimized: false, zIndex: zCounter.current });
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

import { useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { motion, useDragControls } from "motion/react";
import WindowTitleBar from "./WindowTitleBar";
import { useWindowManager } from "../../hooks/useWindowManager";
import { windowMeta } from "../../data/windows";
import type { WindowId } from "../../context/WindowContext";

interface WindowProps {
  id: WindowId;
  children: ReactNode;
}

export default function Window({ id, children }: WindowProps) {
  const {
    windows,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    focusWindow,
    moveWindow,
  } = useWindowManager();

  const state = windows[id];
  const meta = windowMeta[id];
  const dragControls = useDragControls();
  const dragStart = useRef({ x: 0, y: 0 });

  const openWindows = Object.values(windows).filter(
    (window) => window.open && !window.minimized
  );
  const topZ = Math.max(0, ...openWindows.map((window) => window.zIndex));
  const isActive = state.zIndex === topZ;

  const handleTitlePointerDown = (event: ReactPointerEvent) => {
    if ((event.target as HTMLElement).closest("button")) return;
    dragStart.current = { x: state.x, y: state.y };
    dragControls.start(event);
  };

  const handleToggleMaximize = () => {
    if (state.maximized) {
      restoreWindow(id);
    } else {
      maximizeWindow(id);
    }
  };

  return (
    <motion.div
      className={
        state.maximized ? "win95-window win95-window--maximized" : "win95-window"
      }
      initial={{ opacity: 0, scale: 0.92, x: state.x, y: state.y }}
      animate={{
        opacity: 1,
        scale: 1,
        x: state.maximized ? 0 : state.x,
        y: state.maximized ? 0 : state.y,
      }}
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.12 } }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      style={{
        left: 0,
        top: 0,
        width: meta.width,
        height: meta.height,
        zIndex: state.zIndex,
      }}
      drag={!state.maximized}
      dragListener={false}
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={(_, info) =>
        moveWindow(
          id,
          dragStart.current.x + info.offset.x,
          dragStart.current.y + info.offset.y
        )
      }
      onPointerDown={() => {
        if (!isActive) focusWindow(id);
      }}
    >
      <WindowTitleBar
        icon={meta.icon}
        title={meta.title}
        active={isActive}
        maximized={state.maximized}
        onPointerDown={handleTitlePointerDown}
        onMinimize={() => minimizeWindow(id)}
        onToggleMaximize={handleToggleMaximize}
        onClose={() => closeWindow(id)}
      />
      <div className="win95-window__body">{children}</div>
    </motion.div>
  );
}

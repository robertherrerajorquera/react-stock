import {
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { motion, useDragControls, type PanInfo } from "motion/react";
import WindowTitleBar from "./WindowTitleBar";
import { useWindowManager } from "../../hooks/useWindowManager";
import {
  clampDragPosition,
  getDesktopArea,
  windowMeta,
} from "../../data/windows";
import type { WindowId } from "../../context/WindowContext";

type ResizeHandle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

interface ResizeGesture {
  pointerId: number;
  corner: ResizeHandle;
  startX: number;
  startY: number;
  startW: number;
  startH: number;
  startWinX: number;
  startWinY: number;
}

interface WindowProps {
  id: WindowId;
  children: ReactNode;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), Math.max(min, max));

export default function Window({ id, children }: WindowProps) {
  const {
    windows,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    focusWindow,
    moveWindow,
    resizeWindow,
  } = useWindowManager();

  const state = windows[id];
  const meta = windowMeta[id];
  const dragControls = useDragControls();
  const dragStart = useRef({ x: 0, y: 0 });
  const resizeGesture = useRef<ResizeGesture | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [isFlying, setIsFlying] = useState(false);

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

  const getFlightTarget = (): { x: number; y: number } | null => {
    const button = document.querySelector<HTMLElement>(
      `[data-window-btn="${id}"]`
    );
    const desktop = document.querySelector<HTMLElement>(".win95-desktop");
    if (!button || !desktop) return null;
    const buttonRect = button.getBoundingClientRect();
    const desktopRect = desktop.getBoundingClientRect();
    const centerX = buttonRect.left - desktopRect.left + buttonRect.width / 2;
    const centerY = buttonRect.top - desktopRect.top + buttonRect.height / 2;
    return { x: centerX - state.width / 2, y: centerY - state.height / 2 };
  };

  const handleMinimize = () => {
    if (isFlying) return;
    setIsFlying(true);
  };

  const flightTarget = isFlying ? getFlightTarget() : null;

  const startResize = (
    event: ReactPointerEvent<HTMLDivElement>,
    corner: ResizeHandle
  ) => {
    if (state.maximized || isFlying || event.button !== 0) return;
    event.preventDefault();
    focusWindow(id);
    event.currentTarget.setPointerCapture(event.pointerId);
    resizeGesture.current = {
      pointerId: event.pointerId,
      corner,
      startX: event.clientX,
      startY: event.clientY,
      startW: state.width,
      startH: state.height,
      startWinX: state.x,
      startWinY: state.y,
    };
    setIsResizing(true);
  };

  const moveResize = (event: ReactPointerEvent<HTMLDivElement>) => {
    const gesture = resizeGesture.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;

    const dx = event.clientX - gesture.startX;
    const dy = event.clientY - gesture.startY;
    const area = getDesktopArea();
    const minW = Math.min(220, area.width);
    const minH = Math.min(140, area.height);
    const east = gesture.corner === "e" || gesture.corner === "se" || gesture.corner === "ne";
    const west = gesture.corner === "w" || gesture.corner === "sw" || gesture.corner === "nw";
    const south = gesture.corner === "s" || gesture.corner === "se" || gesture.corner === "sw";
    const north = gesture.corner === "n" || gesture.corner === "ne" || gesture.corner === "nw";

    let width = gesture.startW;
    let height = gesture.startH;
    let x = gesture.startWinX;
    let y = gesture.startWinY;

    if (east) {
      width = clamp(
        gesture.startW + dx,
        minW,
        area.width - gesture.startWinX
      );
    }
    if (south) {
      height = clamp(
        gesture.startH + dy,
        minH,
        area.height - gesture.startWinY
      );
    }
    if (west) {
      width = clamp(gesture.startW - dx, minW, gesture.startW + gesture.startWinX);
      x = gesture.startWinX + (gesture.startW - width);
    }
    if (north) {
      height = clamp(gesture.startH - dy, minH, gesture.startH + gesture.startWinY);
      y = gesture.startWinY + (gesture.startH - height);
    }

    resizeWindow(id, width, height);
    if (x !== state.x || y !== state.y) {
      moveWindow(id, x, y);
    }
  };

  const endResize = () => {
    resizeGesture.current = null;
    setIsResizing(false);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const pos = clampDragPosition(
      meta,
      dragStart.current.x + info.offset.x,
      dragStart.current.y + info.offset.y
    );
    moveWindow(id, pos.x, pos.y);
  };

  const classNames = ["win95-window"];
  if (state.maximized) classNames.push("win95-window--maximized");
  if (isResizing) classNames.push("win95-window--resizing");
  if (isFlying) classNames.push("win95-window--flying");

  return (
    <motion.div
      className={classNames.join(" ")}
      initial={{ opacity: 0, scale: 0.92, x: state.x, y: state.y }}
      animate={
        isFlying
          ? {
              opacity: 1,
              scale: 0.05,
              x: flightTarget ? flightTarget.x : state.x,
              y: flightTarget ? flightTarget.y : state.y,
            }
          : {
              opacity: 1,
              scale: 1,
              x: state.maximized ? 0 : state.x,
              y: state.maximized ? 0 : state.y,
            }
      }
      exit={{
        opacity: 0,
        scale: isFlying ? 0.05 : 0.92,
        transition: { duration: isFlying ? 0.05 : 0.12 },
      }}
      transition={{
        duration: 0.15,
        ease: isFlying ? "easeIn" : "easeOut",
      }}
      onAnimationComplete={() => {
        if (isFlying) {
          setIsFlying(false);
          minimizeWindow(id);
        }
      }}
      style={{
        left: 0,
        top: 0,
        width: state.width,
        height: state.height,
        zIndex: state.zIndex,
      }}
      drag={!state.maximized && !isFlying}
      dragListener={false}
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={handleDragEnd}
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
        onMinimize={handleMinimize}
        onToggleMaximize={handleToggleMaximize}
        onClose={() => closeWindow(id)}
      />
      <div className="win95-window__body">{children}</div>
      {(["nw", "n", "ne", "e", "se", "s", "sw", "w"] as const).map((corner) => (
        <div
          key={corner}
          className={`win95-resize-handle win95-resize-handle--${corner}`}
          onPointerDown={(event) => startResize(event, corner)}
          onPointerMove={moveResize}
          onPointerUp={endResize}
          onPointerCancel={endResize}
        />
      ))}
    </motion.div>
  );
}

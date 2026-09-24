import type { PointerEvent as ReactPointerEvent } from "react";
import WindowControls from "./WindowControls";

interface WindowTitleBarProps {
  icon: string;
  title: string;
  active: boolean;
  maximized: boolean;
  onPointerDown: (event: ReactPointerEvent) => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onClose: () => void;
}

export default function WindowTitleBar({
  icon,
  title,
  active,
  maximized,
  onPointerDown,
  onMinimize,
  onToggleMaximize,
  onClose,
}: WindowTitleBarProps) {
  return (
    <div
      className={active ? "win95-titlebar win95-titlebar--active" : "win95-titlebar"}
      onPointerDown={onPointerDown}
    >
      <span className="win95-titlebar__icon">{icon}</span>
      <span className="win95-titlebar__title">{title}</span>
      <WindowControls
        maximized={maximized}
        onMinimize={onMinimize}
        onToggleMaximize={onToggleMaximize}
        onClose={onClose}
      />
    </div>
  );
}

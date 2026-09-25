import { useState } from "react";
import { useWindowManager } from "../../hooks/useWindowManager";
import { windowMeta, windowOrder } from "../../data/windows";
import type { WindowId } from "../../context/WindowContext";

export default function DesktopIcons() {
  const { openWindow } = useWindowManager();
  const [selected, setSelected] = useState<WindowId | null>(null);
  const [isTouch] = useState<boolean>(
    () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: coarse)").matches
  );

  const handleOpen = (id: WindowId) => {
    setSelected(id);
    if (isTouch) openWindow(id);
  };

  return (
    <div className="absolute left-2 top-2 flex flex-col gap-1">
      {windowOrder.map((id) => {
        const meta = windowMeta[id];

        return (
          <button
            key={id}
            type="button"
            className="win95-desktop-icon"
            data-selected={selected === id}
            onClick={() => handleOpen(id)}
            onDoubleClick={() => openWindow(id)}
          >
            <span className="win95-desktop-icon__image">{meta.icon}</span>
            <span className="win95-desktop-icon__label">{meta.title}</span>
          </button>
        );
      })}
    </div>
  );
}

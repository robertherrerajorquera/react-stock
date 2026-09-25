import { useEffect, useState } from "react";
import { useWindowManager } from "../../hooks/useWindowManager";
import { windowMeta, windowOrder } from "../../data/windows";
import type { WindowId } from "../../context/WindowContext";
import StartMenu from "./StartMenu";

const formatTime = (date: Date) =>
  date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });

export default function Taskbar() {
  const { windows, restoreWindow, focusWindow, minimizeWindow } =
    useWindowManager();
  const [startOpen, setStartOpen] = useState(false);
  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTime(formatTime(new Date()));
    }, 10000);

    return () => window.clearInterval(timer);
  }, []);

  const openIds = windowOrder.filter((id) => windows[id].open);
  const topZ = Math.max(
    0,
    ...openIds
      .filter((id) => !windows[id].minimized)
      .map((id) => windows[id].zIndex)
  );

  const handleTaskClick = (id: WindowId) => {
    const state = windows[id];
    const isActive = !state.minimized && state.zIndex === topZ;

    if (state.minimized) {
      restoreWindow(id);
    } else if (isActive) {
      minimizeWindow(id);
    } else {
      focusWindow(id);
    }
  };

  return (
    <div className="win95-taskbar">
      {startOpen && (
        <div
          className="fixed inset-0 z-[1]"
          onClick={() => setStartOpen(false)}
        />
      )}

      <button
        type="button"
        className="win95-button win95-start-button"
        data-active={startOpen}
        onClick={() => setStartOpen((open) => !open)}
      >
        <span className="win95-flag">
          <i />
          <i />
          <i />
          <i />
        </span>
        Inicio
      </button>

      <div className="win95-taskbar__separator" />

      {openIds.map((id) => {
        const meta = windowMeta[id];
        const isActive = !windows[id].minimized && windows[id].zIndex === topZ;

        return (
          <button
            key={id}
            type="button"
            className="win95-button win95-task-button"
            data-active={isActive}
            data-window-btn={id}
            onClick={() => handleTaskClick(id)}
          >
            <span>{meta.icon}</span>
            <span>{meta.title}</span>
          </button>
        );
      })}

      <div className="win95-taskbar__clock">{time}</div>

      {startOpen && <StartMenu onClose={() => setStartOpen(false)} />}
    </div>
  );
}

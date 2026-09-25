import { useState } from "react";
import { useWindowManager } from "../../hooks/useWindowManager";
import DesktopIcons from "./DesktopIcons";
import Taskbar from "./Taskbar";
import WindowManager from "../windows/WindowManager";

export default function Desktop() {
  const { openWindow } = useWindowManager();
  const [lessonIndex, setLessonIndex] = useState(0);

  const handleLessonChange = (index: number) => {
    setLessonIndex(index);
    openWindow("tutorial");
  };

  return (
    <div className="win95-app">
      <div className="win95-desktop">
        <DesktopIcons />
        <WindowManager
          lessonIndex={lessonIndex}
          onLessonChange={handleLessonChange}
        />
      </div>

      <Taskbar />
    </div>
  );
}

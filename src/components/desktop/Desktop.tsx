import { useState } from "react";
import { useWindowManager } from "../../hooks/useWindowManager";
import DesktopIcons from "./DesktopIcons";
import TopMenuBar from "./TopMenuBar";
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
      <div className="win95-titlebar win95-titlebar--active">
        <span className="win95-titlebar__title">React Stock Lab</span>
      </div>

      <TopMenuBar onLessonChange={handleLessonChange} />

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

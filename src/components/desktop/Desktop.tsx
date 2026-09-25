import { useNavigate, useParams, Navigate } from "react-router-dom";
import { useWindowManager } from "../../hooks/useWindowManager";
import { lessons, lessonPath } from "../../data/lessons";
import DesktopIcons from "./DesktopIcons";
import Taskbar from "./Taskbar";
import WindowManager from "../windows/WindowManager";

export default function Desktop() {
  const { openWindow } = useWindowManager();
  const { slug } = useParams();
  const navigate = useNavigate();

  if (slug !== undefined && !lessons.some((lesson) => lesson.id === slug)) {
    return <Navigate to="/" replace />;
  }

  const lessonIndex =
    slug === undefined
      ? 0
      : lessons.findIndex((lesson) => lesson.id === slug);

  const handleLessonChange = (index: number) => {
    navigate(lessonPath(index));
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

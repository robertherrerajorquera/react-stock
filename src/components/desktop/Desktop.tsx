import DesktopIcons from "./DesktopIcons";
import Taskbar from "./Taskbar";
import WindowManager from "../windows/WindowManager";

export default function Desktop() {
  return (
    <>
      <div className="win95-desktop">
        <DesktopIcons />
        <WindowManager />
      </div>
      <Taskbar />
    </>
  );
}

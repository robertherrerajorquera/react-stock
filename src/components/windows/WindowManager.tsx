import type { ReactNode } from "react";
import { AnimatePresence } from "motion/react";
import Window from "./Window";
import TutorialWindow from "../tutorial/TutorialWindow";
import CodeEditorWindow from "../code/CodeEditorWindow";
import StockWindow from "../stock/StockWindow";
import HelpWindow from "../help/HelpWindow";
import { useWindowManager } from "../../hooks/useWindowManager";
import { windowOrder } from "../../data/windows";
import type { WindowId } from "../../context/WindowContext";

interface WindowManagerProps {
  lessonIndex: number;
  onLessonChange: (index: number) => void;
}

export default function WindowManager({
  lessonIndex,
  onLessonChange,
}: WindowManagerProps) {
  const { windows } = useWindowManager();

  const visible = windowOrder.filter(
    (id) => windows[id].open && !windows[id].minimized
  );

  const renderContent = (id: WindowId): ReactNode => {
    switch (id) {
      case "tutorial":
        return (
          <TutorialWindow
            lessonIndex={lessonIndex}
            onLessonChange={onLessonChange}
          />
        );
      case "code":
        return <CodeEditorWindow lessonIndex={lessonIndex} />;
      case "stock":
        return <StockWindow />;
      case "help":
        return <HelpWindow />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {visible.map((id) => (
        <Window key={id} id={id}>
          {renderContent(id)}
        </Window>
      ))}
    </AnimatePresence>
  );
}

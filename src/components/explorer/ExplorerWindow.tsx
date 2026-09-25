import { useState } from "react";
import { Link } from "react-router-dom";
import { useWindowManager } from "../../hooks/useWindowManager";
import {
  lessonCategories,
  lessonPath,
  lessons,
  type LessonCategory,
} from "../../data/lessons";

interface ExplorerWindowProps {
  lessonIndex: number;
  onLessonChange: (index: number) => void;
}

export default function ExplorerWindow({
  lessonIndex,
  onLessonChange,
}: ExplorerWindowProps) {
  const [collapsed, setCollapsed] = useState<Set<LessonCategory>>(new Set());
  const [selected, setSelected] = useState<number>(lessonIndex);
  const { openWindow } = useWindowManager();

  const toggleFolder = (category: LessonCategory) => {
    setCollapsed((current) => {
      const next = new Set(current);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const handleOpen = (index: number) => {
    setSelected(index);
    onLessonChange(index);
  };

  return (
    <div className="win95-explorer">
      <div className="win95-explorer__toolbar">
        <button
          type="button"
          className="win95-button win95-button--small"
          onClick={() => handleOpen(selected)}
        >
          📂 Abrir
        </button>
        <span className="win95-explorer__path">C:\React\Lecciones</span>
      </div>

      <div className="win95-explorer__tree">
        {lessonCategories.map((category) => {
          const isCollapsed = collapsed.has(category);

          return (
            <div key={category} className="win95-explorer__folder">
              <button
                type="button"
                className="win95-explorer__row"
                onClick={() => toggleFolder(category)}
              >
                <span className="win95-explorer__twisty">
                  {isCollapsed ? "▶" : "▼"}
                </span>
                <span aria-hidden="true">📁</span>
                {category}
              </button>

              {!isCollapsed &&
                lessons
                  .map((lesson, index) => ({ lesson, index }))
                  .filter(({ lesson }) => lesson.category === category)
                  .map(({ lesson, index }) => (
                    <Link
                      key={lesson.id}
                      to={lessonPath(index)}
                      className="win95-explorer__row win95-explorer__row--lesson"
                      data-selected={selected === index}
                      data-current={lessonIndex === index}
                      onClick={() => {
                        setSelected(index);
                        openWindow("tutorial");
                      }}
                    >
                      <span className="win95-explorer__twisty" />
                      <span aria-hidden="true">📄</span>
                      {String(index + 1).padStart(2, "0")} — {lesson.title}
                    </Link>
                  ))}
            </div>
          );
        })}
      </div>

      <div className="win95-window__statusbar">
        <span>{lessons.length} lecciones</span>
        <span>Clic para abrir la lección</span>
      </div>
    </div>
  );
}

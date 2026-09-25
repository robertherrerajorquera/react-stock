import { Link } from "react-router-dom";
import { lessonPath, lessons } from "../../data/lessons";

interface LessonNavigationProps {
  index: number;
}

const TOTAL_BLOCKS = 16;

export default function LessonNavigation({ index }: LessonNavigationProps) {
  const total = lessons.length;
  const lesson = lessons[index];

  const blocks = Math.round(((index + 1) / total) * TOTAL_BLOCKS);
  const progress = Math.round(((index + 1) / total) * 100);
  const bar = "█".repeat(blocks) + "░".repeat(TOTAL_BLOCKS - blocks);

  return (
    <div className="mt-auto flex flex-col gap-2 border-t border-[#808080] pt-2">
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <span>
          Lección {index + 1} de {total} — {lesson.title}
        </span>
        <span className="win95-progress">
          {bar} {progress}%
        </span>
      </div>

      <div className="flex items-center justify-between gap-2">
        {index === 0 ? (
          <button
            type="button"
            className="win95-button"
            disabled
            aria-disabled="true"
          >
            ← Anterior
          </button>
        ) : (
          <Link className="win95-button" to={lessonPath(index - 1)}>
            ← Anterior
          </Link>
        )}

        {index === total - 1 ? (
          <button
            type="button"
            className="win95-button"
            disabled
            aria-disabled="true"
          >
            Siguiente →
          </button>
        ) : (
          <Link className="win95-button" to={lessonPath(index + 1)}>
            Siguiente →
          </Link>
        )}
      </div>
    </div>
  );
}

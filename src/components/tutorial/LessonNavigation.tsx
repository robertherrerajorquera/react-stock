import { lessons } from "../../data/lessons";

interface LessonNavigationProps {
  index: number;
  onChange: (index: number) => void;
}

const TOTAL_BLOCKS = 16;

export default function LessonNavigation({
  index,
  onChange,
}: LessonNavigationProps) {
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
        <button
          type="button"
          className="win95-button"
          disabled={index === 0}
          onClick={() => onChange(index - 1)}
        >
          ← Anterior
        </button>
        <button
          type="button"
          className="win95-button"
          disabled={index === total - 1}
          onClick={() => onChange(index + 1)}
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}

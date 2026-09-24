import Section from "./Section";
import { useWindowManager } from "../../hooks/useWindowManager";
import type { LessonResult as LessonResultData } from "../../data/lessons";

interface LessonResultProps {
  result: LessonResultData;
  codeFile: string;
}

export default function LessonResult({ result, codeFile }: LessonResultProps) {
  const { openWindow } = useWindowManager();

  return (
    <Section title="Resultado">
      <div className="flex flex-col gap-2">
        <p className="m-0">{result.description}</p>

        {result.note && <p className="win95-warning m-0">⚠ {result.note}</p>}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="win95-button"
            onClick={() => openWindow(result.window)}
          >
            {result.action}
          </button>
          <button
            type="button"
            className="win95-button"
            onClick={() => openWindow("code")}
          >
            Ver código
          </button>
        </div>

        <p className="m-0 text-[11px] text-[#808080]">
          Archivo relacionado: {codeFile}
        </p>
      </div>
    </Section>
  );
}

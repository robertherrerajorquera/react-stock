import MenuBar, { type Menu } from "../ui/MenuBar";
import { lessons } from "../../data/lessons";

interface CodeEditorWindowProps {
  lessonIndex: number;
}

const menus: Menu[] = [
  {
    label: "Archivo",
    items: [
      { label: "Guardar", disabled: true },
      { label: "Imprimir...", disabled: true },
    ],
  },
  {
    label: "Editar",
    items: [
      { label: "Copiar", disabled: true },
      { label: "Pegar", disabled: true },
    ],
  },
  {
    label: "Buscar",
    items: [{ label: "Buscar...", disabled: true }],
  },
];

export default function CodeEditorWindow({
  lessonIndex,
}: CodeEditorWindowProps) {
  const lesson = lessons[lessonIndex];

  const numbered = lesson.code
    .split("\n")
    .map((line, index) => `${String(index + 1).padStart(3, " ")}  ${line}`)
    .join("\n");

  return (
    <div className="flex h-full flex-col gap-2">
      <MenuBar menus={menus} />

      <div className="flex flex-wrap items-baseline justify-between gap-2 text-[11px]">
        <span className="font-bold">
          Lección {lessonIndex + 1}: {lesson.title}
        </span>
        <span className="text-[#808080]">{lesson.category}</span>
      </div>

      <pre className="win95-code m-0 flex-1">{numbered}</pre>

      <div className="win95-window__statusbar m-0">
        <span>{lesson.codeFile}</span>
        <span>
          Lección {lessonIndex + 1} de {lessons.length}
        </span>
      </div>
    </div>
  );
}

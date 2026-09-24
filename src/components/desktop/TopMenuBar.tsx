import MenuBar, { type Menu } from "../ui/MenuBar";
import { useWindowManager } from "../../hooks/useWindowManager";
import { lessons } from "../../data/lessons";

interface TopMenuBarProps {
  onLessonChange: (index: number) => void;
}

export default function TopMenuBar({ onLessonChange }: TopMenuBarProps) {
  const { openWindow } = useWindowManager();

  const menus: Menu[] = [
    {
      label: "Archivo",
      items: [
        { label: "Nuevo", disabled: true },
        { label: "Abrir...", disabled: true },
        { label: "sep", separator: true },
        { label: "Salir", disabled: true },
      ],
    },
    {
      label: "Editar",
      items: [
        { label: "Deshacer", disabled: true },
        { label: "Copiar", disabled: true },
        { label: "Pegar", disabled: true },
      ],
    },
    {
      label: "Ver",
      items: [
        { label: "Iconos", disabled: true },
        { label: "Lista", disabled: true },
      ],
    },
    {
      label: "Curso",
      items: lessons.map((lesson, index) => ({
        label: `${String(index + 1).padStart(2, "0")}  ${lesson.title}`,
        onClick: () => onLessonChange(index),
      })),
    },
    {
      label: "Ayuda",
      items: [
        {
          label: "Acerca de React Stock Lab...",
          onClick: () => openWindow("help"),
        },
      ],
    },
  ];

  return <MenuBar menus={menus} variant="app" />;
}

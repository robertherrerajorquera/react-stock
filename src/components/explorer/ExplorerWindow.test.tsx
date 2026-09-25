import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { lessons } from "../../data/lessons";
import ExplorerWindow from "./ExplorerWindow";

const lessonRows = () => screen.getAllByRole("button", { name: /\d{2} — / });

describe("ExplorerWindow", () => {
  it("lista las 14 lecciones con su barra de estado", () => {
    render(<ExplorerWindow lessonIndex={0} onLessonChange={() => {}} />);

    expect(lessonRows()).toHaveLength(lessons.length);
    expect(screen.getByText(`${lessons.length} lecciones`)).toBeInTheDocument();
  });

  it("al colapsar una carpeta oculta sus lecciones", async () => {
    const user = userEvent.setup();
    render(<ExplorerWindow lessonIndex={0} onLessonChange={() => {}} />);

    expect(lessonRows()).toHaveLength(lessons.length);

    await user.click(
      screen.getByRole("button", { name: /Estado compartido/ })
    );

    expect(lessonRows().length).toBeLessThan(lessons.length);
  });

  it("el doble clic abre la lección pulsada", async () => {
    const user = userEvent.setup();
    const onLessonChange = vi.fn();
    render(
      <ExplorerWindow lessonIndex={0} onLessonChange={onLessonChange} />
    );

    await user.dblClick(screen.getByRole("button", { name: /03 —/ }));

    expect(onLessonChange).toHaveBeenCalledWith(2);
  });

  it("el botón Abrir abre la lección seleccionada", async () => {
    const user = userEvent.setup();
    const onLessonChange = vi.fn();
    render(
      <ExplorerWindow lessonIndex={0} onLessonChange={onLessonChange} />
    );

    await user.click(screen.getByRole("button", { name: /05 —/ }));
    expect(onLessonChange).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "📂 Abrir" }));
    expect(onLessonChange).toHaveBeenCalledWith(4);
  });
});

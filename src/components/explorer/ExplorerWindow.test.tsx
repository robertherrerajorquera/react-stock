import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter, useLocation } from "react-router-dom";
import WindowProvider from "../../context/WindowProvider";
import { lessons } from "../../data/lessons";
import ExplorerWindow from "./ExplorerWindow";

const LocationProbe = () => {
  const location = useLocation();
  return <div data-testid="path">{location.pathname}</div>;
};

const renderExplorer = (onLessonChange: (index: number) => void = () => {}) =>
  render(
    <MemoryRouter initialEntries={["/"]}>
      <WindowProvider>
        <ExplorerWindow lessonIndex={0} onLessonChange={onLessonChange} />
        <LocationProbe />
      </WindowProvider>
    </MemoryRouter>
  );

describe("ExplorerWindow", () => {
  it("lista las 14 lecciones como enlaces con su barra de estado", () => {
    renderExplorer();

    expect(
      screen.getAllByRole("link", { name: /\d{2} — / })
    ).toHaveLength(lessons.length);
    expect(
      screen.getByText(`${lessons.length} lecciones`)
    ).toBeInTheDocument();
  });

  it("al colapsar una carpeta oculta sus lecciones", async () => {
    const user = userEvent.setup();
    renderExplorer();

    expect(screen.getAllByRole("link", { name: /\d{2} — / })).toHaveLength(
      lessons.length
    );

    await user.click(screen.getByRole("button", { name: /Estado compartido/ }));

    expect(
      screen.getAllByRole("link", { name: /\d{2} — / }).length
    ).toBeLessThan(lessons.length);
  });

  it("hacer clic en una lección navega a su URL", async () => {
    const user = userEvent.setup();
    renderExplorer();

    await user.click(screen.getByRole("link", { name: /03 — / }));

    expect(screen.getByTestId("path")).toHaveTextContent("/leccion/props");
  });

  it("el botón Abrir abre la lección seleccionada", async () => {
    const user = userEvent.setup();
    const onLessonChange = vi.fn();
    renderExplorer(onLessonChange);

    await user.click(screen.getByRole("link", { name: /05 — / }));
    expect(onLessonChange).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "📂 Abrir" }));
    expect(onLessonChange).toHaveBeenCalledWith(4);
  });
});

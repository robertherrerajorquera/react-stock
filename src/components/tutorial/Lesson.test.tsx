import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import WindowProvider from "../../context/WindowProvider";
import { lessons } from "../../data/lessons";
import Lesson from "./Lesson";

const renderLesson = (index = 0) =>
  render(
    <WindowProvider>
      <Lesson lesson={lessons[index]} />
    </WindowProvider>
  );

describe("Lesson", () => {
  it("muestra los enlaces 'Para saber más' de la lección", () => {
    renderLesson();

    const link = screen.getByRole("link", { name: /writing markup with jsx/i });
    expect(link).toHaveAttribute(
      "href",
      "https://react.dev/learn/writing-markup-with-jsx"
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
  });

  it("las 14 lecciones tienen referencias a documentación oficial", () => {
    expect(lessons).toHaveLength(14);
    for (const lesson of lessons) {
      expect(lesson.references.length).toBeGreaterThan(0);
      for (const reference of lesson.references) {
        expect(reference.url).toMatch(
          /^https:\/\/(react\.dev|www\.typescriptlang\.org)\//
        );
      }
    }
  });
});

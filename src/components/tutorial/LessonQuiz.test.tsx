import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { lessonQuizzes } from "../../data/lessons";
import LessonQuiz from "./LessonQuiz";

describe("LessonQuiz", () => {
  it("la opción correcta muestra el feedback con la explicación", async () => {
    const user = userEvent.setup();
    const quiz = lessonQuizzes["jsx"];
    render(<LessonQuiz quiz={quiz} />);

    const check = screen.getByRole("button", { name: "Comprobar" });
    expect(check).toBeDisabled();

    await user.click(
      screen.getByRole("button", { name: quiz.options[quiz.answer] })
    );
    expect(check).toBeEnabled();
    await user.click(check);

    expect(screen.getByText(/Correcto/)).toBeInTheDocument();
    expect(screen.getByText(/Correcto/).textContent).toContain(
      quiz.explanation
    );
  });

  it("una opción incorrecta muestra el mensaje de error", async () => {
    const user = userEvent.setup();
    const quiz = lessonQuizzes["jsx"];
    const wrongIndex = quiz.options.findIndex(
      (_, index) => index !== quiz.answer
    );
    render(<LessonQuiz quiz={quiz} />);

    await user.click(screen.getByRole("button", { name: quiz.options[wrongIndex] }));
    await user.click(screen.getByRole("button", { name: "Comprobar" }));

    expect(screen.getByText(/Incorrecto/)).toBeInTheDocument();
    expect(screen.queryByText(/Correcto/)).not.toBeInTheDocument();
  });

  it("cambiar de opción tras comprobar permite reintentar", async () => {
    const user = userEvent.setup();
    const quiz = lessonQuizzes["jsx"];
    render(<LessonQuiz quiz={quiz} />);

    await user.click(screen.getByRole("button", { name: quiz.options[1] }));
    await user.click(screen.getByRole("button", { name: "Comprobar" }));
    expect(screen.getByText(/Incorrecto/)).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: quiz.options[quiz.answer] })
    );
    await user.click(screen.getByRole("button", { name: "Comprobar" }));

    expect(screen.getByText(/Correcto/)).toBeInTheDocument();
    expect(screen.queryByText(/Incorrecto/)).not.toBeInTheDocument();
  });
});

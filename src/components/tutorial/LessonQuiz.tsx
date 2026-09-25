import { useState } from "react";
import type { LessonQuiz as QuizData } from "../../data/lessons";

interface LessonQuizProps {
  quiz: QuizData;
}

export default function LessonQuiz({ quiz }: LessonQuizProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  const isCorrect = selected === quiz.answer;

  const handleSelect = (index: number) => {
    setSelected(index);
    setChecked(false);
  };

  return (
    <section className="win95-quiz">
      <h4 className="win95-quiz__title">Ejercicio</h4>
      <p className="win95-quiz__question">{quiz.question}</p>

      <div className="win95-quiz__options">
        {quiz.options.map((option, index) => (
          <button
            key={option}
            type="button"
            className="win95-quiz__option"
            data-selected={selected === index}
            aria-pressed={selected === index}
            onClick={() => handleSelect(index)}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="win95-quiz__actions">
        <button
          type="button"
          className="win95-button win95-button--small"
          disabled={selected === null || checked}
          onClick={() => setChecked(true)}
        >
          Comprobar
        </button>

        {checked && (
          <span
            className={
              isCorrect
                ? "win95-quiz__feedback"
                : "win95-quiz__feedback win95-quiz__feedback--wrong"
            }
          >
            {isCorrect
              ? `Correcto: ${quiz.explanation}`
              : "Incorrecto: revisa la lección e inténtalo otra vez."}
          </span>
        )}
      </div>
    </section>
  );
}

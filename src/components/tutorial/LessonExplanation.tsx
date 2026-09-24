import Section from "./Section";
import type { LessonData } from "../../data/lessons";

interface LessonExplanationProps {
  lesson: LessonData;
}

export default function LessonExplanation({ lesson }: LessonExplanationProps) {
  return (
    <>
      <Section title="¿Qué es?">{lesson.concept}</Section>

      <Section title="¿Para qué sirve?">{lesson.problem}</Section>

      <Section title="Sintaxis">
        <pre className="win95-code m-0">{lesson.syntax}</pre>
      </Section>
    </>
  );
}

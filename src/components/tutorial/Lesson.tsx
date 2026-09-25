import Section from "./Section";
import LessonExplanation from "./LessonExplanation";
import LessonCode from "./LessonCode";
import LessonResult from "./LessonResult";
import LessonQuiz from "./LessonQuiz";
import { lessonQuizzes, type LessonData } from "../../data/lessons";

interface LessonProps {
  lesson: LessonData;
}

export default function Lesson({ lesson }: LessonProps) {
  const quiz = lessonQuizzes[lesson.id];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#808080] pb-2">
        <h2 className="m-0 text-[14px] font-bold">{lesson.title}</h2>
        <span className="text-[11px] text-[#808080]">{lesson.category}</span>
      </div>

      <LessonExplanation lesson={lesson} />

      <LessonCode code={lesson.example} />

      <Section title="Ahora en Stock Manager">{lesson.application}</Section>

      <LessonResult result={lesson.result} codeFile={lesson.codeFile} />

      {quiz && <LessonQuiz quiz={quiz} />}
    </div>
  );
}

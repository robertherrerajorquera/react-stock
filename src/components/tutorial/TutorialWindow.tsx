import Lesson from "./Lesson";
import LessonNavigation from "./LessonNavigation";
import { lessons } from "../../data/lessons";

interface TutorialWindowProps {
  lessonIndex: number;
  onLessonChange: (index: number) => void;
}

export default function TutorialWindow({
  lessonIndex,
  onLessonChange,
}: TutorialWindowProps) {
  const lesson = lessons[lessonIndex];

  return (
    <div className="flex h-full flex-col gap-3">
      <Lesson lesson={lesson} />
      <LessonNavigation index={lessonIndex} onChange={onLessonChange} />
    </div>
  );
}

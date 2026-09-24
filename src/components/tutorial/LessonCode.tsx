import Section from "./Section";

interface LessonCodeProps {
  code: string;
}

export default function LessonCode({ code }: LessonCodeProps) {
  return (
    <Section title="Ejemplo simple">
      <pre className="win95-code m-0">{code}</pre>
    </Section>
  );
}

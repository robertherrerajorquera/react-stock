import type { ReactNode } from "react";

interface SectionProps {
  title: string;
  children: ReactNode;
}

export default function Section({ title, children }: SectionProps) {
  return (
    <section className="border-t border-[#808080] pt-2 first:border-t-0 first:pt-0">
      <h3 className="m-0 mb-1 text-[12px] font-bold">{title}</h3>
      <div className="text-[12px] leading-[1.5]">{children}</div>
    </section>
  );
}

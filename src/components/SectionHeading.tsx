import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
}) {
  return (
    <div className={align === "center" ? "text-center mx-auto max-w-2xl" : "max-w-xl"}>
      <span
        className={`block text-xs font-bold uppercase tracking-[0.28em] ${
          light ? "text-gold" : "text-burgundy"
        }`}
      >
        {eyebrow}
      </span>
      <h2
        className={`mt-4 font-serif italic text-4xl md:text-5xl lg:text-[3.4rem] leading-[1.05] ${
          light ? "text-cream" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-5 text-base md:text-lg leading-relaxed ${light ? "text-cream/70" : "text-stone"}`}>
          {description}
        </p>
      )}
    </div>
  );
}

import type { ReactNode } from "react";

export function SectionHeading({
  kicker,
  title,
  description,
  align = "center",
  light = false,
  size = "default",
}: {
  kicker?: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  size?: "default" | "large";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-xl"}>
      {kicker && (
        <span
          className={`block text-[13px] font-semibold uppercase tracking-[0.14em] ${
            light ? "text-paper/50" : "text-stone-light"
          }`}
        >
          {kicker}
        </span>
      )}
      <h2
        className={`${kicker ? "mt-4" : ""} font-semibold tracking-tightest leading-[1.05] ${
          size === "large" ? "text-5xl md:text-6xl lg:text-7xl" : "text-4xl md:text-5xl"
        } ${light ? "text-paper" : "text-ink"}`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mx-auto mt-5 max-w-xl text-lg leading-relaxed ${
            light ? "text-paper/60" : "text-stone"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

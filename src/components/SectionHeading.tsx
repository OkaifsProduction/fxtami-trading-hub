import type { ReactNode } from "react";
import { useReveal } from "../hooks/useReveal";

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
  const ref = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`reveal ${align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-xl"}`}
    >
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
          size === "large"
            ? "text-[clamp(2.25rem,3vw+1.5rem,4.5rem)]"
            : "text-[clamp(2rem,1.6vw+1.6rem,3rem)]"
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

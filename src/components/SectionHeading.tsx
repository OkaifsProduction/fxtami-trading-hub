import type { ReactNode } from "react";
import { useReveal } from "../hooks/useReveal";

/**
 * Section title. Wrap the accent word(s) of `title` in <em> — they render in
 * the serif italic and the brand accent colour.
 */
export function SectionHeading({
  kicker,
  title,
  description,
  align = "center",
  light = false,
  size = "default",
  action,
}: {
  kicker?: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  size?: "default" | "large";
  action?: ReactNode;
}) {
  const ref = useReveal<HTMLDivElement>();
  const centered = align === "center";

  return (
    <div
      ref={ref}
      className={`reveal ${
        centered
          ? "mx-auto max-w-3xl text-center"
          : action
            ? "flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
            : "max-w-2xl"
      }`}
    >
      <div className={centered ? "" : "max-w-2xl"}>
        {kicker && <span className={`kicker ${light ? "text-paper/60" : "text-stone"}`}>{kicker}</span>}
        <h2
          className={`display ${kicker ? "mt-5" : ""} ${
            size === "large"
              ? "text-[clamp(2.75rem,4.5vw+1.25rem,6rem)]"
              : "text-[clamp(2.5rem,3vw+1.25rem,4.5rem)]"
          } ${light ? "text-paper [&_em]:text-gold" : "text-ink [&_em]:text-burgundy"} [&_em]:italic`}
        >
          {title}
        </h2>
        {description && (
          <p
            className={`mt-6 max-w-xl text-[17px] leading-relaxed md:text-lg ${centered ? "mx-auto" : ""} ${
              light ? "text-paper/60" : "text-stone"
            }`}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

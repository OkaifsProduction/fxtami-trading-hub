import type { AnchorHTMLAttributes, ReactNode } from "react";
import { useMagnetic } from "../hooks/usePointerEffect";

type Variant = "primary" | "primary-light" | "outline" | "outline-light" | "link" | "link-light";

interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  variant?: Variant;
  arrow?: boolean;
  /** Drifts toward the cursor on hover (mouse only). For primary calls to action. */
  magnetic?: boolean;
}

const pill =
  "group/btn inline-flex min-h-12 items-center justify-center gap-3 rounded-full py-3 pl-7 text-[15px] font-medium tracking-tight transition-all duration-500 ease-expo";

const variantClasses: Record<Variant, string> = {
  primary: `${pill} bg-ink text-paper hover:bg-burgundy`,
  "primary-light": `${pill} bg-paper text-ink hover:bg-gold`,
  outline: `${pill} border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-paper`,
  "outline-light": `${pill} border border-paper/30 text-paper hover:border-paper hover:bg-paper hover:text-ink`,
  link: "group/btn inline-flex min-h-12 items-center gap-2 text-[15px] font-medium tracking-tight text-ink",
  "link-light": "group/btn inline-flex min-h-12 items-center gap-2 text-[15px] font-medium tracking-tight text-paper",
};

const circleClasses: Record<Variant, string> = {
  primary: "bg-paper/10 text-paper",
  "primary-light": "bg-ink/[0.06] text-ink",
  outline: "bg-ink/[0.05]",
  "outline-light": "bg-paper/10",
  link: "",
  "link-light": "",
};

function Arrow() {
  return (
    <svg
      width="14"
      height="10"
      viewBox="0 0 15 10"
      fill="none"
      aria-hidden="true"
      className="transition-transform duration-500 ease-expo group-hover/btn:translate-x-1"
    >
      <path d="M1 5h12M8 1l5 4-5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Button({ children, variant = "primary", arrow, magnetic, className = "", ...props }: ButtonProps) {
  const magnetRef = useMagnetic<HTMLSpanElement>();
  const isLink = variant === "link" || variant === "link-light";
  const showArrow = arrow ?? isLink;
  const padRight = isLink ? "" : showArrow ? "pr-2" : "pr-7";

  const button = (
    <a {...props} className={`${variantClasses[variant]} ${padRight} ${magnetic ? "w-full" : ""} ${className}`}>
      {isLink ? <span className="link-draw pb-0.5">{children}</span> : children}
      {showArrow &&
        (isLink ? (
          <Arrow />
        ) : (
          <span className={`flex h-8 w-8 items-center justify-center rounded-full ${circleClasses[variant]}`}>
            <Arrow />
          </span>
        ))}
    </a>
  );

  if (!magnetic) return button;

  // The wrapper carries the movement so it can't clash with the button's own
  // colour transitions on hover.
  return (
    <span ref={magnetRef} className="magnetic w-full sm:w-auto">
      {button}
    </span>
  );
}

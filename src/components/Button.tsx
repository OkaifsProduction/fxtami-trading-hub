import type { AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "primary-light" | "outline" | "outline-light" | "link" | "link-light";

interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  variant?: Variant;
}

const pill =
  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-[15px] font-medium transition-all duration-300 ease-out hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

const variantClasses: Record<Variant, string> = {
  primary: `${pill} bg-ink text-paper hover:bg-graphite`,
  "primary-light": `${pill} bg-paper text-ink hover:bg-mist`,
  outline: `${pill} bg-transparent text-ink border border-ink/25 hover:border-ink`,
  "outline-light": `${pill} bg-transparent text-paper border border-paper/35 hover:border-paper`,
  link: "inline-flex items-center gap-1.5 text-[15px] font-medium text-ink transition-all hover:gap-2.5",
  "link-light": "inline-flex items-center gap-1.5 text-[15px] font-medium text-paper transition-all hover:gap-2.5",
};

const isLink = (v: Variant) => v === "link" || v === "link-light";

export function Button({ children, variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <a {...props} className={`${variantClasses[variant]} ${className}`}>
      {children}
      {isLink(variant) && (
        <svg width="15" height="10" viewBox="0 0 15 10" fill="none" aria-hidden="true">
          <path
            d="M1 5h12M8 1l5 4-5 4"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </a>
  );
}

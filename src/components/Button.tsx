import type { AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline-light";

interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-burgundy text-cream hover:bg-burgundy-dark shadow-[0_10px_30px_-10px_rgba(122,25,48,0.55)]",
  secondary:
    "bg-transparent text-ink border border-ink/20 hover:border-ink hover:bg-ink hover:text-cream",
  "outline-light":
    "bg-transparent text-cream border border-cream/40 hover:border-cream hover:bg-cream hover:text-ink",
};

export function Button({ children, variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <a
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold uppercase tracking-[0.12em] transition-all duration-300 ease-out hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy ${variantClasses[variant]} ${className}`}
    >
      {children}
    </a>
  );
}

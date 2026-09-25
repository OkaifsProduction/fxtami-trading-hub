import { useOpenStatus } from "../hooks/useOpenStatus";

export function OpenStatusPill({ light = false, className = "" }: { light?: boolean; className?: string }) {
  const { isOpen, label } = useOpenStatus();

  return (
    <span
      className={`inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 text-[13px] font-medium backdrop-blur-md ${
        light ? "border-paper/15 bg-paper/10 text-paper/80" : "border-ink/10 bg-paper/70 text-stone"
      } ${className}`}
    >
      <span className="relative flex h-2 w-2" aria-hidden="true">
        {isOpen && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold" />}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${isOpen ? "bg-gold" : "bg-stone-light"}`} />
      </span>
      {label}
    </span>
  );
}

import { useEffect, useRef } from "react";

/**
 * Shared behaviour for slide-over panels (cart drawer, mobile menu):
 * - `inert` while closed, so hidden links/buttons can't be reached with Tab
 *   or by screen readers even though the panel stays mounted for its animation;
 * - Escape closes it;
 * - page scroll is locked while open;
 * - focus moves into the panel on open and back to the trigger on close.
 */
export function useDialog<T extends HTMLElement>(isOpen: boolean, onClose: () => void) {
  const ref = useRef<T | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    node.inert = !isOpen;
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusTarget = node.querySelector<HTMLElement>("[data-autofocus]") ?? node;
    focusTarget.focus({ preventScroll: true });

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [isOpen]);

  return ref;
}

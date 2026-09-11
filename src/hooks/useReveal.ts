import { useEffect, useRef } from "react";

/** Adds `is-visible` to the element once it scrolls into view (paired with the `.reveal` CSS class). */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      node.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("is-visible");
          observer.unobserve(node);
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return ref;
}

/**
 * Reveals a group of children in sequence. Give the container this ref, and
 * give each child className="reveal-stagger-item" plus style={{ "--stagger": index }}
 * (see .reveal-stagger-item / --stagger in styles.css for the delay math).
 */
export function useStaggerReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const items = node.querySelectorAll<HTMLElement>(".reveal-stagger-item");

    if (typeof IntersectionObserver === "undefined") {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          items.forEach((el) => el.classList.add("is-visible"));
          observer.unobserve(node);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return ref;
}

/**
 * Reveals each `.word-reveal` span inside the element in sequence, once it
 * scrolls into view. Pair with <AnimatedHeadline> which sets --word per span.
 */
export function useWordReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const words = node.querySelectorAll<HTMLElement>(".word-reveal");

    if (typeof IntersectionObserver === "undefined") {
      words.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          words.forEach((el) => el.classList.add("is-visible"));
          observer.unobserve(node);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return ref;
}

import type { CSSProperties, ReactNode } from "react";

/**
 * One word of a headline animated by useWordReveal — see .word-reveal in
 * styles.css. Renders only the word itself (no trailing space): a trailing
 * space *inside* an inline-block gets trimmed at render time even though
 * it's present in the DOM, so separators must sit *between* <Word>s instead
 * — see splitWords below.
 */
export function Word({ index, children }: { index: number; children: ReactNode }) {
  return (
    <span className="word-reveal" style={{ "--word": index } as CSSProperties}>
      {children}
    </span>
  );
}

/** Splits text into <Word> spans with plain space text nodes between them. */
export function splitWords(text: string, indexOffset = 0): ReactNode[] {
  const words = text.split(" ");
  return words.flatMap((w, i) => {
    const nodes: ReactNode[] = [
      <Word key={`w-${indexOffset + i}`} index={indexOffset + i}>
        {w}
      </Word>,
    ];
    if (i < words.length - 1) nodes.push(" ");
    return nodes;
  });
}

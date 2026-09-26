import type { CSSProperties, ReactNode } from "react";

/**
 * One word of a headline. The outer span is the mask (it clips) and the inner
 * span is what slides up out of it — see .word-reveal in styles.css.
 *
 * Renders only the word itself, never a trailing space: whitespace at the edge
 * of an inline-block gets trimmed at render time even though it's in the DOM,
 * so separators must sit *between* <Word>s — see splitWords below.
 */
export function Word({ index, children }: { index: number; children: ReactNode }) {
  return (
    <span className="word-reveal">
      <span className="word-reveal-inner" style={{ "--word": index } as CSSProperties}>
        {children}
      </span>
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

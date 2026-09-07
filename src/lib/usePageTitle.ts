import { useEffect } from "react";

export function usePageTitle(title: string) {
  useEffect(() => {
    const previous = document.title;
    document.title = `${title} · Ami Legal`;
    return () => {
      document.title = previous;
    };
  }, [title]);
}

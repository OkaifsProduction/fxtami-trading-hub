// 16px text keeps iOS Safari from zooming in when a field is focused.
export const inputClass =
  "w-full rounded-none border-0 border-b border-ink/15 bg-transparent px-0 py-3 text-[16px] text-ink outline-none transition-colors duration-300 placeholder:text-stone-light/70 focus:border-ink focus-visible:outline-none";

export const labelClass = "block text-[12px] font-semibold uppercase tracking-[0.16em] text-stone-light";

export const submitClass =
  "group inline-flex min-h-14 shrink-0 items-center gap-4 whitespace-nowrap rounded-full bg-ink pl-8 pr-2 text-[15px] font-medium text-paper transition-colors duration-500 ease-expo hover:bg-burgundy disabled:cursor-wait disabled:opacity-60";

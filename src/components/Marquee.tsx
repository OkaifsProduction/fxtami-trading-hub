import { Fragment } from "react";
import { menuCategories } from "../data/menu";

const WORDS = ["pizza-margarita", "pizza-davinci", "pasta-carbonara", "pasta-lasagne", "pizza-quattro-formaggio", "vlees-scampi-grilla", "pizza-calzone", "pizza-frutti-di-mare"]
  .map((id) => menuCategories.flatMap((c) => c.items).find((i) => i.id === id)?.name)
  .filter((name): name is string => Boolean(name));

function Row() {
  return (
    <div className="flex shrink-0 items-center">
      {WORDS.map((word) => (
        <Fragment key={word}>
          <span className="whitespace-nowrap px-6 font-serif text-[clamp(2.25rem,3vw+1rem,4rem)] italic leading-none text-ink md:px-10">
            {word}
          </span>
          <span className="text-lg text-gold">✦</span>
        </Fragment>
      ))}
    </div>
  );
}

/** Decorative, slowly scrolling strip of real dish names from the menu. */
export function Marquee() {
  return (
    <div className="marquee-mask overflow-hidden border-y border-ink/[0.06] bg-paper py-8 md:py-10" aria-hidden="true">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        <Row />
        <Row />
      </div>
    </div>
  );
}

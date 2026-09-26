import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";
import { menuCategories } from "../data/menu";
import { useCart } from "../lib/cart";
import { formatPrice } from "../lib/format";
import { useReveal } from "../hooks/useReveal";

export function Menu() {
  const [activeId, setActiveId] = useState(menuCategories[0].id);
  const active = menuCategories.find((c) => c.id === activeId) ?? menuCategories[0];
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const addedTimer = useRef<number>();
  const tabsWrapRef = useReveal<HTMLDivElement>();
  const tabListRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const [direction, setDirection] = useState(1);

  useLayoutEffect(() => {
    function measure() {
      const tab = tabRefs.current[activeId];
      if (tab) setIndicator({ left: tab.offsetLeft, width: tab.offsetWidth });
    }
    measure();
    window.addEventListener("resize", measure);
    // Web fonts can change tab widths after first paint.
    document.fonts?.ready.then(measure).catch(() => {});
    return () => window.removeEventListener("resize", measure);
  }, [activeId]);

  useEffect(() => () => window.clearTimeout(addedTimer.current), []);

  function select(id: string) {
    const from = menuCategories.findIndex((c) => c.id === activeId);
    const to = menuCategories.findIndex((c) => c.id === id);
    setDirection(to >= from ? 1 : -1);
    setActiveId(id);
    const list = tabListRef.current;
    const tab = tabRefs.current[id];
    // Keep the chosen tab in view on narrow screens without scrolling the page.
    if (list && tab) {
      list.scrollTo({ left: tab.offsetLeft - list.clientWidth / 2 + tab.offsetWidth / 2, behavior: "smooth" });
    }
  }

  function onTabKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    const index = menuCategories.findIndex((c) => c.id === activeId);
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = menuCategories[(index + delta + menuCategories.length) % menuCategories.length];
    select(next.id);
    tabRefs.current[next.id]?.focus();
  }

  function handleAdd(item: { id: string; name: string; priceCents: number }) {
    addItem({ id: item.id, name: item.name, priceCents: item.priceCents });
    setJustAdded(item.id);
    window.clearTimeout(addedTimer.current);
    addedTimer.current = window.setTimeout(() => setJustAdded(null), 1200);
  }

  return (
    <section id="menu" className="bg-mist py-28 md:py-40">
      <Container>
        <SectionHeading
          kicker="La Carta"
          title={
            <>
              Ontdek onze <em>kaart</em>
            </>
          }
          description="Pizza, pasta, vlees, vis en salades — kies een categorie en stel uw bestelling samen om af te halen."
        />
      </Container>

      <div ref={tabsWrapRef} className="reveal mt-12 md:mt-16">
        <div
          ref={tabListRef}
          role="tablist"
          aria-label="Menucategorieën"
          className="no-scrollbar relative mx-auto flex max-w-full gap-1 overflow-x-auto px-6 md:w-fit md:rounded-full md:border md:border-ink/[0.08] md:bg-paper md:p-1.5"
        >
          <span
            aria-hidden="true"
            className="absolute bottom-1.5 top-1.5 hidden rounded-full bg-ink transition-all duration-500 ease-expo md:block"
            style={{ left: indicator.left, width: indicator.width }}
          />
          {menuCategories.map((category) => {
            const isActive = category.id === activeId;
            return (
              <button
                key={category.id}
                ref={(el) => {
                  tabRefs.current[category.id] = el;
                }}
                id={`tab-${category.id}`}
                role="tab"
                type="button"
                aria-selected={isActive}
                aria-controls="menu-panel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => select(category.id)}
                onKeyDown={onTabKeyDown}
                className={`relative min-h-11 shrink-0 rounded-full px-5 text-[13px] font-semibold transition-colors duration-500 ${
                  isActive
                    ? "bg-ink text-paper md:bg-transparent"
                    : "bg-paper text-stone hover:text-ink md:bg-transparent"
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      <Container>
        <div id="menu-panel" role="tabpanel" aria-labelledby={`tab-${active.id}`} className="mx-auto mt-12 max-w-5xl md:mt-16">
          <div key={active.id} className="panel-fade" style={{ "--dir": direction } as CSSProperties}>
            {active.note && (
              <p className="mb-8 text-center font-serif text-xl italic text-stone">{active.note}</p>
            )}
            <ul className="grid grid-cols-1 gap-x-16 md:grid-cols-2">
              {active.items.map((item) => (
                <li key={item.id} className="glass-row flex items-start gap-4 border-b border-ink/[0.07] py-6">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline">
                      <h3 className="font-serif text-[24px] leading-tight text-ink">{item.name}</h3>
                      <span className="leader" aria-hidden="true" />
                      <span className="shrink-0 text-[15px] font-semibold tabular-nums text-ink">
                        {formatPrice(item.priceCents)}
                      </span>
                    </div>
                    {item.description && (
                      <p className="mt-1.5 text-[14px] leading-relaxed text-stone">{item.description}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAdd(item)}
                    aria-label={`Voeg ${item.name} toe aan bestelling`}
                    className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all duration-500 ease-expo ${
                      justAdded === item.id
                        ? "bg-gold text-ink"
                        : "bg-paper text-ink shadow-[0_1px_2px_rgba(0,0,0,0.06)] hover:bg-ink hover:text-paper"
                    }`}
                  >
                    {justAdded === item.id ? (
                      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M2 8.5 6 12l8-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

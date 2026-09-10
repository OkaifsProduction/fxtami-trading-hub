import { menuCategories } from "../../../src/data/menu";
import { popularDishes } from "../../../src/data/dishes";

export interface CatalogEntry {
  id: string;
  name: string;
  priceCents: number;
}

/**
 * Every orderable item, keyed by id, built from the same data files the
 * front-end renders. The checkout function looks prices up here — the
 * amount a customer is charged is never trusted from the browser.
 */
export function buildCatalog(): Map<string, CatalogEntry> {
  const catalog = new Map<string, CatalogEntry>();

  for (const category of menuCategories) {
    for (const item of category.items) {
      catalog.set(item.id, { id: item.id, name: item.name, priceCents: item.priceCents });
    }
  }

  for (const dish of popularDishes) {
    if (!catalog.has(dish.id)) {
      catalog.set(dish.id, { id: dish.id, name: dish.name, priceCents: dish.priceCents });
    }
  }

  return catalog;
}

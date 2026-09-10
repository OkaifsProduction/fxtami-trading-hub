export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  priceCents: number;
}

export interface MenuCategory {
  id: string;
  label: string;
  note?: string;
  items: MenuItem[];
}

export const menuCategories: MenuCategory[] = [
  {
    id: "pizza",
    label: "Pizza",
    note: "Wood-fired · 12-inch",
    items: [
      { id: "pizza-margherita", name: "Margherita", description: "San Marzano tomato, fior di latte, basil", priceCents: 1600 },
      { id: "pizza-diavola", name: "Diavola", description: "Spicy salami, chili oil, mozzarella", priceCents: 1900 },
      { id: "pizza-burrata", name: "Burrata", description: "Burrata, cherry tomato, pesto, balsamic", priceCents: 2100 },
      { id: "pizza-quattro-formaggi", name: "Quattro Formaggi", description: "Mozzarella, gorgonzola, fontina, parmesan", priceCents: 2000 },
      { id: "pizza-prosciutto-funghi", name: "Prosciutto e Funghi", description: "Prosciutto cotto, cremini mushroom, truffle oil", priceCents: 2100 },
      { id: "pizza-quattro-stagioni", name: "Quattro Stagioni", description: "Artichoke, mushroom, ham, olives", priceCents: 2000 },
      { id: "pizza-vegetariana", name: "Vegetariana", description: "Roasted peppers, zucchini, onion, olives", priceCents: 1800 },
      { id: "pizza-tartufo", name: "Tartufo", description: "Black truffle cream, wild mushroom, parmesan", priceCents: 2400 },
    ],
  },
  {
    id: "pasta",
    label: "Pasta",
    items: [
      { id: "pasta-pomodoro", name: "Spaghetti Pomodoro", description: "San Marzano tomato, garlic, basil", priceCents: 1600 },
      { id: "pasta-carbonara", name: "Carbonara", description: "Guanciale, egg yolk, pecorino romano", priceCents: 1800 },
      { id: "pasta-ragu", name: "Tagliatelle al Ragù", description: "Slow-braised beef and pork ragù", priceCents: 2000 },
      { id: "pasta-cacio-pepe", name: "Cacio e Pepe", description: "Pecorino romano, cracked black pepper", priceCents: 1700 },
      { id: "pasta-vongole", name: "Linguine alle Vongole", description: "Clams, white wine, garlic, parsley", priceCents: 2300 },
      { id: "pasta-lasagna", name: "Lasagna della Casa", description: "Layered pasta, ragù, béchamel, parmesan", priceCents: 1900 },
      { id: "pasta-risotto-funghi", name: "Risotto ai Funghi", description: "Porcini mushroom, parmesan, white wine", priceCents: 2000 },
    ],
  },
  {
    id: "antipasti",
    label: "Antipasti",
    items: [
      { id: "antipasti-bruschetta", name: "Bruschetta al Pomodoro", description: "Toasted bread, tomato, garlic, basil", priceCents: 900 },
      { id: "antipasti-tagliere", name: "Tagliere Misto", description: "Cured meats, aged cheese, honey, nuts", priceCents: 2200 },
      { id: "antipasti-arancini", name: "Arancini", description: "Saffron risotto balls, mozzarella, tomato sauce", priceCents: 1200 },
      { id: "antipasti-carpaccio", name: "Carpaccio di Manzo", description: "Beef carpaccio, arugula, parmesan, lemon", priceCents: 1700 },
      { id: "antipasti-calamari", name: "Calamari Fritti", description: "Crispy calamari, lemon, spicy aioli", priceCents: 1500 },
      { id: "antipasti-burrata-tartufo", name: "Burrata al Tartufo", description: "Burrata, black truffle honey, toasted bread", priceCents: 1800 },
    ],
  },
  {
    id: "insalate",
    label: "Insalate",
    items: [
      { id: "insalate-verde", name: "Insalata Verde", description: "Mixed greens, shaved fennel, citrus vinaigrette", priceCents: 1100 },
      { id: "insalate-caprese", name: "Caprese", description: "Heirloom tomato, buffalo mozzarella, basil", priceCents: 1400 },
      { id: "insalate-rucola", name: "Rucola e Parmigiano", description: "Arugula, shaved parmesan, walnuts, lemon", priceCents: 1300 },
      { id: "insalate-cesare", name: "Cesare Italiana", description: "Romaine, anchovy dressing, parmesan crisp", priceCents: 1300 },
    ],
  },
  {
    id: "desserts",
    label: "Desserts",
    items: [
      { id: "dessert-tiramisu", name: "Tiramisù", description: "Espresso-soaked savoiardi, mascarpone", priceCents: 1000 },
      { id: "dessert-pannacotta", name: "Panna Cotta", description: "Vanilla bean, mixed berry compote", priceCents: 900 },
      { id: "dessert-cannoli", name: "Cannoli Siciliani", description: "Ricotta cream, pistachio, chocolate chip", priceCents: 900 },
      { id: "dessert-affogato", name: "Affogato", description: "Vanilla gelato, espresso, amaretti", priceCents: 800 },
    ],
  },
  {
    id: "drinks",
    label: "Drinks",
    items: [
      { id: "drink-chianti", name: "Chianti Classico (glass)", priceCents: 1200 },
      { id: "drink-prosecco", name: "Prosecco (glass)", priceCents: 1100 },
      { id: "drink-aperol", name: "Aperol Spritz", priceCents: 1300 },
      { id: "drink-negroni", name: "Negroni", priceCents: 1400 },
      { id: "drink-pellegrino", name: "San Pellegrino", priceCents: 500 },
      { id: "drink-espresso", name: "Espresso", priceCents: 400 },
      { id: "drink-cappuccino", name: "Cappuccino", priceCents: 500 },
    ],
  },
];

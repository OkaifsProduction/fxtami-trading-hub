export interface MenuItem {
  name: string;
  description?: string;
  price: string;
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
      { name: "Margherita", description: "San Marzano tomato, fior di latte, basil", price: "$16" },
      { name: "Diavola", description: "Spicy salami, chili oil, mozzarella", price: "$19" },
      { name: "Burrata", description: "Burrata, cherry tomato, pesto, balsamic", price: "$21" },
      { name: "Quattro Formaggi", description: "Mozzarella, gorgonzola, fontina, parmesan", price: "$20" },
      { name: "Prosciutto e Funghi", description: "Prosciutto cotto, cremini mushroom, truffle oil", price: "$21" },
      { name: "Quattro Stagioni", description: "Artichoke, mushroom, ham, olives", price: "$20" },
      { name: "Vegetariana", description: "Roasted peppers, zucchini, onion, olives", price: "$18" },
      { name: "Tartufo", description: "Black truffle cream, wild mushroom, parmesan", price: "$24" },
    ],
  },
  {
    id: "pasta",
    label: "Pasta",
    items: [
      { name: "Spaghetti Pomodoro", description: "San Marzano tomato, garlic, basil", price: "$16" },
      { name: "Carbonara", description: "Guanciale, egg yolk, pecorino romano", price: "$18" },
      { name: "Tagliatelle al Ragù", description: "Slow-braised beef and pork ragù", price: "$20" },
      { name: "Cacio e Pepe", description: "Pecorino romano, cracked black pepper", price: "$17" },
      { name: "Linguine alle Vongole", description: "Clams, white wine, garlic, parsley", price: "$23" },
      { name: "Lasagna della Casa", description: "Layered pasta, ragù, béchamel, parmesan", price: "$19" },
      { name: "Risotto ai Funghi", description: "Porcini mushroom, parmesan, white wine", price: "$20" },
    ],
  },
  {
    id: "antipasti",
    label: "Antipasti",
    items: [
      { name: "Bruschetta al Pomodoro", description: "Toasted bread, tomato, garlic, basil", price: "$9" },
      { name: "Tagliere Misto", description: "Cured meats, aged cheese, honey, nuts", price: "$22" },
      { name: "Arancini", description: "Saffron risotto balls, mozzarella, tomato sauce", price: "$12" },
      { name: "Carpaccio di Manzo", description: "Beef carpaccio, arugula, parmesan, lemon", price: "$17" },
      { name: "Calamari Fritti", description: "Crispy calamari, lemon, spicy aioli", price: "$15" },
      { name: "Burrata al Tartufo", description: "Burrata, black truffle honey, toasted bread", price: "$18" },
    ],
  },
  {
    id: "insalate",
    label: "Insalate",
    items: [
      { name: "Insalata Verde", description: "Mixed greens, shaved fennel, citrus vinaigrette", price: "$11" },
      { name: "Caprese", description: "Heirloom tomato, buffalo mozzarella, basil", price: "$14" },
      { name: "Rucola e Parmigiano", description: "Arugula, shaved parmesan, walnuts, lemon", price: "$13" },
      { name: "Cesare Italiana", description: "Romaine, anchovy dressing, parmesan crisp", price: "$13" },
    ],
  },
  {
    id: "desserts",
    label: "Desserts",
    items: [
      { name: "Tiramisù", description: "Espresso-soaked savoiardi, mascarpone", price: "$10" },
      { name: "Panna Cotta", description: "Vanilla bean, mixed berry compote", price: "$9" },
      { name: "Cannoli Siciliani", description: "Ricotta cream, pistachio, chocolate chip", price: "$9" },
      { name: "Affogato", description: "Vanilla gelato, espresso, amaretti", price: "$8" },
    ],
  },
  {
    id: "drinks",
    label: "Drinks",
    items: [
      { name: "Chianti Classico (glass)", price: "$12" },
      { name: "Prosecco (glass)", price: "$11" },
      { name: "Aperol Spritz", price: "$13" },
      { name: "Negroni", price: "$14" },
      { name: "San Pellegrino", price: "$5" },
      { name: "Espresso", price: "$4" },
      { name: "Cappuccino", price: "$5" },
    ],
  },
];

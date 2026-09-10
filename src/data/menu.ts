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
    note: "Ø26cm — ook verkrijgbaar in Ø30cm, vraag ernaar",
    items: [
      { id: "pizza-margarita", name: "Margarita", description: "Tomatensaus, kaas", priceCents: 700 },
      { id: "pizza-davinci", name: "Da Vinci", description: "Scampi, spek, hesp, gorgonzola, salami, paprika, look", priceCents: 1050 },
      { id: "pizza-salami", name: "Salami", description: "Tomatensaus, kaas, salami", priceCents: 800 },
      { id: "pizza-prosciutto", name: "Prosciutto", description: "Tomatensaus, kaas, hesp", priceCents: 800 },
      { id: "pizza-capricciosa", name: "Capricciosa", description: "Hesp, champignons, artisjokken", priceCents: 1050 },
      { id: "pizza-quattro-stagioni", name: "Quattro Stagioni", description: "Paprika, hesp, champignons, ansjovis, kappertjes", priceCents: 1050 },
      { id: "pizza-pikante", name: "Pikante", description: "Paprika, ansjovis, peperoni, zwarte peper", priceCents: 950 },
      { id: "pizza-quattro-formaggio", name: "Quattro Formaggio", description: "4 soorten kaas", priceCents: 1050 },
      { id: "pizza-scampi", name: "Scampi", description: "Tomatensaus, kaas, garnalen", priceCents: 1150 },
      { id: "pizza-frutti-di-mare", name: "Frutti di Mare", description: "Tomatensaus, kaas, zeevruchten", priceCents: 1150 },
      { id: "pizza-beverst", name: "Beverst", description: "Garnalen, tonijn, champignons, ansjovis", priceCents: 1100 },
      { id: "pizza-di-pollo", name: "Di Pollo", description: "Kipreepjes, ajuin, paprika", priceCents: 1150 },
      { id: "pizza-gorgonzola", name: "Gorgonzola", description: "Gorgonzola, tomaten, peperoni, ansjovis, olijven, artisjokken", priceCents: 1150 },
      { id: "pizza-mozzarella", name: "Mozzarella", description: "Kaas, mozzarella, tomaten, spinazie, look", priceCents: 1000 },
      { id: "pizza-van-het-huis", name: "Van Het Huis", description: "Rundvleesreepjes, champignons met roomsaus", priceCents: 1300 },
      { id: "pizza-vegetarisch", name: "Vegetarisch", description: "Paprika, ajuin, tomaten, champignons", priceCents: 950 },
      { id: "pizza-calzone", name: "Calzone", description: "Gevuld: bolognese, kaas, hesp, paprika, champignons, tonijn, artisjokken", priceCents: 1250 },
      { id: "pizza-hawai", name: "Hawaï", description: "Hesp, ananas, perzik", priceCents: 1000 },
    ],
  },
  {
    id: "pasta",
    label: "Pasta",
    items: [
      { id: "pasta-bolognese", name: "Spaghetti Bolognese", description: "Rundergehakt in tomatenroomsaus", priceCents: 1000 },
      { id: "pasta-tonno", name: "Spaghetti Tonno", description: "Tonijn in tomatenroomsaus", priceCents: 1050 },
      { id: "pasta-aglio-olio", name: "Spaghetti Aglio Olio", description: "Olijfolie, look, spek", priceCents: 1100 },
      { id: "pasta-carbonara", name: "Spaghetti Carbonara", description: "Spek, hesp, parmezaan, ei in roomsaus", priceCents: 1200 },
      { id: "pasta-frutti-di-mare", name: "Spaghetti Frutti di Mare", description: "Zeevruchten in tomatenroomsaus", priceCents: 1250 },
      { id: "pasta-spinazie", name: "Spaghetti Spinazie", description: "Spinazie, look, peper in tomatenroomsaus", priceCents: 1300 },
      { id: "pasta-apero", name: "Spaghetti Apero", description: "Gamba's in look, tomatensaus", priceCents: 1400 },
      { id: "pasta-davinci", name: "Spaghetti Da Vinci", description: "Gegrild rundvlees, champignons, spek, gorgonzola", priceCents: 1450 },
      { id: "pasta-della-vigo", name: "Spaghetti Della Vigo", description: "Zalm, basilicum, cherrytomaten, parmezaan in roomsaus", priceCents: 1350 },
      { id: "pasta-tagliatelle-monalisa", name: "Tagliatelle Mona Lisa", description: "Witte & groene tagliatelle, rundvlees, champignons, ajuin", priceCents: 1300 },
      { id: "pasta-tagliatelle-apero", name: "Tagliatelle Apero", description: "Gamba's in look, peperoni, artisjokken, basilicum", priceCents: 1350 },
      { id: "pasta-tagliatelle-davinci", name: "Tagliatelle Da Vinci", description: "Rundvlees, champignons, spek, gorgonzola", priceCents: 1450 },
      { id: "pasta-tagliatelle-quattro-formaggio", name: "Tagliatelle Quattro Formaggio", description: "4 soorten kaas in roomsaus", priceCents: 1250 },
      { id: "pasta-tortellini-carbonara", name: "Tortellini Carbonara", description: "Spek, hesp, parmezaan, ei in roomsaus", priceCents: 1200 },
      { id: "pasta-tortellini-davinci", name: "Tortellini Da Vinci", description: "Rundvlees, champignons, spek, gorgonzola", priceCents: 1450 },
      { id: "pasta-lasagne", name: "Lasagne", description: "Rundergehakt, hesp in tomatenroomsaus", priceCents: 1100 },
      { id: "pasta-lasagne-salmone", name: "Lasagne Salmone", description: "Zalm in tomatenroomsaus", priceCents: 1300 },
      { id: "pasta-lasagne-verde", name: "Lasagne Verde", description: "Spinazie, champignons in tomatenroomsaus", priceCents: 1200 },
      { id: "pasta-macaroni-quattro-formaggio", name: "Macaroni Quattro Formaggio", description: "4 soorten kaas in roomsaus", priceCents: 1250 },
      { id: "pasta-combinatione", name: "Combinatione", description: "4 verschillende pasta's in gehakt-tomatenroomsaus, gegratineerd", priceCents: 1500 },
    ],
  },
  {
    id: "voorgerechten",
    label: "Voorgerechten & Soep",
    items: [
      { id: "voorgerecht-pizzabrood-kruidenboter", name: "Pizzabrood met Kruidenboter", priceCents: 550 },
      { id: "voorgerecht-pizzabrood-look", name: "Pizzabrood met Look", priceCents: 600 },
      { id: "voorgerecht-pizzabrood-special", name: "Pizzabrood Special", description: "Tomatensaus en kaas", priceCents: 650 },
      { id: "voorgerecht-pizzabrood-davinci", name: "Pizzabrood Da Vinci", description: "Tomatensaus, kaas en hesp", priceCents: 700 },
      { id: "voorgerecht-pizzabrood-arturo", name: "Pizzabrood Arturo", description: "Kaas gegratineerd", priceCents: 650 },
      { id: "voorgerecht-tomatensoep", name: "Tomatensoep", priceCents: 500 },
      { id: "voorgerecht-groentesoep", name: "Groentesoep", priceCents: 500 },
      { id: "voorgerecht-ajuinensoep", name: "Ajuinensoep", priceCents: 500 },
      { id: "voorgerecht-salade-scampi", name: "Salade Scampi", description: "Verse sla, ajuin, kaas, tomaten, komkommer, scampi", priceCents: 1000 },
      { id: "voorgerecht-salade-verde", name: "Salade Verde", description: "Verse sla, ajuin, komkommer, tomaten, olijven", priceCents: 800 },
    ],
  },
  {
    id: "vlees-vis",
    label: "Vlees & Vis",
    items: [
      { id: "vlees-scampi-grilla", name: "Scampi alla Grilla", description: "Gegrilde gamba's", priceCents: 2300 },
      { id: "vlees-scampi-giovanni", name: "Scampi alla Giovanni", description: "Special tomatensaus, look, basilicum", priceCents: 2250 },
      { id: "vlees-scampi-romana", name: "Scampi alla Romana", description: "Roomsaus, look, basilicum, champignons", priceCents: 2450 },
      { id: "vlees-forel-davinci", name: "Forel alla Da Vinci", description: "Forel op wijze van de chef", priceCents: 2350 },
      { id: "vlees-calamari-fritti", name: "Calamari Fritti", description: "Gepaneerde inktvisringen", priceCents: 1950 },
      { id: "vlees-bistecca-grill", name: "Bistecca alla Grill", description: "Gegrild rundvlees met kruiden", priceCents: 2050 },
      { id: "vlees-bistecca-pepe", name: "Bistecca alla Pepe", description: "Gegrild rundvlees met peperroomsaus", priceCents: 2250 },
      { id: "vlees-bistecca-davinci", name: "Bistecca Da Vinci", description: "Gegrild rundvlees, tomaten-gorgonzolasaus", priceCents: 2250 },
      { id: "vlees-wiener-schnitzel", name: "Wiener Art Schnitzel", description: "Gepaneerde schnitzel", priceCents: 1650 },
      { id: "vlees-schnitzel-nonna", name: "Schnitzel alla Nonna", description: "Met champignonroomsaus", priceCents: 1750 },
      { id: "vlees-scaloppina-romana", name: "Scaloppina alla Romana", description: "3 kleine schnitzels met hesp in marsala wijn", priceCents: 2000 },
      { id: "vlees-scaloppina-pizzaiolo", name: "Scaloppina alla Pizzaiolo", description: "3 kleine schnitzels in tomatensaus, look, champignons", priceCents: 2100 },
      { id: "vlees-lamskoteletten", name: "Lamskoteletten", description: "Vier lamskoteletjes gegrild", priceCents: 2300 },
      { id: "vlees-lams-mixed-grill", name: "Lams Mixed Grill", description: "Drie koteletjes en twee lamsspiesen", priceCents: 2450 },
      { id: "vlees-kipfilet", name: "Kipfilet Gegrild", priceCents: 1750 },
      { id: "vlees-kipreepjes", name: "Kip Reepjes", description: "Gebakken kippenreepjes met champignons en ajuin", priceCents: 2050 },
    ],
  },
  {
    id: "salades",
    label: "Salades",
    items: [
      { id: "salade-davinci", name: "Salade Da Vinci", description: "Garnalen, tonijn, ajuin, komkommer, hesp, kaas, artisjokken, maïs, ananas", priceCents: 1350 },
      { id: "salade-scampi-look", name: "Salade Scampi Look", description: "Garnalen in look, ajuin, komkommer, tomaten, olijven, paprika", priceCents: 1250 },
      { id: "salade-frutti-di-mare", name: "Salade Frutti Di Mare", description: "Zeevruchten, ajuin, komkommer, kaas, tomaten, olijven", priceCents: 1250 },
      { id: "salade-di-pollo", name: "Salade di Pollo", description: "Gegrilde kipreepjes, ajuin, komkommer, tomaten, olijven", priceCents: 1250 },
      { id: "salade-santa-monica", name: "Salade Santa Monica", description: "Zalm, cherrytomaten, ajuin, komkommer, olijven, kaas", priceCents: 1400 },
      { id: "salade-special", name: "Salade Special", description: "Hesp, kaas, artisjokken, tomaten, olijven", priceCents: 1300 },
      { id: "salade-yerevan", name: "Salade Yerevan", description: "Fetakaas, ajuin, komkommer, tomaten, peperoni, paprika, olijven", priceCents: 1200 },
      { id: "salade-mozzarella", name: "Salade Mozzarella", description: "Mozzarella, ajuin, komkommer, tomaten, tonijn, olijven", priceCents: 1150 },
      { id: "salade-italia", name: "Salade Italia", description: "Hesp, tonijn, tomaten, olijven, kaas", priceCents: 1200 },
      { id: "salade-tropicana", name: "Salade Tropicana", priceCents: 1200 },
    ],
  },
  {
    id: "dranken",
    label: "Dranken",
    items: [
      { id: "drank-chaudfontaine", name: "Chaudfontaine Bruisend / Naturel", priceCents: 200 },
      { id: "drank-cola", name: "Coca Cola / Light / Zero", priceCents: 220 },
      { id: "drank-jupiler", name: "Jupiler", priceCents: 200 },
      { id: "drank-carlsberg", name: "Carlsberg", priceCents: 260 },
      { id: "drank-leffe", name: "Leffe Blond / Bruin", priceCents: 300 },
      { id: "drank-duvel", name: "Duvel", priceCents: 320 },
      { id: "drank-wijn-glas", name: "Rode / Witte / Rosé / Halfzoete Wijn (glas)", priceCents: 400 },
      { id: "drank-cava", name: "Cava (glas)", priceCents: 450 },
      { id: "drank-prosecco", name: "Prosecco (glas)", priceCents: 550 },
      { id: "drank-aperol", name: "Aperol Spritz", priceCents: 650 },
      { id: "drank-espresso", name: "Espresso / Koffie / Deca", priceCents: 220 },
      { id: "drank-cappuccino", name: "Cappuccino / Koffie Verkeerd", priceCents: 250 },
      { id: "drank-irish-coffee", name: "Irish / Hasseltse / Italiaanse Koffie", priceCents: 750 },
      { id: "drank-hendricks", name: "Hendrick's Gin", priceCents: 1250 },
      { id: "drank-ginmare", name: "Gin Mare", priceCents: 1300 },
      { id: "drank-limoncello", name: "Limoncello / Grappa / Porto", priceCents: 450 },
    ],
  },
];

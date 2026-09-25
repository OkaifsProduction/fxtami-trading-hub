/**
 * Sfeerbeelden van Unsplash (vrij te gebruiken). Elke foto is visueel
 * gecontroleerd op het gerecht dat ze voorstelt. Vervang ze bij voorkeur door
 * echte foto's van Da Vinci — alles wordt vanaf deze ene plek gebruikt.
 */
function unsplash(id: string, width: number, quality = 80) {
  return `https://images.unsplash.com/photo-${id}?w=${width}&q=${quality}&auto=format&fit=crop`;
}

export const images = {
  heroPizza: unsplash("1513104890138-7c749659a591", 1800),
  cheesePull: unsplash("1542834369-f10ebf06d3e0", 1600),
  pizzaInOven: unsplash("1579751626657-72bc17010498", 1200),

  dishDaVinci: unsplash("1593246049226-ded77bf90326", 900),
  dishMargherita: unsplash("1574071318508-1cdbab80d002", 900),
  dishCarbonara: unsplash("1612874742237-6526221588e3", 900),
  dishLasagne: unsplash("1619895092538-128341789043", 900),
  dishSalad: unsplash("1546793665-c74683f339c1", 900),
  dishScampi: unsplash("1625943553852-781c6dd46faa", 900),

  freshPasta: unsplash("1498579150354-977475b7ea0b", 1200),
  tiramisu: unsplash("1571877227200-a0d98ea607e9", 900),
  redWine: unsplash("1510812431401-41d2bd2722f3", 900),
  tomatoes: unsplash("1592841200221-a6898f307baa", 900),
  pizzaFloured: unsplash("1595854341625-f33ee10dbf94", 900),
  spaghettiScampi: unsplash("1563379926898-05f4575a45d8", 900),
  penne: unsplash("1621996346565-e3dbc646d9a9", 900),
  pizzaSlices: unsplash("1585238342024-78d387f4a707", 900),
  pastaBolognese: unsplash("1600803907087-f56d462fd26b", 900),
};

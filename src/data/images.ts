/**
 * Placeholder photography sourced from Unsplash. Swap any entry for a real,
 * licensed photo of the restaurant by replacing the URL — every image is
 * referenced from a single place so real photography is a one-line change.
 */
function unsplash(id: string, width: number, quality = 80) {
  return `https://images.unsplash.com/photo-${id}?w=${width}&q=${quality}&auto=format&fit=crop`;
}

export const images = {
  heroPizza: unsplash("1513104890138-7c749659a591", 1400),
  heroPizzaSmall: unsplash("1513104890138-7c749659a591", 800),
  doughHands: unsplash("1590947132387-155cc02f3212", 1200),
  woodFiredOven: unsplash("1574071318508-1cdbab80d002", 1200),

  dishMargherita: unsplash("1548369937-47519962c11a", 800),
  dishDiavola: unsplash("1593246049226-ded77bf90326", 800),
  dishBurrata: unsplash("1595295333158-4742f28fbd85", 800),
  dishQuattroFormaggi: unsplash("1519676867240-f03562e64548", 800),
  dishCarbonara: unsplash("1608219992759-8d74ed8d76eb", 800),
  dishTiramisu: unsplash("1571877227200-a0d98ea607e9", 800),

  galleryPizza: unsplash("1467003909585-2f8a72700288", 900),
  galleryPastaClose: unsplash("1608897013039-887f21d8c804", 900),
  galleryInterior: unsplash("1414235077428-338989a2e8c0", 900),
  galleryChef: unsplash("1544025162-d76694265947", 900),
  galleryIngredients: unsplash("1592841200221-a6898f307baa", 900),
  galleryWine: unsplash("1510812431401-41d2bd2722f3", 900),
  galleryDough: unsplash("1590947132387-155cc02f3212", 900),
  gallerySalad: unsplash("1512621776951-a57141f2eefd", 900),

  ctaBackground: unsplash("1574071318508-1cdbab80d002", 1600),
};

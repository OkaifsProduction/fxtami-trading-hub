/** Centrale plek voor alle restaurantgegevens — pas hier aan bij wijzigingen. */
export const restaurant = {
  name: "Da Vinci",
  tagline: "Restaurant & Pizzeria",
  phone: "089 / 49 29 89",
  phoneHref: "tel:+3289492989",
  mobile: "0487 / 22 40 43",
  mobileHref: "tel:+32487224043",
  email: "info@davinci-restaurant.be",
  address: {
    line1: "Beverststraat 41",
    line2: "3740 Bilzen (Beverst)",
    full: "Beverststraat 41, 3740 Bilzen (Beverst)",
  },
  directionsUrl: "https://maps.google.com/?q=Beverststraat+41,+3740+Bilzen",
  mapEmbedUrl: "https://maps.google.com/maps?q=Beverststraat%2041%2C%203740%20Bilzen&z=15&output=embed",
  orderOnlineUrl: "#menu",
  reserveUrl: "#reserve",
  hours: [
    { days: "Maandag", time: "Gesloten", weekdays: [1] },
    { days: "Dinsdag – Donderdag", time: "17:00 – 22:00", weekdays: [2, 3, 4] },
    { days: "Vrijdag – Zondag", time: "17:00 – 23:00", weekdays: [5, 6, 0] },
  ],
  /**
   * Zelfde uren als hierboven, per weekdag (index 0 = zondag … 6 = zaterdag,
   * zoals Date#getDay). null = gesloten. Stuurt de "Nu open"-indicator en de
   * controle van het reservatieformulier — hou beide lijsten gelijk.
   */
  schedule: [
    { open: "17:00", close: "23:00" },
    null,
    { open: "17:00", close: "22:00" },
    { open: "17:00", close: "22:00" },
    { open: "17:00", close: "22:00" },
    { open: "17:00", close: "23:00" },
    { open: "17:00", close: "23:00" },
  ] as ({ open: string; close: string } | null)[],
  timeZone: "Europe/Brussels",
  social: {
    // Nog geen echte profielen aangeleverd — laat leeg, de footer toont het
    // icoon pas zodra hier een echte URL staat.
    instagram: "",
    facebook: "",
    tiktok: "",
  },
};

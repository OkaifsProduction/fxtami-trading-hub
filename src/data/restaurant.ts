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
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2503.8!2d5.5472!3d50.8743!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c0eb74a6e0b6eb%3A0x1!2sBeverststraat+41%2C+3740+Bilzen!5e0!3m2!1snl!2sbe!4v1680000000000!5m2!1snl!2sbe",
  orderOnlineUrl: "#menu",
  reserveUrl: "#reserve",
  hours: [
    { days: "Maandag", time: "Gesloten" },
    { days: "Dinsdag – Donderdag", time: "17:00 – 22:00" },
    { days: "Vrijdag – Zondag", time: "17:00 – 23:00" },
  ],
  social: {
    // Nog geen echte profielen aangeleverd — laat leeg, de footer toont het
    // icoon pas zodra hier een echte URL staat.
    instagram: "",
    facebook: "",
    tiktok: "",
  },
};

export interface Review {
  name: string;
  detail: string;
  rating: number;
  quote: string;
}

export const reviews: Review[] = [
  {
    name: "Emma Peeters",
    detail: "Google Reviews",
    rating: 5,
    quote:
      "De beste pizza uit de buurt. Krokante bodem, verse ingrediënten en altijd vriendelijke bediening. We komen graag terug.",
  },
  {
    name: "Marco Rossi",
    detail: "TripAdvisor",
    rating: 5,
    quote:
      "Voelt aan als een familiekeuken in Italië. De carbonara was precies zoals het hoort: romig, simpel en heerlijk.",
  },
  {
    name: "Sophie Lambrechts",
    detail: "Google Reviews",
    rating: 5,
    quote:
      "Mooie gemoedelijke zaak met een uitgebreide kaart. De Pizza Da Vinci is ons nieuwe favoriete gerecht.",
  },
  {
    name: "Jan Vermeulen",
    detail: "Google Reviews",
    rating: 4,
    quote:
      "Consistent lekker, elke keer opnieuw. De steenoven geeft de pizza's die rokerige smaak die je nergens anders vindt.",
  },
];

export interface Review {
  name: string;
  detail: string;
  rating: number;
  quote: string;
}

export const reviews: Review[] = [
  {
    name: "Emily Carter",
    detail: "Google Reviews",
    rating: 5,
    quote:
      "Best pizza I've had outside of Naples. The crust is perfectly charred and the burrata pie is unreal. Already planning our next visit.",
  },
  {
    name: "Marco Ferretti",
    detail: "OpenTable",
    rating: 5,
    quote:
      "Felt like a family kitchen in Rome. The carbonara was rich and simple, exactly how it should be. Service was warm without being fussy.",
  },
  {
    name: "Sophie Dubois",
    detail: "Google Reviews",
    rating: 5,
    quote:
      "Beautiful space, thoughtful menu, and the tiramisù alone is worth the trip. This is our new go-to for date nights.",
  },
  {
    name: "James Whitfield",
    detail: "Yelp",
    rating: 4,
    quote:
      "Consistently excellent. The wood-fired oven gives every pizza that smoky depth you just can't fake. Highly recommend the Diavola.",
  },
];

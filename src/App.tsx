import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { OurStory } from "./components/OurStory";
import { PopularDishes } from "./components/PopularDishes";
import { Menu } from "./components/Menu";
import { WhyChooseUs } from "./components/WhyChooseUs";
import { Gallery } from "./components/Gallery";
import { Reviews } from "./components/Reviews";
import { Location } from "./components/Location";
import { ReservationCta } from "./components/ReservationCta";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-paper"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <OurStory />
        <PopularDishes />
        <Menu />
        <WhyChooseUs />
        <Gallery />
        <Reviews />
        <Location />
        <ReservationCta />
      </main>
      <Footer />
    </>
  );
}

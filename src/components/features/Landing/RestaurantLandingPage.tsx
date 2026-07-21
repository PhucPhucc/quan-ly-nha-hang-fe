"use client";

import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { ReservationSectionWrapper } from "./components/ReservationSectionWrapper";
import { RestaurantAboutSection } from "./components/restaurant/RestaurantAboutSection";
import { RestaurantHeroSection } from "./components/restaurant/RestaurantHeroSection";
import { RestaurantReviewsSection } from "./components/restaurant/RestaurantReviewsSection";

export function RestaurantLandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary selection:text-primary-foreground overflow-x-hidden scroll-smooth">
      <Navbar />
      <RestaurantHeroSection />
      <RestaurantAboutSection />
      <ReservationSectionWrapper />
      <RestaurantReviewsSection />
      <Footer />
    </div>
  );
}

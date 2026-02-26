"use client";

import { AboutSection } from "./components/AboutSection";
import { BlogSection } from "./components/BlogSection";
import { Footer } from "./components/Footer";
import { HeroSection } from "./components/HeroSection";
import { Navbar } from "./components/Navbar";
import { ReviewsSection } from "./components/ReviewsSection";
import { SolutionsSection } from "./components/SolutionsSection";

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <SolutionsSection />
      <ReviewsSection />
      <BlogSection />
      <Footer />
    </div>
  );
}

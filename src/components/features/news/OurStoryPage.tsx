"use clients";

import { Footer } from "@/components/features/Landing/components/Footer";
import { Navbar } from "@/components/features/Landing/components/Navbar";
import { OurStoryHeroSection } from "@/components/features/news/components/OurStoryHeroSection";
import { OurStoryJourneySection } from "@/components/features/news/components/OurStoryJourneySection";
import { OurStoryNarrativeSection } from "@/components/features/news/components/OurStoryNarrativeSection";
import { OurStoryProblemSection } from "@/components/features/news/components/OurStoryProblemSection";
import { OurStoryProductValueSection } from "@/components/features/news/components/OurStoryProductValueSection";
import { OurStoryStyles } from "@/components/features/news/components/OurStoryStyles";
import { OurStoryTeamSection } from "@/components/features/news/components/OurStoryTeamSection";

export function OurStoryPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-black text-white antialiased">
      <OurStoryStyles />
      <Navbar />

      <div className="pt-20">
        <OurStoryHeroSection />
        <OurStoryProblemSection />
        <OurStoryJourneySection />
        <OurStoryTeamSection />
        <OurStoryProductValueSection />
        <OurStoryNarrativeSection />
      </div>

      <Footer />
    </div>
  );
}

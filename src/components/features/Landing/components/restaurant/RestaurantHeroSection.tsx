"use client";

import { ArrowRight, Flame, Utensils } from "lucide-react";
import Image from "next/image";

import { useBrandingSettings } from "@/hooks/useBrandingSettings";
import { UI_TEXT } from "@/lib/UI_Text";

export function RestaurantHeroSection() {
  const { data: branding } = useBrandingSettings();
  const resText = UI_TEXT.LANDING.RESTAURANT_PAGE;
  const t = UI_TEXT.LANDING;

  const restaurantName = branding?.restaurantName || resText.HERO_TITLE;

  return (
    <section className="relative flex flex-1 items-center justify-center pt-32 pb-20 md:pt-48 md:pb-32">
      <div className="pointer-events-none absolute top-0 z-10 h-full w-full overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] size-125 rounded-full bg-primary/20 blur-[120px] animate-float" />
        <div
          className="absolute top-[20%] -right-[5%] size-100 rounded-full bg-orange-300/20 blur-[100px] animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-[10%] left-[20%] size-75 rounded-full bg-yellow-200/20 blur-[80px] animate-float"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary backdrop-blur-sm shadow-sm animate-fade-in-up">
          <Flame className="h-4 w-4 animate-pulse text-orange-500" />
          {resText.FEATURE_TAG}
        </div>

        <h1
          className="mt-8 text-5xl font-bold tracking-tight text-foreground md:text-7xl text-balance animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          {restaurantName} <br />
          <span className="bg-linear-to-r from-primary to-orange-500 bg-clip-text text-transparent px-2">
            {resText.HERO_SUBTITLE}
          </span>
        </h1>

        <p
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl text-balance animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          {resText.HERO_DESC}
        </p>

        <div
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          <a
            href="#reservation-form"
            className="group flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:bg-primary-hover hover:scale-105 active:scale-95"
          >
            {UI_TEXT.LANDING.RESERVATION_BTN}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* Hero Image Showcase */}
        <div
          className="mt-24 relative px-4 mx-auto max-w-5xl animate-fade-in-up"
          style={{ animationDelay: "0.5s" }}
        >
          <div className="relative overflow-hidden rounded-3xl shadow-2xl transform transition-transform hover:scale-[1.01] duration-500">
            <div className="relative aspect-[21/9] pt-10">
              <Image
                src={
                  branding?.coverImageUrl ||
                  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2000&auto=format&fit=crop"
                }
                alt="Restaurant Ambience"
                fill
                sizes="(min-width: 1280px) 60vw, 100vw"
                className="object-cover brightness-90 hover:brightness-100 transition-all duration-700"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent pointer-events-none" />
            <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between">
              <div className="glass px-6 py-4 rounded-2xl hidden md:flex items-center gap-4 shadow-lg backdrop-blur-md bg-white/10 border border-white/20">
                <div className="h-12 w-12 rounded-full bg-primary/80 flex items-center justify-center">
                  <Utensils className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg leading-tight">
                    {resText.MASTERCHEF} <br /> {resText.SIGNATURE}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

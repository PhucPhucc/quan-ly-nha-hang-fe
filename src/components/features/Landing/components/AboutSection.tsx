"use client";

import { Award, Users } from "lucide-react";
import Image from "next/image";

import { UI_TEXT } from "@/lib/UI_Text";

const YEAR = UI_TEXT.LANDING.YEAR_VAL;
const AWARDS = UI_TEXT.LANDING.AWARDS_VAL;
const CUSTOMERS = UI_TEXT.LANDING.CUSTOMERS_VAL;

export function AboutSection() {
  const t = UI_TEXT.LANDING;

  return (
    <section id="about" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute -left-20 top-40 h-96 w-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-20 md:grid-cols-2 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl mb-6">
              {t.ABOUT_TITLE}
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground text-balance">
              {t.ABOUT_DESC}
            </p>

            <div className="mt-10 grid grid-cols-2 gap-6">
              <div className="glass-card p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Award className="h-5 w-5" />
                  </div>
                  <span className="font-bold text-lg text-foreground">{YEAR}</span>
                </div>
                <p className="text-sm text-muted-foreground">{t.ESTABLISHED}</p>
              </div>
              <div className="glass-card p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Users className="h-5 w-5" />
                  </div>
                  <span className="font-bold text-lg text-foreground">{AWARDS}</span>
                </div>
                <p className="text-sm text-muted-foreground">{t.TEAM_SIZE}</p>
              </div>
            </div>
          </div>

          <div className="relative order-1 md:order-2 group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-orange-400 rounded-[2.5rem] rotate-3 opacity-20 group-hover:rotate-6 transition-transform duration-500" />
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] shadow-2xl transform transition-transform duration-500 group-hover:-translate-y-2">
              <Image
                src="https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1000&auto=format&fit=crop"
                alt={t.ABOUT_IMG_ALT}
                fill
                className="object-cover"
              />
            </div>
            <div
              className="glass absolute -bottom-8 -left-8 p-8 rounded-2xl hidden lg:block animate-float"
              style={{ animationDelay: "1s" }}
            >
              <p className="text-4xl font-extrabold text-primary">{CUSTOMERS}</p>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mt-1">
                {t.PARTNERS}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

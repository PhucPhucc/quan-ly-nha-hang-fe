"use client";

import { ArrowRight, ChefHat, Flame } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { UI_TEXT } from "@/lib/UI_Text";
import { useAuthStore } from "@/store/useAuthStore";

export function HeroSection() {
  const { employee } = useAuthStore();
  const t = UI_TEXT.LANDING;

  return (
    <section className="relative flex flex-1 items-center justify-center pt-32 pb-20 md:pt-48 md:pb-32">
      <div className="absolute top-0 -z-10 h-full w-full overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px] animate-float" />
        <div
          className="absolute top-[20%] -right-[5%] h-[400px] w-[400px] rounded-full bg-orange-300/20 blur-[100px] animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-[10%] left-[20%] h-[300px] w-[300px] rounded-full bg-yellow-200/20 blur-[80px] animate-float"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary backdrop-blur-sm shadow-sm animate-fade-in-up">
          <Flame className="h-4 w-4 animate-pulse text-orange-500" />
          {t.KITCHEN_TERMINAL}
        </div>

        <h1
          className="mt-8 text-5xl font-extrabold tracking-tight text-foreground md:text-7xl text-balance animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          {t.HERO_TITLE} <br />
          <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent italic px-2">
            {t.HERO_SUBTITLE}
          </span>
        </h1>

        <p
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl text-balance animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          {t.HERO_DESC}
        </p>

        <div
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          {employee ? (
            <Link
              href="/dashboard"
              className="group flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:bg-primary-hover hover:scale-105 active:scale-95"
            >
              {t.DASHBOARD}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <Link
              href="/login"
              className="group flex items-center gap-2 rounded-xl bg-primary px-10 py-4 text-lg font-bold text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:bg-primary-hover hover:scale-105 active:scale-95"
            >
              {t.ENTER_SYSTEM}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        {/* KDS Preview */}
        <div
          className="mt-24 relative px-4 mx-auto max-w-6xl animate-fade-in-up"
          style={{ animationDelay: "0.5s" }}
        >
          <div className="relative overflow-hidden rounded-3xl border-4 border-slate-900/5 bg-slate-900 shadow-2xl transform transition-transform hover:scale-[1.01] duration-500">
            <div className="absolute top-0 w-full h-10 bg-slate-900 flex items-center px-4 gap-2 z-10 border-b border-slate-800">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-amber-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="text-xs text-slate-500 font-mono ml-4 opacity-50">
                KDS v2.0 - Live Connection
              </span>
            </div>
            <div className="relative aspect-video pt-10">
              <Image
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2000&auto=format&fit=crop"
                alt="KDS Interface"
                fill
                className="object-cover opacity-80 brightness-75 grayscale-[0.2]"
                priority
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="glass p-8 rounded-3xl text-center max-w-md transform transition-all hover:scale-105 duration-300">
                <div className="mx-auto h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 text-primary">
                  <ChefHat className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {t.KITCHEN_INTEL}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">{t.TECH_REDUCING}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

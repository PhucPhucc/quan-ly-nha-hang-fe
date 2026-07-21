"use client";

import { Clock, MapPin } from "lucide-react";
import Image from "next/image";

import { useBrandingSettings } from "@/hooks/useBrandingSettings";
import { UI_TEXT } from "@/lib/UI_Text";

export function RestaurantAboutSection() {
  const { data: branding } = useBrandingSettings();
  const t = UI_TEXT.LANDING.RESTAURANT_PAGE;

  const formatWorkingDays = (days?: string) => {
    if (!days) return "Đang cập nhật";
    const dayMap: Record<string, string> = {
      Monday: "Thứ 2",
      Tuesday: "Thứ 3",
      Wednesday: "Thứ 4",
      Thursday: "Thứ 5",
      Friday: "Thứ 6",
      Saturday: "Thứ 7",
      Sunday: "Chủ Nhật",
    };
    return days
      .split(",")
      .map((d) => dayMap[d.trim()] || d)
      .join(", ");
  };

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
              <div className="glass-card p-4 rounded-xl border border-primary/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <span className="font-bold text-lg text-foreground">{t.ADDRESS}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {branding?.address || "Đang cập nhật..."}
                </p>
              </div>
              <div className="glass-card p-4 rounded-xl border border-primary/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Clock className="h-5 w-5" />
                  </div>
                  <span className="font-bold text-lg text-foreground">{t.OPERATING_HOURS}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {branding?.openingTime || "08:00"} - {branding?.closingTime || "22:00"}
                  <br />
                  <span className="text-xs">{formatWorkingDays(branding?.workingDays)}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="relative order-1 md:order-2 group">
            <div className="absolute inset-0 bg-linear-to-tr from-primary to-orange-400 rounded-[2.5rem] rotate-3 opacity-20 group-hover:rotate-6 transition-transform duration-500" />
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-[2rem] shadow-2xl transform transition-transform duration-500 group-hover:-translate-y-2">
              <Image
                src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1000&auto=format&fit=crop"
                alt={t.ABOUT_IMG_ALT}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div
              className="glass absolute -bottom-8 -left-8 p-8 rounded-2xl hidden lg:block animate-float shadow-xl border border-white/20"
              style={{ animationDelay: "1s" }}
            >
              <p className="text-4xl font-bold text-primary">{t.CUSTOMERS_VAL}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                {t.SATISFIED_CUSTOMERS}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

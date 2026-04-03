"use client";

import { Utensils } from "lucide-react";
import Link from "next/link";

import { useBrandingSettings } from "@/hooks/useBrandingSettings";
import { UI_TEXT } from "@/lib/UI_Text";

export function Footer() {
  const { data: branding } = useBrandingSettings();
  const t = UI_TEXT.LANDING;
  return (
    <footer className="border-t border-border bg-card pb-12 pt-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Utensils className="h-4 w-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                {branding?.restaurantName ?? t.FOOTER_BRAND}
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed">{t.FOOTER_DESC}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
            <div className="flex flex-col gap-4">
              <span className="font-bold text-foreground">{t.PRODUCT}</span>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                {t.FEATURES}
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                {t.PRICING}
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                {t.INTEGRATIONS}
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-bold text-foreground">{t.COMPANY}</span>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                {t.ABOUT}
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                {t.CAREERS}
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                {t.BLOG}
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-bold text-foreground">{t.SUPPORT}</span>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                {t.HELP_CENTER}
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                {t.STATUS}
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">{t.COPYRIGHT}</p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">
              {t.PRIVACY}
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              {t.TERMS}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

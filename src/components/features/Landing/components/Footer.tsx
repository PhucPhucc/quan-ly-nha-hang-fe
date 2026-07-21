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
              <span className="font-bold text-foreground">{t.CONTACT_INFO}</span>
              {branding?.hotline && (
                <a
                  href={`tel:${branding.hotline}`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t.HOTLINE_LBL} {branding.hotline}
                </a>
              )}
              {branding?.email && (
                <a
                  href={`mailto:${branding.email}`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t.EMAIL_LBL} {branding.email}
                </a>
              )}
              {branding?.website && (
                <a
                  href={branding.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t.WEBSITE_LBL}
                </a>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-bold text-foreground">{t.SOCIAL_MEDIA}</span>
              {branding?.facebook && (
                <a
                  href={branding.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t.FACEBOOK_LBL}
                </a>
              )}
              {branding?.instagram && (
                <a
                  href={branding.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t.INSTAGRAM_LBL}
                </a>
              )}
              {branding?.zaloOa && (
                <a
                  href={branding.zaloOa}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t.ZALOOA_LBL}
                </a>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-bold text-foreground">{t.ADDRESS_LBL}</span>
              <p className="text-muted-foreground transition-colors leading-relaxed">
                {branding?.address || "Đang cập nhật..."}
              </p>
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

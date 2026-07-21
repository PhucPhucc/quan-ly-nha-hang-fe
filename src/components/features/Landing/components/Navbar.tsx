"use client";

import { ChefHat } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useBrandingSettings } from "@/hooks/useBrandingSettings";
import { UI_TEXT } from "@/lib/UI_Text";
import { useAuthStore } from "@/store/useAuthStore";
import { EmployeeRole } from "@/types/Employee";

export function Navbar() {
  const { employee } = useAuthStore();
  const { data: branding } = useBrandingSettings();
  const t = UI_TEXT.LANDING;
  const pathname = usePathname();
  const isRestaurantPage = pathname?.includes("/restaurant");

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl rounded-2xl border border-white/20 glass shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between px-6 py-3">
        <Link
          href={isRestaurantPage ? "/restaurant" : "/"}
          className="flex items-center gap-3 text-primary"
        >
          {branding?.logoUrl ? (
            <img
              src={branding.logoUrl}
              alt="Logo"
              className="h-10 w-10 object-contain drop-shadow-md"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-r from-primary to-primary/60 text-primary-foreground shadow-lg shadow-primary/25">
              <ChefHat className="h-8 w-8 text-white drop-shadow-md" />
            </div>
          )}
          <span className="text-2xl font-bold drop-shadow-md tracking-tight">
            {branding?.restaurantName ?? UI_TEXT.LANDING.NAV_BRAND}
          </span>
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="#about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            {t.ABOUT_TITLE}
          </Link>
          <Link
            href="#blog"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            {t.BLOG_TITLE}
          </Link>

          {employee ? (
            <>
              <Link
                href={`/${employee.role === EmployeeRole.ADMIN ? "manager/dashboard" : employee.role === EmployeeRole.MANAGER ? "manager/dashboard" : employee.role === EmployeeRole.CHEFBAR ? "kds/station" : "order"}`}
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:scale-105 active:scale-95"
              >
                {t.DASHBOARD}
              </Link>
              <button
                onClick={() => {
                  window.location.href = "/logout";
                }}
                className="text-sm font-semibold text-foreground transition-colors hover:text-primary"
              >
                {UI_TEXT.AUTH.LOGOUT}
              </button>
            </>
          ) : (
            <>
              <a
                href={isRestaurantPage ? "#reservation-form" : "#partner-contact"}
                className="flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-bold text-foreground shadow-lg shadow-primary/20 transition-all hover:bg-muted active:scale-95 cursor-pointer"
              >
                {isRestaurantPage ? t.RESERVATION_BTN : "Trở thành đối tác"}
              </a>
              <Link
                href="/login"
                className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:scale-105 active:scale-95"
              >
                {UI_TEXT.AUTH.LOGIN}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

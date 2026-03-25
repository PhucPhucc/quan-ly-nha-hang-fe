"use client";

import { Building2, CalendarDays, Warehouse } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";

const { SETTINGS } = UI_TEXT;

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: SETTINGS.NAV_GENERAL,
    href: "/manager/settings",
    icon: Building2,
    exact: true,
  },
  {
    label: SETTINGS.NAV_WAREHOUSE,
    href: "/manager/settings/warehouse",
    icon: Warehouse,
  },
  {
    label: SETTINGS.NAV_RESERVATION,
    href: "/manager/settings/reservation",
    icon: CalendarDays,
  },
];

export function SettingsNavigation() {
  const pathname = usePathname();

  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <nav
      className="flex items-center gap-1 overflow-x-auto scrollbar-none"
      aria-label={UI_TEXT.SIDE_BAR.SETTINGS}
    >
      {NAV_ITEMS.map((item) => {
        const active = isActive(item);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group relative flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            aria-current={active ? "page" : undefined}
          >
            <Icon
              className={cn(
                "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
                !active && "group-hover:scale-110"
              )}
            />
            <span className="whitespace-nowrap">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

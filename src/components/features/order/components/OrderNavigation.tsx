"use client";

import { Activity, CalendarDays, CreditCard, Sparkles, Tag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: UI_TEXT.ORDER.BOARD.OVERVIEW,
    href: "/manager/order",
    icon: Sparkles,
    exact: true,
  },
  {
    label: UI_TEXT.ORDER.MANAGEMENT.TABS.ORDERS,
    href: "/manager/order/list",
    icon: Activity,
  },
  {
    label: UI_TEXT.VOUCHER.TITLE,
    href: "/manager/voucher",
    icon: Tag,
  },
  {
    label: UI_TEXT.ORDER.MANAGEMENT.TABS.BILLING,
    href: "/manager/order/billing-history",
    icon: CreditCard,
  },
  {
    label: UI_TEXT.ORDER.MANAGEMENT.TABS.AUDIT,
    href: "/manager/order/audit-log",
    icon: CalendarDays,
  },
];

export function OrderNavigation() {
  const pathname = usePathname();

  const isActive = (item: NavItem) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <nav
      className="flex min-w-0 items-center gap-1 overflow-x-auto scrollbar-none"
      aria-label="Điều hướng đơn hàng"
    >
      {NAV_ITEMS.map((item) => {
        const active = isActive(item);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group relative flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-200",
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

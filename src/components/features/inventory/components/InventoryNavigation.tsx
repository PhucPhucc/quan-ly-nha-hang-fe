"use client";

import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  Boxes,
  ClipboardCheck,
  History,
  Layers,
  LayoutDashboard,
  Package,
  PackagePlus,
  Warehouse,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { useInventoryAlertsCount } from "@/hooks/useInventoryAlertsCount";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  /** Nếu true, chỉ match chính xác pathname này */
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: UI_TEXT.INVENTORY.NAV.OVERVIEW,
    href: "/manager/inventory",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: UI_TEXT.INVENTORY.NAV.INGREDIENTS,
    href: "/manager/inventory/ingredients",
    icon: Package,
  },
  {
    label: UI_TEXT.INVENTORY.NAV.GROUPS,
    href: "/manager/inventory/groups",
    icon: Layers,
  },
  {
    label: UI_TEXT.INVENTORY.NAV.STOCK_IO,
    href: "/manager/inventory/stock-in",
    icon: PackagePlus,
  },
  {
    label: UI_TEXT.INVENTORY.NAV.OPENING_STOCK,
    href: "/manager/inventory/opening-stock",
    icon: Warehouse,
  },
  {
    label: UI_TEXT.INVENTORY.NAV.CHECK,
    href: "/manager/inventory/check",
    icon: ClipboardCheck,
  },
  {
    label: UI_TEXT.INVENTORY.NAV.REPORT,
    href: "/manager/inventory/reports",
    icon: BarChart3,
  },
  {
    label: UI_TEXT.INVENTORY.NAV.LEDGER,
    href: "/manager/inventory/ledger",
    icon: BookOpen,
  },
  {
    label: UI_TEXT.INVENTORY.NAV.LOTS,
    href: "/manager/inventory/lots",
    icon: Boxes,
  },
  {
    label: UI_TEXT.INVENTORY.NAV.ALERTS,
    href: "/manager/inventory/alerts",
    icon: AlertTriangle,
  },
  {
    label: UI_TEXT.INVENTORY.NAV.TRANSACTIONS,
    href: "/manager/inventory/transactions",
    icon: History,
  },
];

export function InventoryNavigation() {
  const pathname = usePathname();
  const { data: alertCount = 0 } = useInventoryAlertsCount();

  const isActive = (item: NavItem) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <nav
      className="flex items-center gap-1 overflow-x-auto scrollbar-none"
      aria-label={UI_TEXT.SIDE_BAR.INVENTORY}
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
            {item.label === UI_TEXT.INVENTORY.NAV.ALERTS && alertCount > 0 && (
              <Badge
                className={cn(
                  "ml-1 p-0 font-mono flex size-4 items-center justify-center rounded-full text-[10px] font-bold tabular-nums",
                  active ? "bg-primary-foreground text-primary" : "bg-danger text-white"
                )}
              >
                {alertCount}
              </Badge>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

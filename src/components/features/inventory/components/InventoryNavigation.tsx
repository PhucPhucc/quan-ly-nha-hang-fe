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
  MoreHorizontal,
  Package,
  PackagePlus,
  Warehouse,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

const MORE_BUTTON_WIDTH = 44;
const NAV_GAP = 4;

export function InventoryNavigation() {
  const pathname = usePathname();
  const { data: alertCount = 0 } = useInventoryAlertsCount();
  const navRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [hiddenStartIndex, setHiddenStartIndex] = useState(NAV_ITEMS.length);

  const isActive = (item: NavItem) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  const visibleItems = useMemo(() => NAV_ITEMS.slice(0, hiddenStartIndex), [hiddenStartIndex]);
  const hiddenItems = useMemo(() => NAV_ITEMS.slice(hiddenStartIndex), [hiddenStartIndex]);

  useEffect(() => {
    const navEl = navRef.current;
    if (!navEl) return;

    let animationFrame = 0;

    const calculateVisibleItems = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        const containerWidth = navEl.clientWidth;
        const availableWidth = Math.max(0, containerWidth - MORE_BUTTON_WIDTH);

        let usedWidth = 0;
        let nextHiddenIndex = NAV_ITEMS.length;

        NAV_ITEMS.forEach((_, index) => {
          const itemWidth = itemRefs.current[index]?.offsetWidth ?? 0;
          const nextWidth = usedWidth + itemWidth + (index > 0 ? NAV_GAP : 0);

          if (nextWidth > availableWidth) {
            nextHiddenIndex = Math.min(nextHiddenIndex, index);
            return;
          }

          usedWidth = nextWidth;
        });

        setHiddenStartIndex(nextHiddenIndex);
      });
    };

    calculateVisibleItems();

    const resizeObserver = new ResizeObserver(calculateVisibleItems);
    resizeObserver.observe(navEl);

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
    };
  }, []);

  const activeHiddenItems = hiddenItems.filter((item) => isActive(item));
  const inactiveHiddenItems = hiddenItems.filter((item) => !isActive(item));
  const orderedHiddenItems = [...activeHiddenItems, ...inactiveHiddenItems];

  return (
    <nav
      ref={navRef}
      className="flex items-center gap-1 overflow-hidden"
      aria-label={UI_TEXT.SIDE_BAR.INVENTORY}
    >
      {visibleItems.map((item, index) => {
        const active = isActive(item);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
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

      {hiddenItems.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="ml-1 flex shrink-0 items-center gap-1 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-muted"
              aria-label="Xem thêm chức năng"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {orderedHiddenItems.map((item) => {
              const active = isActive(item);
              const Icon = item.icon;

              return (
                <DropdownMenuItem key={item.href} asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2",
                      active && "font-semibold text-primary"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {item.label === UI_TEXT.INVENTORY.NAV.ALERTS && alertCount > 0 && (
                      <Badge className="ml-auto h-4 min-w-4 rounded-full bg-danger px-1 text-[10px] text-white">
                        {alertCount}
                      </Badge>
                    )}
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </nav>
  );
}

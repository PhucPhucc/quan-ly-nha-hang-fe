"use client";

import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  ClipboardCheck,
  History,
  Package,
  PackagePlus,
  Settings,
  Warehouse,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

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
    label: "Tổng quan",
    href: "/manager/inventory",
    icon: Warehouse,
    exact: true,
  },
  {
    label: "Nhập / Xuất kho",
    href: "/manager/inventory/stock-in",
    icon: PackagePlus,
  },
  {
    label: "Khai báo tồn đầu",
    href: "/manager/inventory/opening-stock",
    icon: Package,
  },
  {
    label: "Kiểm kho",
    href: "/manager/inventory/check",
    icon: ClipboardCheck,
  },
  {
    label: "Báo cáo kho",
    href: "/manager/inventory/reports",
    icon: BarChart3,
  },
  {
    label: "Sổ cái",
    href: "/manager/inventory/ledger",
    icon: BookOpen,
  },
  {
    label: "Giao dịch",
    href: "/manager/inventory/transactions",
    icon: History,
  },
  {
    label: "Cảnh báo",
    href: "/manager/inventory/alerts",
    icon: AlertTriangle,
  },
  {
    label: "Cài đặt",
    href: "/manager/inventory/settings",
    icon: Settings,
  },
];

export function InventoryNavigation() {
  const pathname = usePathname();

  const isActive = (item: NavItem) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <nav
      className="flex items-center gap-1 overflow-x-auto px-4 pb-2 scrollbar-none"
      aria-label="Điều hướng kho hàng"
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

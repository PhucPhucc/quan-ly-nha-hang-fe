"use client";

import { CalendarDays, CheckCircle2, Clock, LayoutDashboard, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

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
    label: UI_TEXT.SIDE_BAR.OVERVIEW,
    href: "/manager/employee",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: UI_TEXT.SIDE_BAR.EMPLOYEE,
    href: "/manager/employee/list",
    icon: Users,
  },
  {
    label: UI_TEXT.SIDE_BAR.SHIFT,
    href: "/manager/shift",
    icon: Clock,
  },
  {
    label: UI_TEXT.SIDE_BAR.SCHEDULE,
    href: "/manager/schedule",
    icon: CalendarDays,
  },
  {
    label: UI_TEXT.SIDE_BAR.ATTENDANCE,
    href: "/manager/attendance",
    icon: CheckCircle2,
  },
];

export function EmployeeNavigation() {
  const pathname = usePathname();

  const isActive = (item: NavItem) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <nav
      className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1"
      aria-label={UI_TEXT.SIDE_BAR.HR_MANAGEMENT}
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

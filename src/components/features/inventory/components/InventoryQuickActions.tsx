import {
  BarChart3,
  BookOpen,
  ClipboardCheck,
  Layers,
  PackageMinus,
  PackagePlus,
  Settings,
} from "lucide-react";
import Link from "next/link";
import React from "react";

import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";

interface QuickAction {
  icon: React.ElementType;
  label: string;
  description: string;
  href: string;
  variant?: "primary" | "neutral";
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    icon: PackagePlus,
    label: UI_TEXT.INVENTORY.OVERVIEW.QUICK_IMPORT,
    description: UI_TEXT.INVENTORY.OVERVIEW.QUICK_IMPORT_DESC,
    href: "/manager/inventory/stock-in",
    variant: "primary",
  },
  {
    icon: PackageMinus,
    label: UI_TEXT.INVENTORY.OVERVIEW.QUICK_EXPORT,
    description: UI_TEXT.INVENTORY.OVERVIEW.QUICK_EXPORT_DESC,
    href: "/manager/inventory/stock-out",
    variant: "primary",
  },
  {
    icon: ClipboardCheck,
    label: UI_TEXT.INVENTORY.OVERVIEW.QUICK_CHECK,
    description: UI_TEXT.INVENTORY.OVERVIEW.QUICK_CHECK_DESC,
    href: "/manager/inventory/check",
    variant: "neutral",
  },
  {
    icon: BarChart3,
    label: UI_TEXT.INVENTORY.OVERVIEW.QUICK_REPORT,
    description: UI_TEXT.INVENTORY.OVERVIEW.QUICK_REPORT_DESC,
    href: "/manager/inventory/reports",
    variant: "neutral",
  },
  {
    icon: BookOpen,
    label: UI_TEXT.INVENTORY.OVERVIEW.QUICK_LEDGER,
    description: UI_TEXT.INVENTORY.OVERVIEW.QUICK_LEDGER_DESC,
    href: "/manager/inventory/ledger",
    variant: "neutral",
  },
  {
    icon: Layers,
    label: UI_TEXT.INVENTORY.OVERVIEW.QUICK_LOTS,
    description: UI_TEXT.INVENTORY.OVERVIEW.QUICK_LOTS_DESC,
    href: "/manager/inventory/lots",
    variant: "neutral",
  },
  {
    icon: Layers,
    label: UI_TEXT.INVENTORY.OVERVIEW.QUICK_GROUPS,
    description: UI_TEXT.INVENTORY.OVERVIEW.QUICK_GROUPS_DESC,
    href: "/manager/inventory/groups",
    variant: "neutral",
  },
  {
    icon: Settings,
    label: UI_TEXT.INVENTORY.OVERVIEW.QUICK_SETTINGS,
    description: UI_TEXT.INVENTORY.OVERVIEW.QUICK_SETTINGS_DESC,
    href: "/manager/inventory/settings",
    variant: "neutral",
  },
];

export function InventoryQuickActions() {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
        {UI_TEXT.INVENTORY.OVERVIEW.QUICK_ACTIONS_TITLE}
      </h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-all duration-200 hover:shadow-sm hover:-translate-y-px",
                action.variant === "primary"
                  ? "border-primary/20 bg-primary/8 hover:bg-primary/12 hover:border-primary/30"
                  : "border-border bg-card hover:bg-muted/40 hover:border-border/80"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  action.variant === "primary"
                    ? "bg-primary/15 text-primary"
                    : "bg-muted/60 text-muted-foreground group-hover:bg-muted"
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div
                  className={cn(
                    "text-xs font-semibold",
                    action.variant === "primary" ? "text-primary" : "text-foreground"
                  )}
                >
                  {action.label}
                </div>
                <div className="truncate text-[10px] text-muted-foreground/70">
                  {action.description}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

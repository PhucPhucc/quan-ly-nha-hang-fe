import { type LucideIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";

interface InventoryStatCardProps {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  subLabel?: string;
  subValue?: React.ReactNode;
  href?: string;
  variant?: "default" | "danger" | "warning" | "success" | "info";
  className?: string;
  isLoading?: boolean;
  compact?: boolean;
}

const variantStyles = {
  default: {
    card: "border-border bg-card",
    iconWrap: "bg-primary/10 text-primary",
    value: "text-foreground",
    label: "text-muted-foreground",
  },
  danger: {
    card: "border-danger/20 bg-danger/5",
    iconWrap: "bg-danger/10 text-danger",
    value: "text-danger",
    label: "text-danger/70",
  },
  warning: {
    card: "border-warning/30 bg-warning/5",
    iconWrap: "bg-warning/10 text-warning-foreground",
    value: "text-warning-foreground",
    label: "text-warning-foreground/70",
  },
  success: {
    card: "border-success/20 bg-success/5",
    iconWrap: "bg-success/10 text-success",
    value: "text-success",
    label: "text-success/70",
  },
  info: {
    card: "border-info/20 bg-info/5",
    iconWrap: "bg-info/10 text-info",
    value: "text-info",
    label: "text-info/70",
  },
};

export function InventoryStatCard({
  icon: Icon,
  label,
  value,
  subLabel,
  subValue,
  href,
  variant = "default",
  className,
  isLoading = false,
  compact = false,
}: InventoryStatCardProps) {
  const styles = variantStyles[variant];

  // Sizes for Horizontal Layout (Compact)
  const padding = compact ? "p-3 py-2.5" : "p-5";
  const gap = compact ? "gap-3" : "gap-3";
  const iconSize = compact ? "h-9 w-9" : "h-10 w-10";
  const iconInner = compact ? "h-4 w-4" : "h-5 w-5";
  const valueSize = compact ? "text-xl" : "text-3xl";
  const labelSize = compact ? "text-[10px]" : "text-xs";

  const content = (
    <div
      className={cn(
        "group relative flex h-full rounded-2xl border shadow-sm transition-all duration-200",
        compact ? "flex-row items-center" : "flex-col",
        gap,
        padding,
        href && "hover:shadow-md hover:-translate-y-0.5 cursor-pointer",
        styles.card,
        className
      )}
    >
      {/* Icon Section */}
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105",
          iconSize,
          styles.iconWrap
        )}
      >
        <Icon className={iconInner} />
      </div>

      {/* Text Section */}
      <div className="flex flex-1 flex-col justify-center min-w-0">
        <div className="flex flex-col gap-0.5">
          <span
            className={cn(
              "font-bold uppercase tracking-widest opacity-60 leading-tight",
              labelSize,
              styles.label
            )}
          >
            {label}
          </span>
          <div className="flex items-baseline gap-2">
            {isLoading ? (
              <div className="h-6 w-12 animate-pulse rounded-md bg-muted" />
            ) : (
              <div
                className={cn("font-black tabular-nums tracking-tight", valueSize, styles.value)}
              >
                {value}
              </div>
            )}

            {!compact && subLabel && subValue !== undefined && (
              <div className="flex items-center gap-1 opacity-50">
                <span className="text-[10px] font-bold">
                  {subLabel}
                  {UI_TEXT.COMMON.COLON}
                </span>
                <span className="text-[10px] font-black">{subValue}</span>
              </div>
            )}
          </div>
        </div>

        {compact && subLabel && subValue !== undefined && (
          <div className="flex items-center gap-1 mt-0.5 opacity-40">
            <span className="text-[9px] font-bold uppercase tracking-tighter">
              {subLabel}
              {UI_TEXT.COMMON.COLON}
            </span>
            {isLoading ? (
              <div className="h-2 w-8 animate-pulse rounded bg-muted" />
            ) : (
              <span className="text-[9px] font-black">{subValue}</span>
            )}
          </div>
        )}
      </div>

      {/* Detail Arrow - Only for non-compact or floating */}
      {href && !compact && (
        <span className="absolute right-4 top-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/30 transition-colors group-hover:text-muted-foreground">
          {UI_TEXT.INVENTORY.OVERVIEW.VIEW_DETAIL_ARROW}
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {content}
      </Link>
    );
  }

  return <div className="h-full">{content}</div>;
}

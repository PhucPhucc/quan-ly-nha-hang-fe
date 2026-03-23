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
}: InventoryStatCardProps) {
  const styles = variantStyles[variant];

  const content = (
    <div
      className={cn(
        "group relative flex h-full flex-col gap-3 rounded-2xl border p-5 shadow-sm transition-all duration-200",
        href && "hover:shadow-md hover:-translate-y-0.5 cursor-pointer",
        styles.card,
        className
      )}
    >
      {/* Icon + Arrow row */}
      <div className="flex items-start justify-between">
        <div
          className={cn("flex h-10 w-10 items-center justify-center rounded-xl", styles.iconWrap)}
        >
          <Icon className="h-5 w-5" />
        </div>
        {href && (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 transition-colors group-hover:text-muted-foreground">
            {UI_TEXT.INVENTORY.OVERVIEW.VIEW_DETAIL_ARROW}
          </span>
        )}
      </div>

      {/* Value */}
      <div className="flex-1">
        {isLoading ? (
          <div className="h-8 w-20 animate-pulse rounded-lg bg-muted mt-2" />
        ) : (
          <div className={cn("text-3xl font-bold tabular-nums tracking-tight", styles.value)}>
            {value}
          </div>
        )}
      </div>

      {/* Label */}
      <div className="flex flex-col gap-0.5">
        <span className={cn("text-xs font-semibold", styles.label)}>{label}</span>
        {subLabel && subValue !== undefined && (
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-muted-foreground/60">
              {subLabel}
              {UI_TEXT.COMMON.COLON}
            </span>
            {isLoading ? (
              <div className="h-3 w-12 animate-pulse rounded bg-muted" />
            ) : (
              <span className="text-[11px] font-medium text-muted-foreground">{subValue}</span>
            )}
          </div>
        )}
      </div>
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

"use client";

import Link from "next/link";
import React from "react";

import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";

interface HRStatCardProps {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  subLabel?: string;
  subValue?: React.ReactNode;
  href?: string;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  isLoading?: boolean;
}

const STAT_VARIANTS = {
  default: {
    card: "border-border bg-card",
    icon: "bg-primary/10 text-primary",
    value: "text-foreground",
    label: "text-muted-foreground",
  },
  success: {
    card: "border-success/20 bg-success/5",
    icon: "bg-success/10 text-success",
    value: "text-success",
    label: "text-success/70",
  },
  warning: {
    card: "border-warning/30 bg-warning/5",
    icon: "bg-warning/10 text-warning-foreground",
    value: "text-warning-foreground",
    label: "text-warning-foreground/70",
  },
  danger: {
    card: "border-danger/20 bg-danger/5",
    icon: "bg-danger/10 text-danger",
    value: "text-danger",
    label: "text-danger/70",
  },
  info: {
    card: "border-info/20 bg-info/5",
    icon: "bg-info/10 text-info",
    value: "text-info",
    label: "text-info/70",
  },
};

export function HRStatCard({
  icon: Icon,
  label,
  value,
  subLabel,
  subValue,
  href,
  variant = "default",
  isLoading = false,
}: HRStatCardProps) {
  const s = STAT_VARIANTS[variant];

  const inner = (
    <div
      className={cn(
        "group relative flex h-full flex-row items-center gap-3 rounded-2xl border p-3 py-2.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        href && "cursor-pointer",
        s.card
      )}
    >
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-105",
          s.icon
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex flex-1 flex-col justify-center min-w-0">
        <span
          className={cn(
            "text-[10px] font-bold uppercase tracking-widest opacity-60 leading-tight",
            s.label
          )}
        >
          {label}
        </span>
        <div className="flex items-baseline gap-2">
          {isLoading ? (
            <div className="h-6 w-12 animate-pulse rounded-md bg-muted" />
          ) : (
            <span className={cn("text-xl font-black tabular-nums tracking-tight", s.value)}>
              {value}
            </span>
          )}
        </div>
        {subLabel && subValue !== undefined && (
          <div className="mt-0.5 flex items-center gap-1 opacity-40">
            <span className="text-[9px] font-bold uppercase tracking-tighter">
              {subLabel}
              {UI_TEXT.HR_DASHBOARD.UNIT_COLON}
            </span>
            {isLoading ? (
              <div className="h-2 w-8 animate-pulse rounded bg-muted" />
            ) : (
              <span className="text-[9px] font-black">{subValue}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {inner}
      </Link>
    );
  }
  return <div className="h-full">{inner}</div>;
}

"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";

import { PriorityGroup } from "../useInventoryOverview";

export function SectionHeader({
  title,
  description,
  href,
  hrefLabel,
  icon: Icon,
}: {
  title: string;
  description?: string;
  href?: string;
  hrefLabel?: string;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-2.5">
        {Icon && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        )}
        <div>
          <h2 className="text-sm font-bold text-foreground">{title}</h2>
          {description && (
            <p className="mt-0.5 text-[11px] text-muted-foreground/70">{description}</p>
          )}
        </div>
      </div>
      {href && hrefLabel && (
        <Link
          href={href}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-[11px] font-semibold text-foreground/70 shadow-sm transition-all hover:bg-muted/50 hover:text-foreground"
        >
          {hrefLabel}
          <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
}

export function AlertBadgePill({
  href,
  icon: Icon,
  label,
  variant,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  variant: "danger" | "warning";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "table-pill flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-all hover:opacity-80",
        variant === "danger" ? "table-pill-danger" : "table-pill-warning"
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </Link>
  );
}

export function PriorityGroupCard({ group }: { group: PriorityGroup }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{group.title}</p>
          <p className="text-xs text-muted-foreground">
            {group.items.length} {UI_TEXT.INVENTORY.OVERVIEW.HIGHLIGHT_SUFFIX}
          </p>
        </div>
        <Badge variant="outline" className={cn("border-0", priorityToneClass(group.tone))}>
          {group.items.length}
        </Badge>
      </div>

      {group.items.length > 0 ? (
        <div className="space-y-2">
          {group.items.map((item) => (
            <div key={item.id} className="rounded-lg border border-border/60 px-3 py-2">
              <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.meta}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex min-h-[112px] items-center justify-center rounded-lg border border-dashed px-4 text-center text-sm text-muted-foreground">
          {UI_TEXT.INVENTORY.OVERVIEW.EMPTY_GROUP}
        </div>
      )}

      <div className="pt-3">
        <Link
          href={group.href}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          {group.actionLabel}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

function priorityToneClass(tone: PriorityGroup["tone"]) {
  if (tone === "danger") return "table-pill table-pill-danger";
  if (tone === "warning") return "table-pill table-pill-warning";
  if (tone === "info") return "table-pill table-pill-info";
  return "table-pill table-pill-neutral";
}

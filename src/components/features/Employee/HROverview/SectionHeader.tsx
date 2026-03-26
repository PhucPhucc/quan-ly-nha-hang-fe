"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  href?: string;
  hrefLabel?: string;
  icon?: React.ElementType;
}

export function SectionHeader({
  title,
  description,
  href,
  hrefLabel,
  icon: Icon,
}: SectionHeaderProps) {
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

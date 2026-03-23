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
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-slate-500 shadow-sm ring-1 ring-slate-100/10">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <div className="flex flex-col">
          <h2 className="text-sm font-bold tracking-tight text-slate-900">{title}</h2>
          {description && (
            <p className="mt-0.5 text-[11px] font-medium text-slate-500/80">{description}</p>
          )}
        </div>
      </div>
      {href && hrefLabel && (
        <Link
          href={href}
          className="flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-100 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:text-primary active:scale-95"
        >
          {hrefLabel}
          <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
}

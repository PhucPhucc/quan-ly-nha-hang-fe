"use client";

import React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatusItemProps {
  label: string;
  count: number;
  total: number;
  color: string;
  loading: boolean;
}

export function StatusItem({ label, count, total, color, loading }: StatusItemProps) {
  const percent = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-xs">
        <div className="flex items-center gap-2">
          <div className={cn("size-2 rounded-full shadow-sm", color)} />
          <span className="font-medium text-slate-600">{label}</span>
        </div>
        {loading ? (
          <Skeleton className="h-4 w-8" />
        ) : (
          <span className="font-bold text-slate-900">{count}</span>
        )}
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={cn("h-full transition-all duration-500 rounded-full", color)}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export function ProgressSkeleton() {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-8" />
      </div>
      <Skeleton className="h-1.5 w-full rounded-full" />
    </div>
  );
}

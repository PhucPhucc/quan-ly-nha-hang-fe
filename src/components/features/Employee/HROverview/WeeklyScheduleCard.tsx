"use client";

import { CalendarDays, Clock, Users } from "lucide-react";
import React from "react";

import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";

interface WeeklyScheduleCardProps {
  scheduled: number;
  estimatedHours: number;
  coverage: number;
  isLoading: boolean;
}

export function WeeklyScheduleCard({
  scheduled,
  estimatedHours,
  coverage,
  isLoading,
}: WeeklyScheduleCardProps) {
  const d = UI_TEXT.HR_DASHBOARD;

  const coverageColor =
    coverage >= 80 ? "text-success" : coverage >= 50 ? "text-warning-foreground" : "text-danger";

  const barColor = coverage >= 80 ? "bg-success" : coverage >= 50 ? "bg-warning" : "bg-danger";

  return (
    <div className="flex h-full flex-col rounded-2xl border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-70">
          {d.SCHEDULE.TITLE}
        </h3>
        <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-50 border border-blue-100">
          <CalendarDays className="h-3.5 w-3.5 text-blue-500" />
        </div>
      </div>

      <div className="flex-1 space-y-4">
        {/* Coverage */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground">
              {d.SCHEDULE.COVERAGE}
            </span>
            {isLoading ? (
              <div className="h-4 w-12 animate-pulse rounded bg-muted" />
            ) : (
              <span className={cn("text-sm font-black", coverageColor)}>
                {coverage.toFixed(0)}
                {d.UNIT_PERCENT}
              </span>
            )}
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted/50">
            <div
              className={cn("h-full rounded-full transition-all duration-700", barColor)}
              style={{ width: `${Math.min(coverage, 100)}%` }}
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border bg-muted/20 p-3 text-center">
            <div className="mb-1 flex items-center justify-center gap-1.5">
              <Users className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] font-bold uppercase text-muted-foreground opacity-70">
                {d.SCHEDULE.STAFF_COUNT}
              </span>
            </div>
            {isLoading ? (
              <div className="mx-auto h-6 w-10 animate-pulse rounded bg-muted" />
            ) : (
              <span className="text-xl font-black tabular-nums text-foreground">{scheduled}</span>
            )}
          </div>
          <div className="rounded-xl border bg-muted/20 p-3 text-center">
            <div className="mb-1 flex items-center justify-center gap-1.5">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] font-bold uppercase text-muted-foreground opacity-70">
                {d.SCHEDULE.ESTIMATED_HOURS}
              </span>
            </div>
            {isLoading ? (
              <div className="mx-auto h-6 w-10 animate-pulse rounded bg-muted" />
            ) : (
              <span className="text-xl font-black tabular-nums text-foreground">
                {estimatedHours.toFixed(0)}
                {d.UNIT_HOURS}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { CheckCircle2, Timer, UserCheck, UserX } from "lucide-react";
import React from "react";

import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";

interface AttendanceTodayCardProps {
  present: number;
  late: number;
  absent: number;
  isLoading: boolean;
}

export function AttendanceTodayCard({
  present,
  late,
  absent,
  isLoading,
}: AttendanceTodayCardProps) {
  const d = UI_TEXT.HR_DASHBOARD.ATTENDANCE;
  const items = [
    {
      icon: UserCheck,
      label: d.PRESENT,
      value: present,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      icon: Timer,
      label: d.LATE,
      value: late,
      color: "text-warning-foreground",
      bg: "bg-warning/10",
    },
    {
      icon: UserX,
      label: d.ABSENT,
      value: absent,
      color: "text-danger",
      bg: "bg-danger/10",
    },
  ];

  return (
    <div className="flex h-full flex-col rounded-2xl border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-70">
          {d.TITLE}
        </h3>
        <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
        </div>
      </div>

      <div className="grid flex-1 grid-cols-3 gap-3">
        {items.map(({ icon: Icon, label, value, color, bg }) => (
          <div
            key={label}
            className="flex flex-col items-center justify-center gap-2 rounded-xl border bg-muted/20 p-4"
          >
            <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", bg)}>
              <Icon className={cn("h-4 w-4", color)} />
            </div>
            {isLoading ? (
              <div className="h-6 w-8 animate-pulse rounded bg-muted" />
            ) : (
              <span className={cn("text-2xl font-black tabular-nums", color)}>{value}</span>
            )}
            <span className="text-center text-[10px] font-bold uppercase text-muted-foreground opacity-70">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { Users } from "lucide-react";
import React from "react";

import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";

const ROLE_COLORS: Record<string, string> = {
  Manager: "bg-violet-500",
  Cashier: "bg-blue-500",
  ChefBar: "bg-orange-500",
};

interface RoleDistributionCardProps {
  roleBreakdown: { role: string; count: number; label: string }[];
  total: number;
  isLoading: boolean;
}

export function RoleDistributionCard({
  roleBreakdown,
  total,
  isLoading,
}: RoleDistributionCardProps) {
  const d = UI_TEXT.HR_DASHBOARD;
  return (
    <div className="flex h-full flex-col rounded-2xl border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-70">
          {d.ROLES.TITLE}
        </h3>
        <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-violet-50 border border-violet-100">
          <Users className="h-3.5 w-3.5 text-violet-500" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 animate-pulse rounded-lg bg-muted/70" />
          ))}
        </div>
      ) : (
        <div className="flex-1 space-y-3">
          {roleBreakdown.map(({ role, count, label }) => {
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            const barColor = ROLE_COLORS[role] ?? "bg-primary";
            return (
              <div key={role}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-foreground">{label}</span>
                  <span className="text-[11px] font-black text-muted-foreground">
                    {count}
                    {d.OPEN_PAREN}
                    {pct}
                    {d.CLOSE_PAREN_PERCENT}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/50">
                  <div
                    className={cn("h-full rounded-full transition-all duration-500", barColor)}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}

          {roleBreakdown.length === 0 && (
            <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
              {d.ROLES.NO_DATA}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

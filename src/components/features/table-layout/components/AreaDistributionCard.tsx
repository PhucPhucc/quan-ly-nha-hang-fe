"use client";

import { Layout } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";
import { Area, Table, TableStatus } from "@/types/Table-Layout";

interface AreaDistributionCardProps {
  areas: Area[];
  tables: Table[];
  isLoading: boolean;
  className?: string;
}

export function AreaDistributionCard({
  areas,
  tables,
  isLoading,
  className,
}: AreaDistributionCardProps) {
  return (
    <Card className={cn("py-5", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-bold">
            <div className="rounded-lg bg-primary/10 p-1.5 text-primary">
              <Layout className="h-3.5 w-3.5" />
            </div>
            {UI_TEXT.TABLE.OVERVIEW.AREA_DISTRIBUTION}
          </CardTitle>
          <Link
            href="/manager/table/layout"
            className="text-[10px] font-bold uppercase tracking-wider text-primary hover:underline"
          >
            {UI_TEXT.TABLE.MANAGE_AREAS}
          </Link>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        ) : areas.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {areas.map((area) => {
              const areaTables = tables.filter((t) => t.areaId === area.areaId);
              const occupiedCount = areaTables.filter(
                (t) => t.status === TableStatus.Occupied
              ).length;
              const rate =
                areaTables.length > 0 ? Math.round((occupiedCount / areaTables.length) * 100) : 0;

              return (
                <div
                  key={area.areaId}
                  className="group rounded-xl border border-slate-100 bg-slate-50/50 p-3 transition-all hover:bg-card hover:shadow-sm"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 transition-colors group-hover:text-primary">
                        {area.name}
                      </h4>
                      <p className="text-[10px] font-medium text-slate-500">
                        {UI_TEXT.TABLE.OVERVIEW.AREA_STAT(areaTables.length)}
                      </p>
                    </div>
                    <Badge
                      variant={area.type === "VIP" ? "default" : "secondary"}
                      className="h-4 px-1.5 text-[9px]"
                    >
                      {area.type}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-bold uppercase tracking-tighter">
                      <span className="text-slate-400">
                        {UI_TEXT.TABLE.OVERVIEW.OCCUPANCY_RATE}
                      </span>
                      <span className={cn(rate > 80 ? "text-danger" : "text-slate-600")}>
                        {rate}
                        {UI_TEXT.COMMON.PERCENT}
                      </span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={cn(
                          "h-full rounded-full bg-primary transition-all duration-500",
                          rate > 80 && "bg-danger"
                        )}
                        style={{ width: `${rate}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-8 text-center">
            <p className="text-xs text-muted-foreground">{UI_TEXT.TABLE.EMPTY}</p>
            <Button variant="link" size="sm" asChild>
              <Link href="/manager/table/layout">{UI_TEXT.TABLE.ADD_AREA}</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

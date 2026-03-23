"use client";

import { Layout } from "lucide-react";
import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";

import { StatusItem } from "./StatusItem";

interface StatusSummaryCardProps {
  stats: {
    available: number;
    occupied: number;
    reserved: number;
    cleaning: number;
    outOfService: number;
    totalTables: number;
  };
  isLoading: boolean;
}

export function StatusSummaryCard({
  stats,
  isLoading,
  className,
}: StatusSummaryCardProps & { className?: string }) {
  return (
    <Card className={cn("border-none bg-card shadow-md h-full flex flex-col", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-bold">
          <div className="rounded-lg bg-primary/10 p-1.5 text-primary">
            <Layout className="h-3.5 w-3.5" />
          </div>
          {UI_TEXT.TABLE.OVERVIEW.STATUS_SUMMARY}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex-1">
        <StatusItem
          label={UI_TEXT.TABLE.STATUS_AVAILABLE}
          count={stats.available}
          total={stats.totalTables}
          color="bg-table-available"
          loading={isLoading}
        />
        <StatusItem
          label={UI_TEXT.TABLE.STATUS_OCCUPIED}
          count={stats.occupied}
          total={stats.totalTables}
          color="bg-table-occupied"
          loading={isLoading}
        />
        <StatusItem
          label={UI_TEXT.TABLE.STATUS_RESERVED}
          count={stats.reserved}
          total={stats.totalTables}
          color="bg-table-reserved"
          loading={isLoading}
        />
        <StatusItem
          label={UI_TEXT.TABLE.STATUS_CLEANING}
          count={stats.cleaning}
          total={stats.totalTables}
          color="bg-table-cleaning"
          loading={isLoading}
        />
        <StatusItem
          label={UI_TEXT.TABLE.STATUS_OUT_OF_SERVICE}
          count={stats.outOfService}
          total={stats.totalTables}
          color="bg-slate-300"
          loading={isLoading}
        />
      </CardContent>
    </Card>
  );
}

"use client";

import {
  AlertCircle,
  CalendarDays,
  RefreshCw,
  TrendingUp,
  UserCheck,
  UserMinus,
  Users,
} from "lucide-react";
import Link from "next/link";
import React from "react";

import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";

import { AttendanceTodayCard } from "./HROverview/AttendanceTodayCard";
import { HRStatCard } from "./HROverview/HRStatCard";
import { RoleDistributionCard } from "./HROverview/RoleDistributionCard";
import { SectionHeader } from "./HROverview/SectionHeader";
import { WeeklyScheduleCard } from "./HROverview/WeeklyScheduleCard";
import { useHROverview } from "./useHROverview";

export function HROverviewDashboard() {
  const { stats, isLoading, isFetching, error, refetch } = useHROverview();
  const d = UI_TEXT.HR_DASHBOARD;

  const activeVariant = (stats?.activeEmployees ?? 0) > 0 ? "success" : "default";
  const inactiveVariant = (stats?.inactiveEmployees ?? 0) > 0 ? "warning" : "default";

  return (
    <div className="px-4 space-y-6 py-2 animate-in fade-in duration-500">
      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        icon={Users}
        title={d.TITLE}
        description={d.DESCRIPTION}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline" size="sm" className="rounded-xl text-xs">
              <Link href="/manager/employee/list">
                <Users className="mr-2 h-3.5 w-3.5" />
                {d.BUTTONS.EMPLOYEES}
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="rounded-xl text-xs">
              <Link href="/manager/schedule">
                <CalendarDays className="mr-2 h-3.5 w-3.5" />
                {d.BUTTONS.SCHEDULE}
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl text-xs"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw className={cn("mr-2 h-3.5 w-3.5", isFetching && "animate-spin")} />
              {d.BUTTONS.REFRESH}
            </Button>
          </div>
        }
      />

      {/* KPI Stats Grid */}
      <h3 className="mb-3 px-4 text-xs font-black uppercase tracking-widest text-foreground opacity-60">
        {d.SECTION_STATS}
      </h3>
      <div className="grid grid-cols-1 gap-4 px-4 md:grid-cols-2 xl:grid-cols-4">
        <HRStatCard
          icon={Users}
          label={d.STATS.TOTAL_EMPLOYEES}
          value={stats?.totalEmployees ?? "—"}
          href="/manager/employee/list"
          isLoading={isLoading}
        />
        <HRStatCard
          icon={UserCheck}
          label={d.STATS.ACTIVE_EMPLOYEES}
          value={stats?.activeEmployees ?? "—"}
          href="/manager/employee/list"
          variant={activeVariant}
          isLoading={isLoading}
        />
        <HRStatCard
          icon={UserMinus}
          label={d.STATS.INACTIVE_EMPLOYEES}
          value={stats?.inactiveEmployees ?? "—"}
          variant={inactiveVariant}
          isLoading={isLoading}
        />
        <HRStatCard
          icon={TrendingUp}
          label={d.STATS.TOTAL_SHIFTS}
          value={stats?.totalShifts ?? "—"}
          subLabel={d.STATS.ACTIVE_SHIFTS}
          subValue={stats?.activeShifts ?? "—"}
          href="/manager/shift"
          variant="info"
          isLoading={isLoading}
        />
      </div>

      <div className="px-4">
        <SectionHeader
          title={d.SECTION_OPERATIONS}
          description={d.OPERATIONS_DESC}
          icon={TrendingUp}
        />
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Role distribution */}
          <div className="lg:col-span-1">
            <RoleDistributionCard
              roleBreakdown={stats?.roleBreakdown ?? []}
              total={stats?.totalEmployees ?? 0}
              isLoading={isLoading}
            />
          </div>

          {/* Attendance today */}
          <div className="lg:col-span-1">
            <AttendanceTodayCard
              present={stats?.presentToday ?? 0}
              late={stats?.lateToday ?? 0}
              absent={stats?.absentToday ?? 0}
              isLoading={isLoading}
            />
          </div>

          {/* Weekly schedule summary */}
          <div className="lg:col-span-1">
            <WeeklyScheduleCard
              scheduled={stats?.scheduledThisWeek ?? 0}
              estimatedHours={stats?.estimatedHours ?? 0}
              coverage={stats?.coveragePercentage ?? 0}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

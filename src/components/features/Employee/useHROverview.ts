"use client";

import { useQuery } from "@tanstack/react-query";
import { endOfWeek, format, startOfWeek } from "date-fns";
import { useState } from "react";

import { attendanceService } from "@/services/attendanceService";
import { getEmployees } from "@/services/employeeService";
import { shiftAssignmentService } from "@/services/shiftAssignmentService";
import { shiftService } from "@/services/shiftService";

// Role Label mapping (localized)
const ROLE_LABELS: Record<string, string> = {
  Manager: "Quản lý",
  Cashier: "Thu ngân",
  ChefBar: "Bếp/Bar",
};

interface HROverviewStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  totalShifts: number;
  activeShifts: number;
  scheduledThisWeek: number;
  estimatedHours: number;
  coveragePercentage: number;
  roleBreakdown: { role: string; count: number; label: string }[];
  presentToday: number;
  lateToday: number;
  absentToday: number;
}

export function useHROverview() {
  const [stats, setStats] = useState<HROverviewStats | null>(null);

  const { isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["hr-overview"],
    queryFn: async () => {
      const now = new Date();
      const weekStart = format(startOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd");
      const weekEnd = format(endOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd");
      const todayStr = format(now, "yyyy-MM-dd");

      const todayStart = `${todayStr}T00:00:00Z`;
      const todayEnd = `${todayStr}T23:59:59Z`;

      const [employeesRes, shiftsRes, summaryRes, todaySummaryRes, attendanceRes] =
        await Promise.all([
          getEmployees({ pageSize: 200 }),
          shiftService.getShifts({ pageSize: 100 }),
          shiftAssignmentService.getSummary({ startDate: weekStart, endDate: weekEnd }),
          shiftAssignmentService.getSummary({ startDate: todayStr, endDate: todayStr }),
          attendanceService.getReport({
            pageSize: 200,
            filters: [`mindate:${todayStart}`, `maxdate:${todayEnd}`],
          }),
        ]);

      const employees = employeesRes.isSuccess ? (employeesRes.data?.items ?? []) : [];
      const shifts = shiftsRes.isSuccess ? (shiftsRes.data?.items ?? []) : [];
      const summary = summaryRes.isSuccess ? summaryRes.data : null;
      const todaySummary = todaySummaryRes.isSuccess ? todaySummaryRes.data : null;
      const attendanceItems = attendanceRes.isSuccess ? (attendanceRes.data?.items ?? []) : [];

      // Calculate role breakdown
      const roles = employees.reduce((acc: Record<string, number>, emp) => {
        if (emp.role) {
          acc[emp.role] = (acc[emp.role] || 0) + 1;
        }
        return acc;
      }, {});

      const roleBreakdown = Object.entries(roles).map(([role, count]) => ({
        role,
        count,
        label: ROLE_LABELS[role] ?? role,
      }));

      // Attendance today calculation
      const presentToday = attendanceItems.length;
      const lateToday = attendanceItems.filter((a) => a.isLate).length;
      const scheduledTodayCount = todaySummary?.totalEmployees ?? 0;
      const absentToday = Math.max(0, scheduledTodayCount - presentToday);

      const calculatedStats: HROverviewStats = {
        totalEmployees: employees.length,
        activeEmployees: employees.filter((e) => e.status?.toLowerCase() === "active").length,
        inactiveEmployees: employees.filter((e) => e.status?.toLowerCase() !== "active").length,
        totalShifts: shifts.length,
        activeShifts: shifts.filter((s) => s.status?.toLowerCase() === "active").length,
        scheduledThisWeek: summary?.totalEmployees ?? 0,
        estimatedHours: summary?.estimatedHours ?? 0,
        coveragePercentage: summary?.coveragePercentage ?? 0,
        roleBreakdown,
        presentToday,
        lateToday,
        absentToday,
      };

      setStats(calculatedStats);
      return calculatedStats;
    },
  });

  return {
    stats,
    isLoading,
    isFetching,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
}

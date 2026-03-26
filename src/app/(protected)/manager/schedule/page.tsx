"use client";

import { useQuery } from "@tanstack/react-query";
import { addDays, format, startOfWeek } from "date-fns";
import React, { useState } from "react";

import ScheduleCalendar from "@/components/features/Schedule/ScheduleCalendar";
import ScheduleStats from "@/components/features/Schedule/ScheduleStats";
import { UI_TEXT } from "@/lib/UI_Text";
import { shiftAssignmentService } from "@/services/shiftAssignmentService";

const SchedulePage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = addDays(weekStart, 6);

  const { data: summaryData, isLoading: isSummaryLoading } = useQuery({
    queryKey: [
      "shiftAssignmentSummary",
      format(weekStart, "yyyy-MM-dd"),
      format(weekEnd, "yyyy-MM-dd"),
    ],
    queryFn: async () => {
      const response = await shiftAssignmentService.getSummary({
        startDate: format(weekStart, "yyyy-MM-dd"),
        endDate: format(weekEnd, "yyyy-MM-dd"),
      });
      if (!response.isSuccess) {
        throw new Error(response.error || "Failed to load summary");
      }
      return response.data;
    },
  });

  return (
    <div className="flex flex-col gap-6 py-6 h-full overflow-y-auto no-scrollbar pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
            {UI_TEXT.SCHEDULE.TITLE}
          </h1>
          <p className="text-slate-400 mt-1 font-bold text-xs uppercase tracking-widest">
            {UI_TEXT.SCHEDULE.ADMIN_TITLE}
          </p>
        </div>
      </div>

      <ScheduleStats
        totalStaff={summaryData?.totalEmployees ?? 0}
        estimatedHours={summaryData?.estimatedHours ?? 0}
        estimatedCost={summaryData?.estimatedCost ?? 0}
        shiftCoverage={summaryData?.coveragePercentage ?? 0}
        isLoading={isSummaryLoading}
      />

      <div className="flex-1">
        <ScheduleCalendar currentDate={currentDate} onDateChange={setCurrentDate} />
      </div>
    </div>
  );
};

export default SchedulePage;

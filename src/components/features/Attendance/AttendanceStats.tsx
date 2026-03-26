import React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { UI_TEXT } from "@/lib/UI_Text";

interface AttendanceStatsProps {
  totalStaff: number;
  totalStaffChange?: string;
  onTimePercent: number;
  latePercent: number;
  estimatedPenalty: number;
}

const AttendanceStats = ({
  totalStaff,
  totalStaffChange = "+0 tháng này",
  onTimePercent,
  latePercent,
  estimatedPenalty,
}: AttendanceStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="rounded-3xl shadow-sm border-none overflow-hidden">
        <CardContent className="p-6">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
            {UI_TEXT.ATTENDANCE.STAT_TOTAL_STAFF}
          </p>
          <div className="flex items-end gap-3">
            <h3 className="text-3xl font-black text-slate-900 leading-none">{totalStaff}</h3>
            <span className="text-[10px] font-bold text-emerald-500 mb-1">{totalStaffChange}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl shadow-sm border-none overflow-hidden">
        <CardContent className="p-6">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
            {UI_TEXT.ATTENDANCE.STAT_ON_TIME}
          </p>
          <div className="flex items-end gap-3 mb-4">
            <h3 className="text-3xl font-black text-slate-900 leading-none">{onTimePercent}</h3>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: `${onTimePercent}%` }} />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl shadow-sm border-none overflow-hidden">
        <CardContent className="p-6">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
            {UI_TEXT.ATTENDANCE.STAT_LATE}
          </p>
          <div className="flex items-end gap-3 mb-4">
            <h3 className="text-3xl font-black text-slate-900 leading-none">{latePercent}</h3>
            <span className="text-[10px] font-bold text-red-500 mb-1">
              {UI_TEXT.ATTENDANCE.STAT_NOTE}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl shadow-sm border-none overflow-hidden bg-[#cc0000]">
        <CardContent className="p-6">
          <p className="text-[10px] font-bold text-red-200 uppercase tracking-widest mb-4">
            {UI_TEXT.ATTENDANCE.STAT_PENALTY}
          </p>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-black text-white leading-none">
              {estimatedPenalty.toLocaleString("vi-VN")}
            </h3>
            <span className="text-[10px] font-bold text-white mb-1">
              {UI_TEXT.ATTENDANCE.STAT_CURRENCY}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceStats;

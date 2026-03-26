import { format, parseISO } from "date-fns";
import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UI_TEXT } from "@/lib/UI_Text";
import { AttendanceReportItem } from "@/types/Attendance";

interface AttendanceTableProps {
  attendances: AttendanceReportItem[];
  isLoading?: boolean;
}

const AttendanceTable = ({ attendances, isLoading }: AttendanceTableProps) => {
  const formatTime = (isoString: string | null) => {
    if (!isoString) return "--:--";
    try {
      return format(parseISO(isoString), "HH:mm");
    } catch {
      return "--:--";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      return format(parseISO(dateString), "dd/MM/yyyy");
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (item: AttendanceReportItem) => {
    // If exact status logic is complex, simplify it based on backend strings or booleans
    // Assuming backend returns descriptive 'status' or we use 'isLate', etc.
    if (item.isLate) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-[10px] font-bold uppercase tracking-widest border border-rose-100">
          <div className="size-1.5 rounded-full bg-rose-500" />
          {UI_TEXT.ATTENDANCE.STATUS_LATE}
        </span>
      );
    }
    if (item.isEarlyLeave) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-widest border border-amber-100">
          <div className="size-1.5 rounded-full bg-amber-500" />
          {UI_TEXT.ATTENDANCE.STATUS_EARLY_LEAVE}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
        <div className="size-1.5 rounded-full bg-emerald-500" />
        {UI_TEXT.ATTENDANCE.STATUS_ON_TIME}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-x-auto w-full">
      <Table className="min-w-[900px]">
        <TableHeader className="bg-slate-50/50 border-b border-slate-100">
          <TableRow className="border-none hover:bg-transparent">
            <TableHead className="font-semibold text-slate-500 uppercase tracking-wider text-xs py-3 pl-6">
              {UI_TEXT.ATTENDANCE.TABLE_DATE}
            </TableHead>
            <TableHead className="font-semibold text-slate-500 uppercase tracking-wider text-xs py-3">
              {UI_TEXT.ATTENDANCE.TABLE_EMPLOYEE}
            </TableHead>
            <TableHead className="font-semibold text-slate-500 uppercase tracking-wider text-xs py-3">
              {UI_TEXT.ATTENDANCE.TABLE_SHIFT}
            </TableHead>
            <TableHead className="font-semibold text-slate-500 uppercase tracking-wider text-xs py-3">
              {UI_TEXT.ATTENDANCE.TABLE_CHECK_IN}
            </TableHead>
            <TableHead className="font-semibold text-slate-500 uppercase tracking-wider text-xs py-3">
              {UI_TEXT.ATTENDANCE.TABLE_CHECK_OUT}
            </TableHead>
            <TableHead className="font-semibold text-slate-500 uppercase tracking-wider text-xs py-3 pr-6 text-right">
              {UI_TEXT.ATTENDANCE.TABLE_STATUS}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="h-48 text-center text-slate-400">
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                    {UI_TEXT.COMMON.LOADING || "ĐANG TẢI..."}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            <>
              {attendances.map((att) => (
                <TableRow
                  key={att.attendanceId}
                  className="hover:bg-slate-50/80 transition-all duration-300 border-b border-slate-50 last:border-0 bg-white"
                >
                  <TableCell className="font-semibold text-slate-800 text-sm py-4 pl-6">
                    {formatDate(att.date)}
                  </TableCell>
                  <TableCell className="text-sm py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs">
                        {att.employeeName.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-bold text-slate-800">{att.employeeName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600 font-medium text-sm py-4">
                    {att.shiftName}
                  </TableCell>
                  <TableCell className="text-slate-600 font-medium text-sm py-4">
                    {formatTime(att.checkInTime)}
                  </TableCell>
                  <TableCell className="text-slate-600 font-medium text-sm py-4">
                    {formatTime(att.checkOutTime)}
                  </TableCell>
                  <TableCell className="text-right py-4 pr-6">{getStatusBadge(att)}</TableCell>
                </TableRow>
              ))}
              {attendances.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center bg-slate-50/30">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                        {UI_TEXT.ATTENDANCE.TABLE_EMPTY}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AttendanceTable;

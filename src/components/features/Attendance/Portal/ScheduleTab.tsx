"use client";

import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ChevronLeft, ChevronRight, ClipboardList, Clock } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";
import { ShiftAssignment } from "@/types/ShiftAssignment";

interface ScheduleTabProps {
  daysOfWeek: Date[];
  todayStr: string;
  isLoadingWeek: boolean;
  weekStart: Date;
  weekEnd: Date;
  getShiftForDay: (date: Date) => ShiftAssignment[];
  prevWeek: () => void;
  nextWeek: () => void;
  backToTodayWeek: () => void;
}

export function ScheduleTab({
  daysOfWeek,
  todayStr,
  isLoadingWeek,
  weekStart,
  weekEnd,
  getShiftForDay,
  prevWeek,
  nextWeek,
  backToTodayWeek,
}: ScheduleTabProps) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 w-full min-h-[500px]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-[#cc0000]" />
          </div>
          <h2 className="text-xl font-black text-slate-900">
            {UI_TEXT.ATTENDANCE.PORTAL_MY_SCHEDULE}
          </h2>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shadow-sm">
          <Button variant="ghost" size="icon" onClick={prevWeek} className="h-9 w-9 rounded-xl">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            onClick={backToTodayWeek}
            className="px-4 h-9 rounded-xl text-xs font-black uppercase tracking-widest text-[#cc0000]"
          >
            {format(weekStart, "dd/MM")} {format(weekEnd, "dd/MM")}
          </Button>
          <Button variant="ghost" size="icon" onClick={nextWeek} className="h-9 w-9 rounded-xl">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
        {daysOfWeek.map((day) => {
          const dayShifts = getShiftForDay(day);
          const isToday = format(day, "yyyy-MM-dd") === todayStr;

          return (
            <div
              key={day.toString()}
              className={`flex flex-col h-full min-h-[220px] rounded-3xl border transition-all duration-300 ${
                isToday
                  ? "bg-red-50/50 border-red-200 shadow-lg shadow-red-50 ring-1 ring-red-100"
                  : "bg-slate-50/50 border-slate-100/80 hover:bg-white hover:shadow-md"
              }`}
            >
              <div className="p-4 text-center border-b border-slate-100/50">
                <p
                  className={`text-[10px] font-black uppercase tracking-[0.15em] ${
                    isToday ? "text-red-600" : "text-slate-400"
                  }`}
                >
                  {format(day, "EEEE", { locale: vi })}
                </p>
                <p
                  className={`text-xl font-black mt-1 ${isToday ? "text-red-700" : "text-slate-900"}`}
                >
                  {format(day, "dd")}
                </p>
              </div>

              <div className="flex-1 p-3 space-y-2 uppercase">
                {isLoadingWeek ? (
                  <div className="flex flex-col gap-2">
                    <div className="h-12 bg-slate-200/50 animate-pulse rounded-xl" />
                  </div>
                ) : dayShifts.length > 0 ? (
                  dayShifts.map((sa: ShiftAssignment) => (
                    <div
                      key={sa.shiftAssignmentId}
                      className={`p-3 rounded-2xl border bg-white shadow-sm ring-1 group transition-all ${
                        isToday
                          ? "border-red-200 ring-red-50 hover:border-red-300"
                          : "border-slate-100 ring-slate-50 hover:border-primary/20"
                      }`}
                    >
                      <p className="text-[10px] font-black text-slate-900 truncate mb-1">
                        {sa.shift?.name || UI_TEXT.ATTENDANCE.TABLE_SHIFT.toUpperCase()}
                      </p>
                      <div className="flex items-center gap-1 text-[9px] font-bold text-slate-500">
                        <Clock className="w-2.5 h-2.5" />
                        <span>
                          {sa.shift?.startTime.substring(0, 5)} {sa.shift?.endTime.substring(0, 5)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-30 grayscale pt-4">
                    <Clock className="w-6 h-6 text-slate-300 mb-1" />
                    <span className="text-[9px] font-black text-slate-400">
                      {UI_TEXT.ATTENDANCE.PORTAL_EMPTY_SHIFT}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

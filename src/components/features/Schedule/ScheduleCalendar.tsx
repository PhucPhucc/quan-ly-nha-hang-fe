import { addDays, format, startOfWeek } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Users } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { UI_TEXT } from "@/lib/UI_Text";
import { getEmployees } from "@/services/employeeService";
import { shiftAssignmentService } from "@/services/shiftAssignmentService";
import { shiftService } from "@/services/shiftService";
import { Employee } from "@/types/Employee";
import { Shift } from "@/types/Shift";
import { ShiftAssignment } from "@/types/ShiftAssignment";

import AssignmentDialog from "./AssignmentDialog";

interface ScheduleCalendarProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

const ScheduleCalendar = ({ currentDate, onDateChange }: ScheduleCalendarProps) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [assignments, setAssignments] = useState<ShiftAssignment[]>([]);
  const [shiftsMap, setShiftsMap] = useState<Record<string, Shift>>({});
  const [loading, setLoading] = useState(true);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<ShiftAssignment | null>(null);

  const startDate = React.useMemo(
    () => startOfWeek(currentDate, { weekStartsOn: 1 }),
    [currentDate]
  );

  const days = React.useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const date = addDays(startDate, i);
        return {
          label: format(date, "EEEE", { locale: vi }).toUpperCase(),
          date: format(date, "dd"),
          fullDate: format(date, "yyyy-MM-dd"),
          isToday: format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd"),
        };
      }),
    [startDate]
  );

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [empRes, assignRes, shiftRes] = await Promise.all([
        getEmployees({ pageSize: 100 }),
        shiftAssignmentService.getAssignments({
          pageSize: 1000,
          filters: [
            `assignedDate >= ${format(startDate, "yyyy-MM-dd")}`,
            `assignedDate <= ${format(addDays(startDate, 6), "yyyy-MM-dd")}`,
          ],
        }),
        shiftService.getShifts({ pageSize: 100 }),
      ]);

      if (empRes.isSuccess && empRes.data) {
        setEmployees(empRes.data.items);
      }
      if (assignRes.isSuccess && assignRes.data) {
        setAssignments(assignRes.data.items);
      }
      if (shiftRes.isSuccess && shiftRes.data) {
        const map: Record<string, Shift> = {};
        shiftRes.data.items.forEach((s) => {
          map[s.shiftId] = s;
        });
        setShiftsMap(map);
      }
    } catch (error) {
      console.error("Failed to fetch schedule data:", error);
    } finally {
      setLoading(false);
    }
  }, [startDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const nextWeek = () => onDateChange(addDays(currentDate, 7));
  const nextTwoWeeks = () => onDateChange(addDays(currentDate, 14));
  const nextMonth = () => onDateChange(addDays(currentDate, 30));
  const prevWeek = () => onDateChange(addDays(currentDate, -7));

  const getAssignment = (employeeId: string, date: string) => {
    return assignments.find((a) => a.employeeId === employeeId && a.assignedDate === date);
  };

  /** Get shift name + times, preferring nested shift, falling back to shiftsMap */
  const getShiftInfo = (assignment: ShiftAssignment) => {
    const shift = assignment.shift ?? shiftsMap[assignment.shiftId];
    if (!shift) return { name: "Ca đã gán", startTime: "", endTime: "" };
    return {
      name: shift.name,
      startTime: shift.startTime,
      endTime: shift.endTime,
    };
  };

  const handleAddAssignment = (emp: Employee, date: string) => {
    setSelectedEmployee(emp);
    setSelectedDate(date);
    setSelectedAssignment(null);
    setIsDialogOpen(true);
  };

  const handleEditAssignment = (emp: Employee, date: string, assignment: ShiftAssignment) => {
    setSelectedEmployee(emp);
    setSelectedDate(date);
    setSelectedAssignment(assignment);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 mb-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
        <Button variant="ghost" size="sm" onClick={prevWeek} className="rounded-xl h-9">
          <ChevronLeft className="size-4 mr-1" /> {UI_TEXT.COMMON.PREVIOUS}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={nextWeek}
          className="rounded-xl h-9 active:bg-red-50 text-red-600 font-bold"
        >
          {UI_TEXT.SCHEDULE.NEXT_WEEK}
        </Button>
        <Button variant="ghost" size="sm" onClick={nextTwoWeeks} className="rounded-xl h-9">
          {UI_TEXT.SCHEDULE.NEXT_2_WEEKS}
        </Button>
        <Button variant="ghost" size="sm" onClick={nextMonth} className="rounded-xl h-9">
          {UI_TEXT.SCHEDULE.NEXT_MONTH}
        </Button>
        <div className="flex-1" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="px-4 py-1.5 h-9 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors flex items-center gap-2 group"
            >
              <CalendarIcon className="size-4 text-slate-400 group-hover:text-primary transition-colors" />
              <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                {format(startDate, "dd/MM")}
                {UI_TEXT.COMMON.SPACE}
                {UI_TEXT.COMMON.HYPHEN}
                {UI_TEXT.COMMON.SPACE}
                {format(addDays(startDate, 6), "dd/MM/yyyy")}
              </span>
              <ChevronLeft className="size-3 text-slate-400 -rotate-90 group-hover:text-primary transition-colors" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[280px] rounded-2xl p-2 shadow-2xl border-none ring-1 ring-black/5"
          >
            <div className="px-3 py-2 border-b border-slate-50 mb-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                {UI_TEXT.SCHEDULE.SELECT_WEEK || "CHỌN TUẦN LÀM VIỆC"}
              </p>
            </div>
            {Array.from({ length: 12 }, (_, i) => {
              const weekDate = addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), (i - 2) * 7);
              const weekStart = format(weekDate, "dd/MM");
              const weekEnd = format(addDays(weekDate, 6), "dd/MM");
              const isSelected = format(weekDate, "yyyy-MM-dd") === format(startDate, "yyyy-MM-dd");

              return (
                <DropdownMenuItem
                  key={i}
                  onClick={() => onDateChange(weekDate)}
                  className={`rounded-xl px-3 py-2.5 mb-0.5 cursor-pointer flex items-center justify-between group/item ${
                    isSelected
                      ? "bg-primary/5 text-primary font-bold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`size-2 rounded-full transition-all ${isSelected ? "bg-primary scale-125" : "bg-slate-200 group-hover/item:bg-slate-300"}`}
                    />
                    <span className="text-sm">
                      {format(weekDate, "yyyy") === format(new Date(), "yyyy")
                        ? `${UI_TEXT.COMMON.WEEK || "Tuần"} ${weekStart} - ${weekEnd}`
                        : `${UI_TEXT.COMMON.WEEK || "Tuần"} ${weekStart} - ${weekEnd} (${format(weekDate, "yyyy")})`}
                    </span>
                  </div>
                  {isSelected && <div className="size-1.5 rounded-full bg-primary animate-pulse" />}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="grid grid-cols-[200px_repeat(7,1fr)] border-b border-slate-100 bg-[var(--table-header-bg)] text-[var(--table-heading)]">
          <div className="p-4 flex items-center gap-2 border-r border-slate-100">
            <Users className="size-4 opacity-70" />
            <span className="text-xs font-bold uppercase tracking-widest">
              {UI_TEXT.SCHEDULE.EMPLOYEE_NAME}
            </span>
          </div>
          {days.map((day, i) => (
            <div
              key={i}
              className={`p-4 text-center border-r border-slate-100 last:border-r-0 ${day.isToday ? "bg-primary/5" : ""}`}
            >
              <p
                className={`text-[10px] font-bold ${day.isToday ? "text-primary" : "opacity-60"} uppercase tracking-widest`}
              >
                {day.label}
              </p>
              <p
                className={`text-xl font-black mt-1 ${day.isToday ? "text-primary" : "text-slate-900"}`}
              >
                {day.date}
              </p>
              {day.isToday && (
                <p className="text-[10px] font-bold text-primary mt-1">{UI_TEXT.SCHEDULE.TODAY}</p>
              )}
            </div>
          ))}
        </div>

        <div className="divide-y divide-slate-100">
          {employees.map((emp) => (
            <div
              key={emp.employeeId}
              className="grid grid-cols-[200px_repeat(7,1fr)] min-h-[100px] hover:bg-slate-50/30 transition-colors group"
            >
              <div className="p-4 border-r border-slate-100 flex items-center gap-3">
                <div className="size-10 rounded-2xl bg-slate-100 overflow-hidden ring-2 ring-white shadow-sm">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(emp.fullName)}&background=random`}
                    alt={emp.fullName}
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{emp.fullName}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate">
                    {emp.role}
                  </p>
                </div>
              </div>

              {days.map((day, i) => {
                const assignment = getAssignment(emp.employeeId, day.fullDate);
                return (
                  <div
                    key={i}
                    className="p-2 border-r border-slate-100 last:border-r-0 flex items-center justify-center relative"
                  >
                    {assignment ? (
                      (() => {
                        const shiftInfo = getShiftInfo(assignment);
                        return (
                          <div
                            onClick={() => handleEditAssignment(emp, day.fullDate, assignment)}
                            className="w-full p-2.5 rounded-xl border bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/20 shadow-sm transition-all hover:scale-[1.02] hover:bg-[var(--primary)]/20 cursor-pointer group/card relative overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                            <p className="text-[10px] font-black uppercase truncate relative z-10">
                              {shiftInfo.name}
                            </p>
                            {shiftInfo.startTime && (
                              <p className="text-[9px] font-bold opacity-80 mt-0.5 whitespace-nowrap relative z-10">
                                {shiftInfo.startTime.slice(0, 5)}
                                {UI_TEXT.COMMON.SPACE}
                                {UI_TEXT.COMMON.HYPHEN}
                                {UI_TEXT.COMMON.SPACE}
                                {shiftInfo.endTime.slice(0, 5)}
                              </p>
                            )}
                          </div>
                        );
                      })()
                    ) : (
                      <button
                        onClick={() => handleAddAssignment(emp, day.fullDate)}
                        className="size-10 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all opacity-0 group-hover:opacity-100 font-bold active:scale-90"
                      >
                        <Plus className="size-5" strokeWidth={3} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend Footer */}
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-md bg-blue-100 border border-blue-200" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {UI_TEXT.SCHEDULE.MORNING_SHIFT}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-md bg-purple-100 border border-purple-200" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {UI_TEXT.SCHEDULE.AFTERNOON_SHIFT}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400 font-medium italic">
              {UI_TEXT.SCHEDULE.PAGE_TEXT}
            </span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-lg border-slate-200"
                onClick={prevWeek}
              >
                <ChevronLeft className="size-4 text-slate-400" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-lg border-slate-200"
                onClick={nextWeek}
              >
                <ChevronRight className="size-4 text-slate-400" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AssignmentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        employee={selectedEmployee}
        date={selectedDate}
        assignment={selectedAssignment}
        onSuccess={fetchData}
      />
    </>
  );
};

export default ScheduleCalendar;

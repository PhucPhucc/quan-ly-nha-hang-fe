import { addDays, format, isSameWeek, startOfWeek } from "date-fns";
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

  const isNextWeek = isSameWeek(currentDate, addDays(new Date(), 7), { weekStartsOn: 1 });
  const isNextTwoWeeks = isSameWeek(currentDate, addDays(new Date(), 14), { weekStartsOn: 1 });
  const isNextMonth = isSameWeek(currentDate, addDays(new Date(), 30), { weekStartsOn: 1 });

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-1 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/60 w-fit">
          <Button
            variant="ghost"
            size="sm"
            onClick={prevWeek}
            className="rounded-xl h-9 px-3 hover:bg-white hover:shadow-sm transition-all text-slate-500 font-medium"
          >
            <ChevronLeft className="size-4 mr-1" />
            {UI_TEXT.COMMON.PREVIOUS}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={nextWeek}
            className={`rounded-xl h-9 px-4 transition-all font-bold ${
              isNextWeek ? "bg-white shadow-sm text-primary" : "text-slate-500 hover:bg-white/50"
            }`}
          >
            {UI_TEXT.SCHEDULE.NEXT_WEEK}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={nextTwoWeeks}
            className={`rounded-xl h-9 px-4 transition-all font-bold ${
              isNextTwoWeeks
                ? "bg-white shadow-sm text-primary"
                : "text-slate-500 hover:bg-white/50"
            }`}
          >
            {UI_TEXT.SCHEDULE.NEXT_2_WEEKS}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={nextMonth}
            className={`rounded-xl h-9 px-4 transition-all font-bold ${
              isNextMonth ? "bg-white shadow-sm text-primary" : "text-slate-500 hover:bg-white/50"
            }`}
          >
            {UI_TEXT.SCHEDULE.NEXT_MONTH}
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-12 px-6 rounded-2xl border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-3 group shadow-sm"
            >
              <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/15 transition-colors">
                <CalendarIcon className="size-4 text-primary" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">
                  {UI_TEXT.SCHEDULE.PERIOD}
                </span>
                <span className="text-sm font-bold text-slate-700">
                  {format(startDate, "dd/MM")} - {format(addDays(startDate, 6), "dd/MM/yyyy")}
                </span>
              </div>
              <ChevronRight className="size-4 text-slate-300 rotate-90 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[300px] rounded-3xl p-3 shadow-2xl border-none ring-1 ring-black/5 animate-in slide-in-from-top-2 duration-300"
          >
            <div className="px-3 py-3 border-b border-slate-50 mb-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                {UI_TEXT.SCHEDULE.CHOOSE_WEEK}
              </p>
            </div>
            <div className="max-h-[350px] overflow-y-auto no-scrollbar space-y-1">
              {Array.from({ length: 12 }, (_, i) => {
                const weekDate = addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), (i - 2) * 7);
                const weekStartStr = format(weekDate, "dd/MM");
                const weekEndStr = format(addDays(weekDate, 6), "dd/MM");
                const isSelected =
                  format(weekDate, "yyyy-MM-dd") === format(startDate, "yyyy-MM-dd");

                return (
                  <DropdownMenuItem
                    key={i}
                    onClick={() => onDateChange(weekDate)}
                    className={`rounded-2xl px-4 py-3 cursor-pointer flex items-center justify-between group/item transition-all ${
                      isSelected ? "bg-primary/5 text-primary" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-2 rounded-full transition-all duration-300 ${
                          isSelected
                            ? "bg-primary shadow-[0_0_8px_rgba(204,0,0,0.4)] scale-125"
                            : "bg-slate-200 group-hover/item:bg-slate-300"
                        }`}
                      />
                      <span className={`text-sm ${isSelected ? "font-bold" : "font-medium"}`}>
                        {format(weekDate, "yyyy") === format(new Date(), "yyyy")
                          ? `Tuần ${weekStartStr} - ${weekEndStr}`
                          : `Tuần ${weekStartStr} - ${weekEndStr} (${format(weekDate, "yyyy")})`}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="size-1.5 rounded-full bg-primary animate-pulse" />
                    )}
                  </DropdownMenuItem>
                );
              })}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="grid grid-cols-[220px_repeat(7,1fr)] border-b border-slate-100 bg-slate-50/50">
          <div className="p-5 flex items-center gap-3 border-r border-slate-100">
            <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100">
              <Users className="size-4 text-slate-400" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              {UI_TEXT.SCHEDULE.EMPLOYEE_NAME}
            </span>
          </div>
          {days.map((day, i) => (
            <div
              key={i}
              className={`p-4 text-center border-r border-slate-100 last:border-r-0 transition-colors ${
                day.isToday ? "bg-primary/5" : ""
              }`}
            >
              <p
                className={`text-[10px] font-bold ${
                  day.isToday ? "text-primary" : "text-slate-400"
                } uppercase tracking-widest`}
              >
                {day.label}
              </p>
              <p
                className={`text-2xl font-black mt-1 ${
                  day.isToday ? "text-primary" : "text-slate-900"
                }`}
              >
                {day.date}
              </p>
              {day.isToday && (
                <div className="mt-1 flex justify-center">
                  <span className="bg-primary text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter shadow-sm shadow-red-100">
                    {UI_TEXT.SCHEDULE.TODAY}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="divide-y divide-slate-100">
          {employees.map((emp) => (
            <div
              key={emp.employeeId}
              className="grid grid-cols-[220px_repeat(7,1fr)] min-h-[110px] hover:bg-slate-50/30 transition-colors group"
            >
              <div className="p-5 border-r border-slate-100 flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-slate-100 overflow-hidden ring-4 ring-white shadow-sm shrink-0">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      emp.fullName
                    )}&background=random&size=128`}
                    alt={emp.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate tracking-tight">
                    {emp.fullName}
                  </h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate mt-0.5">
                    {emp.role}
                  </p>
                </div>
              </div>

              {days.map((day, i) => {
                const assignment = getAssignment(emp.employeeId, day.fullDate);
                return (
                  <div
                    key={i}
                    className="p-3 border-r border-slate-100 last:border-r-0 flex items-center justify-center relative"
                  >
                    {assignment ? (
                      (() => {
                        const shiftInfo = getShiftInfo(assignment);
                        return (
                          <div
                            onClick={() => handleEditAssignment(emp, day.fullDate, assignment)}
                            className="w-full p-3 rounded-2xl border bg-primary/5 text-primary border-primary/10 shadow-sm transition-all hover:scale-[1.03] hover:bg-primary/10 hover:shadow-md cursor-pointer group/card relative overflow-hidden"
                          >
                            <div className="absolute top-0 right-0 p-1 opacity-0 group-hover/card:opacity-40 transition-opacity">
                              <Plus className="size-2 rotate-45" />
                            </div>
                            <p className="text-[10px] font-black uppercase truncate relative z-10 tracking-tight">
                              {shiftInfo.name}
                            </p>
                            {shiftInfo.startTime && (
                              <p className="text-[9px] font-bold opacity-70 mt-1 whitespace-nowrap relative z-10 flex items-center gap-1">
                                <span className="size-1 rounded-full bg-primary/50" />
                                {shiftInfo.startTime.slice(0, 5)} - {shiftInfo.endTime.slice(0, 5)}
                              </p>
                            )}
                          </div>
                        );
                      })()
                    ) : (
                      <button
                        onClick={() => handleAddAssignment(emp, day.fullDate)}
                        className="size-12 rounded-2xl border-2 border-dashed border-slate-100 flex items-center justify-center text-slate-200 hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all opacity-0 group-hover:opacity-100 font-bold active:scale-95"
                      >
                        <Plus className="size-6" strokeWidth={3} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-primary/20 border border-primary/30" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {UI_TEXT.SCHEDULE.ASSIGNED_SHIFT}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-2xl border-2 border-dashed border-slate-200" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {UI_TEXT.SCHEDULE.EMPTY_SHIFT}
              </span>
            </div>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {UI_TEXT.SCHEDULE.AUTO_SAVE}
          </p>
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

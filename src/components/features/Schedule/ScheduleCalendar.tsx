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
  const getNow = () => onDateChange(new Date());
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
        <div className="flex items-center gap-1 bg-muted p-1.5 rounded-lg border w-fit text-muted-foreground">
          <Button
            variant="ghost"
            size="sm"
            onClick={prevWeek}
            className="rounded-lg px-3 hover:bg-card border border-muted hover:border-border hover:shadow-sm transition-all font-medium"
          >
            <ChevronLeft className="size-4 mr-1" />
            {UI_TEXT.COMMON.PREVIOUS}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={getNow}
            className="rounded-lg px-4 transition-all border border-muted hover:bg-card hover:border-border"
          >
            {UI_TEXT.SCHEDULE.NOW}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={nextWeek}
            className="rounded-lg px-4 transition-all border border-muted hover:bg-card hover:border-border"
          >
            {UI_TEXT.SCHEDULE.NEXT_WEEK}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={nextMonth}
            className="rounded-lg px-4 transition-all border border-muted hover:bg-card hover:border-border"
          >
            {UI_TEXT.SCHEDULE.NEXT_MONTH}
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="p-6 rounded-lg border bg-muted transition-all flex items-center gap-3 group shadow-sm"
            >
              <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/15 transition-colors">
                <CalendarIcon className="size-4 text-primary" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[10px] font-bold uppercase tracking-widest text-card-foreground leading-none mb-1">
                  {UI_TEXT.SCHEDULE.PERIOD}
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {format(startDate, "dd/MM")} - {format(addDays(startDate, 6), "dd/MM/yyyy")}
                </span>
              </div>
              <ChevronRight className="size-4 rotate-90 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-75 rounded-lg p-3 shadow-2xl border animate-in slide-in-from-top-2 duration-300"
          >
            <div className="px-3 py-3 border-b mb-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-card-foreground">
                {UI_TEXT.SCHEDULE.CHOOSE_WEEK}
              </p>
            </div>
            <div className="max-h-88 overflow-y-auto no-scrollbar space-y-1">
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
                    className={`rounded-lg px-4 py-3 cursor-pointer flex items-center justify-between group/item transition-all ${
                      isSelected
                        ? "bg-primary/5 text-primary"
                        : "text-card-foreground hover:bg-card-foreground/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-2 rounded-full transition-all duration-300 ${
                          isSelected ? "bg-primary shadow-xs scale-125" : "bg-muted-foreground"
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

      <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
        <div className="grid grid-cols-[220px_repeat(7,1fr)] border-b bg-card">
          <div className="p-5 flex items-center gap-3 border-r">
            <div className="bg-card-foreground/5 p-2 rounded-full shadow-sm border">
              <Users className="size-4 text-card-foreground" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-card-foreground/70">
              {UI_TEXT.SCHEDULE.EMPLOYEE_NAME}
            </span>
          </div>
          {days.map((day, i) => (
            <div
              key={i}
              className={`p-4 text-center border-r last:border-r-0 transition-colors ${
                day.isToday ? "bg-primary/5" : ""
              }`}
            >
              <p
                className={`text-[10px] font-bold ${
                  day.isToday ? "text-primary" : "text-card-foreground/70"
                } uppercase tracking-widest`}
              >
                {day.label}
              </p>
              <p
                className={`text-2xl font-black mt-1 ${
                  day.isToday ? "text-primary" : "text-card-foreground"
                }`}
              >
                {day.date}
              </p>
              {day.isToday && (
                <div className="mt-1 flex justify-center">
                  <span className="bg-primary text-primary-foreground text-[8px] font-black px-1.5 py-0.5 rounded-lg tracking-tighter shadow-sm shadow-red-100">
                    {UI_TEXT.SCHEDULE.TODAY}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="divide-y divide-border">
          {employees.map((emp) => (
            <div
              key={emp.employeeId}
              className="grid grid-cols-[220px_repeat(7,1fr)] min-h-26 hover:bg-card-foreground/5 transition-colors  duration-100 group"
            >
              <div className="p-5 border-r flex items-center gap-4">
                <div className="size-12 rounded-lg overflow-hidden shadow-sm shrink-0">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      emp.fullName
                    )}&background=random&size=128`}
                    alt={emp.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-card-foreground truncate tracking-tight">
                    {emp.fullName}
                  </h4>
                  <p className="text-[10px] font-bold text-card-foreground/70 uppercase tracking-tight truncate mt-0.5">
                    {emp.role}
                  </p>
                </div>
              </div>

              {days.map((day, i) => {
                const assignment = getAssignment(emp.employeeId, day.fullDate);
                return (
                  <div
                    key={i}
                    className="p-3 border-r  last:border-r-0 flex items-center justify-center relative"
                  >
                    {assignment ? (
                      (() => {
                        const shiftInfo = getShiftInfo(assignment);
                        return (
                          <div
                            onClick={() => handleEditAssignment(emp, day.fullDate, assignment)}
                            className="w-full p-3 rounded-2xl border bg-primary/5 text-primary border-primary/10 shadow-sm transition-all hover:scale-[1.03] hover:bg-primary/10 hover:shadow-md cursor-pointer group/card relative overflow-hidden"
                          >
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
                      <Button
                        onClick={() => handleAddAssignment(emp, day.fullDate)}
                        variant="outline"
                        className="size-12 rounded-full border-2 border-dashed  flex items-center justify-center text-card-foreground/30 hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all opacity-0 group-hover:opacity-100 font-bold active:scale-95"
                      >
                        <Plus className="size-6" strokeWidth={3} />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="p-6 bg-card border-t flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-primary/20 border border-primary/30" />
              <span className="text-[10px] font-semibold tracking-widest text-card-foreground">
                {UI_TEXT.SCHEDULE.ASSIGNED_SHIFT}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full border-2 border-dashed border-card-foreground/50" />
              <span className="text-[10px] font-semibold tracking-widest text-card-foreground">
                {UI_TEXT.SCHEDULE.EMPTY_SHIFT}
              </span>
            </div>
          </div>
          <p className="text-[10px] font-bold text-card-foreground tracking-widest">
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

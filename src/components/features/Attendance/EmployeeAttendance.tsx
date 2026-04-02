"use client";

import { useQuery } from "@tanstack/react-query";
import { addDays, endOfWeek, format, startOfWeek } from "date-fns";
import { Calendar, Clock } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBrandingFormatter } from "@/lib/branding-formatting";
import { UI_TEXT } from "@/lib/UI_Text";
import { attendanceService } from "@/services/attendanceService";
import { shiftAssignmentService } from "@/services/shiftAssignmentService";
import { useAuthStore } from "@/store/useAuthStore";
import { ShiftAssignment, ShiftAssignmentPaginationResult } from "@/types/ShiftAssignment";

import { AttendanceTab } from "./Portal/AttendanceTab";
import { ScheduleTab } from "./Portal/ScheduleTab";
import { SuccessDialog } from "./Portal/SuccessDialog";

export const EmployeeAttendance = () => {
  const { formatDate, formatTime } = useBrandingFormatter();
  const employeeId = useAuthStore((state) => state.employee?.employeeId);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Week navigation state
  const [currentWeekDate, setCurrentWeekDate] = useState(new Date());

  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [actionType, setActionType] = useState<"checkin" | "checkout" | null>(null);
  const [actionInfo, setActionInfo] = useState<{ time: string; duration?: string } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = formatTime(currentTime);
  const [time, period] = timeString.split(" ");
  const dateString = formatDate(currentTime);

  // Calculate week range
  const weekStart = startOfWeek(currentWeekDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeekDate, { weekStartsOn: 1 });
  const todayStr = format(currentTime, "yyyy-MM-dd");

  const normalizeTimeString = (value?: string | null) => {
    if (!value) return null;
    const [hours = "00", minutes = "00", seconds = "00"] = value.split(":");
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;
  };

  const parseDateTime = (value?: string | null, fallbackDate?: string) => {
    if (!value) return null;

    const parsedDate = new Date(value);
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate;
    }

    if (!fallbackDate) return null;

    const normalizedTime = normalizeTimeString(value);
    if (!normalizedTime) return null;

    const fallbackDateTime = new Date(`${fallbackDate}T${normalizedTime}`);
    return Number.isNaN(fallbackDateTime.getTime()) ? null : fallbackDateTime;
  };

  const formatDuration = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${String(hours).padStart(2, "0")} giờ ${String(minutes).padStart(2, "0")} phút`;
  };

  // Fetch today's assignments
  const { data: assignmentsData, isLoading: isLoadingToday } = useQuery({
    queryKey: ["myAssignments", employeeId, todayStr],
    queryFn: async () => {
      if (!employeeId) return [];
      const res = await shiftAssignmentService.getMyShifts({
        filters: [`assignedDate==${todayStr}`],
        pageSize: 50,
      });
      const data = res.data as unknown as ShiftAssignment[] | ShiftAssignmentPaginationResult;
      return (Array.isArray(data) ? data : data?.items || []) as ShiftAssignment[];
    },
    enabled: !!employeeId,
  });

  // Fetch all assignments for current week schedule
  const { data: weekShifts, isLoading: isLoadingWeek } = useQuery({
    queryKey: ["myWeeklyShifts", employeeId, format(weekStart, "yyyy-MM-dd")],
    queryFn: async () => {
      if (!employeeId) return [];
      const res = await shiftAssignmentService.getMyShifts({
        filters: [
          `assignedDate >= ${format(weekStart, "yyyy-MM-dd")}`,
          `assignedDate <= ${format(weekEnd, "yyyy-MM-dd")}`,
        ],
        pageSize: 100,
      });
      const data = res.data as unknown as ShiftAssignment[] | ShiftAssignmentPaginationResult;
      return (Array.isArray(data) ? data : data?.items || []) as ShiftAssignment[];
    },
    enabled: !!employeeId,
  });

  const todayAssignment = assignmentsData?.[0];
  const todayShift = todayAssignment?.shift;

  const getWorkedDuration = (checkOutTime?: string | null, shiftAssignmentId?: string) => {
    const matchedAssignment =
      assignmentsData?.find((assignment) => assignment.shiftAssignmentId === shiftAssignmentId) ||
      todayAssignment;

    if (!matchedAssignment?.assignedDate || !matchedAssignment.shift?.startTime) {
      return UI_TEXT.COMMON.NOT_APPLICABLE;
    }

    const shiftStart = parseDateTime(
      matchedAssignment.shift.startTime,
      matchedAssignment.assignedDate
    );
    const checkedOutAt = parseDateTime(checkOutTime, matchedAssignment.assignedDate);

    if (!shiftStart || !checkedOutAt) {
      return UI_TEXT.COMMON.NOT_APPLICABLE;
    }

    const diffInMinutes = Math.floor((checkedOutAt.getTime() - shiftStart.getTime()) / 60000);
    if (diffInMinutes < 0) {
      return UI_TEXT.COMMON.NOT_APPLICABLE;
    }

    return formatDuration(diffInMinutes);
  };

  // Check if late
  const isLate = () => {
    if (!todayShift) return false;
    const [hours, minutes] = todayShift.endTime.split(":");
    const shiftEnd = new Date(currentTime);
    shiftEnd.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    return currentTime > shiftEnd;
  };

  const handleCheckIn = async () => {
    try {
      if (isLate()) {
        toast.warning(UI_TEXT.ATTENDANCE.PORTAL_LATE_CHECKIN);
      }
      const resp = await attendanceService.checkIn();
      if (resp.isSuccess) {
        setIsCheckedIn(true);
        setActionType("checkin");
        setActionInfo({
          time: formatTime(resp.data?.checkInTime || new Date()),
        });
        setShowSuccessModal(true);
      }
    } catch (error) {
      toast.error((error as Error).message || UI_TEXT.ATTENDANCE.MODAL_CHECK_IN_FAIL);
    }
  };

  const handleCheckOut = async () => {
    try {
      const resp = await attendanceService.checkOut();
      if (resp.isSuccess) {
        const checkOutTime = resp.data?.checkOutTime;

        setIsCheckedIn(false);
        setActionType("checkout");
        setActionInfo({
          time: formatTime(checkOutTime || new Date()),
          duration: getWorkedDuration(checkOutTime, resp.data?.shiftAssignmentId),
        });
        setShowSuccessModal(true);
      }
    } catch (error) {
      toast.error((error as Error).message || UI_TEXT.ATTENDANCE.MODAL_CHECK_OUT_FAIL);
    }
  };

  const nextWeek = () => setCurrentWeekDate(addDays(currentWeekDate, 7));
  const prevWeek = () => setCurrentWeekDate(addDays(currentWeekDate, -7));
  const backToTodayWeek = () => setCurrentWeekDate(new Date());

  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getShiftForDay = (date: Date) => {
    const dStr = format(date, "yyyy-MM-dd");
    return weekShifts?.filter((s) => s.assignedDate === dStr) || [];
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] w-full max-w-4xl mx-auto py-8">
      <Tabs defaultValue="attendance" className="w-full">
        <div className="flex justify-center w-full mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-slate-100/50 p-1 rounded-2xl h-14 border border-slate-100 shadow-sm">
            <TabsTrigger
              value="attendance"
              className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-[#cc0000] font-bold text-slate-500 transition-all"
            >
              <Clock className="w-4 h-4 mr-2" />
              {UI_TEXT.ATTENDANCE.PORTAL_TAB_ATTENDANCE}
            </TabsTrigger>
            <TabsTrigger
              value="schedule"
              className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-[#cc0000] font-bold text-slate-500 transition-all"
            >
              <Calendar className="w-4 h-4 mr-2" />
              {UI_TEXT.ATTENDANCE.PORTAL_TAB_SCHEDULE}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="attendance" className="flex justify-center">
          <AttendanceTab
            dateString={dateString}
            time={time}
            period={period}
            todayShift={todayShift}
            isLoadingToday={isLoadingToday}
            isCheckedIn={isCheckedIn}
            isLate={isLate()}
            handleCheckIn={handleCheckIn}
            handleCheckOut={handleCheckOut}
          />
        </TabsContent>

        <TabsContent value="schedule">
          <ScheduleTab
            daysOfWeek={daysOfWeek}
            todayStr={todayStr}
            isLoadingWeek={isLoadingWeek}
            weekStart={weekStart}
            weekEnd={weekEnd}
            getShiftForDay={getShiftForDay}
            prevWeek={prevWeek}
            nextWeek={nextWeek}
            backToTodayWeek={backToTodayWeek}
          />
        </TabsContent>
      </Tabs>

      <SuccessDialog
        isOpen={showSuccessModal}
        onOpenChange={setShowSuccessModal}
        actionType={actionType}
        actionInfo={actionInfo}
      />
    </div>
  );
};

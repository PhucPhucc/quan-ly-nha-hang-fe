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

  const todayShift = assignmentsData?.[0]?.shift;

  // Check if late
  const isLate = () => {
    if (!todayShift) return false;
    const [hours, minutes] = todayShift.startTime.split(":");
    const shiftStart = new Date(currentTime);
    shiftStart.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    return currentTime > shiftStart;
  };

  const handleCheckIn = async () => {
    try {
      if (isLate()) {
        toast.warning(UI_TEXT.ATTENDANCE.PORTAL_LATE_CHECKIN, {
          description: UI_TEXT.ATTENDANCE.PORTAL_WARNING_TITLE,
          duration: 5000,
        });
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
        setIsCheckedIn(false);
        setActionType("checkout");
        setActionInfo({
          time: formatTime(resp.data?.checkOutTime || new Date()),
          duration: "09 giờ 05 phút", // Mock duration
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
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-4xl mx-auto py-8">
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

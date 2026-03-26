import { useQuery } from "@tanstack/react-query";
import { addDays, endOfWeek, format, startOfWeek } from "date-fns";
import { vi } from "date-fns/locale";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  LogIn,
  LogOut,
  MapPin,
  Wifi,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UI_TEXT } from "@/lib/UI_Text";
import { attendanceService } from "@/services/attendanceService";
import { shiftAssignmentService } from "@/services/shiftAssignmentService";
import { useAuthStore } from "@/store/useAuthStore";
import { ShiftAssignment, ShiftAssignmentPaginationResult } from "@/types/ShiftAssignment";

export const EmployeeAttendance = () => {
  const employeeId = useAuthStore((state) => state.employee?.employeeId);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Week navigation state
  const [currentWeekDate, setCurrentWeekDate] = useState(new Date());

  // ... other states ...
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [actionType, setActionType] = useState<"checkin" | "checkout" | null>(null);
  const [actionInfo, setActionInfo] = useState<{ time: string; duration?: string } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const [time, period] = timeString.split(" ");

  const dateString = currentTime.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

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

  const todayShift = assignmentsData?.[0]?.shift; // taking first shift of the day for simplicity

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
          time: new Date(resp.data?.checkInTime || new Date()).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
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
          time: new Date(resp.data?.checkOutTime || new Date()).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
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
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 w-full max-w-md relative overflow-hidden">
            {/* Top Status */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#cc0000]" />

            <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest mt-2 mb-8">
              {dateString}
            </p>

            {/* Big Time Display */}
            <div className="flex items-baseline justify-center gap-2 mb-10">
              <h1 className="text-7xl font-black text-slate-900 tracking-tighter">{time}</h1>
              <span className="text-3xl font-bold text-slate-400">{period}</span>
            </div>

            {/* Late Notification */}
            {todayShift && isLate() && !isCheckedIn && (
              <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 p-4 flex gap-3 items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-widest text-red-700 mb-1">
                    {UI_TEXT.ATTENDANCE.PORTAL_WARNING_TITLE}
                  </h5>
                  <p className="text-sm font-medium text-red-600">
                    {UI_TEXT.ATTENDANCE.PORTAL_LATE_CHECKIN}
                  </p>
                </div>
              </div>
            )}

            {/* Shift Info Card */}
            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl mb-10 shadow-sm relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-l-2xl" />
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                {UI_TEXT.ATTENDANCE.PORTAL_TODAY_SHIFT}
              </p>
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    {isLoadingToday
                      ? "..."
                      : todayShift
                        ? todayShift.name
                        : UI_TEXT.ATTENDANCE.PORTAL_NO_SHIFT}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                    {isLoadingToday
                      ? "..."
                      : todayShift
                        ? `${todayShift.startTime.substring(0, 5)} \u2014 ${todayShift.endTime.substring(0, 5)}`
                        : "—"}
                  </p>
                </div>
                {isCheckedIn ? (
                  <span className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 tracking-wider">
                    {UI_TEXT.ATTENDANCE.PORTAL_WORKING}
                  </span>
                ) : todayShift ? (
                  <span className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-red-100 text-red-700 tracking-wider">
                    {UI_TEXT.ATTENDANCE.PORTAL_UPCOMING}
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-slate-200 text-slate-500 tracking-wider">
                    {UI_TEXT.ATTENDANCE.PORTAL_EMPTY_SHIFT}
                  </span>
                )}
              </div>
            </div>

            {/* Main Action Button */}
            {isCheckedIn ? (
              <Button
                onClick={handleCheckOut}
                className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg cursor-pointer transition-all active:scale-[0.98] shadow-xl shadow-slate-200"
              >
                <LogOut className="mr-2" />
                {UI_TEXT.ATTENDANCE.PORTAL_CHECK_OUT}
              </Button>
            ) : (
              <Button
                onClick={handleCheckIn}
                disabled={!todayShift}
                className="w-full h-16 rounded-2xl bg-[#cc0000] hover:bg-[#aa0000] disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none text-white font-bold text-lg cursor-pointer transition-all active:scale-[0.98] shadow-xl shadow-red-100"
              >
                <LogIn className="mr-2" />
                {UI_TEXT.ATTENDANCE.PORTAL_CHECK_IN}
              </Button>
            )}

            <p className="text-center text-[10px] text-slate-400 mt-6 tracking-wide font-medium">
              {UI_TEXT.ATTENDANCE.PORTAL_CAMERA_NOTE}
            </p>

            {/* Footer Info */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-100">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  {UI_TEXT.ATTENDANCE.PORTAL_LOCATION}
                </p>
                <p className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <MapPin className="size-3 text-red-500" />{" "}
                  {UI_TEXT.ATTENDANCE.PORTAL_MOCK_LOCATION}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  {UI_TEXT.ATTENDANCE.PORTAL_NETWORK}
                </p>
                <p className="text-xs font-bold text-emerald-600 flex items-center justify-end gap-1">
                  <Wifi className="size-3" /> {UI_TEXT.ATTENDANCE.PORTAL_NETWORK_STABLE}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="schedule">
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevWeek}
                  className="h-9 w-9 rounded-xl"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  onClick={backToTodayWeek}
                  className="px-4 h-9 rounded-xl text-xs font-black uppercase tracking-widest text-[#cc0000]"
                >
                  {format(weekStart, "dd/MM")} {format(weekEnd, "dd/MM")}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextWeek}
                  className="h-9 w-9 rounded-xl"
                >
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
                        dayShifts.map((sa) => (
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
                                {sa.shift?.startTime.substring(0, 5)}{" "}
                                {sa.shift?.endTime.substring(0, 5)}
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
        </TabsContent>
      </Tabs>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md rounded-[2rem] p-8 bg-white border-0 shadow-2xl">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-100">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-2xl font-black text-slate-900 mb-2">
              {actionType === "checkin"
                ? UI_TEXT.ATTENDANCE.MODAL_CHECK_IN_SUCCESS
                : UI_TEXT.ATTENDANCE.MODAL_CHECK_OUT_SUCCESS}
            </h2>

            <p className="text-base text-slate-600 font-medium mb-8">
              {actionType === "checkin"
                ? UI_TEXT.ATTENDANCE.MODAL_CHECK_IN_TIME
                : UI_TEXT.ATTENDANCE.MODAL_CHECK_OUT_TIME}{" "}
              <span className="font-bold text-slate-900">{actionInfo?.time}</span>
            </p>

            {actionType === "checkin" ? (
              <p className="text-slate-500 text-sm italic">{UI_TEXT.ATTENDANCE.MODAL_GREETING}</p>
            ) : (
              <div className="w-full bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-6">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  {UI_TEXT.ATTENDANCE.MODAL_STATS_TODAY}
                </p>
                <p className="text-sm font-bold text-slate-700 mb-1">
                  {UI_TEXT.ATTENDANCE.MODAL_TOTAL_TIME}
                </p>
                <p className="text-xl font-black text-slate-900">{actionInfo?.duration}</p>
              </div>
            )}

            <Button
              className="w-full h-14 bg-[#cc0000] hover:bg-[#aa0000] text-white rounded-xl font-bold mt-4"
              onClick={() => setShowSuccessModal(false)}
            >
              {UI_TEXT.ATTENDANCE.MODAL_UNDERSTOOD}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

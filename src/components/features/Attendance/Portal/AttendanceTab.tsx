"use client";

import { AlertCircle, LogIn, LogOut, MapPin, Wifi } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";
import { ShiftAssignment } from "@/types/ShiftAssignment";

interface AttendanceTabProps {
  dateString: string;
  time: string;
  period: string;
  todayShift?: ShiftAssignment["shift"];
  isLoadingToday: boolean;
  isCheckedIn: boolean;
  isLate: boolean;
  handleCheckIn: () => void;
  handleCheckOut: () => void;
}

export function AttendanceTab({
  dateString,
  time,
  period,
  todayShift,
  isLoadingToday,
  isCheckedIn,
  isLate,
  handleCheckIn,
  handleCheckOut,
}: AttendanceTabProps) {
  return (
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
      {todayShift && isLate && !isCheckedIn && (
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
            <MapPin className="size-3 text-red-500" /> {UI_TEXT.ATTENDANCE.PORTAL_MOCK_LOCATION}
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
  );
}

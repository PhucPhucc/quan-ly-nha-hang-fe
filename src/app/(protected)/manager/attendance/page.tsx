"use client";

import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";

import AttendanceFilter from "@/components/features/Attendance/AttendanceFilter";
import AttendanceStats from "@/components/features/Attendance/AttendanceStats";
import AttendanceTable from "@/components/features/Attendance/AttendanceTable";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { UI_TEXT } from "@/lib/UI_Text";
import { attendanceService } from "@/services/attendanceService";

const DEFAULT_PAGE_SIZE = 10;

const AttendancePage = () => {
  const [page, setPage] = useState(1);

  // Filter states
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Applied filters (to trigger query)
  const [appliedFilters, setAppliedFilters] = useState({
    dateRange: undefined as DateRange | undefined,
    employeeSearch: "",
    statusFilter: "all",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["attendances", page, appliedFilters],
    queryFn: async () => {
      // mapping statusFilter
      const filters: string[] = [];
      if (appliedFilters.statusFilter !== "all") {
        filters.push(`status==${appliedFilters.statusFilter}`);
      }
      if (appliedFilters.dateRange?.from) {
        filters.push(`date>=${appliedFilters.dateRange.from.toISOString()}`);
      }
      if (appliedFilters.dateRange?.to) {
        filters.push(`date<=${appliedFilters.dateRange.to.toISOString()}`);
      }

      const response = await attendanceService.getReport({
        pageNumber: page,
        pageSize: DEFAULT_PAGE_SIZE,
        search: appliedFilters.employeeSearch || undefined,
        filters: filters.length > 0 ? filters : undefined,
      });
      if (!response.isSuccess) {
        throw new Error(response.message || "Failed to fetch attendances");
      }
      return response.data;
    },
  });

  const attendances = data?.items || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 1;
  const currentPage = data?.pageNumber || 1;

  const handleFilter = () => {
    setPage(1);
    setAppliedFilters({
      dateRange,
      employeeSearch,
      statusFilter,
    });
  };

  const handleExport = async () => {
    try {
      const filters: string[] = [];
      if (appliedFilters.statusFilter !== "all") {
        filters.push(`status==${appliedFilters.statusFilter}`);
      }
      if (appliedFilters.dateRange?.from) {
        filters.push(`date>=${appliedFilters.dateRange.from.toISOString()}`);
      }
      if (appliedFilters.dateRange?.to) {
        filters.push(`date<=${appliedFilters.dateRange.to.toISOString()}`);
      }

      const blob = await attendanceService.exportReport({
        search: appliedFilters.employeeSearch || undefined,
        filters: filters.length > 0 ? filters : undefined,
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Bao_Cao_Diem_Danh.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(UI_TEXT.ATTENDANCE.EXPORT_SUCCESS);
    } catch {
      toast.error(UI_TEXT.ATTENDANCE.EXPORT_FAILURE);
    }
  };

  const startDisplay = (currentPage - 1) * DEFAULT_PAGE_SIZE + 1;
  const endDisplay = Math.min(currentPage * DEFAULT_PAGE_SIZE, totalCount);
  const displayInfo =
    totalCount > 0
      ? `${UI_TEXT.COMMON.DISPLAY} ${startDisplay} - ${endDisplay} / ${totalCount}`
      : UI_TEXT.ATTENDANCE.TABLE_EMPTY;

  // Mocking Stats logic to show the screenshot numbers
  const mockStats = {
    totalStaff: 42,
    totalStaffChange: "+2 tháng này",
    onTimePercent: 94,
    latePercent: 6,
    estimatedPenalty: 2450000,
  };

  return (
    <div className="flex flex-col gap-6 py-6 ring-offset-background max-w-full overflow-x-hidden h-full overflow-y-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-slate-400 mt-1 font-bold text-xs uppercase tracking-widest">
            {UI_TEXT.SIDE_BAR.DASHBOARD}
          </p>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {UI_TEXT.ATTENDANCE.REPORT_TITLE}
          </h1>
        </div>

        <Button
          onClick={handleExport}
          className="bg-white border hover:bg-slate-50 text-slate-700 h-11 px-6 rounded-xl font-bold gap-2 text-sm shadow-sm transition-all active:scale-[0.98]"
        >
          <Download className="size-4" />
          {UI_TEXT.ATTENDANCE.EXPORT_EXCEL}
        </Button>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <AttendanceFilter
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          employeeSearch={employeeSearch}
          onEmployeeSearchChange={setEmployeeSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onFilter={handleFilter}
        />
      </div>

      <div className="w-full">
        <AttendanceTable attendances={attendances} isLoading={isLoading} />
      </div>

      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-100">
        <p className="text-sm text-slate-500 font-medium">{displayInfo}</p>
        <Pagination className="w-auto ml-0">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) setPage(page - 1);
                }}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === i + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page < totalPages) setPage(page + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <AttendanceStats
        totalStaff={mockStats.totalStaff}
        totalStaffChange={mockStats.totalStaffChange}
        onTimePercent={mockStats.onTimePercent}
        latePercent={mockStats.latePercent}
        estimatedPenalty={mockStats.estimatedPenalty}
      />
    </div>
  );
};

export default AttendancePage;

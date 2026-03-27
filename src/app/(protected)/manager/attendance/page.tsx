"use client";

import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";

import AttendanceFilter from "@/components/features/Attendance/AttendanceFilter";
import AttendanceTable from "@/components/features/Attendance/AttendanceTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

const formatDate = (date: Date) => {
  const d = new Date(date);
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

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

      const startDate = appliedFilters.dateRange?.from
        ? formatDate(appliedFilters.dateRange.from)
        : undefined;
      const endDate = appliedFilters.dateRange?.to
        ? formatDate(appliedFilters.dateRange.to)
        : undefined;
      const date = startDate && !endDate ? startDate : undefined;

      const response = await attendanceService.getReport({
        pageNumber: page,
        pageSize: DEFAULT_PAGE_SIZE,
        search: appliedFilters.employeeSearch || undefined,
        filters: filters.length > 0 ? filters : undefined,
        date,
        startDate: !date ? startDate : undefined,
        endDate: !date ? endDate : undefined,
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

      const startDate = appliedFilters.dateRange?.from
        ? formatDate(appliedFilters.dateRange.from)
        : undefined;
      const endDate = appliedFilters.dateRange?.to
        ? formatDate(appliedFilters.dateRange.to)
        : undefined;
      const date = startDate && !endDate ? startDate : undefined;

      const blob = await attendanceService.exportReport({
        search: appliedFilters.employeeSearch || undefined,
        filters: filters.length > 0 ? filters : undefined,
        date,
        startDate: !date ? startDate : undefined,
        endDate: !date ? endDate : undefined,
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

  return (
    <div className="flex flex-col gap-6 px-4 py-4 h-full overflow-y-auto no-scrollbar pb-10 animate-in fade-in duration-500">
      <Card className="border-none shadow-sm rounded-3xl overflow-hidden py-4">
        <CardContent className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
          <div className="flex-1 w-full">
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
          <Button
            onClick={handleExport}
            variant="outline"
            className="h-11 px-6 rounded-2xl font-bold gap-2 text-sm border-slate-100 text-slate-700 hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-[0.98] w-full xl:w-auto mt-2 xl:mt-0"
          >
            <Download className="size-4" />
            {UI_TEXT.ATTENDANCE.EXPORT_EXCEL}
          </Button>
        </CardContent>
      </Card>

      <div className="w-full">
        <AttendanceTable attendances={attendances} isLoading={isLoading} />
      </div>

      <Card className="border-none shadow-sm rounded-3xl overflow-hidden py-4">
        <CardContent className="flex items-center justify-between">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendancePage;

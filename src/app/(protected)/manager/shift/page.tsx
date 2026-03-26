"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";

import ShiftActionBar from "@/components/features/Shift/ShiftActionBar";
import ShiftDialog from "@/components/features/Shift/ShiftDialog";
import ShiftTable from "@/components/features/Shift/ShiftTable";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { UI_TEXT } from "@/lib/UI_Text";
import { shiftService } from "@/services/shiftService";
import { Shift, ShiftStatus } from "@/types/Shift";

const DEFAULT_PAGE_SIZE = 10;

const ShiftPage = () => {
  const [page, setPage] = useState(1);
  const [editingShift, setEditingShift] = useState<Shift | undefined>();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["shifts", page],
    queryFn: async () => {
      const response = await shiftService.getShifts({
        pageNumber: page,
        pageSize: DEFAULT_PAGE_SIZE,
      });
      if (!response.isSuccess) {
        throw new Error(response.message || UI_TEXT.COMMON.ERROR_UNKNOWN);
      }
      return response.data;
    },
  });

  const shifts = data?.items || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 1;
  const currentPage = data?.pageNumber || 1;

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      const response = await shiftService.updateShiftStatus(id, isActive);
      if (response.isSuccess) {
        toast.success(UI_TEXT.COMMON.UPDATE_SUCCESS);
        void refetch();
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa ca làm việc này?")) return;
    try {
      const response = await shiftService.deleteShift(id);
      if (response.isSuccess) {
        toast.success("Xóa ca làm việc thành công");
        void refetch();
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleExport = () => {
    if (!shifts.length) {
      toast.error("Không có dữ liệu để xuất");
      return;
    }
    const headers = ["Tên ca làm việc", "Giờ bắt đầu", "Giờ kết thúc", "Trạng thái"];
    const csvContent = [
      headers.join(","),
      ...shifts.map(
        (s: Shift) =>
          `"${s.name}","${s.startTime}","${s.endTime}","${s.status === ShiftStatus.ACTIVE ? "Đang hoạt động" : "Không hoạt động"}"`
      ),
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "danh-sach-ca-lam-viec.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const startDisplay = (currentPage - 1) * DEFAULT_PAGE_SIZE + 1;
  const endDisplay = Math.min(currentPage * DEFAULT_PAGE_SIZE, totalCount);
  const displayInfo = `${UI_TEXT.COMMON.DISPLAY} ${startDisplay}-${endDisplay} / ${totalCount}`;

  return (
    <div className="flex flex-col gap-6 py-6 ring-offset-background max-w-full overflow-x-hidden h-full overflow-y-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-slate-400 mt-1 font-bold text-xs uppercase tracking-widest">
            {UI_TEXT.SCHEDULE.ADMIN_TITLE}
          </p>
          <p className="text-slate-500 mt-1 font-medium italic">{UI_TEXT.SHIFT.PAGE_DESC}</p>
        </div>
        <ShiftDialog onSuccess={() => void refetch()} />
        <ShiftDialog
          shift={editingShift}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSuccess={() => {
            setIsEditDialogOpen(false);
            void refetch();
          }}
        />
      </div>

      <div className="flex flex-col xl:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <ShiftActionBar onSearch={(v) => console.log("Search:", v)} onExport={handleExport} />
      </div>

      <div className="w-full">
        <ShiftTable
          shifts={shifts}
          onEdit={(s) => {
            setEditingShift(s);
            setIsEditDialogOpen(true);
          }}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          isLoading={isLoading}
        />
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
    </div>
  );
};

export default ShiftPage;

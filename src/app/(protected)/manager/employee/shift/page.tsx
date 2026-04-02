"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";

import ShiftActionBar from "@/components/features/Shift/ShiftActionBar";
import ShiftDialog from "@/components/features/Shift/ShiftDialog";
import ShiftTable from "@/components/features/Shift/ShiftTable";
import PaginationTable from "@/components/shared/PaginationTable";
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
    if (!confirm(UI_TEXT.COMMON.DELETE_CONFIRM)) return;
    try {
      const response = await shiftService.deleteShift(id);
      if (response.isSuccess) {
        toast.success(UI_TEXT.SHIFT.DELETE_SUCCESS);
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

  return (
    <div className="px-4 space-y-3 py-4 animate-in fade-in duration-500">
      <ShiftActionBar
        onExport={handleExport}
        rightActions={
          <div className="flex items-center gap-2">
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
        }
      />

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

      {/* <Card className="border shadow-sm rounded-2xl overflow-hidden bg-background">
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
      </Card> */}

      {totalPages > 1 && (
        <PaginationTable currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  );
};

export default ShiftPage;

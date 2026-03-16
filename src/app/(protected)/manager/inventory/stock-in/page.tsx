"use client";

import { RotateCcw, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { CreateStockInTrigger } from "@/components/features/inventory/components/CreateStockInTrigger";
import { InventoryPagination } from "@/components/features/inventory/components/InventoryPagination";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UI_TEXT } from "@/lib/UI_Text";
import { stockInService } from "@/services/stock-in.service";
import { stockOutService } from "@/services/stock-out.service";
import { StockInReceipt } from "@/types/StockIn";
import { StockOutReceipt } from "@/types/StockOut";

import { StockOutListTable } from "../stock-out/_components/StockOutListTable";
import { StockInListTable } from "./_components/StockInListTable";

const SEARCH_RECEIPT_PLACEHOLDER = "Tìm mã phiếu...";
const START_DATE_LABEL = "Từ ngày";
const END_DATE_LABEL = "Đến ngày";
const RESET_FILTER_LABEL = "Reset";

type ReceiptType = "in" | "out";

export default function StockInPage() {
  const router = useRouter();
  const [receiptType, setReceiptType] = useState<ReceiptType>("in");
  const [stockInData, setStockInData] = useState<StockInReceipt[]>([]);
  const [stockOutData, setStockOutData] = useState<StockOutReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Delete Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [receiptToDelete, setReceiptToDelete] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (receiptType === "in") {
        const response = await stockInService.getReceipts(
          currentPage,
          10,
          search || undefined,
          startDate || undefined,
          endDate || undefined
        );

        if (response.isSuccess && response.data) {
          setStockInData(response.data.items);
          setTotalPages(response.data.totalPages);
        }
      } else {
        const response = await stockOutService.getReceipts(
          currentPage,
          10,
          search || undefined,
          startDate || undefined,
          endDate || undefined
        );

        if (response.isSuccess && response.data) {
          setStockOutData(response.data.items);
          setTotalPages(response.data.totalPages);
        }
      }
    } catch (error) {
      console.error("Failed to fetch receipts:", error);
      toast.error(error instanceof Error ? error.message : UI_TEXT.API.NETWORK_ERROR);
    } finally {
      setLoading(false);
    }
  }, [currentPage, endDate, receiptType, search, startDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleViewDetail = (id: string) => {
    if (receiptType === "in") {
      router.push(`/manager/inventory/stock-in/${id}`);
    } else {
      router.push(`/manager/inventory/stock-out/${id}`);
    }
  };

  const handleDeleteTrigger = (id: string) => {
    setReceiptToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!receiptToDelete) return;

    try {
      if (receiptType === "in") {
        await stockInService.deleteReceipt(receiptToDelete);
        toast.success("Đã hủy phiếu nhập kho thành công");
      } else {
        await stockOutService.deleteReceipt(receiptToDelete);
        toast.success("Đã xóa phiếu xuất kho thành công");
      }
      await fetchData();
    } catch (error) {
      console.error("Failed to reverse receipt:", error);
      toast.error(error instanceof Error ? error.message : UI_TEXT.API.NETWORK_ERROR);
    } finally {
      setReceiptToDelete(null);
    }
  };

  return (
    <div className="flex flex-1 flex-col min-h-0 bg-slate-50/30">
      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Xác nhận hủy phiếu"
        description="Bạn có chắc chắn muốn hủy phiếu này không? Hành động này sẽ hoàn tác các thay đổi tồn kho liên quan."
      />
      <div className="space-y-4 p-6 pb-0">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Tabs
            value={receiptType}
            onValueChange={(v) => {
              setReceiptType(v as ReceiptType);
              setCurrentPage(1);
            }}
            className="w-full lg:w-auto"
          >
            <TabsList className="grid w-full max-w-[320px] grid-cols-2 rounded-2xl bg-slate-100">
              <TabsTrigger
                value="in"
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow"
              >
                {UI_TEXT.INVENTORY.VOUCHER.TYPE_IN}
              </TabsTrigger>
              <TabsTrigger
                value="out"
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow"
              >
                {UI_TEXT.INVENTORY.VOUCHER.TYPE_OUT}
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <CreateStockInTrigger onSuccess={fetchData} />
        </div>

        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="receipt-search"
              placeholder={SEARCH_RECEIPT_PLACEHOLDER}
              className="h-11 rounded-2xl border-slate-100 bg-white pl-10 focus-visible:ring-primary/20"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex items-center gap-2 lg:w-[250px]">
            <Label
              htmlFor="receipt-start-date"
              className="shrink-0 text-sm font-medium text-slate-600"
            >
              {START_DATE_LABEL}
            </Label>
            <Input
              id="receipt-start-date"
              type="date"
              aria-label={START_DATE_LABEL}
              className="h-11 rounded-2xl border-slate-100 bg-white focus-visible:ring-primary/20"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex items-center gap-2 lg:w-[250px]">
            <Label
              htmlFor="receipt-end-date"
              className="shrink-0 text-sm font-medium text-slate-600"
            >
              {END_DATE_LABEL}
            </Label>
            <Input
              id="receipt-end-date"
              type="date"
              aria-label={END_DATE_LABEL}
              className="h-11 rounded-2xl border-slate-100 bg-white focus-visible:ring-primary/20"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <Button
            variant="outline"
            className="h-11 w-11 shrink-0 rounded-2xl border-slate-100 p-0"
            onClick={() => {
              setStartDate("");
              setEndDate("");
              setSearch("");
              setCurrentPage(1);
            }}
            title={RESET_FILTER_LABEL}
          >
            <RotateCcw className="h-4 w-4 text-slate-500" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col space-y-6 overflow-auto p-6">
        <div className="flex flex-1 flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm shadow-slate-100/60">
          <div className="min-h-[400px] flex-1 overflow-auto">
            {loading ? (
              <div className="flex h-full items-center justify-center text-slate-400">
                {UI_TEXT.COMMON.LOADING}
              </div>
            ) : receiptType === "in" ? (
              <StockInListTable
                data={stockInData}
                onViewDetail={handleViewDetail}
                onDelete={handleDeleteTrigger}
              />
            ) : (
              <StockOutListTable
                data={stockOutData}
                onViewDetail={handleViewDetail}
                onDelete={handleDeleteTrigger}
              />
            )}
          </div>

          <InventoryPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrev={() => setCurrentPage((page) => Math.max(1, page - 1))}
            onNext={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useQueryClient } from "@tanstack/react-query";
import { RotateCcw, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { CreateStockInTrigger } from "@/components/features/inventory/components/CreateStockInTrigger";
import { InventoryPagination } from "@/components/features/inventory/components/InventoryPagination";
import {
  INVENTORY_ICON_BUTTON_CLASS,
  INVENTORY_INPUT_CLASS,
} from "@/components/features/inventory/components/inventoryStyles";
import { InventoryToolbar } from "@/components/features/inventory/components/InventoryToolbar";
import { invalidateInventoryQueries } from "@/components/features/inventory/inventoryQueryInvalidation";
import { StockInListTable } from "@/components/features/inventory/StockInListTable";
import { StockOutListTable } from "@/components/features/inventory/StockOutListTable";
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

const SEARCH_RECEIPT_PLACEHOLDER = "Tìm mã phiếu...";
const START_DATE_LABEL = "Từ ngày";
const END_DATE_LABEL = "Đến ngày";
const RESET_FILTER_LABEL = "Reset";

type ReceiptType = "in" | "out";

export default function StockInPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [receiptType, setReceiptType] = useState<ReceiptType>("in");
  const [stockInData, setStockInData] = useState<StockInReceipt[]>([]);
  const [stockOutData, setStockOutData] = useState<StockOutReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
          setTotalItems(response.data.totalCount);
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
          setTotalItems(response.data.totalCount);
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
      await invalidateInventoryQueries(queryClient);
      await fetchData();
    } catch (error) {
      console.error("Failed to reverse receipt:", error);
      toast.error(error instanceof Error ? error.message : UI_TEXT.API.NETWORK_ERROR);
    } finally {
      setReceiptToDelete(null);
    }
  };

  return (
    <div className="flex flex-1 min-h-0 flex-col bg-background">
      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Xác nhận hủy phiếu"
        description="Bạn có chắc chắn muốn hủy phiếu này không? Hành động này sẽ hoàn tác các thay đổi tồn kho liên quan."
      />

      <div className="p-6">
        <InventoryToolbar
          actions={
            <div className="flex items-center gap-3">
              <Tabs
                value={receiptType}
                onValueChange={(v) => {
                  setReceiptType(v as ReceiptType);
                  setCurrentPage(1);
                }}
                className="shrink-0"
              >
                <TabsList className="inline-flex h-11 bg-muted/50 p-1 border">
                  <TabsTrigger
                    value="in"
                    className="h-full rounded-lg px-4 text-xs font-black uppercase tracking-widest transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm"
                  >
                    {UI_TEXT.INVENTORY.VOUCHER.TYPE_IN}
                  </TabsTrigger>
                  <TabsTrigger
                    value="out"
                    className="h-full rounded-lg px-4 text-xs font-black uppercase tracking-widest transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm"
                  >
                    {UI_TEXT.INVENTORY.VOUCHER.TYPE_OUT}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <CreateStockInTrigger onSuccess={fetchData} />
            </div>
          }
        >
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
            <Input
              id="receipt-search"
              placeholder={SEARCH_RECEIPT_PLACEHOLDER}
              className={`${INVENTORY_INPUT_CLASS} h-11 pl-10 bg-muted/20 border-border/50 focus:bg-background transition-colors`}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="receipt-start-date"
                className="shrink-0 text-[10px] font-black uppercase tracking-widest text-muted-foreground/70"
              >
                {START_DATE_LABEL}
              </Label>
              <Input
                id="receipt-start-date"
                type="date"
                aria-label={START_DATE_LABEL}
                className={`${INVENTORY_INPUT_CLASS} h-11 w-[160px] bg-muted/20 border-border/50 focus:bg-background`}
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="flex items-center gap-2">
              <Label
                htmlFor="receipt-end-date"
                className="shrink-0 text-[10px] font-black uppercase tracking-widest text-muted-foreground/70"
              >
                {END_DATE_LABEL}
              </Label>
              <Input
                id="receipt-end-date"
                type="date"
                aria-label={END_DATE_LABEL}
                className={`${INVENTORY_INPUT_CLASS} h-11 w-[160px] bg-muted/20 border-border/50 focus:bg-background`}
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <Button
              variant="ghost"
              className={`${INVENTORY_ICON_BUTTON_CLASS} h-11 w-11 rounded-xl border border-border/50 bg-muted/20 hover:bg-background text-muted-foreground`}
              onClick={() => {
                setStartDate("");
                setEndDate("");
                setSearch("");
                setCurrentPage(1);
              }}
              title={RESET_FILTER_LABEL}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </InventoryToolbar>

        <div className="mt-6">
          <div className="rounded-[2rem] border bg-card shadow-sm overflow-hidden min-h-[500px] flex flex-col">
            <div className="flex-1 overflow-auto">
              {loading ? (
                <div className="flex h-full items-center justify-center p-20">
                  <div className="flex flex-col items-center gap-4 text-muted-foreground/30 animate-pulse">
                    <RotateCcw className="h-10 w-10 animate-spin" />
                    <span className="text-sm font-black uppercase tracking-widest">
                      {UI_TEXT.COMMON.LOADING}
                    </span>
                  </div>
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

            <div className="shrink-0 border-t border-border/50 bg-muted/5">
              <InventoryPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={10}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

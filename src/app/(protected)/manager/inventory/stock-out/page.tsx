"use client";

import { useQueryClient } from "@tanstack/react-query";
import { RotateCcw, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { InventoryPagination } from "@/components/features/inventory/components/InventoryPagination";
import {
  INVENTORY_ICON_BUTTON_CLASS,
  INVENTORY_INPUT_CLASS,
} from "@/components/features/inventory/components/inventoryStyles";
import { InventoryToolbar } from "@/components/features/inventory/components/InventoryToolbar";
import { CreateStockOutDrawer } from "@/components/features/inventory/CreateStockOutDrawer";
import { invalidateInventoryQueries } from "@/components/features/inventory/inventoryQueryInvalidation";
import { StockOutListTable } from "@/components/features/inventory/StockOutListTable";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UI_TEXT } from "@/lib/UI_Text";
import { stockOutService } from "@/services/stock-out.service";
import { StockOutReceipt } from "@/types/StockOut";

const SEARCH_RECEIPT_PLACEHOLDER = "Tìm mã phiếu...";
const START_DATE_LABEL = "Từ ngày";
const END_DATE_LABEL = "Đến ngày";
const RESET_FILTER_LABEL = "Reset";

export default function StockOutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [data, setData] = useState<StockOutReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [receiptToDelete, setReceiptToDelete] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await stockOutService.getReceipts(
        currentPage,
        10,
        search || undefined,
        startDate || undefined,
        endDate || undefined
      );

      if (response.isSuccess && response.data) {
        setData(response.data.items);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.totalCount);
      }
    } catch (error) {
      console.error("Failed to fetch stock out receipts:", error);
      toast.error(error instanceof Error ? error.message : UI_TEXT.API.NETWORK_ERROR);
    } finally {
      setLoading(false);
    }
  }, [currentPage, endDate, search, startDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleViewDetail = (id: string) => {
    router.push(`/manager/inventory/stock-out/${id}`);
  };

  const handleDeleteTrigger = (id: string) => {
    setReceiptToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!receiptToDelete) return;

    try {
      await stockOutService.deleteReceipt(receiptToDelete);
      await invalidateInventoryQueries(queryClient);
      toast.success("Đã xóa phiếu xuất kho thành công");
      await fetchData();
    } catch (error) {
      console.error("Failed to reverse stock out receipt:", error);
      toast.error(error instanceof Error ? error.message : UI_TEXT.API.NETWORK_ERROR);
    } finally {
      setReceiptToDelete(null);
    }
  };

  return (
    <div className="flex flex-1 min-h-0 flex-col bg-background p-6">
      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa phiếu"
        description="Bạn có chắc chắn muốn xóa phiếu xuất kho này không? Hành động này sẽ hoàn tác các thay đổi tồn kho liên quan."
      />

      <InventoryToolbar
        actions={
          <CreateStockOutDrawer
            onSuccess={fetchData}
            open={isCreateOpen}
            onOpenChange={setIsCreateOpen}
          />
        }
      >
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
          <Input
            id="stock-out-search"
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
              htmlFor="stock-out-start-date"
              className="shrink-0 text-[10px] font-black uppercase tracking-widest text-muted-foreground/70"
            >
              {START_DATE_LABEL}
            </Label>
            <Input
              id="stock-out-start-date"
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
              htmlFor="stock-out-end-date"
              className="shrink-0 text-[10px] font-black uppercase tracking-widest text-muted-foreground/70"
            >
              {END_DATE_LABEL}
            </Label>
            <Input
              id="stock-out-end-date"
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

      <div className="mt-6 flex-1 min-h-0 flex flex-col">
        <div className="rounded-[2.5rem] border bg-card shadow-sm overflow-hidden flex flex-col flex-1">
          <div className="flex-1 overflow-auto bg-card/40">
            {loading ? (
              <div className="flex h-full items-center justify-center p-20">
                <div className="flex flex-col items-center gap-4 text-muted-foreground/30 animate-pulse">
                  <RotateCcw className="h-10 w-10 animate-spin" />
                  <span className="text-sm font-black uppercase tracking-widest">
                    {UI_TEXT.COMMON.LOADING}
                  </span>
                </div>
              </div>
            ) : (
              <StockOutListTable
                data={data}
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
  );
}

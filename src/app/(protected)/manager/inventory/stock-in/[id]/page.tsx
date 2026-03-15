"use client";

import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { toast } from "sonner";

import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";
import { stockInService } from "@/services/stock-in.service";
import { StockInReceipt } from "@/types/StockIn";

import { StockInDetailView } from "../_components/StockInDetailView";

export default function StockInDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [receipt, setReceipt] = useState<StockInReceipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const response = await stockInService.getReceiptById(id);
        if (response.isSuccess && response.data) {
          setReceipt(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch receipt:", error);
        toast.error(error instanceof Error ? error.message : UI_TEXT.API.NETWORK_ERROR);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [id]);

  const handleConfirmDelete = async () => {
    if (!receipt) return;
    try {
      const response = await stockInService.deleteReceipt(receipt.id);
      if (response.isSuccess) {
        toast.success("Đã hủy phiếu nhập kho thành công");
        router.push("/manager/inventory/stock-in");
      }
    } catch (error) {
      console.error("Failed to delete receipt:", error);
      toast.error(error instanceof Error ? error.message : UI_TEXT.API.NETWORK_ERROR);
    }
  };

  if (loading) return <div>{UI_TEXT.COMMON.LOADING}</div>;
  if (!receipt) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">{UI_TEXT.INVENTORY.OPENING_STOCK.EMPTY_SEARCH}</p>
        <Button
          variant="outline"
          onClick={() => {
            router.push("/manager/inventory/stock-in");
          }}
          className="mt-4"
        >
          {UI_TEXT.COMMON.BACK}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Xác nhận hủy phiếu"
        description="Bạn có chắc chắn muốn hủy phiếu nhập kho này không? Hành động này sẽ hoàn tác các thay đổi tồn kho liên quan."
      />
      <StockInDetailView
        receipt={receipt}
        onBack={() => {
          router.push("/manager/inventory/stock-in");
        }}
        onDelete={() => setIsDeleteDialogOpen(true)}
      />
    </div>
  );
}

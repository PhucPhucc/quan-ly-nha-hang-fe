"use client";

import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { toast } from "sonner";

import { StockOutDetailView } from "@/components/features/inventory/StockOutDetailView";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";
import { stockOutService } from "@/services/stock-out.service";
import { StockOutReceipt } from "@/types/StockOut";

export default function StockOutDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [receipt, setReceipt] = useState<StockOutReceipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const response = await stockOutService.getReceiptById(id);
        if (response.isSuccess && response.data) {
          setReceipt(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch stock out receipt:", error);
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
      const response = await stockOutService.deleteReceipt(receipt.id);
      if (response.isSuccess) {
        toast.success("Đã xóa phiếu xuất kho thành công");
        router.push("/manager/inventory/stock-out");
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
            router.push("/manager/inventory/stock-out");
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
        title="Xác nhận xóa phiếu"
        description="Bạn có chắc chắn muốn xóa phiếu xuất kho này không? Hành động này sẽ hoàn tác các thay đổi tồn kho liên quan."
      />
      <StockOutDetailView
        receipt={receipt}
        onBack={() => {
          router.push("/manager/inventory/stock-out");
        }}
        onDelete={() => setIsDeleteDialogOpen(true)}
      />
    </div>
  );
}

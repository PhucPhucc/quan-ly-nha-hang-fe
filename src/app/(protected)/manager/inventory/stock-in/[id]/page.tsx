import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";
import { stockInService } from "@/services/stock-in.service";
import { StockInReceipt } from "@/types/StockIn";

import { StockInDetailView } from "../_components/StockInDetailView";

export default function StockInDetailPage({ params }: { params: { id: string } }) {
  const [receipt, setReceipt] = useState<StockInReceipt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const response = await stockInService.getReceiptById(params.id);
        if (response.isSuccess && response.data) {
          setReceipt(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch receipt:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [params.id]);

  if (loading) return <div>{UI_TEXT.COMMON.LOADING}</div>;
  if (!receipt) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">{UI_TEXT.INVENTORY.OPENING_STOCK.EMPTY_SEARCH}</p>
        <Button
          variant="outline"
          onClick={() => {
            window.location.href = "/manager/inventory/stock-in";
          }}
          className="mt-4"
        >
          {UI_TEXT.COMMON.BACK}
        </Button>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!confirm(UI_TEXT.COMMON.DELETE_CONFIRM)) return;
    try {
      const response = await stockInService.deleteReceipt(receipt.id);
      if (response.isSuccess) {
        window.location.href = "/manager/inventory/stock-in";
      }
    } catch (error) {
      console.error("Failed to delete receipt:", error);
    }
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      <StockInDetailView
        receipt={receipt}
        onBack={() => {
          window.location.href = "/manager/inventory/stock-in";
        }}
        onDelete={handleDelete}
      />
    </div>
  );
}

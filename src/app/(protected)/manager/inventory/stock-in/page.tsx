"use client";

import React, { useEffect, useState } from "react";

import { UI_TEXT } from "@/lib/UI_Text";
import { stockInService } from "@/services/stock-in.service";
import { StockInReceipt } from "@/types/StockIn";

import { StockInTable } from "./_components/StockInTable";

export default function StockInPage() {
  const [data, setData] = useState<StockInReceipt[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await stockInService.getReceipts();
      if (response.isSuccess && response.data) {
        setData(response.data.items);
      }
    } catch (error) {
      console.error("Failed to fetch stock in receipts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleViewDetail = (id: string) => {
    window.location.href = `/manager/inventory/stock-in/${id}`;
  };

  return (
    <>
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {loading ? (
          <div>{UI_TEXT.COMMON.LOADING}</div>
        ) : (
          <StockInTable
            data={data}
            onViewDetail={handleViewDetail}
            onDelete={(id) => console.log("Delete", id)}
          />
        )}
      </div>
    </>
  );
}

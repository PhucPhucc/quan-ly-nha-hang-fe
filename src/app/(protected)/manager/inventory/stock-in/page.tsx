"use client";

import { format } from "date-fns";
import { Search } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

import { CreateStockInTrigger } from "@/components/features/inventory/components/CreateStockInTrigger";
import { InventoryPagination } from "@/components/features/inventory/components/InventoryPagination";
import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { Input } from "@/components/ui/input";
import { UI_TEXT } from "@/lib/UI_Text";
import { stockInService } from "@/services/stock-in.service";
import { StockInReceipt } from "@/types/StockIn";

import { StockInTable } from "./_components/StockInTable";

export default function StockInPage() {
  const [data, setData] = useState<StockInReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await stockInService.getReceipts(
        currentPage,
        10,
        search || undefined,
        dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
        dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined
      );
      if (response.isSuccess && response.data) {
        setData(response.data.items);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch stock in receipts:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, dateRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleViewDetail = (id: string) => {
    window.location.href = `/manager/inventory/stock-in/${id}`;
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50/30">
      {/* Search & Filter Header */}
      <div className="p-6 pb-0 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-1 flex-col sm:flex-row gap-3 w-full max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Tìm mã phiếu..."
                className="pl-10 h-11 rounded-2xl bg-white border-slate-100 focus-visible:ring-primary/20"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <DateRangePicker
              className="w-full sm:w-[300px]"
              value={dateRange}
              onChange={(range) => {
                setDateRange(range);
                setCurrentPage(1);
              }}
            />
          </div>
          <CreateStockInTrigger onSuccess={fetchData} />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6 flex flex-col">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm shadow-slate-100/60 overflow-hidden flex flex-col flex-1">
          <div className="flex-1 overflow-auto min-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-full text-slate-400">
                {UI_TEXT.COMMON.LOADING}
              </div>
            ) : (
              <StockInTable
                data={data}
                onViewDetail={handleViewDetail}
                onDelete={(id) => console.log("Delete", id)}
              />
            )}
          </div>

          <InventoryPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
            onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          />
        </div>
      </div>
    </div>
  );
}

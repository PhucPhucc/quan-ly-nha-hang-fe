"use client";

import { RefreshCcw, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import {
  INVENTORY_ICON_BUTTON_CLASS,
  INVENTORY_INPUT_CLASS,
  INVENTORY_PAGE_CLASS,
  INVENTORY_TABLE_SURFACE_CLASS,
} from "@/components/features/inventory/components/inventoryStyles";
import { InventoryToolbar } from "@/components/features/inventory/components/InventoryToolbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";
import { OrderAuditLogResponse, orderService } from "@/services/orderService";

import { InventoryPagination } from "../../inventory/components/InventoryPagination";
import { OrderAuditLogDetailSheet } from "./OrderAuditLogDetailSheet";
import { OrderAuditLogTable } from "./OrderAuditLogTable";

const PAGE_SIZE = 15;

export default function OrderAuditLogPage() {
  const [orderId, setOrderId] = useState("");
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [logs, setLogs] = useState<OrderAuditLogResponse[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<OrderAuditLogResponse | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const searchParams = useSearchParams();

  // 1. Initial order discovery logic
  useEffect(() => {
    let alive = true;

    const resolveOrder = async () => {
      // Priority 1: URL param
      const queryOrderId = searchParams.get("orderId")?.trim();
      if (queryOrderId) {
        if (!alive) return;
        setOrderId(queryOrderId);
        setActiveOrderId(queryOrderId);
        return;
      }

      // Priority 2: localStorage
      if (typeof window !== "undefined") {
        const storedOrderId = window.localStorage.getItem("foodhub:lastAuditOrderId")?.trim();
        if (storedOrderId) {
          if (!alive) return;
          setOrderId(storedOrderId);
          setActiveOrderId(storedOrderId);
          return;
        }
      }

      // Priority 3: Latest order from API
      try {
        const response = await orderService.getOrders({ pageNumber: 1, pageSize: 1 });
        if (!alive) return;

        const recentOrderId = response.data?.items?.[0]?.orderId;
        if (recentOrderId) {
          setOrderId(recentOrderId);
          setActiveOrderId(recentOrderId);
        }
      } catch (err) {
        console.error("Failed to fetch latest order for audit log discovery", err);
      }
    };

    resolveOrder();

    return () => {
      alive = false;
    };
  }, [searchParams]);

  // 2. Data fetching function
  const fetchLogs = useCallback(async (id: string, pageNum: number) => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const result = await orderService.getOrderAuditLogs(id, {
        pageNumber: pageNum,
        pageSize: PAGE_SIZE,
      });

      if (result.isSuccess && result.data) {
        setLogs(result.data.items || []);
        setTotalPages(result.data.totalPages || 1);
        setTotalItems(result.data.totalCount || 0);
      } else {
        setError(result.error || result.message || UI_TEXT.AUDIT_LOG.FETCH_ERROR);
        setLogs([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch {
      setError(UI_TEXT.AUDIT_LOG.FETCH_ERROR);
      setLogs([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Trigger fetch when ID or Page changes
  useEffect(() => {
    if (activeOrderId) {
      fetchLogs(activeOrderId, page);
    } else {
      setLogs([]);
      setTotalPages(1);
      setLoading(false);
      setError(null);
    }
  }, [activeOrderId, page, fetchLogs]);

  const handleSearch = () => {
    const trimmed = orderId.trim();
    if (trimmed !== activeOrderId) {
      setPage(1);
      setActiveOrderId(trimmed || null);
      if (typeof window !== "undefined" && trimmed) {
        window.localStorage.setItem("foodhub:lastAuditOrderId", trimmed);
      }
    } else {
      // Re-fetch current data
      fetchLogs(trimmed, 1);
    }
  };

  const handleRefresh = () => {
    if (activeOrderId) {
      fetchLogs(activeOrderId, page);
    }
  };

  const openDetails = (log: OrderAuditLogResponse) => {
    setSelectedLog(log);
    setIsSheetOpen(true);
  };

  return (
    <div className={INVENTORY_PAGE_CLASS}>
      <InventoryToolbar
        actions={
          <Button
            variant="outline"
            type="button"
            className={INVENTORY_ICON_BUTTON_CLASS}
            onClick={handleRefresh}
            title={UI_TEXT.COMMON.RESET}
          >
            <RefreshCcw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
        }
      >
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            className={cn(INVENTORY_INPUT_CLASS, "pl-9")}
            value={orderId}
            onChange={(event) => setOrderId(event.target.value)}
            placeholder="Nhập orderId hoặc dán từ URL"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch} disabled={loading}>
          {UI_TEXT.AUDIT_LOG.FILTER.APPLY}
        </Button>
      </InventoryToolbar>

      <div className={cn(INVENTORY_TABLE_SURFACE_CLASS, "mt-4")}>
        <OrderAuditLogTable
          logs={logs}
          loading={loading}
          error={error}
          onOpenDetails={openDetails}
          orderIdSelected={!!activeOrderId}
          noSurface
        />

        <div className="shrink-0 border-t border-border/50 bg-card">
          <InventoryPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={totalItems}
            pageSize={PAGE_SIZE}
          />
        </div>
      </div>

      <OrderAuditLogDetailSheet
        log={selectedLog}
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />
    </div>
  );
}

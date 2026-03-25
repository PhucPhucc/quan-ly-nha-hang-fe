"use client";

import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import {
  INVENTORY_ICON_BUTTON_CLASS,
  INVENTORY_INPUT_CLASS,
  INVENTORY_PAGE_CLASS,
  INVENTORY_SELECT_TRIGGER_CLASS,
  INVENTORY_TABLE_SURFACE_CLASS,
} from "@/components/features/inventory/components/inventoryStyles";
import { InventoryToolbar } from "@/components/features/inventory/components/InventoryToolbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";
import { OrderAuditLogResponse, OrderAuditLogsParams, orderService } from "@/services/orderService";

import { InventoryPagination } from "../../inventory/components/InventoryPagination";
import { OrderAuditLogDetailSheet } from "./OrderAuditLogDetailSheet";
import { OrderAuditLogTable } from "./OrderAuditLogTable";

const PAGE_SIZE = 15;

export default function OrderAuditLogPage() {
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [logs, setLogs] = useState<OrderAuditLogResponse[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<OrderAuditLogResponse | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [actionFilter, setActionFilter] = useState("all");
  const [searchFilter, setSearchFilter] = useState("");
  const searchParams = useSearchParams();

  // 1. Initial order discovery logic
  useEffect(() => {
    const queryOrderId = searchParams.get("orderId")?.trim();
    setActiveOrderId(queryOrderId || null);
  }, [searchParams]);

  // 2. Data fetching function
  const fetchLogs = useCallback(
    async (id: string | null, pageNum: number, action: string, search: string) => {
      try {
        setLoading(true);
        setError(null);

        const params: OrderAuditLogsParams = {
          pageNumber: pageNum,
          pageSize: PAGE_SIZE,
          search: search.trim() || undefined,
          action: action === "all" ? undefined : action,
        };

        const result = id
          ? await orderService.getOrderAuditLogs(id, params)
          : await orderService.getAllOrderAuditLogs(params);

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
    },
    []
  );

  // 3. Trigger fetch when ID, Page, Action or Search changes
  useEffect(() => {
    fetchLogs(activeOrderId, page, actionFilter, searchFilter);
  }, [activeOrderId, page, actionFilter, searchFilter, fetchLogs]);

  const handleRefresh = () => {
    setPage(1);
    fetchLogs(activeOrderId, 1, actionFilter, searchFilter);
  };

  const openDetails = (log: OrderAuditLogResponse) => {
    setSelectedLog(log);
    setIsSheetOpen(true);
  };

  return (
    <div className={INVENTORY_PAGE_CLASS}>
      <InventoryToolbar
        actions={
          <div className="flex items-center gap-2">
            <Select
              value={actionFilter}
              onValueChange={(v) => {
                setActionFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className={cn(INVENTORY_SELECT_TRIGGER_CLASS, "w-full sm:w-[200px]")}>
                <div className="flex items-center gap-2 text-slate-500">
                  <SlidersHorizontal className="h-4 w-4" />
                  <SelectValue placeholder={UI_TEXT.AUDIT_LOG.FILTER.ACTION_LABEL} />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl shadow-xl border-slate-200">
                <SelectItem value="all">{UI_TEXT.AUDIT_LOG.ALL_ACTION}</SelectItem>
                <SelectItem value="CREATE_ORDER">
                  {UI_TEXT.AUDIT_LOG.ACTIONS.CREATE_ORDER}
                </SelectItem>
                <SelectItem value="SUBMIT_ORDER">
                  {UI_TEXT.AUDIT_LOG.ACTIONS.SUBMIT_ORDER}
                </SelectItem>
                <SelectItem value="ADD_ORDER_ITEM">
                  {UI_TEXT.AUDIT_LOG.ACTIONS.ADD_ORDER_ITEM}
                </SelectItem>
                <SelectItem value="UPDATE_ORDER_ITEM">
                  {UI_TEXT.AUDIT_LOG.ACTIONS.UPDATE_ORDER_ITEM}
                </SelectItem>
                <SelectItem value="ADJUST_ORDER_ITEM_QUANTITY">
                  {UI_TEXT.AUDIT_LOG.ACTIONS.ADJUST_ORDER_ITEM_QUANTITY}
                </SelectItem>
                <SelectItem value="CANCEL_ORDER_ITEM">
                  {UI_TEXT.AUDIT_LOG.ACTIONS.CANCEL_ORDER_ITEM}
                </SelectItem>
                <SelectItem value="CANCEL_ORDER">
                  {UI_TEXT.AUDIT_LOG.ACTIONS.CANCEL_ORDER}
                </SelectItem>
                <SelectItem value="COMPLETE_ORDER">
                  {UI_TEXT.AUDIT_LOG.ACTIONS.COMPLETE_ORDER}
                </SelectItem>
                <SelectItem value="CHECKOUT_ORDER">
                  {UI_TEXT.AUDIT_LOG.ACTIONS.CHECKOUT_ORDER}
                </SelectItem>
                <SelectItem value="CHANGE_ORDER_TABLE">
                  {UI_TEXT.AUDIT_LOG.ACTIONS.CHANGE_ORDER_TABLE}
                </SelectItem>
                <SelectItem value="MERGE_ORDER">{UI_TEXT.AUDIT_LOG.ACTIONS.MERGE_ORDER}</SelectItem>
                <SelectItem value="SPLIT_ORDER">{UI_TEXT.AUDIT_LOG.ACTIONS.SPLIT_ORDER}</SelectItem>
                <SelectItem value="KDS_START_COOKING">
                  {UI_TEXT.AUDIT_LOG.ACTIONS.KDS_START_COOKING}
                </SelectItem>
                <SelectItem value="KDS_COMPLETE_COOKING">
                  {UI_TEXT.AUDIT_LOG.ACTIONS.KDS_COMPLETE_COOKING}
                </SelectItem>
                <SelectItem value="KDS_REJECT">{UI_TEXT.AUDIT_LOG.ACTIONS.KDS_REJECT}</SelectItem>
                <SelectItem value="ApplyPromotion">
                  {UI_TEXT.AUDIT_LOG.ACTIONS.APPLY_PROMOTION}
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              type="button"
              className={INVENTORY_ICON_BUTTON_CLASS}
              onClick={handleRefresh}
              title={UI_TEXT.COMMON.RESET}
            >
              <RotateCcw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
          </div>
        }
      >
        <div className="relative flex-1 group min-w-0">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
          <Input
            className={cn(INVENTORY_INPUT_CLASS, "pl-9")}
            value={searchFilter}
            onChange={(event) => setSearchFilter(event.target.value)}
            placeholder={UI_TEXT.AUDIT_LOG.FILTER.SEARCH_PLACEHOLDER}
            onKeyDown={(e) => e.key === "Enter" && setPage(1)}
          />
        </div>
      </InventoryToolbar>

      <div className={cn(INVENTORY_TABLE_SURFACE_CLASS, "mt-4")}>
        <OrderAuditLogTable
          logs={logs}
          loading={loading}
          error={error}
          onOpenDetails={openDetails}
          orderIdSelected={true}
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

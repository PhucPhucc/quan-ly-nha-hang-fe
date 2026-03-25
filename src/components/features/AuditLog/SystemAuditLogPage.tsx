"use client";

import { CalendarIcon, ChevronLeft, ChevronRight, RefreshCcw, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  INVENTORY_ICON_BUTTON_CLASS,
  INVENTORY_INPUT_CLASS,
  INVENTORY_PAGE_CLASS,
  INVENTORY_PAGINATION_BUTTON_CLASS,
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
import { getSystemAuditLogs, SystemAuditLog, SystemAuditLogParams } from "@/services/auditService";

import { AuditLogDetailSheet } from "./AuditLogDetailSheet";
import { AuditLogHeader } from "./AuditLogHeader";
import { AuditLogTable } from "./AuditLogTable";
import { toIsoDateEnd, toIsoDateStart } from "./AuditUtils";

type FilterState = {
  actionFilter: string;
  entityNameFilter: string;
  entityIdFilter: string;
  fromDate: string;
  toDate: string;
};

const PAGE_SIZE = 15;

const ENTITY_OPTIONS = [
  { value: "all", label: UI_TEXT.AUDIT_LOG.ENTITIES.ALL },
  { value: "Reservation", label: UI_TEXT.AUDIT_LOG.ENTITIES.RESERVATION },
  { value: "Table", label: UI_TEXT.AUDIT_LOG.ENTITIES.TABLE },
];

const ACTION_OPTIONS = [
  { value: "all", label: UI_TEXT.AUDIT_LOG.ACTIONS_LIST.ALL },
  { value: "Create", label: UI_TEXT.AUDIT_LOG.ACTIONS_LIST.CREATE },
  { value: "Update", label: UI_TEXT.AUDIT_LOG.ACTIONS_LIST.UPDATE },
  { value: "Delete", label: UI_TEXT.AUDIT_LOG.ACTIONS_LIST.DELETE },
  { value: "StatusChange", label: UI_TEXT.AUDIT_LOG.ACTIONS_LIST.STATUS_CHANGE },
  { value: "Cancel", label: UI_TEXT.AUDIT_LOG.ACTIONS_LIST.CANCEL },
  { value: "CheckIn", label: UI_TEXT.AUDIT_LOG.ACTIONS_LIST.CHECK_IN },
  { value: "NoShow", label: UI_TEXT.AUDIT_LOG.ACTIONS_LIST.NO_SHOW },
];

const DEFAULT_FILTERS: FilterState = {
  actionFilter: "all",
  entityNameFilter: "all",
  entityIdFilter: "",
  fromDate: "",
  toDate: "",
};

export default function SystemAuditLogPage() {
  const [draftFilters, setDraftFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [logs, setLogs] = useState<SystemAuditLog[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<SystemAuditLog | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const query = useMemo<SystemAuditLogParams>(
    () => ({
      pageNumber: page,
      pageSize: PAGE_SIZE,
      actionFilter: filters.actionFilter === "all" ? undefined : filters.actionFilter,
      entityNameFilter: filters.entityNameFilter === "all" ? undefined : filters.entityNameFilter,
      entityIdFilter: filters.entityIdFilter || undefined,
      fromDate: toIsoDateStart(filters.fromDate),
      toDate: toIsoDateEnd(filters.toDate),
    }),
    [filters, page]
  );

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getSystemAuditLogs(query);
        const data = response.data;
        setLogs(data.items ?? []);
        setTotalCount(data.totalCount ?? 0);
        setTotalPages(data.totalPages ?? 0);
      } catch (fetchError) {
        setLogs([]);
        setTotalCount(0);
        setTotalPages(0);
        setError(fetchError instanceof Error ? fetchError.message : UI_TEXT.AUDIT_LOG.FETCH_ERROR);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [query]);

  const resetFilters = () => {
    setPage(1);
    setDraftFilters(DEFAULT_FILTERS);
    setFilters(DEFAULT_FILTERS);
  };

  const applyFilters = useCallback((next: FilterState) => {
    setPage(1);
    setDraftFilters(next);
    setFilters(next);
  }, []);

  const openDetails = (log: SystemAuditLog) => {
    setSelectedLog(log);
    setIsSheetOpen(true);
  };

  return (
    <div className={INVENTORY_PAGE_CLASS}>
      <AuditLogHeader totalCount={totalCount} currentPage={page} pageSize={PAGE_SIZE} />

      <InventoryToolbar
        actions={
          <Button
            variant="outline"
            type="button"
            className={INVENTORY_ICON_BUTTON_CLASS}
            onClick={resetFilters}
            title={UI_TEXT.AUDIT_LOG.FILTER.RESET}
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        }
      >
        <Select
          value={draftFilters.entityNameFilter}
          onValueChange={(value) => {
            applyFilters({ ...draftFilters, entityNameFilter: value });
          }}
        >
          <SelectTrigger
            className={cn(INVENTORY_SELECT_TRIGGER_CLASS, "min-h-[40px] w-full sm:w-44")}
          >
            <SelectValue placeholder={UI_TEXT.AUDIT_LOG.ENTITIES.ALL} />
          </SelectTrigger>
          <SelectContent>
            {ENTITY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={draftFilters.actionFilter}
          onValueChange={(value) => {
            applyFilters({ ...draftFilters, actionFilter: value });
          }}
        >
          <SelectTrigger
            className={cn(INVENTORY_SELECT_TRIGGER_CLASS, "min-h-[40px] w-full sm:w-44")}
          >
            <SelectValue placeholder={UI_TEXT.AUDIT_LOG.ACTIONS_LIST.ALL} />
          </SelectTrigger>
          <SelectContent>
            {ACTION_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            className={cn(INVENTORY_INPUT_CLASS, "pl-9")}
            value={draftFilters.entityIdFilter}
            onChange={(event) => {
              applyFilters({ ...draftFilters, entityIdFilter: event.target.value });
            }}
            placeholder={UI_TEXT.AUDIT_LOG.ENTITY_ID}
          />
        </div>

        <div className="relative min-w-[180px]">
          <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="date"
            className={cn(INVENTORY_INPUT_CLASS, "pl-10")}
            value={draftFilters.fromDate}
            onChange={(event) => {
              applyFilters({ ...draftFilters, fromDate: event.target.value });
            }}
          />
        </div>

        <div className="relative min-w-[180px]">
          <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="date"
            className={cn(INVENTORY_INPUT_CLASS, "pl-10")}
            value={draftFilters.toDate}
            onChange={(event) => {
              applyFilters({ ...draftFilters, toDate: event.target.value });
            }}
          />
        </div>
      </InventoryToolbar>

      <div className={INVENTORY_TABLE_SURFACE_CLASS}>
        <AuditLogTable
          logs={logs}
          loading={loading}
          error={error}
          onOpenDetails={openDetails}
          noSurface
        />

        <div className="flex items-center justify-between border-t border-border/50 bg-card px-4 py-3 shadow-none">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {UI_TEXT.AUDIT_LOG.STATS.CURRENT_PAGE} {page}
            {totalPages > 0 ? ` / ${totalPages}` : ""}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className={cn(
                INVENTORY_PAGINATION_BUTTON_CLASS,
                "h-8 px-3 text-[10px] font-bold uppercase tracking-widest rounded-lg"
              )}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={loading || page <= 1}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              {UI_TEXT.AUDIT_LOG.PREVIOUS}
            </Button>
            <Button
              variant="outline"
              className={cn(
                INVENTORY_PAGINATION_BUTTON_CLASS,
                "h-8 px-3 text-[10px] font-bold uppercase tracking-widest rounded-lg"
              )}
              onClick={() => setPage((current) => current + 1)}
              disabled={loading || totalPages === 0 || page >= totalPages}
            >
              {UI_TEXT.AUDIT_LOG.NEXT}
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <AuditLogDetailSheet log={selectedLog} isOpen={isSheetOpen} onOpenChange={setIsSheetOpen} />
    </div>
  );
}

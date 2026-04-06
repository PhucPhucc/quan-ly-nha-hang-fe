"use client";

import { endOfDay, startOfDay } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";

import { INVENTORY_PAGE_CLASS } from "@/components/features/inventory/components/inventoryStyles";
import PaginationTable from "@/components/shared/PaginationTable";
import { UI_TEXT } from "@/lib/UI_Text";
import { getSystemAuditLogs, SystemAuditLog, SystemAuditLogParams } from "@/services/auditService";

import { AuditLogDetailSheet } from "./AuditLogDetailSheet";
import { AuditLogHeader } from "./AuditLogHeader";
import { AuditLogTable } from "./AuditLogTable";
import { AuditLogToolbar } from "./AuditLogToolbar";
import { AuditLogFilterState } from "./types";

const PAGE_SIZE = 15;

const ENTITY_OPTIONS = [
  { value: "all", label: UI_TEXT.AUDIT_LOG.ENTITIES.ALL },
  { value: "Reservation", label: UI_TEXT.AUDIT_LOG.ENTITIES.RESERVATION },
  { value: "Table", label: UI_TEXT.AUDIT_LOG.ENTITIES.TABLE },
  { value: "Order", label: UI_TEXT.AUDIT_LOG.ENTITIES.ORDER },
  { value: "Employee", label: UI_TEXT.AUDIT_LOG.ENTITIES.EMPLOYEE },
  { value: "User", label: UI_TEXT.AUDIT_LOG.ENTITIES.USER },
  { value: "Menu", label: UI_TEXT.AUDIT_LOG.ENTITIES.MENU },
  { value: "MenuItem", label: UI_TEXT.AUDIT_LOG.ENTITIES.MENU_ITEM },
  { value: "Area", label: UI_TEXT.AUDIT_LOG.ENTITIES.AREA },
  { value: "Promotion", label: UI_TEXT.AUDIT_LOG.ENTITIES.PROMOTION },
  { value: "Shift", label: UI_TEXT.AUDIT_LOG.ENTITIES.SHIFT },
  { value: "Inventory", label: UI_TEXT.AUDIT_LOG.ENTITIES.INVENTORY },
  { value: "Session", label: UI_TEXT.AUDIT_LOG.ENTITIES.SESSION },
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
  { value: "Activate", label: UI_TEXT.AUDIT_LOG.ACTIONS_LIST.ACTIVATE },
  { value: "Deactivate", label: UI_TEXT.AUDIT_LOG.ACTIONS_LIST.DEACTIVATE },
  { value: "Login", label: UI_TEXT.AUDIT_LOG.ACTIONS_LIST.LOGIN },
  { value: "Logout", label: UI_TEXT.AUDIT_LOG.ACTIONS_LIST.LOGOUT },
  { value: "ResetPassword", label: UI_TEXT.AUDIT_LOG.ACTIONS_LIST.RESET_PASSWORD },
  { value: "ChangeRole", label: UI_TEXT.AUDIT_LOG.ACTIONS_LIST.CHANGE_ROLE },
  { value: "Submit", label: UI_TEXT.AUDIT_LOG.ACTIONS_LIST.SUBMIT },
  { value: "Complete", label: UI_TEXT.AUDIT_LOG.ACTIONS_LIST.COMPLETE },
  { value: "Checkout", label: UI_TEXT.AUDIT_LOG.ACTIONS_LIST.CHECKOUT },
];

const DEFAULT_FILTERS: AuditLogFilterState = {
  actionFilter: "all",
  entityNameFilter: "all",
  fromDate: startOfDay(new Date()),
  toDate: endOfDay(new Date()),
};

export default function SystemAuditLogPage() {
  const [draftFilters, setDraftFilters] = useState<AuditLogFilterState>(DEFAULT_FILTERS);
  const [filters, setFilters] = useState<AuditLogFilterState>(DEFAULT_FILTERS);
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
      fromDate: filters.fromDate,
      toDate: filters.toDate,
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

  const applyFilters = useCallback((next: AuditLogFilterState) => {
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
      <AuditLogToolbar
        draftFilters={draftFilters}
        applyFilters={applyFilters}
        resetFilters={resetFilters}
        entityOptions={ENTITY_OPTIONS}
        actionOptions={ACTION_OPTIONS}
      />
      <div>
        <AuditLogTable
          logs={logs}
          loading={loading}
          error={error}
          onOpenDetails={openDetails}
          noSurface
        />
        <PaginationTable currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
      <AuditLogDetailSheet log={selectedLog} isOpen={isSheetOpen} onOpenChange={setIsSheetOpen} />
    </div>
  );
}

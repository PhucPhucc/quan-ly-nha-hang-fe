"use client";

import { LucideClipboardCheck, LucideExternalLink, LucidePlus } from "lucide-react";
import Link from "next/link";
import React from "react";

import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UI_TEXT } from "@/lib/UI_Text";
import { InventoryCheck, InventoryCheckStatus } from "@/types/Inventory";

import { InventoryPagination } from "./components/InventoryPagination";
import {
  INVENTORY_SELECT_TRIGGER_CLASS,
  INVENTORY_TABLE_SURFACE_CLASS,
} from "./components/inventoryStyles";
import { InventoryToolbar } from "./components/InventoryToolbar";
import { useInventoryCheckTable } from "./useInventoryCheckTable";

export function InventoryCheckTable() {
  const {
    checks,
    isLoading,
    currentPage,
    setCurrentPage,
    totalPages,
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange,
  } = useInventoryCheckTable();

  if (isLoading) {
    return <CheckTableSkeleton />;
  }

  return (
    <div className="space-y-4">
      <InventoryToolbar
        actions={
          <Button asChild className="h-10 rounded-xl px-4 text-sm font-medium shadow-sm">
            <Link href="/manager/inventory/check/new">
              <LucidePlus className="h-4 w-4" />
              {UI_TEXT.INVENTORY.CHECK.CREATE_BTN}
            </Link>
          </Button>
        }
      >
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger
            className={`${INVENTORY_SELECT_TRIGGER_CLASS} min-h-[40px] w-full sm:w-44`}
          >
            <SelectValue placeholder={UI_TEXT.INVENTORY.TOOLBAR.FILTER_STATUS} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{UI_TEXT.INVENTORY.TOOLBAR.STATUS_ALL}</SelectItem>
            <SelectItem value={InventoryCheckStatus.Draft.toString()}>
              {UI_TEXT.INVENTORY.CHECK.STATUS_DRAFT}
            </SelectItem>
            <SelectItem value={InventoryCheckStatus.Processed.toString()}>
              {UI_TEXT.INVENTORY.CHECK.STATUS_PROCESSED}
            </SelectItem>
          </SelectContent>
        </Select>

        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </InventoryToolbar>

      <div className={INVENTORY_TABLE_SURFACE_CLASS}>
        {!checks.length ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="mb-4 rounded-full bg-slate-100 p-4">
              <LucideClipboardCheck className="h-8 w-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              {UI_TEXT.INVENTORY.CHECK.EMPTY_TITLE}
            </h3>
            <p className="max-w-xs text-sm text-slate-500">{UI_TEXT.INVENTORY.CHECK.EMPTY_DESC}</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-200 bg-slate-50 hover:bg-slate-50">
                  <TableHead className="w-[150px] pl-6 text-[10px] font-semibold uppercase tracking-wider text-slate-700">
                    {UI_TEXT.INVENTORY.CHECK.COL_CODE}
                  </TableHead>
                  <TableHead className="text-[10px] font-semibold uppercase tracking-wider text-slate-700">
                    {UI_TEXT.INVENTORY.CHECK.COL_DATE}
                  </TableHead>
                  <TableHead className="text-[10px] font-semibold uppercase tracking-wider text-slate-700">
                    {UI_TEXT.INVENTORY.CHECK.COL_CREATOR}
                  </TableHead>
                  <TableHead className="text-center text-[10px] font-semibold uppercase tracking-wider text-slate-700">
                    {UI_TEXT.INVENTORY.CHECK.COL_STATUS}
                  </TableHead>
                  <TableHead className="text-center text-[10px] font-semibold uppercase tracking-wider text-slate-700">
                    {UI_TEXT.INVENTORY.CHECK.COL_ITEMS}
                  </TableHead>
                  <TableHead className="pr-6 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-700">
                    {UI_TEXT.INVENTORY.TABLE.COL_ACTIONS}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {checks.map((check: InventoryCheck) => (
                  <TableRow
                    key={check.inventoryCheckId}
                    className="group border-b border-slate-100 hover:bg-slate-50/80"
                  >
                    <TableCell className="pl-6 font-mono text-sm font-medium text-slate-700">
                      {check.inventoryCheckId.substring(0, 8).toUpperCase()}
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {new Date(check.checkDate).toLocaleDateString(UI_TEXT.COMMON.LOCALE_VI)}
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {check.createdBy || UI_TEXT.COMMON.DASH}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={
                          check.status === InventoryCheckStatus.Processed ? "success" : "warning"
                        }
                        className="rounded-full px-3 py-0.5"
                      >
                        {check.status === InventoryCheckStatus.Processed
                          ? UI_TEXT.INVENTORY.CHECK.STATUS_PROCESSED
                          : UI_TEXT.INVENTORY.CHECK.STATUS_DRAFT}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-semibold text-slate-700">
                      {check.totalItems}
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                      >
                        <Link href={`/manager/inventory/check/${check.inventoryCheckId}`}>
                          <LucideExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="shrink-0 border-t border-border/40 bg-muted/5">
              <InventoryPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={checks.length * totalPages}
                pageSize={10}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CheckTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-16 w-full animate-pulse rounded-2xl border border-slate-200 bg-white" />
      <div className="rounded-2xl border border-slate-200 bg-white p-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 w-full border-b border-slate-100 p-4 last:border-0">
            <Skeleton className="h-full w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { LucideClipboardCheck, LucideExternalLink, LucidePlus } from "lucide-react";
import Link from "next/link";
import React from "react";

import { DatePicker } from "@/components/shared/DatePicker";
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
  TableShell,
} from "@/components/ui/table";
import { useBrandingFormatter } from "@/lib/branding-formatting";
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
    totalCount,
    statusFilter,
    setStatusFilter,
    fromDate,
    toDate,
    setFromDate,
    setToDate,
  } = useInventoryCheckTable();

  const { formatDate } = useBrandingFormatter();

  if (isLoading) {
    return <CheckTableSkeleton />;
  }

  return (
    <div className="space-y-4">
      <InventoryToolbar
        actions={
          <Button asChild className="px-4 text-sm font-medium shadow-sm">
            <Link href="/manager/inventory/check/new">
              <LucidePlus className="h-4 w-4" />
              {UI_TEXT.INVENTORY.CHECK.CREATE_BTN}
            </Link>
          </Button>
        }
      >
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className={`${INVENTORY_SELECT_TRIGGER_CLASS} w-full sm:w-44`}>
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

        <DatePicker
          value={fromDate}
          onChange={setFromDate}
          placeholder={UI_TEXT.COMMON.FROM_DATE}
        />
        <DatePicker value={toDate} onChange={setToDate} placeholder={UI_TEXT.COMMON.TO_DATE} />
      </InventoryToolbar>

      <div className={INVENTORY_TABLE_SURFACE_CLASS}>
        {!checks.length ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="mb-4 rounded-full bg-card-foreground/5 p-4">
              <LucideClipboardCheck className="h-8 w-8 text-card-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground">
              {UI_TEXT.INVENTORY.CHECK.EMPTY_TITLE}
            </h3>
            <p className="max-w-xs text-sm text-card-foreground">
              {UI_TEXT.INVENTORY.CHECK.EMPTY_DESC}
            </p>
          </div>
        ) : (
          <>
            <TableShell>
              <Table>
                <TableHeader>
                  <TableRow variant="header">
                    <TableHead>{UI_TEXT.INVENTORY.CHECK.COL_CODE}</TableHead>
                    <TableHead>{UI_TEXT.INVENTORY.CHECK.COL_DATE}</TableHead>
                    <TableHead>{UI_TEXT.INVENTORY.CHECK.COL_CREATOR}</TableHead>
                    <TableHead>{UI_TEXT.INVENTORY.CHECK.COL_STATUS}</TableHead>
                    <TableHead className="text-right">
                      {UI_TEXT.INVENTORY.CHECK.COL_ITEMS}
                    </TableHead>
                    <TableHead className="text-right">
                      {UI_TEXT.INVENTORY.TABLE.COL_ACTIONS}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {checks.map((check: InventoryCheck) => (
                    <TableRow key={check.inventoryCheckId} className="text-card-foreground text-sm">
                      <TableCell className="fonfont-medium">
                        {check.inventoryCheckId.substring(0, 8).toUpperCase()}
                      </TableCell>
                      <TableCell>{formatDate(check.checkDate)}</TableCell>
                      <TableCell>{check.createdBy || UI_TEXT.COMMON.DASH}</TableCell>
                      <TableCell>
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
                      <TableCell className="font-semibold text-right">{check.totalItems}</TableCell>
                      <TableCell className="text-right">
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
            </TableShell>
            <div className="shrink-0 border-t border-border/40 bg-muted/5">
              <InventoryPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={totalCount}
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

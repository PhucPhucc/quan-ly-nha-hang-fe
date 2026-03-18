"use client";

import { LucideClipboardCheck, LucideExternalLink, LucidePlus, LucideSearch } from "lucide-react";
import Link from "next/link";
import React from "react";

import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
      {/* Tool Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-72">
            <LucideSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={UI_TEXT.INVENTORY.TOOLBAR.SEARCH_PLACEHOLDER}
              className="pl-9 bg-muted/30 border-none focus-visible:ring-primary"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-muted/30 border-none">
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
        </div>

        <Button asChild className="gap-2 rounded-full shadow-lg shadow-primary/20">
          <Link href="/manager/inventory/check/new">
            <LucidePlus className="h-4 w-4" />
            {UI_TEXT.INVENTORY.CHECK.CREATE_BTN}
          </Link>
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        {!checks.length ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <LucideClipboardCheck className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground">
              {UI_TEXT.INVENTORY.CHECK.EMPTY_TITLE}
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              {UI_TEXT.INVENTORY.CHECK.EMPTY_DESC}
            </p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                  <TableHead className="w-[150px] font-semibold uppercase text-[10px] tracking-wider text-muted-foreground pl-6">
                    {UI_TEXT.INVENTORY.CHECK.COL_CODE}
                  </TableHead>
                  <TableHead className="font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">
                    {UI_TEXT.INVENTORY.CHECK.COL_DATE}
                  </TableHead>
                  <TableHead className="font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">
                    {UI_TEXT.INVENTORY.CHECK.COL_CREATOR}
                  </TableHead>
                  <TableHead className="text-center font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">
                    {UI_TEXT.INVENTORY.CHECK.COL_STATUS}
                  </TableHead>
                  <TableHead className="text-center font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">
                    {UI_TEXT.INVENTORY.CHECK.COL_ITEMS}
                  </TableHead>
                  <TableHead className="text-right font-semibold uppercase text-[10px] tracking-wider text-muted-foreground pr-6">
                    {UI_TEXT.INVENTORY.TABLE.COL_ACTIONS}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {checks.map((check: InventoryCheck) => (
                  <TableRow
                    key={check.inventoryCheckId}
                    className="hover:bg-muted/30 group border-b border-border/50"
                  >
                    <TableCell className="font-mono text-sm font-medium pl-6">
                      {check.inventoryCheckId.substring(0, 8).toUpperCase()}
                    </TableCell>
                    <TableCell className="text-sm text-foreground/80">
                      {new Date(check.checkDate).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell className="text-sm text-foreground/80">
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
                    <TableCell className="text-center font-semibold text-foreground/80">
                      {check.totalItems}
                    </TableCell>
                    <TableCell className="text-right pr-6">
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
            <InventoryPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
              onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            />
          </>
        )}
      </div>
    </div>
  );
}

function CheckTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-16 w-full rounded-xl bg-card border border-border animate-pulse" />
      <div className="rounded-xl border border-border bg-card p-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 w-full border-b border-border last:border-0 p-4">
            <Skeleton className="h-full w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

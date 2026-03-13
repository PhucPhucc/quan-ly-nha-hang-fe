"use client";

import { useQuery } from "@tanstack/react-query";
import { CircleAlert } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { inventoryService } from "@/services/inventory.service";
import { Ingredient } from "@/types/Inventory";

import { AddIngredientPanel } from "./AddIngredientPanel";
import { InventoryEmptyState } from "./components/InventoryEmptyState";
import { InventoryPagination } from "./components/InventoryPagination";
import { InventoryRow } from "./components/InventoryRow";
import { InventoryTableHeader } from "./components/InventoryTableHeader";
import { useInventoryTable } from "./useInventoryTable";

const COMPLETED_OPENING_STOCK_STATUS = 2;
const OPENING_STOCK_REMINDER = {
  title: "Bạn chưa nhập số dư đầu kỳ",
  description:
    "Vui lòng nhập số dư đầu kỳ trước khi tiếp tục quản lý kho để dữ liệu tồn kho được chính xác.",
  action: "Đi đến nhập số dư",
} as const;

function shouldShowOpeningStockReminder(
  settings?: { openingStockStatus?: number | string; lockedAt?: string | null } | null
) {
  if (!settings) {
    return true;
  }

  return (
    !settings.lockedAt &&
    settings.openingStockStatus !== COMPLETED_OPENING_STOCK_STATUS &&
    settings.openingStockStatus !== "Completed"
  );
}

export function IngredientTable() {
  const pageSize = 10;

  const {
    ingredients,
    totalPages,
    isLoading,
    isError,
    error,
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    deleteMutation,
  } = useInventoryTable(pageSize);

  const { data: settingsResponse } = useQuery({
    queryKey: ["inventory-settings"],
    queryFn: () => inventoryService.getInventorySettings(),
  });

  const [editingItem, setEditingItem] = useState<Ingredient | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<Ingredient | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleEdit = (item: Ingredient) => {
    setEditingItem(item);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (item: Ingredient) => {
    setDeletingItem(item);
    setIsDeleteOpen(true);
  };

  const handleEditSuccess = () => {
    // Query invalidation is handled inside the hook mutations.
  };

  const dialogTitle = UI_TEXT.INVENTORY.DELETE.TITLE;
  const dialogDesc = UI_TEXT.INVENTORY.DELETE.DESC;
  const confirmLabel = UI_TEXT.INVENTORY.DELETE.BTN_CONFIRM;

  const renderLoading = () => (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-12 w-full rounded-xl" />
      ))}
    </div>
  );

  const renderError = () => (
    <div className="rounded-xl border bg-destructive/5 p-8 text-center text-destructive">
      <p>
        {UI_TEXT.INVENTORY.TABLE.ERROR_PREFIX} {(error as Error).message}
      </p>
    </div>
  );

  if (isLoading) {
    return renderLoading();
  }

  if (isError) {
    return renderError();
  }

  return (
    <div className="space-y-4">
      {shouldShowOpeningStockReminder(settingsResponse?.data) ? (
        <div className="flex items-start justify-between gap-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-950">
          <div className="flex items-start gap-3">
            <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
            <div className="space-y-1">
              <p className="font-semibold">{OPENING_STOCK_REMINDER.title}</p>
              <p className="text-sm text-amber-900/90">{OPENING_STOCK_REMINDER.description}</p>
            </div>
          </div>
          <Button asChild className="shrink-0">
            <Link href="/manager/inventory/opening-stock">{OPENING_STOCK_REMINDER.action}</Link>
          </Button>
        </div>
      ) : null}

      <div className="grid gap-3">
        <InventoryTableHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          onReset={() => {
            setSearchQuery("");
            setStatusFilter("all");
          }}
        />
      </div>

      <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-100 bg-slate-50/50 hover:bg-transparent">
              <TableHead className="py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-800">
                {UI_TEXT.INVENTORY.TABLE.COL_SKU}
              </TableHead>
              <TableHead className="py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-800">
                {UI_TEXT.INVENTORY.TABLE.COL_NAME}
              </TableHead>
              <TableHead className="py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-800">
                {UI_TEXT.INVENTORY.TABLE.COL_STOCK}
              </TableHead>
              <TableHead className="py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-800">
                {UI_TEXT.INVENTORY.TABLE.COL_PRICE}
              </TableHead>
              <TableHead className="w-[140px] py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-800">
                {UI_TEXT.INVENTORY.TABLE.COL_STATUS}
              </TableHead>
              <TableHead className="w-[120px] py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-800">
                {UI_TEXT.INVENTORY.TABLE.COL_ACTIVE}
              </TableHead>
              <TableHead className="w-[140px] py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-800">
                {UI_TEXT.INVENTORY.TABLE.COL_ACTIONS}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ingredients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-48 text-center">
                  <InventoryEmptyState />
                </TableCell>
              </TableRow>
            ) : (
              ingredients.map((item) => (
                <InventoryRow
                  key={item.ingredientId}
                  item={item}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              ))
            )}
          </TableBody>
        </Table>

        <InventoryPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          onNext={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
        />
      </div>

      <AddIngredientPanel
        ingredient={editingItem || undefined}
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) {
            setEditingItem(null);
          }
        }}
        onSuccess={handleEditSuccess}
        hideTrigger={true}
      />

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription asChild>
              <div className="flex flex-col gap-2 pt-2">
                <span>{dialogDesc}</span>
                {deletingItem && (
                  <div className="rounded-lg border border-border/50 bg-muted/50 p-3">
                    <span className="font-semibold text-foreground">{deletingItem.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {UI_TEXT.INVENTORY.TABLE.PAREN_OPEN}
                      {deletingItem.code}
                      {UI_TEXT.INVENTORY.TABLE.PAREN_CLOSE}
                    </span>
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              className="rounded-lg"
              onClick={() => setIsDeleteOpen(false)}
              disabled={deleteMutation.isPending}
            >
              {UI_TEXT.INVENTORY.DELETE.BTN_CANCEL}
            </Button>
            <Button
              variant="destructive"
              className="rounded-lg"
              onClick={() =>
                deletingItem &&
                deleteMutation.mutate(deletingItem.ingredientId, {
                  onSuccess: () => {
                    setIsDeleteOpen(false);
                    setDeletingItem(null);
                  },
                })
              }
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? UI_TEXT.INVENTORY.DELETE.BTN_DELETING : confirmLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

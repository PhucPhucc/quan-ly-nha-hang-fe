"use client";

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
import { Ingredient } from "@/types/Inventory";

import { AddIngredientPanel } from "./AddIngredientPanel";
import { InventoryEmptyState } from "./components/InventoryEmptyState";
import { InventoryPagination } from "./components/InventoryPagination";
import { InventoryRow } from "./components/InventoryRow";
import {
  INVENTORY_TABLE_CONTAINER_CLASS,
  INVENTORY_TABLE_SURFACE_CLASS,
  INVENTORY_TH_CLASS,
  INVENTORY_THEAD_CLASS,
  INVENTORY_THEAD_ROW_CLASS,
} from "./components/inventoryStyles";
import { InventoryTableHeader } from "./components/InventoryTableHeader";
import { useInventoryTable } from "./useInventoryTable";

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
    toggleActivationMutation,
  } = useInventoryTable(pageSize);

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

  const isReactivating = deletingItem && !deletingItem.isActive;

  const dialogTitle = isReactivating
    ? UI_TEXT.INVENTORY.DELETE.REACTIVATE_TITLE
    : UI_TEXT.INVENTORY.DELETE.TITLE;
  const dialogDesc = isReactivating
    ? UI_TEXT.INVENTORY.DELETE.REACTIVATE_DESC
    : UI_TEXT.INVENTORY.DELETE.DESC;
  const confirmLabel = isReactivating
    ? UI_TEXT.INVENTORY.DELETE.BTN_CONFIRM_REACTIVATE
    : UI_TEXT.INVENTORY.DELETE.BTN_CONFIRM;

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
    <div className="flex min-h-0 flex-1 flex-col space-y-6 pt-2">
      {" "}
      <div className="shrink-0">
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
      <div className={`${INVENTORY_TABLE_SURFACE_CLASS} mt-2`}>
        <Table containerClassName={INVENTORY_TABLE_CONTAINER_CLASS}>
          <TableHeader className={INVENTORY_THEAD_CLASS}>
            <TableRow className={INVENTORY_THEAD_ROW_CLASS}>
              <TableHead className={`${INVENTORY_TH_CLASS} text-center`}>
                {UI_TEXT.INVENTORY.TABLE.COL_SKU}
              </TableHead>
              <TableHead className={`${INVENTORY_TH_CLASS} text-center`}>
                {UI_TEXT.INVENTORY.TABLE.COL_NAME}
              </TableHead>
              <TableHead className={`${INVENTORY_TH_CLASS} text-center`}>
                {UI_TEXT.INVENTORY.TABLE.COL_GROUP}
              </TableHead>
              <TableHead className={`${INVENTORY_TH_CLASS} text-center`}>
                {UI_TEXT.INVENTORY.TABLE.COL_STOCK}
              </TableHead>
              <TableHead className={`${INVENTORY_TH_CLASS} text-center`}>
                {UI_TEXT.INVENTORY.TABLE.COL_PRICE}
              </TableHead>
              <TableHead className={`${INVENTORY_TH_CLASS} text-center`}>
                {UI_TEXT.INVENTORY.TABLE.COL_STATUS}
              </TableHead>
              <TableHead className={`${INVENTORY_TH_CLASS} text-center`}>
                {UI_TEXT.INVENTORY.TABLE.COL_ACTIVE}
              </TableHead>
              <TableHead className={`${INVENTORY_TH_CLASS} text-center`}>
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
              <>
                {ingredients.map((item) => (
                  <InventoryRow
                    key={item.ingredientId}
                    item={item}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                  />
                ))}
                {pageSize > ingredients.length &&
                  Array.from({ length: pageSize - ingredients.length }).map((_, i) => (
                    <TableRow key={`empty-${i}`} className="h-[52px]">
                      <TableCell colSpan={8} />
                    </TableRow>
                  ))}
              </>
            )}
          </TableBody>
        </Table>

        <div className="shrink-0 border-t border-border/40 bg-muted/5">
          <InventoryPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={ingredients.length * totalPages} // Approximate as we don't have absolute total yet in this hook, but good enough for now
            pageSize={pageSize}
          />
        </div>
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
              disabled={toggleActivationMutation.isPending}
            >
              {UI_TEXT.INVENTORY.DELETE.BTN_CANCEL}
            </Button>
            <Button
              variant={isReactivating ? "default" : "destructive"}
              className="rounded-lg"
              onClick={() =>
                deletingItem &&
                toggleActivationMutation.mutate(
                  { id: deletingItem.ingredientId, isActive: deletingItem.isActive },
                  {
                    onSuccess: () => {
                      setIsDeleteOpen(false);
                      setDeletingItem(null);
                    },
                  }
                )
              }
              disabled={toggleActivationMutation.isPending}
            >
              {toggleActivationMutation.isPending
                ? UI_TEXT.INVENTORY.DELETE.BTN_DELETING
                : confirmLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

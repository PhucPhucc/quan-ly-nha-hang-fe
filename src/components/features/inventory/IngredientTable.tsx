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
    deleteMutation,
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
    // invalidate handled inside hook via mutations
  };

  const renderLoading = () => (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-xl" />
      ))}
    </div>
  );

  const renderError = () => (
    <div className="p-8 text-center text-destructive rounded-xl border bg-destructive/5">
      <p>
        {UI_TEXT.INVENTORY.TABLE.ERROR_PREFIX} {(error as Error).message}
      </p>
    </div>
  );

  if (isLoading) return renderLoading();
  if (isError) return renderError();

  return (
    <div className="space-y-4">
      <InventoryTableHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>{UI_TEXT.INVENTORY.TABLE.COL_NAME}</TableHead>
              <TableHead>{UI_TEXT.INVENTORY.TABLE.COL_SKU}</TableHead>
              <TableHead className="text-right">{UI_TEXT.INVENTORY.TABLE.COL_STOCK}</TableHead>
              <TableHead className="text-right">{UI_TEXT.INVENTORY.TABLE.COL_PRICE}</TableHead>
              <TableHead className="w-[140px]">{UI_TEXT.INVENTORY.TABLE.COL_STATUS}</TableHead>
              <TableHead className="w-[120px] text-center">
                {UI_TEXT.INVENTORY.TABLE.COL_ACTIVE}
              </TableHead>
              <TableHead className="w-[140px] text-right">
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
          if (!open) setEditingItem(null);
        }}
        onSuccess={handleEditSuccess}
        hideTrigger={true}
      />

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle>{UI_TEXT.INVENTORY.DELETE.TITLE}</DialogTitle>
            <DialogDescription asChild>
              <div className="flex flex-col gap-2 pt-2">
                <span>{UI_TEXT.INVENTORY.DELETE.DESC}</span>
                {deletingItem && (
                  <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                    <span className="font-semibold text-foreground">{deletingItem.name}</span>
                    <span className="text-muted-foreground text-xs ml-2">
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
              {deleteMutation.isPending
                ? UI_TEXT.INVENTORY.DELETE.BTN_DELETING
                : UI_TEXT.INVENTORY.DELETE.BTN_CONFIRM}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

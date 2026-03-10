"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Package, Trash2 } from "lucide-react";
import React, { useState } from "react";

import { Badge } from "@/components/ui/badge";
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
import { inventoryService } from "@/services/inventoryService";
import { AlertThresholdStatus, Ingredient } from "@/types/Inventory";

import { AddIngredientPanel } from "./AddIngredientPanel";

export function IngredientTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const queryClient = useQueryClient();

  // Use React Query for data fetching
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["ingredients", currentPage, pageSize],
    queryFn: () => inventoryService.getIngredients(currentPage, pageSize),
  });

  const [editingItem, setEditingItem] = useState<Ingredient | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [deletingItem, setDeletingItem] = useState<Ingredient | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => inventoryService.deleteIngredient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      setIsDeleteOpen(false);
      setDeletingItem(null);
    },
  });

  const handleEdit = (item: Ingredient) => {
    setEditingItem(item);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (item: Ingredient) => {
    setDeletingItem(item);
    setIsDeleteOpen(true);
  };

  const handleEditSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["ingredients"] });
  };

  const ingredients = data?.data?.items || [];
  const totalPages = data?.data?.totalPages || 1;

  const getStatusBadge = (status: AlertThresholdStatus) => {
    switch (status) {
      case AlertThresholdStatus.NORMAL:
        return (
          <Badge className="bg-success text-success-foreground">
            {UI_TEXT.INVENTORY.STOCK.STATUS_NORMAL}
          </Badge>
        );
      case AlertThresholdStatus.LOW_STOCK:
        return (
          <Badge className="bg-warning text-warning-foreground">
            {UI_TEXT.INVENTORY.STOCK.STATUS_LOW}
          </Badge>
        );
      case AlertThresholdStatus.OUT_OF_STOCK:
        return (
          <Badge className="bg-destructive text-destructive-foreground">
            {UI_TEXT.INVENTORY.STOCK.STATUS_OUT}
          </Badge>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-destructive">
        <p>
          {UI_TEXT.INVENTORY.TABLE.ERROR_PREFIX} {(error as Error).message}
        </p>
      </div>
    );
  }

  if (ingredients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/20">
        <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium">{UI_TEXT.INVENTORY.TABLE.EMPTY_TITLE}</h3>
        <p className="text-muted-foreground mt-1">{UI_TEXT.INVENTORY.TABLE.EMPTY_DESC}</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card text-card-foreground shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{UI_TEXT.INVENTORY.TABLE.COL_NAME}</TableHead>
            <TableHead>{UI_TEXT.INVENTORY.TABLE.COL_SKU}</TableHead>
            <TableHead>{UI_TEXT.INVENTORY.TABLE.COL_CATEGORY}</TableHead>
            <TableHead className="text-right">{UI_TEXT.INVENTORY.TABLE.COL_STOCK}</TableHead>
            <TableHead className="text-right">{UI_TEXT.INVENTORY.TABLE.COL_PRICE}</TableHead>
            <TableHead>{UI_TEXT.INVENTORY.TABLE.COL_STATUS}</TableHead>
            <TableHead className="text-right">{UI_TEXT.INVENTORY.TABLE.COL_ACTIONS}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ingredients.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell className="text-muted-foreground">{item.sku}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col items-end">
                  <span>
                    {item.currentStock} {item.unit}
                  </span>
                  {item.currentStock <= item.lowStockThreshold && (
                    <span className="text-xs text-warning border-t border-warning/20 mt-1 pt-1">
                      {UI_TEXT.INVENTORY.TABLE.THRESHOLD_PREFIX} {item.lowStockThreshold}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                {UI_TEXT.INVENTORY.TABLE.CURRENCY}
                {item.costPerUnit.toFixed(2)}
              </TableCell>
              <TableCell>{getStatusBadge(item.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Sửa"
                    title="Sửa"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    aria-label="Xóa"
                    title="Xóa"
                    onClick={() => handleDeleteClick(item)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Footer */}
      {!isLoading && !isError && totalPages > 1 && (
        <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-muted/20 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 mr-2">
              {UI_TEXT.INVENTORY.TABLE.PAGE}
            </span>
            <div className="flex items-center justify-center min-w-12 px-2 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-sm font-bold">{currentPage}</span>
              <span className="text-muted-foreground mx-1">{UI_TEXT.INVENTORY.TABLE.SLASH}</span>
              <span className="text-sm font-medium text-muted-foreground">{totalPages}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage <= 1}
              className="h-8 shadow-sm transition-all hover:shadow-md"
            >
              {UI_TEXT.COMMON.PREVIOUS}
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage >= totalPages}
              className="h-8 shadow-sm transition-all hover:shadow-md"
            >
              {UI_TEXT.COMMON.NEXT}
            </Button>
          </div>
        </div>
      )}

      {/* Edit Form Panel */}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{UI_TEXT.INVENTORY.DELETE.TITLE}</DialogTitle>
            <DialogDescription asChild>
              <div className="flex flex-col gap-2">
                <span>{UI_TEXT.INVENTORY.DELETE.DESC}</span>
                {deletingItem && (
                  <span className="font-medium text-foreground">
                    {deletingItem.name} {UI_TEXT.INVENTORY.TABLE.PAREN_OPEN}
                    {deletingItem.sku}
                    {UI_TEXT.INVENTORY.TABLE.PAREN_CLOSE}
                  </span>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={deleteMutation.isPending}
            >
              {UI_TEXT.INVENTORY.DELETE.BTN_CANCEL}
            </Button>
            <Button
              variant="destructive"
              onClick={() => deletingItem && deleteMutation.mutate(deletingItem.id)}
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

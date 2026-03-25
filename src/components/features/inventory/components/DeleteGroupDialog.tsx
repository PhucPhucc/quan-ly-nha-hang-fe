"use client";

import { UseMutationResult } from "@tanstack/react-query";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UI_TEXT } from "@/lib/UI_Text";
import { InventoryGroup } from "@/types/Inventory";

interface DeleteGroupDialogProps {
  deletingGroup: InventoryGroup | null;
  setDeletingGroup: (group: InventoryGroup | null) => void;
  deleteMutation: UseMutationResult<unknown, Error, string, unknown>;
}

export function DeleteGroupDialog({
  deletingGroup,
  setDeletingGroup,
  deleteMutation,
}: DeleteGroupDialogProps) {
  return (
    <Dialog open={!!deletingGroup} onOpenChange={(open) => !open && setDeletingGroup(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{UI_TEXT.INVENTORY.GROUPS.DELETE_TITLE}</DialogTitle>
          <DialogDescription>
            {UI_TEXT.INVENTORY.GROUPS.DELETE_DESC}
            {deletingGroup ? ` ${deletingGroup.name}` : ""}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDeletingGroup(null)}>
            {UI_TEXT.COMMON.CANCEL}
          </Button>
          <Button
            variant="destructive"
            onClick={() => deletingGroup && deleteMutation.mutate(deletingGroup.inventoryGroupId)}
            disabled={!deletingGroup || deleteMutation.isPending}
          >
            {deleteMutation.isPending
              ? UI_TEXT.INVENTORY.GROUPS.DELETING
              : UI_TEXT.INVENTORY.GROUPS.DELETE_BTN}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

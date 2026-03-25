"use client";

import React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { DeleteGroupDialog } from "./components/DeleteGroupDialog";
import { InventoryGroupForm } from "./components/InventoryGroupForm";
import { InventoryGroupList } from "./components/InventoryGroupList";
import { INVENTORY_PAGE_CLASS } from "./components/inventoryStyles";
import { useInventoryGroups } from "./useInventoryGroups";

export function InventoryGroupsManager() {
  const {
    groups,
    isLoading,
    isError,
    error,
    editingGroup,
    setEditingGroup,
    deletingGroup,
    setDeletingGroup,
    formMethods,
    onSubmit,
    isBusy,
    deleteMutation,
  } = useInventoryGroups();

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-72 w-full rounded-2xl" />
        </div>
      );
    }

    if (isError) {
      return (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-destructive">
          {(error as Error).message}
        </div>
      );
    }

    return (
      <div className="grid gap-8 xl:grid-cols-[400px_1fr]">
        <InventoryGroupForm
          formMethods={formMethods}
          onSubmit={onSubmit}
          editingGroup={editingGroup}
          setEditingGroup={setEditingGroup}
          isBusy={isBusy}
        />

        <InventoryGroupList
          groups={groups}
          setEditingGroup={setEditingGroup}
          setDeletingGroup={setDeletingGroup}
        />
      </div>
    );
  };

  return (
    <div className={cn(INVENTORY_PAGE_CLASS, "gap-6 pb-20")}>
      {renderContent()}

      <DeleteGroupDialog
        deletingGroup={deletingGroup}
        setDeletingGroup={setDeletingGroup}
        deleteMutation={deleteMutation}
      />
    </div>
  );
}

"use client";

import { Library, Save } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { UI_TEXT } from "@/lib/UI_Text";
import { MenuItemOptionGroup } from "@/types/Menu";

import { MenuItemOptionAssignmentCard } from "./MenuItemOptionAssignmentCard";
import { MenuItemOptionAssignmentSkeleton } from "./MenuItemOptionAssignmentSkeleton";
import { OptionItemsModal } from "./OptionItemsModal";
import { OptionLibraryDrawer } from "./OptionLibraryDrawer";
import { useMenuItemOptionAssignment } from "./useMenuItemOptionAssignment";

interface MenuItemOptionAssignmentProps {
  assignments: MenuItemOptionGroup[];
  setAssignments: (assignments: MenuItemOptionGroup[]) => void;
  menuItemId: string;
  isFetching?: boolean;
}

export const MenuItemOptionAssignment: React.FC<MenuItemOptionAssignmentProps> = ({
  assignments,
  setAssignments,
  menuItemId,
  isFetching = false,
}) => {
  const {
    isDrawerOpen,
    setIsDrawerOpen,
    isSaving,
    viewingGroup,
    setViewingGroup,
    draggingAssignmentId,
    sortedAssignments,
    handleOpenItems,
    handleAssignGroup,
    handlePersistAssignments,
    handleUpdateAssignment,
    handleUnassign,
    handleReorder,
    handleDragStart,
    handleDragEnd,
    handleDrop,
  } = useMenuItemOptionAssignment(assignments, setAssignments, menuItemId);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-base font-semibold text-foreground leading-none">
            {UI_TEXT.MENU.OPTIONS.ASSIGNED_OPTIONS}
          </h3>
          <p className="text-[11px] text-muted-foreground mt-1">
            {UI_TEXT.MENU.OPTIONS.ASSIGN_DESC}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 justify-end">
          <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" disabled={isFetching || isSaving}>
                <Library className="h-4 w-4 mr-2" />
                {UI_TEXT.MENU.OPTIONS.ADD_FROM_LIBRARY}
              </Button>
            </SheetTrigger>
            <OptionLibraryDrawer
              assignedGroupIds={assignments.map((a) => a.optionGroupId)}
              onAssign={handleAssignGroup}
            />
          </Sheet>
          <Button
            size="sm"
            disabled={isFetching || isSaving}
            onClick={handlePersistAssignments}
            className="shadow-md shadow-primary/10 transition-all active:scale-95 bg-primary hover:bg-primary/90 text-white"
          >
            {isSaving ? (
              <Save className="h-4 w-4 mr-2 animate-pulse" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {UI_TEXT.BUTTON.SAVE_CHANGES}
          </Button>
        </div>
      </div>

      {isFetching ? (
        <MenuItemOptionAssignmentSkeleton />
      ) : assignments.length === 0 ? (
        <Card className="p-6 border-dashed flex flex-col items-center justify-center text-center space-y-3 bg-muted/5 min-h-[160px]">
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
            <Library className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="max-w-xs">
            <p className="text-sm text-muted-foreground italic">
              {UI_TEXT.MENU.OPTIONS.EMPTY_ASSIGNED}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedAssignments.map((assignment, idx) => (
            <MenuItemOptionAssignmentCard
              key={assignment.menuItemOptionGroupId}
              assignment={assignment}
              idx={idx}
              totalItems={sortedAssignments.length}
              draggingAssignmentId={draggingAssignmentId}
              handleDragStart={handleDragStart}
              handleDragEnd={handleDragEnd}
              handleDrop={handleDrop}
              handleReorder={handleReorder}
              handleOpenItems={handleOpenItems}
              handleUpdateAssignment={handleUpdateAssignment}
              handleUnassign={handleUnassign}
            />
          ))}
          <OptionItemsModal
            open={!!viewingGroup}
            onOpenChange={(open) => !open && setViewingGroup(null)}
            group={viewingGroup}
          />
        </div>
      )}
    </div>
  );
};

"use client";

import { GripVertical, Library, Plus, Save, Trash2 } from "lucide-react";
import React, { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { UI_TEXT } from "@/lib/UI_Text";
import { optionService } from "@/services/optionService";
import { MenuItemOptionGroup, OptionGroup } from "@/types/Menu";

import { OptionItemsModal } from "./OptionItemsModal";
import { OptionLibraryDrawer } from "./OptionLibraryDrawer";

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [viewingGroup, setViewingGroup] = useState<OptionGroup | null>(null);

  const handleOpenItems = (group?: OptionGroup | null) => {
    if (!group) return;
    setViewingGroup(group);
  };

  const handleAssignGroup = (group: OptionGroup) => {
    const newAssignment: MenuItemOptionGroup = {
      menuItemOptionGroupId: `temp-map-${Date.now()}`,
      menuItemId: menuItemId,
      optionGroupId: group.optionGroupId,
      optionGroup: group,
      isRequired: false,
      minSelect: 0,
      maxSelect: 1,
      sortOrder: assignments.length,
      isVisible: true,
    };
    setAssignments([...assignments, newAssignment]);
    setIsDrawerOpen(false);
  };

  const handlePersistAssignments = async () => {
    if (!menuItemId) return;
    setIsSaving(true);
    try {
      for (const assignment of assignments) {
        if (assignment.menuItemOptionGroupId.startsWith("temp-")) {
          await optionService.assignToMenuItem({
            menuItemId,
            optionGroupId: assignment.optionGroupId,
            isRequired: assignment.isRequired,
            minSelect: assignment.minSelect,
            maxSelect: assignment.maxSelect,
            sortOrder: assignment.sortOrder,
            isVisible: assignment.isVisible,
          });
        } else {
          await optionService.updateAssignment(assignment.menuItemOptionGroupId, {
            isRequired: assignment.isRequired,
            minSelect: assignment.minSelect,
            maxSelect: assignment.maxSelect,
            sortOrder: assignment.sortOrder,
            isVisible: assignment.isVisible,
          });
        }
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateAssignment = (id: string, updates: Partial<MenuItemOptionGroup>) => {
    setAssignments(
      assignments.map((a) => (a.menuItemOptionGroupId === id ? { ...a, ...updates } : a))
    );
  };

  const handleUnassign = (id: string) => {
    setAssignments(assignments.filter((a) => a.menuItemOptionGroupId !== id));
  };

  const handleReorder = (idx: number, direction: "up" | "down") => {
    const newAssignments = [...assignments];
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= newAssignments.length) return;

    [newAssignments[idx], newAssignments[targetIdx]] = [
      newAssignments[targetIdx],
      newAssignments[idx],
    ];

    // Re-assign sort orders
    const updated = newAssignments.map((a, i) => ({ ...a, sortOrder: i }));
    setAssignments(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            {UI_TEXT.MENU.OPTIONS.ASSIGNED_OPTIONS}
          </h3>
          <p className="text-sm text-muted-foreground">{UI_TEXT.MENU.OPTIONS.ASSIGN_DESC}</p>
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
            onClick={() => window.open("/menu/options", "_blank")}
          >
            <Plus className="h-4 w-4 mr-2" />
            {UI_TEXT.MENU.OPTIONS.CREATE_NEW_GROUP}
          </Button>
        </div>
      </div>

      {isFetching ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Card key={i} className="p-4 flex items-center gap-4 border-border/50 animate-pulse">
              <div className="h-10 w-6 bg-muted rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-3 w-48 bg-muted rounded" />
              </div>
              <div className="flex gap-4">
                <div className="h-8 w-12 bg-muted rounded" />
                <div className="h-8 w-16 bg-muted rounded" />
                <div className="h-8 w-16 bg-muted rounded" />
              </div>
            </Card>
          ))}
        </div>
      ) : assignments.length === 0 ? (
        <Card className="p-12 border-dashed flex flex-col items-center justify-center text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
            <Library className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="max-w-xs">
            <p className="text-sm text-muted-foreground italic">
              {UI_TEXT.MENU.OPTIONS.EMPTY_ASSIGNED}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {assignments
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((assignment, idx) => (
              <Card
                key={assignment.menuItemOptionGroupId}
                className="overflow-hidden border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center p-4 gap-4">
                  {/* Drag and Reorder controls */}
                  <div className="flex flex-col items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      disabled={idx === 0}
                      onClick={() => handleReorder(idx, "up")}
                    >
                      <GripVertical className="h-4 w-4 text-muted-foreground/50 rotate-90" />
                    </Button>
                    <GripVertical className="h-4 w-4 text-muted-foreground/30" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      disabled={idx === assignments.length - 1}
                      onClick={() => handleReorder(idx, "down")}
                    >
                      <GripVertical className="h-4 w-4 text-muted-foreground/50 rotate-90" />
                    </Button>
                  </div>

                  {/* Group Identity */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">
                        {assignment.optionGroup?.name}
                      </span>
                      <Badge variant="secondary" className="text-[10px] uppercase">
                        {String(assignment.optionGroup?.optionType)}
                      </Badge>
                    </div>
                    <button
                      type="button"
                      className="text-[11px] text-primary hover:underline font-medium"
                      onClick={() => handleOpenItems(assignment.optionGroup ?? null)}
                    >
                      {UI_TEXT.MENU.OPTIONS.VIEW_ITEMS(
                        assignment.optionGroup?.optionItems?.length || 0
                      )}
                    </button>
                  </div>

                  {/* Inline Configuration */}
                  <div className="flex items-center gap-8">
                    <div className="flex flex-col items-center gap-1.5">
                      <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        {UI_TEXT.MENU.OPTIONS.REQUIRED_LABEL}
                      </Label>
                      <Switch
                        checked={assignment.isRequired}
                        onCheckedChange={(val) =>
                          handleUpdateAssignment(assignment.menuItemOptionGroupId, {
                            isRequired: val,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                        {UI_TEXT.MENU.OPTIONS.MIN_SELECT}
                      </Label>
                      <Input
                        type="number"
                        className="h-8 w-16 text-center"
                        value={assignment.minSelect}
                        onChange={(e) =>
                          handleUpdateAssignment(assignment.menuItemOptionGroupId, {
                            minSelect: Number(e.target.value),
                          })
                        }
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                        {UI_TEXT.MENU.OPTIONS.MAX_SELECT}
                      </Label>
                      <Input
                        type="number"
                        className="h-8 w-16 text-center"
                        value={assignment.maxSelect}
                        onChange={(e) =>
                          handleUpdateAssignment(assignment.menuItemOptionGroupId, {
                            maxSelect: Number(e.target.value),
                          })
                        }
                      />
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full text-destructive hover:bg-destructive/10"
                      onClick={() => handleUnassign(assignment.menuItemOptionGroupId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <OptionItemsModal
                    open={!!viewingGroup}
                    onOpenChange={(open) => !open && setViewingGroup(null)}
                    group={viewingGroup}
                  />
                </div>
              </Card>
            ))}
        </div>
      )}

      <div className="flex justify-end pt-6">
        <Button
          size="sm"
          variant="secondary"
          disabled={isFetching || isSaving}
          onClick={handlePersistAssignments}
        >
          {isSaving ? (
            <>
              <Save className="h-4 w-4 mr-2 animate-pulse" />
              {UI_TEXT.BUTTON.SAVE_CHANGES}
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {UI_TEXT.BUTTON.SAVE_CHANGES}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

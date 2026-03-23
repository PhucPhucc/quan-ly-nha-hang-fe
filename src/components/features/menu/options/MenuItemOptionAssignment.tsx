"use client";

import { ArrowDown, ArrowUp, CheckCircle2, Library, ListChecks, Save, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

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
  const [draggingAssignmentId, setDraggingAssignmentId] = useState<string | null>(null);
  const sortedAssignments = [...assignments].sort((a, b) => a.sortOrder - b.sortOrder);

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
      name: group.name,
      optionType: group.optionType,
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
      toast.success("Đã lưu tùy chọn cho món");
    } catch (error) {
      console.error("Failed to save option assignments", error);
      toast.error(error instanceof Error ? error.message : "Không thể lưu tùy chọn cho món");
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

  const applySortedAssignments = (nextAssignments: MenuItemOptionGroup[]) => {
    const reorderedAssignments = nextAssignments.map((assignment, index) => ({
      ...assignment,
      sortOrder: index,
    }));
    setAssignments(reorderedAssignments);
  };

  const handleReorder = (idx: number, direction: "up" | "down") => {
    const newAssignments = [...sortedAssignments];
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= newAssignments.length) return;

    [newAssignments[idx], newAssignments[targetIdx]] = [
      newAssignments[targetIdx],
      newAssignments[idx],
    ];

    applySortedAssignments(newAssignments);
  };

  const handleDragStart = (assignmentId: string) => {
    setDraggingAssignmentId(assignmentId);
  };

  const handleDragEnd = () => {
    setDraggingAssignmentId(null);
  };

  const handleDrop = (targetAssignmentId: string) => {
    if (!draggingAssignmentId || draggingAssignmentId === targetAssignmentId) {
      setDraggingAssignmentId(null);
      return;
    }

    const sourceIndex = sortedAssignments.findIndex(
      (assignment) => assignment.menuItemOptionGroupId === draggingAssignmentId
    );
    const targetIndex = sortedAssignments.findIndex(
      (assignment) => assignment.menuItemOptionGroupId === targetAssignmentId
    );

    if (sourceIndex < 0 || targetIndex < 0) {
      setDraggingAssignmentId(null);
      return;
    }

    const reorderedAssignments = [...sortedAssignments];
    const [movedAssignment] = reorderedAssignments.splice(sourceIndex, 1);
    reorderedAssignments.splice(targetIndex, 0, movedAssignment);

    applySortedAssignments(reorderedAssignments);
    setDraggingAssignmentId(null);
  };

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
            <Card
              key={assignment.menuItemOptionGroupId}
              className={`overflow-hidden border-border shadow-sm transition-all ${
                draggingAssignmentId === assignment.menuItemOptionGroupId
                  ? "opacity-60 ring-2 ring-primary/30 shadow-lg scale-[0.99]"
                  : "hover:shadow-md cursor-grab active:cursor-grabbing"
              }`}
              draggable
              onDragStart={() => handleDragStart(assignment.menuItemOptionGroupId)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(assignment.menuItemOptionGroupId)}
            >
              <div className="flex items-center p-4 gap-4">
                <div className="flex flex-col items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    disabled={idx === 0}
                    onClick={() => handleReorder(idx, "up")}
                    title="Đưa lên trên"
                  >
                    <ArrowUp className="h-4 w-4 text-muted-foreground/70" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    disabled={idx === sortedAssignments.length - 1}
                    onClick={() => handleReorder(idx, "down")}
                    title="Đưa xuống dưới"
                  >
                    <ArrowDown className="h-4 w-4 text-muted-foreground/70" />
                  </Button>
                </div>

                {/* Group Identity */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">
                      {assignment.optionGroup?.name}
                    </span>
                    {String(assignment.optionGroup?.optionType) === "1" ? (
                      <Badge
                        variant="outline"
                        className="bg-orange-50 border-orange-200 text-orange-600 uppercase text-[9px] font-bold px-1.5 py-0 gap-1 shadow-sm h-5"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        {UI_TEXT.MENU.OPTIONS.TYPE_SINGLE}
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-indigo-50 border-indigo-200 text-indigo-600 uppercase text-[9px] font-bold px-1.5 py-0 gap-1 shadow-sm h-5"
                      >
                        <ListChecks className="w-3 h-3" />
                        {UI_TEXT.MENU.OPTIONS.TYPE_MULTI}
                      </Badge>
                    )}
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
                <div className="flex items-center gap-4 border-l pl-4 border-border/50">
                  <div className="flex flex-col items-center gap-1">
                    <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      {UI_TEXT.MENU.OPTIONS.REQUIRED_LABEL}
                    </Label>
                    <Switch
                      className="h-5 w-9 scale-90"
                      checked={assignment.isRequired}
                      onCheckedChange={(val) =>
                        handleUpdateAssignment(assignment.menuItemOptionGroupId, {
                          isRequired: val,
                        })
                      }
                    />
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      {UI_TEXT.MENU.OPTIONS.MIN_SELECT}
                    </Label>
                    <Input
                      type="number"
                      className="h-7 w-12 text-center text-xs p-1"
                      value={assignment.minSelect}
                      onChange={(e) =>
                        handleUpdateAssignment(assignment.menuItemOptionGroupId, {
                          minSelect: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      {UI_TEXT.MENU.OPTIONS.MAX_SELECT}
                    </Label>
                    <Input
                      type="number"
                      className="h-7 w-12 text-center text-xs p-1"
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
                    className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/10 ml-2"
                    onClick={() => handleUnassign(assignment.menuItemOptionGroupId)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
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
    </div>
  );
};

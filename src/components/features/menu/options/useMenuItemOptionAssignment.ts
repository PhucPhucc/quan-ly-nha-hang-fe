import { useState } from "react";
import { toast } from "sonner";

import { optionService } from "@/services/optionService";
import { MenuItemOptionGroup, OptionGroup } from "@/types/Menu";

export function useMenuItemOptionAssignment(
  assignments: MenuItemOptionGroup[],
  setAssignments: (assignments: MenuItemOptionGroup[]) => void,
  menuItemId: string
) {
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

  return {
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
  };
}

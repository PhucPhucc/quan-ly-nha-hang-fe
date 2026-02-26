"use client";

import { useCallback, useEffect, useReducer } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { optionService } from "@/services/optionService";
import { MenuItem, OptionGroup, OptionItem } from "@/types/Menu";

import { OptionGroupForm } from "./option/OptionGroupForm";
import { OptionGroupList } from "./option/OptionGroupList";
import { OptionItemForm } from "./option/OptionItemForm";
import { OptionItemList } from "./option/OptionItemList";

interface OptionManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menuItem: MenuItem | null;
}

type State = {
  optionGroups: OptionGroup[];
  selectedGroup: OptionGroup | null;
  loading: boolean;
  isGroupFormOpen: boolean;
  editingGroup: OptionGroup | null;
  isItemFormOpen: boolean;
  editingItem: OptionItem | null;
};

type Action =
  | { type: "SET_GROUPS"; payload: OptionGroup[] }
  | { type: "SET_SELECTED_GROUP"; payload: OptionGroup | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "OPEN_GROUP_FORM"; payload: OptionGroup | null }
  | { type: "CLOSE_GROUP_FORM" }
  | { type: "OPEN_ITEM_FORM"; payload: OptionItem | null }
  | { type: "CLOSE_ITEM_FORM" }
  | { type: "RESET" };

const initialState: State = {
  optionGroups: [],
  selectedGroup: null,
  loading: false,
  isGroupFormOpen: false,
  editingGroup: null,
  isItemFormOpen: false,
  editingItem: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_GROUPS":
      return { ...state, optionGroups: action.payload };
    case "SET_SELECTED_GROUP":
      return { ...state, selectedGroup: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "OPEN_GROUP_FORM":
      return { ...state, isGroupFormOpen: true, editingGroup: action.payload };
    case "CLOSE_GROUP_FORM":
      return { ...state, isGroupFormOpen: false, editingGroup: null };
    case "OPEN_ITEM_FORM":
      return { ...state, isItemFormOpen: true, editingItem: action.payload };
    case "CLOSE_ITEM_FORM":
      return { ...state, isItemFormOpen: false, editingItem: null };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export function OptionManagementDialog({
  open,
  onOpenChange,
  menuItem,
}: OptionManagementDialogProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    optionGroups,
    selectedGroup,
    loading,
    isGroupFormOpen,
    editingGroup,
    isItemFormOpen,
    editingItem,
  } = state;

  const fetchData = useCallback(async () => {
    if (!menuItem) return;
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const res = await optionService.getOptionGroupsByMenuItem(menuItem.menuItemId);
      if (res.isSuccess && res.data) {
        dispatch({ type: "SET_GROUPS", payload: res.data });
      }
    } catch {
      toast.error("Không thể tải danh sách tùy chọn");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [menuItem]);

  // Sync selectedGroup when optionGroups change
  useEffect(() => {
    if (optionGroups.length > 0) {
      if (selectedGroup) {
        const updatedGroup = optionGroups.find(
          (g) => g.optionGroupId === selectedGroup.optionGroupId
        );
        dispatch({ type: "SET_SELECTED_GROUP", payload: updatedGroup || optionGroups[0] });
      } else {
        dispatch({ type: "SET_SELECTED_GROUP", payload: optionGroups[0] });
      }
    } else {
      dispatch({ type: "SET_SELECTED_GROUP", payload: null });
    }
  }, [optionGroups, selectedGroup?.optionGroupId]);

  useEffect(() => {
    if (open && menuItem) {
      fetchData();
    } else {
      dispatch({ type: "RESET" });
    }
  }, [open, menuItem, fetchData]);

  // --- Group Handlers ---

  const handleOpenGroupForm = (group?: OptionGroup) => {
    dispatch({ type: "OPEN_GROUP_FORM", payload: group || null });
  };

  const handleSaveGroup = async (data: Partial<OptionGroup>) => {
    if (!menuItem) return;
    try {
      if (editingGroup) {
        await optionService.updateOptionGroup(editingGroup.optionGroupId, {
          ...data,
          optionGroupId: editingGroup.optionGroupId,
        });
        toast.success("Đã cập nhật nhóm tùy chọn");
      } else {
        await optionService.createOptionGroup({
          ...data,
          menuItemId: menuItem.menuItemId,
          optionType: 1, // Default type
          sortOrder: optionGroups.length + 1,
          isActive: true,
        });
        toast.success("Đã tạo nhóm tùy chọn mới");
      }
      fetchData();
    } catch {
      toast.error("Lỗi khi lưu nhóm tùy chọn");
    }
  };

  const handleDeleteGroup = async (group: OptionGroup) => {
    if (!confirm(`Bạn có chắc muốn xóa nhóm "${group.name}"?`)) return;
    try {
      await optionService.deleteOptionGroup(group.optionGroupId);
      toast.success("Đã xóa nhóm tùy chọn");
      if (selectedGroup?.optionGroupId === group.optionGroupId) {
        dispatch({ type: "SET_SELECTED_GROUP", payload: null });
      }
      fetchData();
    } catch {
      toast.error("Lỗi khi xóa nhóm tùy chọn");
    }
  };

  // --- Item Handlers ---

  const handleOpenItemForm = (item?: OptionItem) => {
    dispatch({ type: "OPEN_ITEM_FORM", payload: item || null });
  };

  const handleSaveItem = async (data: Partial<OptionItem>) => {
    if (!selectedGroup) return;
    try {
      if (editingItem) {
        await optionService.updateOptionItem(editingItem.optionItemId, {
          ...editingItem, // Keep existing fields
          ...data,
          optionItemId: editingItem.optionItemId,
        });
        toast.success("Đã cập nhật lựa chọn");
      } else {
        await optionService.createOptionItem({
          ...data,
          optionGroupId: selectedGroup.optionGroupId,
          isActive: true,
          sortOrder: (selectedGroup.optionItems?.length || 0) + 1,
          value: data.label, // Default value same as label
        });
        toast.success("Đã thêm lựa chọn mới");
      }
      fetchData();
    } catch {
      toast.error("Lỗi khi lưu lựa chọn");
    }
  };

  const handleDeleteItem = async (item: OptionItem) => {
    if (!confirm(`Bạn có chắc muốn xóa "${item.label}"?`)) return;
    try {
      await optionService.deleteOptionItem(item.optionItemId);
      toast.success("Đã xóa lựa chọn");
      fetchData();
    } catch {
      toast.error("Lỗi khi xóa lựa chọn");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            Quản lý Tùy chọn: <span className="text-primary">{menuItem?.name}</span>
          </DialogTitle>
          <DialogDescription>
            Cấu hình các nhóm tùy chọn (Size, Topping, Đường, Đá...) cho món ăn.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex min-h-0">
          {/* Left Pane: Groups List */}
          <OptionGroupList
            optionGroups={optionGroups}
            selectedGroup={selectedGroup}
            loading={loading}
            onSelectGroup={(group) => dispatch({ type: "SET_SELECTED_GROUP", payload: group })}
            onOpenGroupForm={handleOpenGroupForm}
            onDeleteGroup={handleDeleteGroup}
          />

          {/* Right Pane: Items List */}
          <OptionItemList
            selectedGroup={selectedGroup}
            onOpenItemForm={handleOpenItemForm}
            onDeleteItem={handleDeleteItem}
          />
        </div>
      </DialogContent>

      {/* Nested Dialog for Group Form */}
      <OptionGroupForm
        key={editingGroup?.optionGroupId || "new-group"}
        open={isGroupFormOpen}
        onOpenChange={(isOpen) => !isOpen && dispatch({ type: "CLOSE_GROUP_FORM" })}
        initialData={editingGroup}
        onSubmit={handleSaveGroup}
      />

      {/* Nested Dialog for Item Form */}
      <OptionItemForm
        key={editingItem?.optionItemId || "new-item"}
        open={isItemFormOpen}
        onOpenChange={(isOpen) => !isOpen && dispatch({ type: "CLOSE_ITEM_FORM" })}
        initialData={editingItem}
        onSubmit={handleSaveItem}
      />
    </Dialog>
  );
}

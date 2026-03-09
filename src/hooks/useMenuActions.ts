// hooks/useMenuActions.ts
import { useState } from "react";

import { UI_TEXT } from "@/lib/UI_Text";
import { menuService, setMenuService } from "@/services/menuService";
import type {
  MenuItem,
  MenuItemUpdateBody,
  SetMenu,
  SetMenuCreateBody,
  SetMenuUpdateBody,
} from "@/types/Menu";

import type { MenuDataItem } from "./useMenuFilters";

export function useMenuActions(menuData: MenuDataItem[], refetch: () => Promise<void>) {
  // --- States quản lý đóng/mở Dialog ---
  const [isCreateItemOpen, setIsCreateItemOpen] = useState(false);
  const [isUpdateItemOpen, setIsUpdateItemOpen] = useState(false);
  const [isCreateSetOpen, setIsCreateSetOpen] = useState(false);
  const [isUpdateSetOpen, setIsUpdateSetOpen] = useState(false);

  // --- States quản lý dữ liệu đang Edit ---
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [editSet, setEditSet] = useState<SetMenu | null>(null);

  // ================= HELPER FUNCTIONS (UI) =================

  const openCreateItem = () => setIsCreateItemOpen(true);

  const openUpdateItem = (it: MenuItem) => {
    setEditItem(it);
    setIsUpdateItemOpen(true);
  };

  const openCreateSet = () => {
    setEditSet(null);
    setIsCreateSetOpen(true);
  };

  const openEditSet = async (it: SetMenu) => {
    if (!it.setMenuId) return;
    const res = await setMenuService.getById(it.setMenuId);
    if (res.isSuccess && res.data) {
      setEditSet(res.data);
      setIsUpdateSetOpen(true);
    }
  };

  // ================= API HANDLERS (CRUD) =================

  const handleCreateMenuItem = async (formData: FormData) => {
    try {
      await menuService.create(formData);
      setIsCreateItemOpen(false);
      await refetch();
      alert(UI_TEXT.MENU.SAVE_SUCCESS);
    } catch {
      alert("Lỗi khi tạo món lẻ");
    }
  };

  const handleUpdateMenuItem = async (payload: MenuItemUpdateBody) => {
    try {
      await menuService.update(payload.menuItemId, payload);
      setIsUpdateItemOpen(false);
      await refetch();
      alert(UI_TEXT.MENU.SAVE_SUCCESS);
    } catch {
      alert("Lỗi khi cập nhật món lẻ");
    }
  };

  const handleCreateSetMenu = async (payload: SetMenuCreateBody) => {
    try {
      await setMenuService.create(payload);
      setIsCreateSetOpen(false);
      await refetch();
      alert(UI_TEXT.MENU.SAVE_SUCCESS);
    } catch {
      alert("Lỗi khi tạo combo mới");
    }
  };

  const handleUpdateSetMenu = async (payload: SetMenuUpdateBody) => {
    const targetId = payload.setMenuId || editSet?.setMenuId;
    if (!targetId) return alert("Không tìm thấy ID Combo!");
    try {
      await setMenuService.update(targetId, payload);
      setIsUpdateSetOpen(false);
      await refetch();
      alert(UI_TEXT.MENU.SAVE_SUCCESS);
    } catch {
      alert("Lỗi khi cập nhật combo");
    }
  };

  const handleDelete = async (it: MenuDataItem) => {
    const id = it.type === "combo" ? it.setMenuId : it.menuItemId;
    if (!id || !window.confirm(UI_TEXT.MENU.DELETE_CONFIRM(it.name))) return;
    try {
      if (it.type === "combo") await setMenuService.delete(id);
      else await menuService.delete(id);
      await refetch();
      alert(UI_TEXT.MENU.DELETE_SUCCESS);
    } catch {
      alert("Lỗi khi xóa");
    }
  };

  const handleToggleStock = async (id: string) => {
    const found = menuData.find((m) =>
      m.type === "combo" ? m.setMenuId === id : m.menuItemId === id
    );
    if (!found) return;
    try {
      const newStatus = !found.isOutOfStock;
      if (found.type === "combo") await setMenuService.updateStock(id, newStatus);
      else await menuService.updateStock(id, newStatus);
      await refetch();
    } catch {
      alert(UI_TEXT.MENU.UPDATE_STOCK_ERROR);
    }
  };

  // Gom tất cả vào actionProps để Page truyền đi cho gọn
  return {
    // Trả về lẻ để Page dùng điều khiển TopBar/Tabs
    dialogStates: {
      isCreateItemOpen,
      setIsCreateItemOpen,
      isUpdateItemOpen,
      setIsUpdateItemOpen,
      isCreateSetOpen,
      setIsCreateSetOpen,
      isUpdateSetOpen,
      setIsUpdateSetOpen,
    },
    editData: {
      editItem,
      setEditItem,
      editSet,
      setEditSet,
    },
    handlers: {
      handleCreateMenuItem,
      handleUpdateMenuItem,
      handleCreateSetMenu,
      handleUpdateSetMenu,
      handleDelete,
      handleToggleStock,
      openCreateItem,
      openUpdateItem,
      openCreateSet,
      openEditSet,
    },
  };
}

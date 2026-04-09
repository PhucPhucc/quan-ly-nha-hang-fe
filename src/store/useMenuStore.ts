// Assuming sonner is used for toasts based on typical shadcn projects, if not, adjust later. Replace if not needed.
import { toast } from "sonner";
import { create } from "zustand";

import { menuService } from "@/services/menuService";
import { ApiResponse } from "@/types/Api";
import { MenuFilter, MenuItem, SetMenu } from "@/types/Menu";

interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

const DEFAULT_PAGINATION: PaginationState = {
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
};

const PAGE_SIZE = 10;

interface MenuState {
  menuItems: MenuItem[];
  setMenus: SetMenu[];
  isLoadingItems: boolean;
  isLoadingCombos: boolean;
  filter: MenuFilter;

  // UI States
  searchQuery: string;
  categoryId: string;
  showOutOfStock: boolean;
  isModalOpen: boolean;
  editingItem: MenuItem | SetMenu | null;

  // Pagination States (separate for items and combos)
  itemPagination: PaginationState;
  comboPagination: PaginationState;
  pageSize: number;

  // Actions
  setFilter: (filter: Partial<MenuFilter>) => void;
  setSearchQuery: (query: string) => void;
  setCategoryId: (id: string) => void;
  setShowOutOfStock: (show: boolean) => void;
  setModalOpen: (isOpen: boolean) => void;
  setEditingItem: (item: MenuItem | SetMenu | null) => void;
  setItemPage: (page: number) => void;
  setComboPage: (page: number) => void;
  fetchMenuItems: (page?: number, pageSize?: number) => Promise<void>;
  fetchSetMenus: (page?: number, pageSize?: number) => Promise<void>;
  addMenuItem: (item: Partial<MenuItem>) => Promise<MenuItem | undefined>;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => Promise<MenuItem | undefined>;
  deleteMenuItem: (id: string) => Promise<void>;
  toggleMenuItemStock: (id: string, isOutOfStock: boolean) => Promise<void>;

  addSetMenu: (item: Partial<SetMenu>) => Promise<void>;
  updateSetMenu: (id: string, item: Partial<SetMenu>) => Promise<ApiResponse<SetMenu>>;
  deleteSetMenu: (id: string) => Promise<void>;
  toggleSetMenuStock: (id: string, isOutOfStock: boolean) => Promise<void>;
}

export const useMenuStore = create<MenuState>((set, get) => ({
  menuItems: [],
  setMenus: [],
  isLoadingItems: false,
  isLoadingCombos: false,
  filter: {},

  searchQuery: "",
  categoryId: "all",
  showOutOfStock: false,
  isModalOpen: false,
  editingItem: null,

  itemPagination: { ...DEFAULT_PAGINATION },
  comboPagination: { ...DEFAULT_PAGINATION },
  pageSize: PAGE_SIZE,

  setFilter: (filter) =>
    set((state) => ({
      filter: { ...state.filter, ...filter },
      itemPagination: { ...DEFAULT_PAGINATION },
      comboPagination: { ...DEFAULT_PAGINATION },
    })),
  setSearchQuery: (searchQuery) =>
    set({
      searchQuery,
      itemPagination: { ...DEFAULT_PAGINATION },
      comboPagination: { ...DEFAULT_PAGINATION },
    }),
  setCategoryId: (categoryId) =>
    set({
      categoryId,
      itemPagination: { ...DEFAULT_PAGINATION },
      comboPagination: { ...DEFAULT_PAGINATION },
    }),
  setShowOutOfStock: (showOutOfStock) =>
    set({
      showOutOfStock,
      itemPagination: { ...DEFAULT_PAGINATION },
      comboPagination: { ...DEFAULT_PAGINATION },
    }),
  setModalOpen: (isModalOpen) => set({ isModalOpen }),
  setEditingItem: (editingItem) => set({ editingItem }),

  setItemPage: (page: number) => {
    get().fetchMenuItems(page);
  },

  setComboPage: (page: number) => {
    get().fetchSetMenus(page);
  },

  fetchMenuItems: async (currentPage = 1, pageSize = get().pageSize) => {
    set({ isLoadingItems: true });
    try {
      const response = await menuService.getAll(currentPage, pageSize);
      if (response.isSuccess && response.data) {
        set({
          menuItems: response.data.items,
          itemPagination: {
            currentPage: response.data.pageNumber || currentPage,
            totalPages:
              response.data.totalPages || Math.ceil(response.data.totalCount / pageSize) || 1,
            totalCount: response.data.totalCount,
          },
        });
      }
    } catch (error) {
      console.error("Failed to fetch menu items:", error);
    } finally {
      set({ isLoadingItems: false });
    }
  },

  fetchSetMenus: async (pageNumber = 1, pageSize = get().pageSize) => {
    set({ isLoadingCombos: true });
    try {
      const response = await menuService.getAllSetMenu(pageNumber, pageSize);
      if (response.isSuccess && response.data) {
        set({
          setMenus: response.data.items,
          comboPagination: {
            currentPage: response.data.pageNumber || pageNumber,
            totalPages:
              response.data.totalPages || Math.ceil(response.data.totalCount / pageSize) || 1,
            totalCount: response.data.totalCount,
          },
        });
      }
    } catch (error) {
      console.error("Failed to fetch set menus:", error);
    } finally {
      set({ isLoadingCombos: false });
    }
  },

  addMenuItem: async (item) => {
    set({ isLoadingItems: true });
    try {
      const response = await menuService.create(item);
      if (response.isSuccess && response.data) {
        // Re-fetch to ensure consistency, or optimistic update
        const currentItems = get().menuItems;
        set({ menuItems: [response.data, ...currentItems] });
        return response.data;
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add menu item");
      console.error("Failed to add menu item:", error);
    } finally {
      set({ isLoadingItems: false });
    }
  },

  updateMenuItem: async (id, item) => {
    set({ isLoadingItems: true });
    try {
      const response = await menuService.update(id, item);
      if (response.isSuccess && response.data) {
        const updatedItem = response.data;
        set((state) => ({
          menuItems: state.menuItems.map((m) =>
            m.menuItemId === id ? { ...m, ...updatedItem } : m
          ),
        }));
        return updatedItem;
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update menu item");
      console.error("Failed to update menu item:", error);
    } finally {
      set({ isLoadingItems: false });
    }
  },

  deleteMenuItem: async (id) => {
    set({ isLoadingItems: true });
    try {
      const response = await menuService.delete(id);
      if (response.isSuccess) {
        set((state) => ({
          menuItems: state.menuItems.filter((m) => m.menuItemId !== id),
        }));
      }
    } catch (error) {
      console.error("Failed to delete menu item:", error);
    } finally {
      set({ isLoadingItems: false });
    }
  },

  toggleMenuItemStock: async (id, isOutOfStock) => {
    try {
      const response = await menuService.toggleStock(id, isOutOfStock);
      if (response.isSuccess) {
        set((state) => ({
          menuItems: state.menuItems.map((m) => (m.menuItemId === id ? { ...m, isOutOfStock } : m)),
        }));
      }
    } catch (error) {
      console.error("Failed to toggle stock:", error);
    }
  },

  addSetMenu: async (item) => {
    set({ isLoadingCombos: true });
    try {
      const response = await menuService.createSetMenu(item);
      if (response.isSuccess && response.data) {
        const currentItems = get().setMenus;
        set({ setMenus: [response.data, ...currentItems] });
      }
    } catch (error) {
      console.error("Failed to add set menu:", error);
    } finally {
      set({ isLoadingCombos: false });
    }
  },

  updateSetMenu: async (id, item) => {
    set({ isLoadingCombos: true });
    try {
      const response = await menuService.updateSetMenu(id, item);
      if (response.isSuccess) {
        await get().fetchSetMenus();
      }
      return response;
    } catch (error) {
      console.error("Failed to update set menu:", error);
      throw error;
    } finally {
      set({ isLoadingCombos: false });
    }
  },

  deleteSetMenu: async (id) => {
    set({ isLoadingCombos: true });
    try {
      const response = await menuService.deleteSetMenu(id);
      if (response.isSuccess) {
        set((state) => ({
          setMenus: state.setMenus.filter((m) => m.setMenuId !== id),
        }));
      }
    } catch (error) {
      console.error("Failed to delete set menu:", error);
    } finally {
      set({ isLoadingCombos: false });
    }
  },

  toggleSetMenuStock: async (id, isOutOfStock) => {
    try {
      const response = await menuService.updateSetMenuStock(id, isOutOfStock);
      if (response.isSuccess) {
        set((state) => ({
          setMenus: state.setMenus.map((m) => (m.setMenuId === id ? { ...m, isOutOfStock } : m)),
        }));
      }
    } catch (error) {
      console.error("Failed to toggle set menu stock:", error);
    } finally {
    }
  },
}));

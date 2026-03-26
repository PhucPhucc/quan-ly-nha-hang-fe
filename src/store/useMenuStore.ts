// Assuming sonner is used for toasts based on typical shadcn projects, if not, adjust later. Replace if not needed.
import { toast } from "sonner";
import { create } from "zustand";

import { menuService } from "@/services/menuService";
import { MenuFilter, MenuItem, SetMenu } from "@/types/Menu";

interface MenuState {
  menuItems: MenuItem[];
  setMenus: SetMenu[];
  isLoading: boolean;
  filter: MenuFilter;

  // UI States
  searchQuery: string;
  categoryId: string;
  showOutOfStock: boolean;
  isModalOpen: boolean;
  editingItem: MenuItem | SetMenu | null;

  // Pagination UI States
  currentPage: number;
  totalItems: number;
  totalPages: number;
  pageSize: number;

  // Actions
  setFilter: (filter: Partial<MenuFilter>) => void;
  setSearchQuery: (query: string) => void;
  setCategoryId: (id: string) => void;
  setShowOutOfStock: (show: boolean) => void;
  setModalOpen: (isOpen: boolean) => void;
  setEditingItem: (item: MenuItem | SetMenu | null) => void;
  setCurrentPage: (page: number) => void;
  fetchMenuItems: (page?: number, pageSize?: number) => Promise<void>;
  fetchSetMenus: (page?: number, pageSize?: number) => Promise<void>;
  addMenuItem: (item: Partial<MenuItem>) => Promise<MenuItem | undefined>;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => Promise<MenuItem | undefined>;
  deleteMenuItem: (id: string) => Promise<void>;
  toggleMenuItemStock: (id: string, isOutOfStock: boolean) => Promise<void>;

  addSetMenu: (item: Partial<SetMenu>) => Promise<void>;
  updateSetMenu: (id: string, item: Partial<SetMenu>) => Promise<void>;
  deleteSetMenu: (id: string) => Promise<void>;
  toggleSetMenuStock: (id: string, isOutOfStock: boolean) => Promise<void>;
}

export const useMenuStore = create<MenuState>((set, get) => ({
  menuItems: [],
  setMenus: [],
  isLoading: false,
  filter: {},

  searchQuery: "",
  categoryId: "all",
  showOutOfStock: false,
  isModalOpen: false,
  editingItem: null,

  currentPage: 1,
  totalItems: 0,
  totalPages: 1,
  pageSize: 7,

  setFilter: (filter) =>
    set((state) => ({ filter: { ...state.filter, ...filter }, currentPage: 1 })),
  setSearchQuery: (searchQuery) => set({ searchQuery, currentPage: 1 }),
  setCategoryId: (categoryId) => set({ categoryId, currentPage: 1 }),
  setShowOutOfStock: (showOutOfStock) => set({ showOutOfStock, currentPage: 1 }),
  setModalOpen: (isModalOpen) => set({ isModalOpen }),
  setEditingItem: (editingItem) => set({ editingItem }),
  setCurrentPage: (currentPage) => set({ currentPage }),

  fetchMenuItems: async (currentPage = 1, pageSize = get().pageSize) => {
    set({ isLoading: true });
    try {
      const response = await menuService.getAll(currentPage, pageSize);
      if (response.isSuccess && response.data) {
        const isAllCategory = get().categoryId === "all";
        const combinedTotal = isAllCategory
          ? response.data.totalCount + get().setMenus.length
          : response.data.totalCount;

        set({
          menuItems: response.data.items,
          totalItems: response.data.totalCount,
          totalPages: isAllCategory
            ? Math.ceil(combinedTotal / pageSize) || 1
            : response.data.totalPages || Math.ceil(response.data.totalCount / pageSize) || 1,
          currentPage: response.data.currentPage || currentPage,
        });
      }
    } catch (error) {
      console.error("Failed to fetch menu items:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSetMenus: async (pageNumber = 1, pageSize = get().pageSize) => {
    set({ isLoading: true });
    try {
      const response = await menuService.getAllSetMenu(pageNumber, pageSize);
      if (response.isSuccess && response.data) {
        const state = get();
        // Check if current category is combo category
        // We probably don't have categories in store, so we can't easily check isComboCategorySelected here.
        // Wait, if we just update setMenus it's safe if we do it conditionally.
        // Let's pass an optional boolean to updatePagination?
        // Actually, we can just update it. Wait, no.

        // A simple fix is to always update if we are not fetching BOTH.
        // But how does useMenuStore know if it's fetching both?
        // Let's look at MenuManagement.tsx.
        // It fetches BOTH if categoryId === 'all'.

        const isAllCategory = get().categoryId === "all";

        if (isAllCategory) {
          const combinedTotal = get().totalItems + response.data.items.length;
          set({
            setMenus: response.data.items,
            totalPages: Math.ceil(combinedTotal / pageSize) || 1,
          });
        } else {
          set({
            setMenus: response.data.items,
            totalItems: response.data.totalCount,
            totalPages:
              response.data.totalPages || Math.ceil(response.data.totalCount / pageSize) || 1,
            currentPage: response.data.currentPage || pageNumber,
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch set menus:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addMenuItem: async (item) => {
    set({ isLoading: true });
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
      set({ isLoading: false });
    }
  },

  updateMenuItem: async (id, item) => {
    set({ isLoading: true });
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
      set({ isLoading: false });
    }
  },

  deleteMenuItem: async (id) => {
    set({ isLoading: true });
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
      set({ isLoading: false });
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
    set({ isLoading: true });
    try {
      const response = await menuService.createSetMenu(item);
      if (response.isSuccess && response.data) {
        const currentItems = get().setMenus;
        set({ setMenus: [response.data, ...currentItems] });
      }
    } catch (error) {
      console.error("Failed to add set menu:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateSetMenu: async (id, item) => {
    set({ isLoading: true });
    try {
      const response = await menuService.updateSetMenu(id, item);
      if (response.isSuccess && response.data) {
        const updatedItem = response.data;
        set((state) => ({
          setMenus: state.setMenus.map((m) => (m.setMenuId === id ? { ...m, ...updatedItem } : m)),
        }));
      }
    } catch (error) {
      console.error("Failed to update set menu:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteSetMenu: async (id) => {
    set({ isLoading: true });
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
      set({ isLoading: false });
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

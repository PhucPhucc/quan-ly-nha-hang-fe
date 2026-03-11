"use client";

import { toast } from "sonner";
import { create } from "zustand";

import { categoryService } from "@/services/categoryService";
import { menuService } from "@/services/menuService";
import { Category, MenuItem } from "@/types/Menu";

type MenuStore = {
  categories: Category[];
  menuItems: MenuItem[];
  loading: boolean;

  activeTab: string;
  selectedItem: MenuItem | null;
  isOptionDialogOpen: boolean;

  fetchData: () => Promise<void>;
  setActiveTab: (tab: string) => void;
  setLoading: (loading: boolean) => void;
  openOptionDialog: (item: MenuItem) => void;
  closeOptionDialog: () => void;
};

export const useMenuStore = create<MenuStore>((set) => ({
  categories: [],
  menuItems: [],
  loading: true,

  activeTab: "all",
  selectedItem: null,
  isOptionDialogOpen: false,

  fetchData: async () => {
    try {
      set({ loading: true });

      const [catRes, menuRes] = await Promise.all([
        categoryService.getAll(),
        menuService.getAll(1, 1000),
      ]);

      set({
        categories: catRes.isSuccess ? (catRes.data?.items ?? []) : [],
        menuItems: menuRes.isSuccess ? (menuRes.data?.items ?? []) : [],
      });
    } catch (error) {
      toast.error("Không thể tải thực đơn: " + (error instanceof Error ? error.message : ""));
    } finally {
      set({ loading: false });
    }
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setLoading: (loading) => set({ loading }),

  openOptionDialog: (item) => set({ selectedItem: item, isOptionDialogOpen: true }),

  closeOptionDialog: () => set({ selectedItem: null, isOptionDialogOpen: false }),
}));

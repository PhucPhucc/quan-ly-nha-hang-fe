"use client";

import React, { useEffect, useState } from "react";

import { categoryService } from "@/services/categoryService";
import { useMenuStore } from "@/store/useMenuStore";

import { MenuFilterBar } from "./MenuFilterBar";
import { MenuFormModal } from "./MenuFormModal";
import { MenuList } from "./MenuList";
import MenuPagination from "./MenuPagination";

export const MenuManagement: React.FC = () => {
  const fetchMenuItems = useMenuStore((state) => state.fetchMenuItems);
  const fetchSetMenus = useMenuStore((state) => state.fetchSetMenus);
  const [categories, setCategories] = useState<{ id: string; name: string; type: number }[]>([]);

  useEffect(() => {
    fetchMenuItems();
    fetchSetMenus();

    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAll();
        if (response.isSuccess && response.data && response.data.items) {
          const activeCategories = response.data.items
            .filter((c) => c.isActive)
            .map((c) => ({
              id: c.categoryId,
              name: c.name,
              type: c.type,
            }));
          setCategories(activeCategories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, [fetchMenuItems, fetchSetMenus]);

  return (
    <div className="px-4 space-y-6 py-2 animate-in fade-in duration-500">
      <MenuFilterBar categories={categories} />

      <MenuList categories={categories} />

      <MenuPagination />

      <MenuFormModal categories={categories} />
    </div>
  );
};

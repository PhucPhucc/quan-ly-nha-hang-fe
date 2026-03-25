"use client";

import React, { useEffect, useState } from "react";

import { categoryService } from "@/services/categoryService";
import { useMenuStore } from "@/store/useMenuStore";
import { Category } from "@/types/Menu";

import { MenuFilterBar } from "./MenuFilterBar";
import { MenuFormModal } from "./MenuFormModal";
import { MenuList } from "./MenuList";
import MenuPagination from "./MenuPagination";

export const MenuManagement: React.FC = () => {
  const { fetchMenuItems, fetchSetMenus, currentPage, categoryId, pageSize } = useMenuStore();

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const isComboCategorySelected = categories.find((c) => c.categoryId === categoryId)?.type === 2;

    if (categoryId === "all") {
      fetchMenuItems(currentPage, pageSize);
      fetchSetMenus(currentPage, pageSize);
    } else if (isComboCategorySelected) {
      fetchSetMenus(currentPage, pageSize);
    } else {
      fetchMenuItems(currentPage, pageSize);
    }
  }, [fetchMenuItems, fetchSetMenus, currentPage, categoryId, pageSize, categories]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAll();
        if (response.isSuccess && response.data && response.data.items) {
          const activeCategories = response.data.items
            .filter((c) => c.isActive)
            .map((c) => ({
              categoryId: c.categoryId,
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
    <div className="p-6 space-y-6">
      <MenuFilterBar categories={categories} />

      <MenuList categories={categories} />

      <MenuPagination />

      <MenuFormModal categories={categories} />
    </div>
  );
};

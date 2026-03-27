"use client";

import React, { useEffect, useState } from "react";

import { categoryService } from "@/services/categoryService";
import { useMenuStore } from "@/store/useMenuStore";
import { Category } from "@/types/Menu";

import { MenuFilterBar } from "./MenuFilterBar";
import { MenuFormModal } from "./MenuFormModal";
import { MenuList } from "./MenuList";

const MENU_FILTER_ALL = "all";
const MENU_FILTER_ITEM = "item";
const MENU_FILTER_COMBO = "combo";
const MENU_MANAGEMENT_FETCH_SIZE = 100;

export const MenuManagement: React.FC = () => {
  const { fetchMenuItems, fetchSetMenus, categoryId } = useMenuStore();

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const selectedCategory = categories.find((category) => category.categoryId === categoryId);
    const isAllFilter = categoryId === MENU_FILTER_ALL;
    const isItemFilter = categoryId === MENU_FILTER_ITEM;
    const isComboFilter = categoryId === MENU_FILTER_COMBO;
    const isSpecificMenuItemCategory = Boolean(selectedCategory && selectedCategory.type !== 2);

    if (isComboFilter) {
      fetchSetMenus(1, MENU_MANAGEMENT_FETCH_SIZE);
      return;
    }

    fetchMenuItems(1, MENU_MANAGEMENT_FETCH_SIZE);

    if (isAllFilter || (!isItemFilter && !isSpecificMenuItemCategory)) {
      fetchSetMenus(1, MENU_MANAGEMENT_FETCH_SIZE);
    }
  }, [fetchMenuItems, fetchSetMenus, categoryId, categories]);

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

      <MenuFormModal categories={categories} />
    </div>
  );
};

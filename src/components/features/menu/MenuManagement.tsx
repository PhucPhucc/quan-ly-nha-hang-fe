"use client";

import React, { useEffect, useState } from "react";

import { categoryService } from "@/services/categoryService";
import { useMenuStore } from "@/store/useMenuStore";

import { MenuFilterBar } from "./MenuFilterBar";
import { MenuFormModal } from "./MenuFormModal";
import { MenuList } from "./MenuList";

export const MenuManagement: React.FC = () => {
  const fetchMenuItems = useMenuStore((state) => state.fetchMenuItems);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetchMenuItems();

    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAll();
        if (response.isSuccess && response.data && response.data.items) {
          const activeCategories = response.data.items
            .filter((c) => c.isActive)
            .map((c) => ({
              id: c.categoryId,
              name: c.name,
            }));
          setCategories(activeCategories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, [fetchMenuItems]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <MenuFilterBar categories={categories} />

      <MenuList />

      <MenuFormModal categories={categories} />
    </div>
  );
};

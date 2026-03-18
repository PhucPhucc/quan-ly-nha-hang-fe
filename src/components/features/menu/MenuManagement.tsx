"use client";

import React, { useEffect, useState } from "react";

import { categoryService } from "@/services/categoryService";
import { useMenuStore } from "@/store/useMenuStore";

import { MenuFilterBar } from "./MenuFilterBar";
import { MenuFormModal } from "./MenuFormModal";
import { MenuList } from "./MenuList";
import MenuPagination from "./MenuPagination";

export const MenuManagement: React.FC = () => {
  const { menuItems = [], searchQuery, categoryId } = useMenuStore();
  const fetchMenuItems = useMenuStore((state) => state.fetchMenuItems);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const filteredCount = menuItems.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = categoryId === "all" || item.categoryId === categoryId;
    return matchSearch && matchCategory;
  }).length;

  const totalPages = Math.ceil(filteredCount / ITEMS_PER_PAGE);
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
      <MenuList currentPage={currentPage} itemsPerPage={ITEMS_PER_PAGE} />

      <MenuPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <MenuFormModal categories={categories} />
    </div>
  );
};

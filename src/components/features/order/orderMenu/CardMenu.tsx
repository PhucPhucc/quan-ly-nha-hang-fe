"use client";

import { UtensilsCrossed } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import LoadingSpinner from "@/components/shared/LoadingSpinner";
import PaginationTable from "@/components/shared/PaginationTable";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UI_TEXT } from "@/lib/UI_Text";
import { categoryService } from "@/services/categoryService";
import { useMenuStore } from "@/store/useMenuStore";
import { Category, MenuItem } from "@/types/Menu";

import { MenuOptionSelectionDialog } from "./MenuOptionSelectionDialog";
import OrderList from "./OrderList";

const MENU_ITEMS_PER_PAGE = 10;
const SET_MENUS_PER_PAGE = 5;
const TOTAL_PER_PAGE = MENU_ITEMS_PER_PAGE + SET_MENUS_PER_PAGE;

/**
 * Tính số lượng lấy từ mỗi nguồn (MenuItem / SetMenu) cho 1 trang.
 * Mục tiêu: 10 MenuItem + 5 SetMenu = 15.
 * Nếu bên nào hết trước thì bù từ bên còn lại.
 */
function computePageTakes(menuAvailable: number, setAvailable: number) {
  let menuTake = Math.min(MENU_ITEMS_PER_PAGE, menuAvailable);
  let setTake = Math.min(SET_MENUS_PER_PAGE, setAvailable);

  const menuUnfilled = MENU_ITEMS_PER_PAGE - menuTake;
  const setUnfilled = SET_MENUS_PER_PAGE - setTake;

  // MenuItem không đủ 10 → lấy thêm từ SetMenu
  if (menuUnfilled > 0) {
    const extraFromSet = Math.min(menuUnfilled, setAvailable - setTake);
    setTake += extraFromSet;
  }

  // SetMenu không đủ 5 → lấy thêm từ MenuItem
  if (setUnfilled > 0) {
    const extraFromMenu = Math.min(setUnfilled, menuAvailable - menuTake);
    menuTake += extraFromMenu;
  }

  return { menuTake, setTake };
}

const CardMenu = () => {
  const menuItems = useMenuStore((state) => state.menuItems);
  const setMenus = useMenuStore((state) => state.setMenus);
  const isLoading = useMenuStore((state) => state.isLoading);
  const fetchMenuItems = useMenuStore((state) => state.fetchMenuItems);
  const fetchSetMenus = useMenuStore((state) => state.fetchSetMenus);

  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isOptionDialogOpen, setIsOptionDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

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

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  }, []);

  const comboCategory = useMemo(() => {
    return categories.find(
      (c) =>
        c.type === 2 ||
        c.name.toLowerCase().includes("combo") ||
        c.name.toLowerCase().includes("set")
    );
  }, [categories]);

  const mappedSetMenus = useMemo<MenuItem[]>(() => {
    return setMenus.map((sm) => ({
      menuItemId: sm.setMenuId,
      setMenuId: sm.setMenuId,
      items: sm.items,
      name: sm.name,
      code: sm.code,
      description: sm.description || "",
      price: sm.price,
      costPrice: sm.costPrice,
      expectedTime: 15,
      imageUrl: sm.imageUrl || "",
      station: 1, // Default Station
      categoryId: comboCategory?.categoryId || "combo-category-id",
      categoryName: comboCategory?.name || "Combo",
      isOutOfStock: sm.isOutOfStock,
    }));
  }, [setMenus, comboCategory]);

  // Tách riêng 2 nguồn sau khi lọc theo category
  const filteredMenuItems = useMemo(() => {
    if (activeTab === "all") return menuItems;
    return menuItems.filter((item) => item.categoryId === activeTab);
  }, [menuItems, activeTab]);

  const filteredSetMenus = useMemo(() => {
    if (activeTab === "all") return mappedSetMenus;
    return mappedSetMenus.filter((item) => item.categoryId === activeTab);
  }, [mappedSetMenus, activeTab]);

  const totalItems = filteredMenuItems.length + filteredSetMenus.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / TOTAL_PER_PAGE));

  const paginatedItems = useMemo(() => {
    let menuOffset = 0;
    let setOffset = 0;

    // Tính offset bằng cách lặp qua các trang trước
    for (let p = 1; p < currentPage; p++) {
      const { menuTake, setTake } = computePageTakes(
        filteredMenuItems.length - menuOffset,
        filteredSetMenus.length - setOffset
      );
      menuOffset += menuTake;
      setOffset += setTake;
    }

    // Tính items cho trang hiện tại
    const { menuTake, setTake } = computePageTakes(
      filteredMenuItems.length - menuOffset,
      filteredSetMenus.length - setOffset
    );

    return [
      ...filteredMenuItems.slice(menuOffset, menuOffset + menuTake),
      ...filteredSetMenus.slice(setOffset, setOffset + setTake),
    ];
  }, [filteredMenuItems, filteredSetMenus, currentPage]);

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setIsOptionDialogOpen(true);
  };

  if (isLoading) {
    return <LoadingSpinner label={UI_TEXT.ORDER.FETCH_MENU} />;
  }

  return (
    <>
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full h-full flex flex-col bg-background overflow-hidden"
      >
        <div className="px-3 py-2 border-b bg-muted/20 overflow-x-auto no-scrollbar">
          <TabsList className="flex w-max justify-start gap-2 bg-transparent p-0 h-auto">
            <TabsTrigger
              value="all"
              className="rounded-full border border-transparent bg-transparent px-4 py-1.5 text-xs font-bold text-muted-foreground data-[state=active]:border-primary/20 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all uppercase tracking-wider"
            >
              {UI_TEXT.COMMON.ALL}
            </TabsTrigger>
            {categories.map((cat) => (
              <TabsTrigger
                key={cat.categoryId}
                value={cat.categoryId}
                className="rounded-full border border-transparent bg-transparent px-4 py-1.5 text-xs font-bold text-muted-foreground data-[state=active]:border-primary/20 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all uppercase tracking-wider whitespace-nowrap"
              >
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-4 custom-scrollbar">
          <TabsContent value={activeTab} className="m-0 h-full p-0 outline-none">
            {totalItems > 0 ? (
              <OrderList menuList={paginatedItems} onItemClick={handleItemClick} />
            ) : (
              <EmptyState
                title="Trống"
                description="Danh mục này hiện chưa có món nào"
                icon={UtensilsCrossed}
              />
            )}
          </TabsContent>
        </div>

        {totalPages > 1 && (
          <PaginationTable
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </Tabs>

      <MenuOptionSelectionDialog
        open={isOptionDialogOpen}
        onOpenChange={setIsOptionDialogOpen}
        menuItem={selectedItem}
      />
    </>
  );
};

export default CardMenu;

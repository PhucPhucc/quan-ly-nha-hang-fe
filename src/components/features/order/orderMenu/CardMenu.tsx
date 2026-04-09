"use client";

import { UtensilsCrossed } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import LoadingSpinner from "@/components/shared/LoadingSpinner";
import PaginationTable from "@/components/shared/PaginationTable";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UI_TEXT } from "@/lib/UI_Text";
import { categoryService } from "@/services/categoryService";
import { useMenuStore } from "@/store/useMenuStore";
import { Category, MenuItem } from "@/types/Menu";

import { MenuOptionSelectionDialog } from "./MenuOptionSelectionDialog";
import OrderList from "./OrderList";

const CardMenu = () => {
  const menuItems = useMenuStore((state) => state.menuItems);
  const setMenus = useMenuStore((state) => state.setMenus);
  const isLoading = useMenuStore((state) => state.isLoadingItems || state.isLoadingCombos);
  const fetchMenuItems = useMenuStore((state) => state.fetchMenuItems);
  const fetchSetMenus = useMenuStore((state) => state.fetchSetMenus);

  const itemPagination = useMenuStore((state) => state.itemPagination);
  const comboPagination = useMenuStore((state) => state.comboPagination);
  const setItemPage = useMenuStore((state) => state.setItemPage);
  const setComboPage = useMenuStore((state) => state.setComboPage);

  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState("all");
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

  const isComboTab = comboCategory && activeTab === comboCategory.categoryId;
  const isItemTab = activeTab !== "all" && !isComboTab;

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
          <TabsContent
            value={activeTab}
            className="m-0 min-h-full p-0 outline-none flex flex-col gap-6 pb-6"
          >
            {filteredMenuItems.length === 0 && filteredSetMenus.length === 0 && (
              <EmptyState
                title="Trống"
                description="Danh mục này hiện chưa có món nào"
                icon={UtensilsCrossed}
              />
            )}

            {(activeTab === "all" || isItemTab) && filteredMenuItems.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-border/50">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase">
                    {UI_TEXT.MENU.COL_ITEM_NAME}
                  </h3>
                  <Badge variant="secondary" className="rounded-full">
                    {UI_TEXT.MENU.MENUCOUNT(filteredMenuItems.length)}
                  </Badge>
                </div>
                <OrderList menuList={filteredMenuItems} onItemClick={handleItemClick} />
                {itemPagination.totalPages > 1 && (
                  <div className="pt-2">
                    <PaginationTable
                      currentPage={itemPagination.currentPage}
                      totalPages={itemPagination.totalPages}
                      onPageChange={setItemPage}
                    />
                  </div>
                )}
              </div>
            )}

            {(activeTab === "all" || isComboTab) && filteredSetMenus.length > 0 && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between pb-2 border-b border-border/50">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase">
                    {UI_TEXT.MENU.COL_CATEGORY || "Combo"}
                  </h3>
                  <Badge variant="secondary" className="rounded-full">
                    {UI_TEXT.MENU.COMBOCOUNT(filteredSetMenus.length)}
                  </Badge>
                </div>
                <OrderList menuList={filteredSetMenus} onItemClick={handleItemClick} />
                {comboPagination.totalPages > 1 && (
                  <div className="pt-2">
                    <PaginationTable
                      currentPage={comboPagination.currentPage}
                      totalPages={comboPagination.totalPages}
                      onPageChange={setComboPage}
                    />
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </div>
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

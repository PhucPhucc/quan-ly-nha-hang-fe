"use client";

import { UtensilsCrossed } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

import LoadingSpinner from "@/components/shared/LoadingSpinner";
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
  const isLoading = useMenuStore((state) => state.isLoading);
  const fetchMenuItems = useMenuStore((state) => state.fetchMenuItems);
  const fetchSetMenus = useMenuStore((state) => state.fetchSetMenus);

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
      // createdAt: sm.createdAt,
      // updatedAt: sm.updatedAt,
    }));
  }, [setMenus, comboCategory]);

  const filteredItems = useMemo(() => {
    const combinedItems = [...menuItems, ...mappedSetMenus];
    if (activeTab === "all") return combinedItems;
    return combinedItems.filter((item) => item.categoryId === activeTab);
  }, [menuItems, mappedSetMenus, activeTab]);

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
        onValueChange={setActiveTab}
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
            {filteredItems.length > 0 ? (
              <OrderList menuList={filteredItems} onItemClick={handleItemClick} />
            ) : (
              <EmptyState
                title="Trống"
                description="Danh mục này hiện chưa có món nào"
                icon={UtensilsCrossed}
              />
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

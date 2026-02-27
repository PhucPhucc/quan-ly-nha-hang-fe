"use client";

import { UtensilsCrossed } from "lucide-react";
import React, { useEffect, useMemo } from "react";

import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UI_TEXT } from "@/lib/UI_Text";
import { useMenuStore } from "@/store/useMenuStore";
import { MenuItem } from "@/types/Menu";

import { MenuOptionSelectionDialog } from "./MenuOptionSelectionDialog";
import OrderList from "./OrderList";

const CardMenu = () => {
  const categories = useMenuStore((state) => state.categories);
  const menuItems = useMenuStore((state) => state.menuItems);
  const loading = useMenuStore((state) => state.loading);
  const activeTab = useMenuStore((state) => state.activeTab);
  const isOptionDialogOpen = useMenuStore((state) => state.isOptionDialogOpen);
  const selectedItem = useMenuStore((state) => state.selectedItem);
  const setActiveTab = useMenuStore((state) => state.setActiveTab);
  const setIsOptionDialogOpen = useMenuStore((state) => state.closeOptionDialog);
  const setSelectedItem = useMenuStore((state) => state.openOptionDialog);
  const fetchData = useMenuStore((state) => state.fetchData);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredItems = useMemo(() => {
    if (activeTab === "all") return menuItems;
    return menuItems.filter((item) => item.categoryId === activeTab);
  }, [menuItems, activeTab]);

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
  };

  if (loading) {
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

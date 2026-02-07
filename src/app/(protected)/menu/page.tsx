"use client";

import { useMemo, useState } from "react";

import MenuFilters from "@/components/features/menu/MenuFilters";
import { MenuFormDialog } from "@/components/features/menu/MenuFormDialog";
import { MenuTable } from "@/components/features/menu/MenuTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_CATEGORIES, MOCK_MENU_ITEMS } from "@/data/mockMenu";
import { MenuItem } from "@/types/Menu";

export default function MenuManagementPage() {
  // State quản lý dữ liệu và lọc
  const [menuData, setMenuData] = useState<MenuItem[]>(MOCK_MENU_ITEMS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStation, setFilterStation] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPrice, setFilterPrice] = useState("all");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const userRole = "Manager";

  // Logic lọc dữ liệu tổng hợp
  const filteredItems = useMemo(() => {
    return menuData.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStation = filterStation === "all" || item.station === filterStation;
      const matchesCategory = filterCategory === "all" || item.category_id === filterCategory;

      let matchesPrice = true;
      if (filterPrice === "low") matchesPrice = item.dine_in_price < 30000;
      if (filterPrice === "mid")
        matchesPrice = item.dine_in_price >= 30000 && item.dine_in_price <= 60000;
      if (filterPrice === "high") matchesPrice = item.dine_in_price > 60000;

      return matchesSearch && matchesStation && matchesCategory && matchesPrice;
    });
  }, [searchQuery, filterStation, filterCategory, filterPrice, menuData]);

  const handleToggleStock = (id: string) => {
    setMenuData((prev) =>
      prev.map((item) =>
        item.menu_item_id === id ? { ...item, is_out_of_stock: !item.is_out_of_stock } : item
      )
    );
  };

  const handleReset = () => {
    setSearchQuery("");
    setFilterStation("all");
    setFilterCategory("all");
    setFilterPrice("all");
  };

  return (
    <div className="p-6 space-y-4 bg-muted/40 rounded-xl min-h-screen">
      {/* <MenuContainerHeader onAddNew={() => setIsFormOpen(true)} /> */}

      <MenuFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterStation={filterStation}
        setFilterStation={setFilterStation}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterPrice={filterPrice}
        setFilterPrice={setFilterPrice}
        categories={MOCK_CATEGORIES}
        onReset={handleReset}
      />

      <Tabs defaultValue="items" className="w-full gap-1">
        <TabsList className="bg-slate-200/50 p-1 rounded-lg">
          <TabsTrigger value="items" className="px-8 font-semibold">
            Món lẻ
          </TabsTrigger>
          <TabsTrigger value="sets" className="px-8 font-semibold">
            Combo / Set Menu
          </TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="">
          <MenuTable
            items={filteredItems}
            role={userRole}
            onToggleStock={handleToggleStock}
            onEdit={(item) => console.log("Edit:", item)}
            onDelete={(item) => console.log("Delete:", item)}
          />
        </TabsContent>

        <TabsContent
          value="sets"
          className="italic text-slate-400 text-center py-20 bg-white rounded-xl border border-dashed"
        >
          Chưa có dữ liệu Combo...
        </TabsContent>
      </Tabs>

      <MenuFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        categories={MOCK_CATEGORIES}
        onSubmit={(data) => console.log(data)}
        initialData={null}
      />
    </div>
  );
}

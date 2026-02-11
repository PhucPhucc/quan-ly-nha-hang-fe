"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import MenuContainerHeader from "@/components/features/menu/MenuContainerHeader";
import MenuFilters from "@/components/features/menu/MenuFilters";
import { MenuFormDialog } from "@/components/features/menu/MenuFormDialog";
import { MenuTable } from "@/components/features/menu/MenuTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { categoryService } from "@/services/categoryService";
import { menuService } from "@/services/menuService";
import { Category, MenuItem } from "@/types/Menu";

export default function MenuManagementPage() {
  // State quản lý dữ liệu và lọc
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStation, setFilterStation] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPrice, setFilterPrice] = useState("all");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const userRole = "Manager";

  // Fetch dữ liệu từ API
  const fetchData = async () => {
    try {
      setLoading(true);
      const [menuRes, catRes] = await Promise.all([
        menuService.getAll({ pageSize: 100 }),
        categoryService.getAll(),
      ]);

      if (menuRes && menuRes.data) {
        setMenuData(menuRes.data.items || []);
      }
      if (catRes && catRes.data) {
        setCategories(catRes.data || []);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Đã xảy ra lỗi";
      toast.error("Không thể tải dữ liệu: " + message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Logic lọc dữ liệu tổng hợp
  const filteredItems = useMemo(() => {
    return menuData?.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStation = filterStation === "all" || item.station.toString() === filterStation;
      const matchesCategory = filterCategory === "all" || item.categoryId === filterCategory;

      let matchesPrice = true;
      if (filterPrice === "low") matchesPrice = item.priceDineIn < 30000;
      if (filterPrice === "mid")
        matchesPrice = item.priceDineIn >= 30000 && item.priceDineIn <= 60000;
      if (filterPrice === "high") matchesPrice = item.priceDineIn > 60000;

      return matchesSearch && matchesStation && matchesCategory && matchesPrice;
    });
  }, [menuData, searchQuery, filterStation, filterCategory, filterPrice]);

  const handleToggleStock = async (id: string) => {
    const item = menuData.find((m) => m.menuItemId === id);
    if (!item) return;

    try {
      const res = await menuService.updateStock(id, !item.isOutOfStock);
      if (res.isSuccess) {
        setMenuData((prev) =>
          prev.map((m) => (m.menuItemId === id ? { ...m, isOutOfStock: !m.isOutOfStock } : m))
        );
        toast.success("Đã cập nhật trạng thái kho");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Đã xảy ra lỗi";
      toast.error("Lỗi: " + message);
    }
  };

  const handleDelete = async (item: MenuItem) => {
    if (!confirm(`Bạn có chắc muốn xóa món "${item.name}"?`)) return;

    try {
      const res = await menuService.delete(item.menuItemId);
      if (res.isSuccess) {
        setMenuData((prev) => prev.filter((m) => m.menuItemId !== item.menuItemId));
        toast.success("Đã xóa món ăn");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Đã xảy ra lỗi";
      toast.error("Lỗi: " + message);
    }
  };

  const handleSubmit = async (data: MenuItem) => {
    try {
      if (selectedItem) {
        const res = await menuService.update(selectedItem.menuItemId, data);
        if (res.isSuccess) {
          toast.success("Đã cập nhật món ăn");
          setIsFormOpen(false);
          fetchData();
        }
      } else {
        const res = await menuService.create(data);
        if (res.isSuccess) {
          toast.success("Đã thêm món mới");
          setIsFormOpen(false);
          fetchData();
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Đã xảy ra lỗi";
      toast.error("Lỗi: " + message);
    }
  };

  const handleReset = () => {
    setSearchQuery("");
    setFilterStation("all");
    setFilterCategory("all");
    setFilterPrice("all");
  };

  return (
    <div className="p-6 space-y-8 bg-slate-50/50 min-h-screen">
      <MenuContainerHeader
        onAddNew={() => {
          setSelectedItem(null);
          setIsFormOpen(true);
        }}
      />

      <MenuFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterStation={filterStation}
        setFilterStation={setFilterStation}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterPrice={filterPrice}
        setFilterPrice={setFilterPrice}
        categories={categories}
        onReset={handleReset}
      />

      <Tabs
        defaultValue="items"
        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
      >
        <TabsList className="bg-slate-100/50 p-1 rounded-xl">
          <TabsTrigger
            value="items"
            className="rounded-lg px-8 font-bold data-[state=active]:bg-white data-[state=active]:text-[#cc0000] data-[state=active]:shadow-sm"
          >
            Món lẻ
          </TabsTrigger>
          <TabsTrigger
            value="sets"
            className="rounded-lg px-8 font-bold data-[state=active]:bg-white data-[state=active]:text-[#cc0000] data-[state=active]:shadow-sm"
          >
            Combo / Set menu
          </TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="mt-6">
          {loading ? (
            <div className="text-center py-20 italic text-slate-400">Đang tải dữ liệu...</div>
          ) : (
            <MenuTable
              items={filteredItems}
              role={userRole}
              onToggleStock={handleToggleStock}
              onEdit={(item) => {
                setSelectedItem(item);
                setIsFormOpen(true);
              }}
              onDelete={handleDelete}
            />
          )}
        </TabsContent>

        <TabsContent value="sets" className="mt-6">
          <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 text-slate-400">
            Chế độ quản lý Combo đang được phát triển...
          </div>
        </TabsContent>
      </Tabs>

      <MenuFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        categories={categories}
        onSubmit={handleSubmit}
        initialData={selectedItem}
      />
    </div>
  );
}

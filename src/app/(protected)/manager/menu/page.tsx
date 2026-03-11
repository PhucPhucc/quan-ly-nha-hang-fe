"use client";

import { useEffect, useMemo, useState } from "react";

import MenuFilters from "@/components/features/menu/MenuFilters";
import { MenuFormDialog } from "@/components/features/menu/MenuFormDialog";
import { MenuTable } from "@/components/features/menu/MenuTable";
import { OptionManagementDialog } from "@/components/features/menu/OptionManagementDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UI_TEXT } from "@/lib/UI_Text";
import { categoryService } from "@/services/categoryService";
import { menuService } from "@/services/menuService";
import { Category, MenuItem } from "@/types/Menu";

export default function MenuManagementPage() {
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStation, setFilterStation] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPrice, setFilterPrice] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [formType, setFormType] = useState<"single" | "combo">("single");

  const [isOptionDialogOpen, setIsOptionDialogOpen] = useState(false);
  const [selectedOptionItem, setSelectedOptionItem] = useState<MenuItem | null>(null);

  const userRole = "Manager";

  const fetchData = async () => {
    try {
      const [menuRes, setMenuRes, categoryRes] = await Promise.all([
        menuService.getAll(1, 100),
        menuService.getAllSetMenu(1, 100),
        categoryService.getAll(),
      ]);

      const menuArray = menuRes.data?.items || [];
      const setMenuArrayRaw = setMenuRes.data?.items || [];

      // Map lại để đồng bộ structure với MenuItem
      const setMenuArray = setMenuArrayRaw.map((item: any) => ({
        ...item,
        menuItemId: item.setMenuId || item.menuItemId || item.id,
        code: item.code || item.Code,
        name: item.name || item.Name,
      }));

      const categoryArray = categoryRes.data?.items || [];

      setMenuData([...menuArray, ...setMenuArray]);
      setCategories(categoryArray);
    } catch (error) {
      console.error("Fetch data failed:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteItem = async (item: MenuItem) => {
    const itemId = (item as any).menuItemId || (item as any).MenuItemId || (item as any).id;
    const itemName = item.name || (item as any).Name;

    if (!itemId) {
      alert(UI_TEXT.MENU.ID_NOT_FOUND);
      return;
    }

    const confirmDelete = window.confirm(UI_TEXT.MENU.DELETE_CONFIRM(itemName));
    if (!confirmDelete) return;

    try {
      const isCombo = (item.code || (item as any).Code || "").toUpperCase().includes("COMBO");

      if (isCombo) {
        (await (menuService as any).deleteSetMenu?.(itemId)) || (await menuService.delete(itemId));
      } else {
        await menuService.delete(itemId);
      }

      alert(UI_TEXT.MENU.DELETE_SUCCESS);
      fetchData();
    } catch (error: any) {
      console.error("Delete failed:", error);
      const msg = error.response?.data?.message || UI_TEXT.MENU.DELETE_DEFAULT_ERROR;
      alert(msg);
    }
  };

  const handleToggleStock = async (id: string) => {
    try {
      const item = menuData.find((m) => ((m as any).menuItemId || (m as any).id) === id);
      if (!item) return;

      const currentStatus = (item as any).isOutOfStock ?? (item as any).IsOutOfStock ?? false;

      const isCombo = (item.code || (item as any).Code || "").toUpperCase().includes("COMBO");

      if (isCombo) {
        await menuService.updateSetMenuStock(id, !currentStatus);
      } else {
        await menuService.toggleStock(id, !currentStatus);
      }

      fetchData();
    } catch (error) {
      console.error("Toggle stock failed:", error);
      alert(UI_TEXT.MENU.UPDATE_STOCK_ERROR);
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      const isCombo = formType === "combo";

      const id = selectedItem
        ? (selectedItem as any).menuItemId ||
          (selectedItem as any).menu_item_id ||
          (selectedItem as any).id
        : null;

      if (id) {
        isCombo
          ? await menuService.updateSetMenu(id, formData)
          : await menuService.update(id, formData);
      } else {
        isCombo ? await menuService.createSetMenu(formData) : await menuService.create(formData);
      }

      setIsFormOpen(false);
      fetchData();
      alert(UI_TEXT.MENU.SAVE_SUCCESS);
    } catch (error: any) {
      alert(`Lỗi: ${error.message}`);
    }
  };

  const handleManageOptions = (item: MenuItem) => {
    setSelectedOptionItem(item);
    setIsOptionDialogOpen(true);
  };

  // Logic useMemo giữ nguyên...
  const baseFilteredData = useMemo(() => {
    return (menuData || []).filter((item) => {
      if (!item) return false;
      const itemName = item.name || (item as any).Name || "";
      const itemCode = item.code || (item as any).Code || "";
      const matchesSearch =
        itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        itemCode.toLowerCase().includes(searchQuery.toLowerCase());
      const itemStation = String(item.station || (item as any).Station || "");
      const matchesStation = filterStation === "all" || itemStation === filterStation;
      const itemCategoryId = (item as any).categoryId || (item as any).CategoryId;
      const matchesCategory = filterCategory === "all" || itemCategoryId === filterCategory;
      const price = (item as any).price ?? (item as any).Price ?? (item as any).price ?? 0;
      let matchesPrice = true;
      if (filterPrice === "low") matchesPrice = price < 30000;
      if (filterPrice === "mid") matchesPrice = price >= 30000 && price <= 60000;
      if (filterPrice === "high") matchesPrice = price > 60000;
      return matchesSearch && matchesStation && matchesCategory && matchesPrice;
    });
  }, [searchQuery, filterStation, filterCategory, filterPrice, menuData]);

  const singleItems = useMemo(
    () =>
      baseFilteredData.filter(
        (item) => !(item.code || (item as any).Code || "").toUpperCase().includes("COMBO")
      ),
    [baseFilteredData]
  );
  const comboItems = useMemo(
    () =>
      baseFilteredData.filter((item) =>
        (item.code || (item as any).Code || "").toUpperCase().includes("COMBO")
      ),
    [baseFilteredData]
  );

  return (
    <div className="p-6 space-y-4 bg-muted/40 rounded-xl min-h-screen">
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
        onReset={() => {
          setSearchQuery("");
          setFilterStation("all");
          setFilterCategory("all");
          setFilterPrice("all");
        }}
      />

      <Tabs defaultValue="items" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-slate-200/50 p-1 rounded-lg">
            <TabsTrigger value="items" className="px-8 font-semibold">
              {UI_TEXT.MENU.TAB_ITEM}
            </TabsTrigger>
            <TabsTrigger value="sets" className="px-8 font-semibold">
              {UI_TEXT.MENU.TAB_COMBO}
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setSelectedItem(null);
                setFormType("combo");
                setIsFormOpen(true);
              }}
              className="h-9 px-4 text-sm font-bold border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 rounded-md shadow-sm"
            >
              {UI_TEXT.MENU.ADD_COMBO}
            </button>
            <button
              onClick={() => {
                setSelectedItem(null);
                setFormType("single");
                setIsFormOpen(true);
              }}
              className="h-9 px-4 text-sm font-bold bg-[#cc0000] text-white hover:bg-[#b30000] rounded-md shadow-sm"
            >
              {UI_TEXT.MENU.ADD_ITEM}
            </button>
          </div>
        </div>

        <TabsContent value="items" className="mt-0">
          <MenuTable
            items={singleItems}
            role={userRole}
            onToggleStock={handleToggleStock}
            onEdit={(item) => {
              setSelectedItem(item);
              setFormType("single");
              setIsFormOpen(true);
            }}
            onDelete={handleDeleteItem}
            onManageOptions={handleManageOptions}
          />
        </TabsContent>

        <TabsContent value="sets" className="mt-0">
          {comboItems.length > 0 ? (
            <MenuTable
              items={comboItems}
              role={userRole}
              onToggleStock={handleToggleStock}
              onEdit={async (item: any) => {
                try {
                  // Lấy ID chính xác của Combo
                  const comboId = item.setMenuId || item.id;

                  if (!comboId) {
                    alert("ID Combo không hợp lệ");
                    return;
                  }

                  // Gọi API lấy chi tiết Combo (bao gồm mảng items món lẻ)
                  const detail = await menuService.getSetMenuById(comboId);

                  if (detail.data) {
                    setSelectedItem(detail.data as any);
                    setFormType("combo");
                    setIsFormOpen(true);
                  }
                } catch (error) {
                  console.error("Lỗi khi tải chi tiết combo:", error);
                  alert("Không thể tải danh sách món lẻ của combo này.");
                }
              }}
              onDelete={handleDeleteItem}
            />
          ) : (
            <div className="italic text-slate-400 text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
              {UI_TEXT.MENU.EMPTY_COMBO}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <MenuFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        categories={categories}
        onSubmit={handleFormSubmit}
        initialData={selectedItem}
        forcedType={formType}
        allMenuItems={menuData}
      />

      <OptionManagementDialog
        open={isOptionDialogOpen}
        onOpenChange={setIsOptionDialogOpen}
        menuItem={selectedOptionItem}
      />
    </div>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { categoryService } from "@/services/categoryService";
import { menuService, setMenuService } from "@/services/menuService";
import { Station } from "@/types/enums";
import type { Category, MenuItem, SetMenu } from "@/types/Menu";

/* =======================
   1) KHAI BÁO KIỂU API
   ======================= */

type ApiMenuItem = {
  menuItemId: string;
  code: string;
  name: string;
  imageUrl: string;
  description: string;
  categoryId: string;
  categoryName: string;
  station: number;
  expectedTime: number;
  price: number;
  costPrice: number;
  isOutOfStock: boolean;
  createdAt: string;
  updatedAt: string;
};

type ApiMenuItemListResponse = {
  isSuccess: boolean;
  data: {
    items: ApiMenuItem[];
  };
};

type ApiCategory = {
  categoryId: string;
  name: string;
  type: number;
  createdAt: string;
  updatedAt: string;
};

type ApiCategoryResponse = {
  isSuccess: boolean;
  data: {
    items: ApiCategory[];
  };
};

type ApiSetMenu = {
  setMenuId: string;
  code: string;
  name: string;
  setType: string; // COMBO, có thể thêm các loại khác
  imageUrl: string | null;
  description: string | null;
  price: number;
  costPrice: number;
  isOutOfStock: boolean;
  createdAt: string;
  updatedAt: string;
};

type ApiSetMenuListResponse = {
  isSuccess: boolean;
  data: {
    items: ApiSetMenu[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  error?: string;
  errorType?: string;
  warning?: string;
  hasWarning?: boolean;
};

/* =======================
   2) UTILS
   ======================= */

const stationNumericToEnum = (val: number): Station => {
  switch (val) {
    case 0:
      return Station.BAR;
    case 1:
      return Station.HOT_KITCHEN;
    case 2:
      return Station.COLD_KITCHEN;
    default:
      return Station.BAR;
  }
};

/* =======================
   3) EXTRACTORS
   ======================= */

const extractMenuItemsStrict = (resp: unknown): ApiMenuItem[] => {
  const r = resp as ApiMenuItemListResponse;
  if (r?.isSuccess && r?.data?.items && Array.isArray(r.data.items)) {
    return r.data.items;
  }
  return [];
};

const extractCategoriesStrict = (resp: unknown): ApiCategory[] => {
  const r = resp as ApiCategoryResponse;
  if (r?.data?.items && Array.isArray(r.data.items)) {
    return r.data.items;
  }
  if (Array.isArray(resp)) {
    return resp as ApiCategory[];
  }
  return [];
};

const extractSetMenusStrict = (resp: unknown): ApiSetMenu[] => {
  const r = resp as ApiSetMenuListResponse;
  if (r?.isSuccess && r?.data?.items && Array.isArray(r.data.items)) {
    return r.data.items;
  }
  return [];
};

/* =======================
   4) MAPPER
   ======================= */

const mapApiMenuItemToUi = (api: ApiMenuItem): MenuItem & { id: string } => {
  return {
    id: api.menuItemId,
    menuItemId: api.menuItemId,
    code: api.code,
    name: api.name,
    imageUrl: api.imageUrl,
    description: api.description,
    categoryId: api.categoryId,
    categoryName: api.categoryName,
    station: stationNumericToEnum(api.station),
    expectedTime: api.expectedTime,
    price: api.price,
    costPrice: api.costPrice,
    isOutOfStock: api.isOutOfStock,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
};

const mapApiSetMenuToUi = (api: ApiSetMenu): SetMenu & { id: string } => {
  return {
    id: api.setMenuId,
    setMenuId: api.setMenuId,
    code: api.code,
    name: api.name,
    setType: api.setType,
    imageUrl: api.imageUrl ?? "",
    description: api.description ?? "",
    price: api.price,
    costPrice: api.costPrice,
    isOutOfStock: api.isOutOfStock,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
};

/* =======================
   5) HOOK CHÍNH
   ======================= */

type CombinedMenu =
  | (MenuItem & { id: string; type: "item" })
  | (SetMenu & { id: string; type: "combo" });

export function useMenuData() {
  const [menuData, setMenuData] = useState<CombinedMenu[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [menuRes, setMenuRes, categoryRes] = await Promise.all([
        menuService.getAll({ pageNumber: 1, pageSize: 100 }),
        setMenuService.getAll({ pageNumber: 1, pageSize: 100 }),
        categoryService.getAll(),
      ]);

      const rawItems = extractMenuItemsStrict(menuRes);
      const items = rawItems.map(mapApiMenuItemToUi);

      const rawCombos = extractSetMenusStrict(setMenuRes);
      const combos = rawCombos.map(mapApiSetMenuToUi);

      const mappedItems: CombinedMenu[] = items.map((i) => ({ ...i, type: "item" }));
      const mappedCombos: CombinedMenu[] = combos.map((c) => ({ ...c, type: "combo" }));

      setMenuData([...mappedItems, ...mappedCombos]);

      const catRaw = extractCategoriesStrict(categoryRes);
      const catMapped: Category[] = catRaw.map((c) => ({
        categoryId: c.categoryId ?? "",
        name: c.name ?? "",
        type: c.type ?? 0,
        createdAt: c.createdAt ?? new Date().toISOString(),
        updatedAt: c.updatedAt ?? new Date().toISOString(),
      }));

      setCategories(catMapped);
    } catch (e) {
      console.error("Fetch failed:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const singleItems = useMemo(
    () => menuData.filter((i): i is MenuItem & { id: string; type: "item" } => i.type === "item"),
    [menuData]
  );

  const comboItems = useMemo(
    () => menuData.filter((i): i is SetMenu & { id: string; type: "combo" } => i.type === "combo"),
    [menuData]
  );

  return {
    loading,
    menuData,
    categories,
    refetch: fetchData,
    singleItems,
    comboItems,
    allSingleItems: singleItems,
  };
}

import { useMemo, useState } from "react";

import { Station } from "@/types/enums";
import type { MenuItem, SetMenu } from "@/types/Menu";

// Định nghĩa kiểu dữ liệu cho phần tử kết hợp mang sang đây luôn
export type MenuDataItem =
  | (MenuItem & { type: "item"; id?: string })
  | (SetMenu & { type: "combo"; id?: string });

const stationMap: Record<string, Station> = {
  BAR: Station.BAR,
  KITCHEN_HOT: Station.HOT_KITCHEN,
  KITCHEN_COLD: Station.COLD_KITCHEN,
};

export function useMenuFilters(menuData: MenuDataItem[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStation, setFilterStation] = useState("all");
  const [filterPrice, setFilterPrice] = useState("all");

  const selectedStation: Station | undefined =
    filterStation !== "all" ? stationMap[filterStation] : undefined;

  const filteredData = useMemo(() => {
    return menuData.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        filterCategory === "all" || ("categoryId" in item && item.categoryId === filterCategory);

      const matchesStation =
        filterStation === "all" ||
        (item.type === "item" && "station" in item && item.station === selectedStation);

      const price = "price" in item ? Number(item.price ?? 0) : 0;
      const matchesPrice =
        filterPrice === "all" ||
        (filterPrice === "low" && price < 30000) ||
        (filterPrice === "mid" && price >= 30000 && price <= 60000) ||
        (filterPrice === "high" && price > 60000);

      return matchesSearch && matchesCategory && matchesStation && matchesPrice;
    });
  }, [menuData, searchQuery, filterCategory, filterStation, selectedStation, filterPrice]);

  const filteredSingles = useMemo(
    () =>
      filteredData.filter((i): i is MenuItem & { type: "item"; id: string } => i.type === "item"),
    [filteredData]
  );

  const filteredCombos = useMemo(
    () =>
      filteredData.filter((i): i is SetMenu & { type: "combo"; id: string } => i.type === "combo"),
    [filteredData]
  );

  const handleResetFilters = () => {
    setSearchQuery("");
    setFilterCategory("all");
    setFilterStation("all");
    setFilterPrice("all");
  };

  return {
    // Gom toàn bộ props cho component MenuFilters vào đây
    filterProps: {
      searchQuery,
      setSearchQuery,
      filterCategory,
      setFilterCategory,
      filterStation,
      setFilterStation,
      filterPrice,
      setFilterPrice,
      onReset: handleResetFilters, // Đổi tên để khớp với Component
    },
    // Dữ liệu đã lọc vẫn để riêng để dùng cho các Tab
    filteredSingles,
    filteredCombos,
  };
}

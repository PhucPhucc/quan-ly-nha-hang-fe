import React, { useMemo } from "react";

import TableSkeleton from "@/components/shared/TableSkeleton";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableShell,
} from "@/components/ui/table";
import { UI_TEXT } from "@/lib/UI_Text";
import { useMenuStore } from "@/store/useMenuStore";
import { Category } from "@/types/Menu";

import { MenuItemCard } from "./MenuItemCard";

interface MenuListProps {
  categories: Category[];
}

export const MenuList: React.FC<MenuListProps> = ({ categories }) => {
  const {
    menuItems,
    setMenus,
    isLoading,
    searchQuery,
    categoryId,
    currentPage,
    pageSize,
    totalItems,
  } = useMenuStore();

  const filteredItems = useMemo(() => {
    const isComboCategorySelected = categories.find((c) => c.categoryId === categoryId)?.type === 2;

    if (isComboCategorySelected) {
      const combos = setMenus.filter((item) => {
        const matchSearch =
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchSearch;
      });
      // setMenus are fully loaded (max 100), so we MUST paginate them on frontend
      return combos.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    }

    const filteredMenuItems = menuItems.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCategory = categoryId === "all" || item.categoryId === categoryId;

      return matchSearch && matchCategory;
    });

    if (categoryId === "all") {
      const filteredSetMenus = setMenus.filter((item) => {
        const matchSearch =
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchSearch;
      });

      let pageItems = [] as Array<
        (typeof filteredMenuItems)[number] | (typeof filteredSetMenus)[number]
      >;

      // If there are menuItems for this page:
      if (filteredMenuItems.length > 0) {
        pageItems = [...filteredMenuItems];
      }

      // Compute global requirements to seamlessly fill the gap with setMenus
      const reqStart = (currentPage - 1) * pageSize;
      const M = totalItems; // global total backend menuItems count

      if (pageItems.length < pageSize) {
        const needed = pageSize - pageItems.length;
        // determine where to start in setMenus (if after complete menu items)
        const setMenuStartIndex = Math.max(0, reqStart - M);
        const setMenuSlice = filteredSetMenus.slice(setMenuStartIndex, setMenuStartIndex + needed);
        pageItems = [...pageItems, ...setMenuSlice];
      }

      return pageItems;
    }

    return filteredMenuItems.slice(0, pageSize);
  }, [menuItems, setMenus, searchQuery, categoryId, categories, currentPage, pageSize, totalItems]);

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (filteredItems.length === 0) {
    return (
      <TableShell className="mt-4">
        <div className="table-feedback">
          <div className="table-feedback-icon">{UI_TEXT.COMMON.DASH}</div>
          <p className="text-lg font-semibold text-table-text-strong">
            {UI_TEXT.MENU.NOT_FOUND_TITLE}
          </p>
          <p className="max-w-md text-sm text-table-text-muted">{UI_TEXT.MENU.NOT_FOUND_DESC}</p>
        </div>
      </TableShell>
    );
  }

  return (
    <TableShell className="mt-4 mb-0">
      <Table>
        <TableHeader>
          <TableRow variant="header">
            <TableHead>{UI_TEXT.MENU.COL_ITEM_NAME}</TableHead>
            <TableHead>{UI_TEXT.MENU.COL_CATEGORY}</TableHead>
            <TableHead>{UI_TEXT.MENU.COL_PRICE}</TableHead>
            <TableHead>{UI_TEXT.MENU.COL_STATUS}</TableHead>
            <TableHead className="text-right">{UI_TEXT.MENU.COL_ACTION}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredItems.map((item) => (
            <MenuItemCard
              key={"setMenuId" in item ? item.setMenuId : item.menuItemId}
              item={item}
            />
          ))}
        </TableBody>
      </Table>
    </TableShell>
  );
};

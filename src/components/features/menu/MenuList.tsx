import React, { useMemo } from "react";

import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UI_TEXT } from "@/lib/UI_Text";
import { useMenuStore } from "@/store/useMenuStore";

import { MenuItemCard } from "./MenuItemCard";

export const MenuList: React.FC = () => {
  const { menuItems, isLoading, searchQuery, categoryId } = useMenuStore();

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCategory = categoryId === "all" || item.categoryId === categoryId;

      return matchSearch && matchCategory;
    });
  }, [menuItems, searchQuery, categoryId]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (filteredItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 bg-card rounded-lg border border-dashed text-gray-500 mt-4 min-h-100">
        <p className="text-xl font-bold">{UI_TEXT.MENU.NOT_FOUND_TITLE}</p>
        <p className="text-sm mt-2">{UI_TEXT.MENU.NOT_FOUND_DESC}</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border mt-4 bg-card overflow-hidden">
      <Table className="">
        <TableHeader>
          <TableRow>
            <TableHead>{UI_TEXT.MENU.COL_ITEM_NAME}</TableHead>
            <TableHead>{UI_TEXT.MENU.COL_CATEGORY}</TableHead>
            <TableHead>{UI_TEXT.MENU.COL_PRICE}</TableHead>
            <TableHead>{UI_TEXT.MENU.COL_STATUS}</TableHead>
            <TableHead className="text-right">{UI_TEXT.MENU.COL_ACTION}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredItems.map((item) => (
            <MenuItemCard key={item.menuItemId} item={item} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

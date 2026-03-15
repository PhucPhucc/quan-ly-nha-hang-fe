import React, { useMemo } from "react";

import TableSkeleton from "@/components/shared/TableSkeleton";
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
    return <TableSkeleton columns={5} rows={6} showMediaInFirstColumn />;
  }

  if (filteredItems.length === 0) {
    return (
      <div className="fh-table-shell mt-4">
        <div className="fh-table-feedback">
          <div className="fh-table-feedback-icon">{UI_TEXT.COMMON.DASH}</div>
          <p className="text-lg font-semibold text-[var(--table-text-strong)]">
            {UI_TEXT.MENU.NOT_FOUND_TITLE}
          </p>
          <p className="max-w-md text-sm text-[var(--table-text-muted)]">
            {UI_TEXT.MENU.NOT_FOUND_DESC}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fh-table-shell mt-4">
      <Table className="fh-table">
        <TableHeader>
          <TableRow className="fh-table-header-row hover:bg-[var(--table-header-bg)]">
            <TableHead className="fh-table-head">{UI_TEXT.MENU.COL_ITEM_NAME}</TableHead>
            <TableHead className="fh-table-head">{UI_TEXT.MENU.COL_CATEGORY}</TableHead>
            <TableHead className="fh-table-head">{UI_TEXT.MENU.COL_PRICE}</TableHead>
            <TableHead className="fh-table-head">{UI_TEXT.MENU.COL_STATUS}</TableHead>
            <TableHead className="fh-table-head text-right">{UI_TEXT.MENU.COL_ACTION}</TableHead>
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

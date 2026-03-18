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

import { MenuItemCard } from "./MenuItemCard";

// Định nghĩa interface để nhận props từ MenuManagement
interface MenuListProps {
  currentPage: number;
  itemsPerPage: number;
}

export const MenuList: React.FC<MenuListProps> = ({ currentPage, itemsPerPage }) => {
  const { menuItems, isLoading, searchQuery, categoryId } = useMenuStore();

  // 1. Lọc dữ liệu theo search và category (Giữ nguyên logic của bạn)
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCategory = categoryId === "all" || item.categoryId === categoryId;

      return matchSearch && matchCategory;
    });
  }, [menuItems, searchQuery, categoryId]);

  // 2. CHÍNH LÀ ĐÂY: Cắt mảng để chỉ lấy 8 món của trang hiện tại
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  if (isLoading) {
    return <TableSkeleton columns={5} rows={6} />;
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
    <TableShell className="mt-4">
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
          {paginatedItems.map((item) => (
            <MenuItemCard key={item.menuItemId} item={item} />
          ))}
        </TableBody>
      </Table>
    </TableShell>
  );
};

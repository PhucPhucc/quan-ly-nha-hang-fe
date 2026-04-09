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
import { Category, MenuItem, SetMenu } from "@/types/Menu";

import { MenuItemCard } from "./MenuItemCard";
import MenuPagination from "./MenuPagination";

interface MenuListProps {
  categories: Category[];
}

const MENU_FILTER_ALL = "all";
const MENU_FILTER_ITEM = "item";
const MENU_FILTER_COMBO = "combo";

const toSearchableText = (value?: string | null) => value?.toLowerCase() ?? "";

const matchesSearch = (item: MenuItem | SetMenu, searchQuery: string) => {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  return (
    toSearchableText(item.name).includes(normalizedQuery) ||
    toSearchableText(item.description).includes(normalizedQuery)
  );
};

const MenuSection = ({
  title,
  items,
  totalCount,
}: {
  title: string;
  items: Array<MenuItem | SetMenu>;
  totalCount: number;
}) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <h3 className="text-base font-semibold text-table-text-strong">{title}</h3>
      <span className="text-sm text-table-text-muted">{UI_TEXT.MENU.MENUCOUNT(totalCount)}</span>
    </div>

    <TableShell className="mt-0 mb-0">
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
          {items.map((item) => (
            <MenuItemCard
              key={"setMenuId" in item ? item.setMenuId : item.menuItemId}
              item={item}
            />
          ))}
        </TableBody>
      </Table>
    </TableShell>
  </div>
);

const MenuListContent: React.FC<MenuListProps> = ({ categories }) => {
  const {
    menuItems,
    setMenus,
    isLoadingItems,
    isLoadingCombos,
    searchQuery,
    categoryId,
    itemPagination,
    comboPagination,
    setItemPage,
    setComboPage,
  } = useMenuStore();

  const selectedCategory = categories.find((category) => category.categoryId === categoryId);
  const isAllFilter = categoryId === MENU_FILTER_ALL;
  const isItemFilter = categoryId === MENU_FILTER_ITEM;
  const isComboFilter = categoryId === MENU_FILTER_COMBO;
  const isSpecificMenuItemCategory = Boolean(selectedCategory && selectedCategory.type !== 2);

  // Client-side search filtering on already-paginated server data
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchSearch = matchesSearch(item, searchQuery);
      const matchCategory =
        isAllFilter ||
        isItemFilter ||
        (isSpecificMenuItemCategory && item.categoryId === categoryId);

      return matchSearch && matchCategory;
    });
  }, [menuItems, searchQuery, categoryId, isAllFilter, isItemFilter, isSpecificMenuItemCategory]);

  const filteredSetMenus = useMemo(
    () => setMenus.filter((item) => matchesSearch(item, searchQuery)),
    [setMenus, searchQuery]
  );

  const isLoading = isLoadingItems || isLoadingCombos;

  const visibleItemCount = isComboFilter
    ? filteredSetMenus.length
    : isAllFilter
      ? filteredMenuItems.length + filteredSetMenus.length
      : filteredMenuItems.length;

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (visibleItemCount === 0) {
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

  if (isComboFilter) {
    return (
      <div className="space-y-4">
        <MenuSection
          title="Combo"
          items={filteredSetMenus}
          totalCount={comboPagination.totalCount}
        />
        <MenuPagination
          currentPage={comboPagination.currentPage}
          totalPages={comboPagination.totalPages}
          onPageChange={setComboPage}
        />
      </div>
    );
  }

  if (isSpecificMenuItemCategory) {
    return (
      <div className="space-y-4">
        <MenuSection
          title={selectedCategory?.name || "Món lẻ"}
          items={filteredMenuItems}
          totalCount={itemPagination.totalCount}
        />
        <MenuPagination
          currentPage={itemPagination.currentPage}
          totalPages={itemPagination.totalPages}
          onPageChange={setItemPage}
        />
      </div>
    );
  }

  if (isItemFilter) {
    return (
      <div className="space-y-4">
        <MenuSection
          title="Món lẻ"
          items={filteredMenuItems}
          totalCount={itemPagination.totalCount}
        />
        <MenuPagination
          currentPage={itemPagination.currentPage}
          totalPages={itemPagination.totalPages}
          onPageChange={setItemPage}
        />
      </div>
    );
  }

  // Filter "all": show both sections with independent pagination
  return (
    <div className="space-y-6">
      {filteredMenuItems.length > 0 && (
        <div className="space-y-4">
          <MenuSection
            title="Món lẻ"
            items={filteredMenuItems}
            totalCount={itemPagination.totalCount}
          />
          <MenuPagination
            currentPage={itemPagination.currentPage}
            totalPages={itemPagination.totalPages}
            onPageChange={setItemPage}
          />
        </div>
      )}

      {filteredSetMenus.length > 0 && (
        <div className="space-y-4">
          <MenuSection
            title="Combo"
            items={filteredSetMenus}
            totalCount={comboPagination.totalCount}
          />
          <MenuPagination
            currentPage={comboPagination.currentPage}
            totalPages={comboPagination.totalPages}
            onPageChange={setComboPage}
          />
        </div>
      )}
    </div>
  );
};

export const MenuList: React.FC<MenuListProps> = ({ categories }) => {
  return <MenuListContent categories={categories} />;
};

import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import React from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { TableCell, TableRow } from "@/components/ui/table";
import { UI_TEXT } from "@/lib/UI_Text";
import { useMenuStore } from "@/store/useMenuStore";
import { MenuItem } from "@/types/Menu";

interface MenuItemCardProps {
  item: MenuItem;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  const deleteMenuItem = useMenuStore((state) => state.deleteMenuItem);
  const setEditingItem = useMenuStore((state) => state.setEditingItem);
  const setModalOpen = useMenuStore((state) => state.setModalOpen);
  const toggleMenuItemStock = useMenuStore((state) => state.toggleMenuItemStock);

  const handleEdit = () => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleDelete = () => {
    const confirmDelete = async () => {
      await deleteMenuItem(item.menuItemId);
      toast.dismiss();
    };

    toast(UI_TEXT.MENU.DELETE_CONFIRM(item.name), {
      action: (
        <>
          <Button variant="outline" size="sm" onClick={() => toast.dismiss()}>
            {UI_TEXT.BUTTON.CLOSE}
          </Button>
          <Button size="sm" onClick={confirmDelete}>
            {UI_TEXT.BUTTON.CONFIRM_DELETE}
          </Button>
        </>
      ),
    });
  };

  const handleToggleStock = (checked: boolean) => {
    toggleMenuItemStock(item.menuItemId, !checked);
  };
  let imageSrc = "/placeholderMenu.webp";

  if (item.imageUrl.startsWith("http://res.cloudinary.com/")) {
    imageSrc = item.imageUrl;
  }
  console.log("MenuItemCard render", { imageSrc });
  return (
    <TableRow className={item.isOutOfStock ? "table-row-muted opacity-75" : ""}>
      <TableCell className="max-w-120 py-1">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 overflow-hidden rounded-full border border-table-border-soft bg-table-row-muted shrink-0">
            <Image
              src={imageSrc}
              alt={item.name}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-table-text-strong">{item.name}</span>
            <span className="line-clamp-1 text-xs text-table-text-muted">{item.description}</span>
          </div>
        </div>
      </TableCell>

      <TableCell>
        {item.categoryName ? (
          <Badge variant="outline" className="table-pill table-pill-neutral border-0">
            {item.categoryName}
          </Badge>
        ) : (
          <span className="text-xs text-table-text-muted">{UI_TEXT.MENU.NO_CATEGORY}</span>
        )}
      </TableCell>

      <TableCell>
        <div className="text-sm font-semibold text-primary">
          {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
            item.price
          )}
        </div>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          <Switch
            checked={!item.isOutOfStock}
            onCheckedChange={handleToggleStock}
            title={UI_TEXT.MENU.TOOLTIP_CHANGE_STATUS}
          />
          <Badge
            variant="outline"
            className={`table-pill border-0 ${item.isOutOfStock ? "table-pill-danger" : "table-pill-success"}`}
          >
            {item.isOutOfStock ? UI_TEXT.MENU.STATUS_OUT_OF_STOCK : UI_TEXT.MENU.STATUS_IN_STOCK}
          </Badge>
        </div>
      </TableCell>

      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleEdit}
            title={UI_TEXT.MENU.TOOLTIP_EDIT}
            className="border-table-border-soft text-table-text-strong hover:bg-table-row-hover"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={handleDelete}
            title={UI_TEXT.MENU.TOOLTIP_DELETE}
            className="shadow-none"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

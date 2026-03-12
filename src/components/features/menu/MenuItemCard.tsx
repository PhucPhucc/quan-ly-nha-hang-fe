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

  const imageSrc = !item.imageUrl ? "https://placehold.co/200x200/png" : item.imageUrl;

  return (
    <TableRow className={`${item.isOutOfStock ? "opacity-70 grayscale bg-border" : ""}`}>
      <TableCell className="font-medium">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-md overflow-hidden shrink-0">
            <Image
              src={imageSrc}
              alt={item.name}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold">{item.name}</span>
            <span className="text-xs text-gray-500 line-clamp-1">{item.description}</span>
          </div>
        </div>
      </TableCell>

      <TableCell>
        {item.categoryName ? (
          <Badge variant="outline">{item.categoryName}</Badge>
        ) : (
          <span className="text-xs text-gray-400">{UI_TEXT.MENU.NO_CATEGORY}</span>
        )}
      </TableCell>

      <TableCell>
        <div className="font-semibold text-primary">
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
          <Badge variant={item.isOutOfStock ? "destructive" : "secondary"}>
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
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={handleDelete}
            title={UI_TEXT.MENU.TOOLTIP_DELETE}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

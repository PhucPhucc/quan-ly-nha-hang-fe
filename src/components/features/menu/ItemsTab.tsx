"use client";
import { MenuTable } from "@/components/features/menu/MenuTable";
import type { MenuItem } from "@/types/Menu";

type Props = {
  items: MenuItem[];
  role: string;
  onToggleStock: (id: string) => void;
  onEdit: (item: MenuItem & { type: "item" }) => void;
  onDelete: (item: MenuItem & { type: "item" }) => void;
};

export default function ItemsTab({ items, role, onToggleStock, onEdit, onDelete }: Props) {
  // Biến đổi MenuItem[] thành TableItem[] bằng cách thêm id và type
  const formattedItems = items.map((it) => ({
    ...it,
    id: it.menuItemId, // MenuTable cần 'id' để làm key và xử lý logic
    type: "item" as const, // Định danh đây là món lẻ (item)
  }));

  return (
    <MenuTable
      items={formattedItems} // Hết đỏ vì formattedItems đã khớp kiểu TableItem[]
      role={role}
      onToggleStock={onToggleStock}
      onEdit={(it) => onEdit(it as MenuItem & { type: "item" })}
      onDelete={(it) => onDelete(it as MenuItem & { type: "item" })}
    />
  );
}

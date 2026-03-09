"use client";

import { MenuTable, TableItem } from "@/components/features/menu/MenuTable";
import type { SetMenu } from "@/types/Menu";

type Props = {
  items: SetMenu[];
  role: string;
  onToggleStock: (id: string) => void;
  onEdit: (item: SetMenu) => void;
  onDelete: (item: SetMenu & { type: "combo" }) => void;
};

export default function CombosTab({ items, role, onToggleStock, onEdit, onDelete }: Props) {
  // ✅ Thêm id property cho MenuTable
  const tableItems: TableItem[] = items.map((item) => ({
    ...item,
    id: item.setMenuId,
    type: "combo" as const,
  }));

  return (
    <MenuTable
      items={tableItems}
      role={role}
      onToggleStock={onToggleStock}
      onEdit={(it) => {
        const original = items.find((i) => i.setMenuId === it.id);
        if (original) onEdit(original);
      }}
      onDelete={(it) => {
        const original = items.find((i) => i.setMenuId === it.id);
        if (original) onDelete({ ...original, type: "combo" });
      }}
    />
  );
}

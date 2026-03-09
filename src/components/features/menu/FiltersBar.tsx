"use client";
import { MenuTable } from "@/components/features/menu/MenuTable";
import type { MenuItem } from "@/types/Menu";

type Props = {
  items: (MenuItem & { type: "item" })[];
  role: string;
  onToggleStock: (id: string) => void;
  onEdit: (item: MenuItem & { type: "item" }) => void;
  onDelete: (item: MenuItem & { type: "item" }) => void;
};

export default function ItemsTab({ items, role, onToggleStock, onEdit, onDelete }: Props) {
  return (
    <MenuTable
      items={items}
      role={role}
      onToggleStock={onToggleStock}
      onEdit={(it) => onEdit(it as MenuItem & { type: "item" })}
      onDelete={(it) => onDelete(it as MenuItem & { type: "item" })}
    />
  );
}

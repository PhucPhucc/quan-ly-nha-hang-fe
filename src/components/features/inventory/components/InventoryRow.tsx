import { Edit, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";
import { AlertThresholdStatus, Ingredient } from "@/types/Inventory";

import { StatusBadge } from "./StatusBadge";

type Props = {
  item: Ingredient;
  onEdit: (item: Ingredient) => void;
  onDelete: (item: Ingredient) => void;
};

export function InventoryRow({ item, onEdit, onDelete }: Props) {
  return (
    <TableRow className="group transition-colors">
      <TableCell className="font-medium">{item.name}</TableCell>
      <TableCell className="text-muted-foreground">{item.code}</TableCell>
      <TableCell className="text-right">
        <span className="font-semibold">
          {item.currentStock} {item.unit}
        </span>
      </TableCell>
      <TableCell className="text-right">
        <span className="text-muted-foreground mr-0.5">{UI_TEXT.INVENTORY.TABLE.CURRENCY}</span>
        <span className="font-medium">{(item.costPrice ?? 0).toFixed(2)}</span>
      </TableCell>
      <TableCell className="w-[140px]">
        <StatusBadge status={item.status as AlertThresholdStatus} />
      </TableCell>
      <TableCell className="w-[120px] text-center">
        <div className="flex items-center gap-2 justify-center">
          <div
            className={cn(
              "h-2 w-2 rounded-full",
              item.isActive
                ? "bg-success shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                : "bg-muted-foreground/30"
            )}
            title={
              item.isActive
                ? UI_TEXT.INVENTORY.TABLE.ACTIVE_BADGE
                : UI_TEXT.INVENTORY.TABLE.INACTIVE_BADGE
            }
          />
          <span
            className={cn(
              "text-xs font-semibold px-2 py-0.5 rounded-full",
              item.isActive ? "text-success bg-success/10" : "text-muted-foreground bg-muted/20"
            )}
          >
            {item.isActive
              ? UI_TEXT.INVENTORY.TABLE.ACTIVE_BADGE
              : UI_TEXT.INVENTORY.TABLE.INACTIVE_BADGE}
          </span>
        </div>
      </TableCell>
      <TableCell className="w-[140px] text-right">
        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={() => onEdit(item)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete(item)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

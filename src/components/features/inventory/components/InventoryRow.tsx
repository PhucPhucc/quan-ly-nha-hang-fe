import { Ban, Edit, RotateCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
    <TableRow>
      <TableCell>
        <Badge
          variant="outline"
          className="min-w-20 justify-center rounded-md px-2 py-1 font-mono text-xs"
        >
          {item.code}
        </Badge>
      </TableCell>
      <TableCell className="font-semibold text-card-foreground text-sm">{item.name}</TableCell>
      <TableCell className="text-sm">
        <span>{item.inventoryGroupName || UI_TEXT.INVENTORY.TABLE.GROUP_NONE}</span>
      </TableCell>
      <TableCell>
        <span className="font-semibold text-card-foreground text-sm">
          {item.currentStock} {item.unit}
        </span>
      </TableCell>
      <TableCell className="text-sm">
        <span className="mr-0.5">{UI_TEXT.INVENTORY.TABLE.CURRENCY}</span>
        <span className="font-semibold text-card-foreground" aria-label="Average cost (read only)">
          {(item.costPrice ?? 0).toFixed(2)}
        </span>
      </TableCell>
      <TableCell className="w-35">
        <div>
          <StatusBadge status={item.status as AlertThresholdStatus} />
        </div>
      </TableCell>
      <TableCell className="w-30">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "h-2 w-2 rounded-full",
              item.isActive ? "bg-success " : "bg-muted-foreground/30"
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
      <TableCell className="w-35 text-center">
        <div className="flex justify-center gap-1">
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
            className={cn(
              "h-8 w-8 rounded-lg",
              item.isActive
                ? "text-destructive hover:bg-destructive/10 hover:text-destructive"
                : "text-muted-foreground hover:bg-muted/20"
            )}
            title={
              item.isActive
                ? UI_TEXT.INVENTORY.DELETE.TITLE
                : UI_TEXT.INVENTORY.DELETE.REACTIVATE_TITLE
            }
            onClick={() => onDelete(item)}
          >
            {item.isActive ? <Ban className="h-4 w-4" /> : <RotateCcw className="h-4 w-4" />}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

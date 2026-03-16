import { Package } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UI_TEXT } from "@/lib/UI_Text";
import { formatCurrency } from "@/lib/utils";
import type { Ingredient } from "@/types/Inventory";

import type { OpeningStockEntryValues } from "./openingStockEntry.types";

type Props = {
  ingredients: Ingredient[];
  entryItems: OpeningStockEntryValues;
  onInputChange: (id: string, field: "quantity" | "costPrice", value: string) => void;
  disabled?: boolean;
};

const { OPENING_STOCK } = UI_TEXT.INVENTORY;

export function OpeningStockTable({
  ingredients,
  entryItems,
  onInputChange,
  disabled = false,
}: Props) {
  return (
    <div className="max-h-[600px] overflow-auto rounded-xl border border-border bg-card">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-muted/50">
          <TableRow className="border-border bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-[120px] text-center font-semibold uppercase text-[11px] tracking-wider text-muted-foreground">
              {OPENING_STOCK.COL_CODE}
            </TableHead>
            <TableHead className="text-center font-semibold uppercase text-[11px] tracking-wider text-muted-foreground">
              {OPENING_STOCK.COL_NAME}
            </TableHead>
            <TableHead className="w-[100px] text-center font-semibold uppercase text-[11px] tracking-wider text-muted-foreground">
              {OPENING_STOCK.COL_UNIT}
            </TableHead>
            <TableHead className="w-[120px] text-center font-semibold uppercase text-[11px] tracking-wider text-muted-foreground">
              {OPENING_STOCK.COL_CURRENT}
            </TableHead>
            <TableHead className="w-[160px] text-center font-semibold uppercase text-[11px] tracking-wider text-muted-foreground">
              {OPENING_STOCK.COL_INITIAL}
            </TableHead>
            <TableHead className="w-[180px] text-center font-semibold uppercase text-[11px] tracking-wider text-muted-foreground">
              {OPENING_STOCK.COL_COST}
            </TableHead>
            <TableHead className="w-[150px] text-center font-semibold uppercase text-[11px] tracking-wider text-muted-foreground">
              {OPENING_STOCK.COL_TOTAL}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ingredients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-64 text-center">
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <Package className="h-8 w-8 opacity-20" />
                  <p>{OPENING_STOCK.EMPTY_SEARCH}</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            ingredients.map((item) => {
              const entryItem = entryItems[item.ingredientId];
              const rowTotal = (entryItem?.quantity || 0) * (entryItem?.costPrice || 0);

              return (
                <TableRow
                  key={item.ingredientId}
                  className="border-border transition-colors hover:bg-muted/50"
                >
                  <TableCell className="text-center font-medium">
                    <Badge variant="outline" className="font-mono text-xs">
                      {item.code}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center text-foreground">{item.name}</TableCell>
                  <TableCell className="text-center">
                    <span className="text-muted-foreground">{item.unit}</span>
                  </TableCell>
                  <TableCell className="text-center font-medium text-foreground">
                    {item.currentStock}
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      className="h-9 text-center"
                      disabled={disabled}
                      value={entryItem?.quantity ?? ""}
                      onChange={(e) => onInputChange(item.ingredientId, "quantity", e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      className="h-9 text-center"
                      disabled={disabled}
                      value={entryItem?.costPrice ?? ""}
                      onChange={(e) =>
                        onInputChange(item.ingredientId, "costPrice", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell className="text-center font-semibold text-primary">
                    {formatCurrency(rowTotal)}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

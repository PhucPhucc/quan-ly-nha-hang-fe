import {
  Bell,
  Boxes,
  EllipsisVertical,
  History,
  Package,
  RotateCcw,
  Search,
  Settings,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UI_TEXT } from "@/lib/UI_Text";

import type { StatusFilter } from "../useInventoryTable";
import { AddIngredientTrigger } from "./AddIngredientTrigger";
import { CreateStockInTrigger } from "./CreateStockInTrigger";
import {
  INVENTORY_ICON_BUTTON_CLASS,
  INVENTORY_INPUT_CLASS,
  INVENTORY_SELECT_TRIGGER_CLASS,
} from "./inventoryStyles";
import { InventoryToolbar } from "./InventoryToolbar";

type Props = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
  onReset?: () => void;
};

export function InventoryTableHeader({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  onReset,
}: Props) {
  return (
    <InventoryToolbar
      actions={
        <>
          <CreateStockInTrigger />
          <AddIngredientTrigger />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className={INVENTORY_ICON_BUTTON_CLASS}
                aria-label={UI_TEXT.INVENTORY.TABLE.COL_ACTIONS}
              >
                <EllipsisVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl">
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/manager/inventory/alerts" className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-orange-500" />
                  <span>{UI_TEXT.INVENTORY.ALERTS_BTN}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/manager/inventory/stock-in" className="flex items-center gap-2">
                  <Boxes className="h-4 w-4 text-primary" />
                  <span>{UI_TEXT.INVENTORY.STOCK_IN_TITLE}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/manager/inventory/transactions" className="flex items-center gap-2">
                  <History className="h-4 w-4 text-indigo-500" />
                  <span>{UI_TEXT.INVENTORY.TABLE.TRANS_HISTORY}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/manager/inventory/opening-stock" className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-green-500" />
                  <span>{UI_TEXT.INVENTORY.OPENING_STOCK.TITLE}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/manager/inventory/settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-slate-500" />
                  <span>{UI_TEXT.INVENTORY.SETTINGS.TITLE}</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      }
    >
      <div className="relative min-w-0 flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder={UI_TEXT.INVENTORY.TOOLBAR.SEARCH_PLACEHOLDER}
          className={`${INVENTORY_INPUT_CLASS} pl-9`}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as StatusFilter)}>
          <SelectTrigger
            className={`${INVENTORY_SELECT_TRIGGER_CLASS} min-h-[40px] w-full sm:w-[180px]`}
          >
            <div className="flex items-center gap-2 text-slate-500">
              <SlidersHorizontal className="h-4 w-4" />
              <SelectValue placeholder={UI_TEXT.INVENTORY.TOOLBAR.FILTER_STATUS} />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">{UI_TEXT.INVENTORY.TOOLBAR.STATUS_ALL}</SelectItem>
            <SelectItem value="normal">{UI_TEXT.INVENTORY.STOCK.STATUS_NORMAL}</SelectItem>
            <SelectItem value="low">{UI_TEXT.INVENTORY.STOCK.STATUS_LOW}</SelectItem>
            <SelectItem value="out">{UI_TEXT.INVENTORY.STOCK.STATUS_OUT}</SelectItem>
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="ghost"
          className={INVENTORY_ICON_BUTTON_CLASS}
          onClick={() => {
            onSearchChange("");
            onStatusChange("all");
            onReset?.();
          }}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </InventoryToolbar>
  );
}

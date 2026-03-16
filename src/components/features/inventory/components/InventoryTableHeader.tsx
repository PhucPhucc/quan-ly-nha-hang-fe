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
    <div className="w-full rounded-2xl border border-border bg-card shadow-soft px-4 py-3 grid gap-3 lg:grid-cols-[1fr_auto_auto_auto] lg:items-center">
      <div className="flex-1 min-w-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={UI_TEXT.INVENTORY.TOOLBAR.SEARCH_PLACEHOLDER}
            className="pl-10 h-11 rounded-2xl bg-background text-foreground placeholder:text-muted-foreground border border-border focus-visible:ring-2 focus-visible:ring-muted"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 justify-end">
        <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as StatusFilter)}>
          <SelectTrigger className="h-11 min-h-[44px] w-full sm:w-[200px] rounded-2xl bg-background border border-border text-foreground">
            <div className="flex items-center gap-2 text-muted-foreground">
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
          className="h-11 w-11 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-muted/30"
          onClick={() => {
            onSearchChange("");
            onStatusChange("all");
            onReset?.();
          }}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center justify-end gap-2">
        <CreateStockInTrigger />
        <AddIngredientTrigger />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="h-9 w-9 rounded-xl text-muted-foreground hover:bg-muted/30"
              aria-label="Thao tác"
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
      </div>
    </div>
  );
}

import { EllipsisVertical, History, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
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
    <div className="w-full rounded-2xl border border-slate-100 bg-white shadow-sm shadow-slate-100/60 px-4 py-3 grid gap-3 lg:grid-cols-[1fr_auto_auto_auto_auto] lg:items-center">
      <div className="flex-1 min-w-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder={UI_TEXT.INVENTORY.TOOLBAR.SEARCH_PLACEHOLDER}
            className="pl-10 h-11 rounded-2xl bg-slate-50 text-slate-700 placeholder:text-slate-400 border border-slate-100 focus-visible:ring-2 focus-visible:ring-slate-200"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 justify-end">
        <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as StatusFilter)}>
          <SelectTrigger className="h-11 min-h-[44px] w-full sm:w-[200px] rounded-2xl bg-slate-50 border border-slate-100 text-slate-700">
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
          className="h-11 w-11 rounded-2xl text-slate-400 hover:text-slate-600 hover:bg-slate-50"
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="h-11 w-11 rounded-xl text-slate-500 border-slate-200 hover:bg-slate-50"
              aria-label="Thao tác"
            >
              <EllipsisVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl">
            <DropdownMenuItem asChild>
              <Link href="/manager/inventory/alerts" className="flex items-center gap-2">
                <EllipsisVertical className="h-4 w-4 text-slate-400" />
                <span>{UI_TEXT.INVENTORY.ALERTS_TITLE}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/manager/inventory/history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                <span>{UI_TEXT.INVENTORY.HISTORY_TITLE}</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <AddIngredientTrigger />
      </div>
    </div>
  );
}

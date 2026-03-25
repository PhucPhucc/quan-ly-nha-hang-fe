import { Calculator, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { UI_TEXT } from "@/lib/UI_Text";

import { InventoryCogsContainer } from "../InventoryCogsContainer";
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
  const [isCogsDialogOpen, setIsCogsDialogOpen] = useState(false);

  return (
    <>
      <InventoryToolbar
        actions={
          <>
            <CreateStockInTrigger />
            <AddIngredientTrigger />
            <Button
              type="button"
              variant="ghost"
              className={INVENTORY_ICON_BUTTON_CLASS}
              aria-label={UI_TEXT.INVENTORY.COGS.TITLE}
              onClick={() => setIsCogsDialogOpen(true)}
            >
              <Calculator className="h-4 w-4" />
            </Button>
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
            <SelectContent className="rounded-lg">
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

      <Sheet open={isCogsDialogOpen} onOpenChange={setIsCogsDialogOpen}>
        <SheetContent
          side="right"
          className="flex h-full w-full flex-col gap-0 border-l border-slate-200 p-0 shadow-2xl sm:max-w-[720px] sm:rounded-l-lg bg-white"
        >
          <SheetHeader className="shrink-0 px-6 pt-8 pr-14 sm:px-10 sm:pt-10 bg-slate-50/50 border-b border-slate-100 pb-8">
            <SheetTitle className="flex items-center gap-3 text-xl font-bold tracking-tight text-slate-900">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-slate-200 text-primary shadow-sm">
                <Calculator className="h-5 w-5" />
              </div>
              {UI_TEXT.INVENTORY.COGS.TITLE}
            </SheetTitle>
            <p className="mt-2 ml-13 text-sm font-medium text-slate-500">
              {UI_TEXT.INVENTORY.COGS.DESC}
            </p>
          </SheetHeader>

          <div className="mt-4 min-h-0 flex-1 overflow-y-auto px-6 pb-10 sm:px-10 sm:pb-12">
            <InventoryCogsContainer embedded />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

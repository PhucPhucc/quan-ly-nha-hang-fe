import {
  Calculator,
  EllipsisVertical,
  RotateCcw,
  Search,
  Settings,
  SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

import { InventoryCogsContainer } from "../InventoryCogsContainer";
import { InventorySettingsFormContainer } from "../InventorySettingsFormContainer";
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
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);

  return (
    <>
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
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={(event) => {
                    event.preventDefault();
                    setIsCogsDialogOpen(true);
                  }}
                >
                  <Calculator className="h-4 w-4 text-rose-500" />
                  <span>{UI_TEXT.INVENTORY.COGS.TITLE}</span>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <button
                    type="button"
                    className="flex w-full items-center gap-2"
                    onClick={() => setIsSettingsDialogOpen(true)}
                  >
                    <Settings className="h-4 w-4 text-slate-500" />
                    <span>{UI_TEXT.INVENTORY.SETTINGS.TITLE}</span>
                  </button>
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

      <Dialog open={isCogsDialogOpen} onOpenChange={setIsCogsDialogOpen}>
        <DialogContent className="!left-3 !top-3 !right-3 !bottom-3 !grid !h-auto !w-[92vw] !max-w-[1180px] !translate-x-0 !translate-y-0 overflow-hidden rounded-[2rem] p-0 sm:!max-w-[1180px]">
          <div className="flex h-full flex-col overflow-hidden">
            <DialogHeader className="shrink-0 px-6 pt-6 pr-14 sm:px-8 sm:pt-8">
              <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                <Calculator className="h-5 w-5 text-primary" />
                {UI_TEXT.INVENTORY.COGS.TITLE}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {UI_TEXT.INVENTORY.COGS.DESC}
              </DialogDescription>
            </DialogHeader>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 sm:px-8 sm:pb-8">
              <InventoryCogsContainer embedded />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
        <DialogContent className="!left-3 !top-3 !right-3 !bottom-3 !grid !h-auto !w-auto !max-w-none !translate-x-0 !translate-y-0 overflow-hidden rounded-[2rem] p-0 sm:!max-w-none">
          <div className="flex h-full flex-col overflow-hidden">
            <DialogHeader className="shrink-0 px-6 pt-6 pr-14 sm:px-8 sm:pt-8">
              <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                <Settings className="h-5 w-5 text-primary" />
                {UI_TEXT.INVENTORY.SETTINGS.TITLE}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {UI_TEXT.INVENTORY.SETTINGS.DESC}
              </DialogDescription>
            </DialogHeader>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 sm:px-8 sm:pb-8">
              <InventorySettingsFormContainer />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

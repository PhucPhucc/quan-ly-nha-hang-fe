import { Search } from "lucide-react";

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

type Props = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
};

export function InventoryTableHeader({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={UI_TEXT.INVENTORY.TOOLBAR.SEARCH_PLACEHOLDER}
          className="pl-10 rounded-xl"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as StatusFilter)}>
        <SelectTrigger className="w-full sm:w-[200px] rounded-xl">
          <SelectValue placeholder={UI_TEXT.INVENTORY.TOOLBAR.FILTER_STATUS} />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          <SelectItem value="all">{UI_TEXT.INVENTORY.TOOLBAR.STATUS_ALL}</SelectItem>
          <SelectItem value="normal">{UI_TEXT.INVENTORY.STOCK.STATUS_NORMAL}</SelectItem>
          <SelectItem value="low">{UI_TEXT.INVENTORY.STOCK.STATUS_LOW}</SelectItem>
          <SelectItem value="out">{UI_TEXT.INVENTORY.STOCK.STATUS_OUT}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

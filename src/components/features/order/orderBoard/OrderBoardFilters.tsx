import { RefreshCw, Search } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UI_TEXT } from "@/lib/UI_Text";
import { OrderStatus, OrderType } from "@/types/enums";

const STATUS_OPTIONS = [
  { value: "ALL", label: UI_TEXT.ORDER.BOARD.ALL_STATUS },
  { value: OrderStatus.Serving, label: UI_TEXT.ORDER.CURRENT.STATUS_SERVING },
  { value: OrderStatus.Completed, label: UI_TEXT.ORDER.CURRENT.STATUS_COMPLETED },
  { value: OrderStatus.Cancelled, label: UI_TEXT.ORDER.CURRENT.STATUS_CANCELLED },
  { value: OrderStatus.Paid, label: UI_TEXT.ORDER.CURRENT.STATUS_PAID },
];

const ORDER_TYPE_OPTIONS = [
  { value: "ALL", label: UI_TEXT.ORDER.BOARD.ALL_TYPE },
  { value: OrderType.DineIn.toString(), label: UI_TEXT.ORDER.BOARD.DINE_IN_LABEL },
  { value: OrderType.Takeaway.toString(), label: UI_TEXT.ORDER.BOARD.TAKEAWAY_LABEL },
];

interface OrderBoardFiltersProps {
  search: string;
  statusFilter: string;
  typeFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (status: string) => void;
  onTypeChange: (type: string) => void;
  onReset: () => void;
}

export default function OrderBoardFilters({
  search,
  statusFilter,
  typeFilter,
  onSearchChange,
  onStatusChange,
  onTypeChange,
  onReset,
}: OrderBoardFiltersProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className="flex flex-col xl:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={handleSearchChange}
            placeholder={UI_TEXT.ORDER.BOARD.SEARCH_PLACEHOLDER}
            className="pl-9 bg-slate-50/50 border-slate-200 focus-visible:ring-primary/20"
          />
        </div>

        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full bg-slate-50/50">
            <SelectValue placeholder={UI_TEXT.ORDER.BOARD.STATUS_LABEL} />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={onTypeChange}>
          <SelectTrigger className="w-full bg-slate-50/50">
            <SelectValue placeholder={UI_TEXT.ORDER.BOARD.TYPE_TABLE} />
          </SelectTrigger>
          <SelectContent>
            {ORDER_TYPE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="shrink-0 w-full xl:w-auto">
        <Button
          onClick={onReset}
          variant="outline"
          size="icon"
          className="group"
          title={UI_TEXT.COMMON.RESET}
        >
          <RefreshCw className="h-4 w-4 transition-transform group-hover:rotate-180" />
        </Button>
      </div>
    </div>
  );
}

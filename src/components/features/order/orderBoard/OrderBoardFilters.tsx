import { RefreshCw, Search, SlidersHorizontal } from "lucide-react";
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
  { value: OrderType.Delivery.toString(), label: "Giao hàng" },
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
    <div className="w-full rounded-2xl border border-slate-100 bg-white shadow-sm shadow-slate-100/60 px-4 py-3 grid gap-3 lg:grid-cols-[1fr_auto_auto_auto] lg:items-center">
      <div className="flex-1 min-w-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={handleSearchChange}
            placeholder={UI_TEXT.ORDER.BOARD.SEARCH_PLACEHOLDER}
            className="pl-10 h-11 rounded-2xl bg-slate-50 text-slate-700 placeholder:text-slate-400 border border-slate-100 focus-visible:ring-2 focus-visible:ring-slate-200"
          />
        </div>
      </div>

      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="h-11 min-h-[44px] w-full sm:w-[200px] rounded-2xl bg-slate-50 border border-slate-100 text-slate-700">
          <div className="flex items-center gap-2 text-slate-500">
            <SlidersHorizontal className="h-4 w-4" />
            <SelectValue placeholder={UI_TEXT.ORDER.BOARD.STATUS_LABEL} />
          </div>
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={typeFilter} onValueChange={onTypeChange}>
        <SelectTrigger className="h-11 min-h-[44px] w-full sm:w-[200px] rounded-2xl bg-slate-50 border border-slate-100 text-slate-700">
          <div className="flex items-center gap-2 text-slate-500">
            <SlidersHorizontal className="h-4 w-4" />
            <SelectValue placeholder={UI_TEXT.ORDER.BOARD.TYPE_TABLE} />
          </div>
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          {ORDER_TYPE_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center justify-end">
        <Button
          onClick={onReset}
          variant="ghost"
          size="icon"
          className="h-11 w-11 rounded-2xl text-slate-400 hover:text-slate-600 hover:bg-slate-50"
          title={UI_TEXT.COMMON.RESET}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

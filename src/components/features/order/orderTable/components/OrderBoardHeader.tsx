import { format } from "date-fns";
import {
  Armchair,
  Calendar as CalendarIcon,
  LayoutGrid,
  Search,
  ShoppingCart,
  SlidersHorizontal,
} from "lucide-react";
import { shallow } from "zustand/shallow";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";
import { ActiveTab, useOrderBoardStore } from "@/store/useOrderStore";
import { OrderType } from "@/types/enums";
import { DINE_IN_STATUSES, TAKEAWAY_STATUSES } from "@/types/Order";

const OrderBoardHeader = () => {
  const searchQuery = useOrderBoardStore((s) => s.searchQuery);
  const setSearchQuery = useOrderBoardStore((s) => s.setSearchQuery);

  const selectedStatuses = useOrderBoardStore((s) => s.selectedStatuses);
  const toggleStatus = useOrderBoardStore((s) => s.toggleStatus);

  const activeTab = useOrderBoardStore((s) => s.activeTab);
  const setActiveTab = useOrderBoardStore((s) => s.setActiveTab);

  const dateRange = useOrderBoardStore((s) => s.dateRange);
  const setDateRange = useOrderBoardStore((s) => s.setDateRange);

  const sortOrder = useOrderBoardStore((s) => s.sortOrder);
  const setSortOrder = useOrderBoardStore((s) => s.setSortOrder);

  const stats = useOrderBoardStore(
    (s) => ({
      total: s.orders.length,
      dineIn: s.orders.filter((o) => o.orderType === OrderType.DineIn).length,
      takeaway: s.orders.filter((o) => o.orderType === OrderType.Takeaway).length,
    }),
    shallow
  );
  const resetFilters = useOrderBoardStore((s) => s.resetFilters);

  return (
    <div className="px-5 py-4 border-b space-y-4 bg-muted/5">
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm mã đơn, số bàn..."
            className="pl-10 h-11 bg-background border-muted-foreground/20 rounded-2xl shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-11 rounded-2xl px-4 gap-2 border-muted-foreground/20 shadow-sm"
            >
              <SlidersHorizontal className="size-4" />
              <span className="hidden sm:inline font-bold text-xs uppercase">
                {UI_TEXT.COMMON.FILTER}
              </span>
              {selectedStatuses.length > 0 && (
                <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                  {selectedStatuses.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-120 p-0 rounded-2xl shadow-2xl overflow-hidden" align="end">
            <div className="bg-primary/5 px-4 py-3 border-b flex items-center justify-between">
              <p className="font-black text-[11px] text-primary uppercase">
                {UI_TEXT.ORDER.BOARD.ADVANCED_FILTER}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="h-6 text-[9px] font-black uppercase"
              >
                {UI_TEXT.BUTTON.RESET}
              </Button>
            </div>

            <div className="p-4 space-y-6">
              <div className="flex gap-6">
                {(activeTab === "all" || activeTab === "dine_in") && (
                  <div className="space-y-3 flex-1">
                    <span className="text-[10px] font-black text-muted-foreground uppercase border-b pb-1 block">
                      {UI_TEXT.ORDER.BOARD.AT_TABLE}
                    </span>
                    <div className="grid grid-cols-1 gap-1">
                      {DINE_IN_STATUSES.map((s) => (
                        <div
                          key={s.value}
                          onClick={() => toggleStatus(s.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              toggleStatus(s.value);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-muted/50 transition-colors focus:bg-muted/50 focus:outline-none"
                        >
                          <Checkbox checked={selectedStatuses.includes(s.value)} />
                          <div className="flex items-center gap-2">
                            <div className={cn("size-2 rounded-full", s.color)} />
                            <span className="text-xs font-bold whitespace-nowrap">{s.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(activeTab === "all" || activeTab === "takeaway") && (
                  <div className="space-y-3 flex-1">
                    <span className="text-[10px] font-black text-muted-foreground uppercase border-b pb-1 block">
                      {UI_TEXT.ORDER.BOARD.STATUS_LABEL}
                    </span>
                    <div className="grid grid-cols-1 gap-1">
                      {TAKEAWAY_STATUSES.map((s) => (
                        <div
                          key={s.value}
                          onClick={() => toggleStatus(s.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              toggleStatus(s.value);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-muted/50 transition-colors focus:bg-muted/50 focus:outline-none"
                        >
                          <Checkbox checked={selectedStatuses.includes(s.value)} />
                          <div className="flex items-center gap-2">
                            <div className={cn("size-2 rounded-full", s.color)} />
                            <span className="text-xs font-bold whitespace-nowrap">{s.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2 border-t pt-4">
                <span className="text-[10px] font-black text-muted-foreground uppercase">
                  {UI_TEXT.ORDER.BOARD.SORT_BY}
                </span>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="w-full h-10 rounded-xl bg-muted/20 text-xs font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">{UI_TEXT.ORDER.BOARD.LATEST_UPDATE}</SelectItem>
                    <SelectItem value="oldest">{UI_TEXT.ORDER.BOARD.OLDEST_UPDATE}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Date Range Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-11 rounded-2xl px-4 gap-2 border-muted-foreground/20 shadow-sm font-bold"
            >
              <CalendarIcon className="size-4" />
              <span className="text-[11px] uppercase">
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd/MM")} {UI_TEXT.COMMON.MINUS}{" "}
                      {format(dateRange.to, "dd/MM/yyyy")}
                    </>
                  ) : (
                    format(dateRange.from, "dd/MM/yyyy")
                  )
                ) : (
                  "Chọn ngày"
                )}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 rounded-2xl shadow-2xl" align="end">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              className="rounded-2xl"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        className="w-full"
        onValueChange={(value) => setActiveTab(value as ActiveTab)}
      >
        <TabsList className="flex items-center w-full bg-muted/40 rounded-2xl border border-muted-foreground/10">
          <TabsTrigger
            value="all"
            className="data-[state=active]:border-2 data-[state=active]:border-muted-foreground/20 flex justify-center items-center py-1 rounded-xl gap-2 font-semibold text-xs uppercase"
          >
            <LayoutGrid className="size-4" />
            <span>{UI_TEXT.ORDER.BOARD.OVERVIEW}</span>
            <Badge variant="secondary" className="ml-1 scale-90">
              {stats.total}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="dine_in"
            className="data-[state=active]:border-2 data-[state=active]:border-muted-foreground/20 rounded-xl gap-2 font-semibold text-xs uppercase"
          >
            <Armchair className="size-4" />
            <span>{UI_TEXT.ORDER.BOARD.AT_TABLE}</span>
            <Badge variant="secondary" className="ml-1 scale-90">
              {stats.dineIn}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="takeaway"
            className="data-[state=active]:border-2 data-[state=active]:border-muted-foreground/20 rounded-xl gap-2 font-semibold text-xs uppercase"
          >
            <ShoppingCart className="size-4" />
            <span>{UI_TEXT.ORDER.BOARD.TAKEAWAY}</span>
            <Badge variant="secondary" className="ml-1 scale-90">
              {stats.takeaway}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default OrderBoardHeader;

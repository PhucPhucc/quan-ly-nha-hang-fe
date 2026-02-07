"use client";

import { format } from "date-fns";
import {
  Armchair,
  Calendar as CalendarIcon,
  LayoutGrid,
  Search,
  ShoppingCart,
  SlidersHorizontal,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import { mockTables, mockTakeawayOrders } from "./mockData";
import TableItem from "./TableItem";
import TakeawayItem from "./TakeawayItem";

const DINE_IN_STATUSES = [
  { value: "ready", label: "Bàn trống", color: "bg-table-empty" },
  { value: "inprocess", label: "Đang sử dụng", color: "bg-table-inprocess" },
  { value: "reserved", label: "Đặt trước", color: "bg-table-reserved" },
  { value: "cleaning", label: "Đang dọn", color: "bg-table-cleaning" },
];

const TAKEAWAY_STATUSES = [
  { value: "tk_inprocess", label: "Đang nấu", color: "bg-orange-500" },
  { value: "tk_ready", label: "Sẵn sàng", color: "bg-emerald-500" },
];

const OrderBoard = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState("newest");

  const stats = {
    total: mockTables.length + mockTakeawayOrders.length,
    dineIn: mockTables.length,
    takeaway: mockTakeawayOrders.length,
  };

  const filteredTables = useMemo(() => {
    if (activeTab === "takeaway") return [];

    // Only apply statuses that belong to Dine-in
    const dineInFilters = selectedStatuses.filter((s) =>
      DINE_IN_STATUSES.some((ds) => ds.value === s)
    );

    return mockTables.filter((t) => {
      const matchesStatus =
        dineInFilters.length === 0 || dineInFilters.includes(t.status.toLowerCase());
      const matchesSearch =
        searchQuery === "" ||
        t.tableNumber.toString().includes(searchQuery) ||
        t.label.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [selectedStatuses, searchQuery, activeTab]);

  const filteredTakeaways = useMemo(() => {
    if (activeTab === "dine_in") return [];

    // Only apply statuses that belong to Takeaway (handling both 'ready' and 'tk_ready' variants)
    const takeawayFilters = selectedStatuses.filter((s) =>
      TAKEAWAY_STATUSES.some((ts) => ts.value === s)
    );

    return mockTakeawayOrders.filter((o) => {
      const orderStatus = o.status.toLowerCase();
      const tkMappedStatus = `tk_${orderStatus}`;

      const isSelected =
        takeawayFilters.length === 0 ||
        takeawayFilters.includes(orderStatus) ||
        takeawayFilters.includes(tkMappedStatus);

      const matchesSearch =
        searchQuery === "" ||
        o.orderCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.label.toLowerCase().includes(searchQuery.toLowerCase());
      return isSelected && matchesSearch;
    });
  }, [selectedStatuses, searchQuery, activeTab]);

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const resetFilters = () => {
    setSelectedStatuses([]);
    setSearchQuery("");
    setSortOrder("newest");
    setDateRange({ from: new Date(), to: new Date() });
  };

  return (
    <div className="w-full h-full flex flex-col bg-background overflow-hidden font-sans">
      {/* Header */}
      <div className="px-5 py-4 border-b space-y-4 bg-muted/5">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm mã đơn, số bàn..."
              className="pl-10 h-11 bg-background border-muted-foreground/20 rounded-2xl shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-11 rounded-2xl px-4 gap-2 border-muted-foreground/20 shadow-sm"
              >
                <SlidersHorizontal className="size-4" />
                <span className="hidden sm:inline font-bold text-xs uppercase">Bộ lọc</span>
                {selectedStatuses.length > 0 && (
                  <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                    {selectedStatuses.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[480px] p-0 rounded-2xl shadow-2xl overflow-hidden"
              align="end"
            >
              <div className="bg-primary/5 px-4 py-3 border-b flex items-center justify-between">
                <h4 className="font-black text-[11px] text-primary uppercase">Bộ lọc nâng cao</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="h-6 text-[9px] font-black uppercase"
                >
                  Xóa lọc
                </Button>
              </div>

              <div className="p-4 space-y-6">
                <div className="flex gap-6">
                  {(activeTab === "all" || activeTab === "dine_in") && (
                    <div className="space-y-3 flex-1">
                      <label className="text-[10px] font-black text-muted-foreground uppercase border-b pb-1 block">
                        Tại bàn
                      </label>
                      <div className="grid grid-cols-1 gap-1">
                        {DINE_IN_STATUSES.map((s) => (
                          <div
                            key={s.value}
                            onClick={() => toggleStatus(s.value)}
                            className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-muted/50 transition-colors"
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
                      <label className="text-[10px] font-black text-muted-foreground uppercase border-b pb-1 block">
                        Mang đi
                      </label>
                      <div className="grid grid-cols-1 gap-1">
                        {TAKEAWAY_STATUSES.map((s) => (
                          <div
                            key={s.value}
                            onClick={() => toggleStatus(s.value)}
                            className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-muted/50 transition-colors"
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
                  <label className="text-[10px] font-black text-muted-foreground uppercase">
                    Sắp xếp theo
                  </label>
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="w-full h-10 rounded-xl bg-muted/20 text-xs font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Cập nhật mới nhất</SelectItem>
                      <SelectItem value="oldest">Cập nhật cũ nhất</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>

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
                        {format(dateRange.from, "dd/MM")} - {format(dateRange.to, "dd/MM/yyyy")}
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
                initialFocus
                className="rounded-2xl"
              />
            </PopoverContent>
          </Popover>
        </div>

        <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full h-12 bg-muted/40 p-1.5 rounded-2xl border border-muted-foreground/10">
            <TabsTrigger value="all" className="rounded-xl gap-2 font-black text-[11px] uppercase">
              <LayoutGrid className="size-4" /> Tổng quan
              <Badge variant="secondary" className="ml-1 scale-90">
                {stats.total}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="dine_in"
              className="rounded-xl gap-2 font-black text-[11px] uppercase"
            >
              <Armchair className="size-4" /> Tại bàn
              <Badge variant="secondary" className="ml-1 scale-90">
                {stats.dineIn}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="takeaway"
              className="rounded-xl gap-2 font-black text-[11px] uppercase"
            >
              <ShoppingCart className="size-4" /> Mang đi
              <Badge variant="secondary" className="ml-1 scale-90">
                {stats.takeaway}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-0 relative bg-background">
        <ScrollArea className="h-full w-full" type="always">
          <div className="p-6 grid grid-cols-4 gap-6 pb-32">
            {filteredTables.map((table) => (
              <TableItem key={`table-${table.tableNumber}`} table={table} />
            ))}
            {filteredTakeaways.map((order) => (
              <TakeawayItem key={`takeaway-${order.id}`} order={order} />
            ))}
          </div>

          {filteredTables.length === 0 && filteredTakeaways.length === 0 && (
            <div className="flex flex-col items-center justify-center py-40 text-muted-foreground uppercase font-black text-xs">
              Không tìm thấy kết quả
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default OrderBoard;

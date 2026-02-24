"use client";

import { Armchair, LayoutGrid, Loader2, ShoppingCart, SlidersHorizontal } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { orderService } from "@/services/orderService";
import { OrderStatus, OrderType } from "@/types/enums";
import { Order } from "@/types/Order";

import OrderBoardHeader from "./components/OrderBoardHeader";
import TableItem, { Table } from "./TableItem";
import TakeawayItem from "./TakeawayItem";

const DINE_IN_STATUSES = [
  { value: "inprocess", label: "Đang phục vụ", color: "bg-table-inprocess" },
  { value: "ready", label: "Đã hoàn thành", color: "bg-table-empty" },
];

export type ActiveTab = "all" | "dine_in" | "takeaway";

const OrderBoard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await orderService.getOrders({ pageSize: 100 });
        if (res.isSuccess && res.data) {
          setOrders(res.data.items || []);
        }
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const dineInOrders = useMemo(
    () => orders.filter((o) => o.orderType === OrderType.DineIn),
    [orders]
  );
  const takeawayOrders = useMemo(
    () => orders.filter((o) => o.orderType === OrderType.Takeaway),
    [orders]
  );

  const stats = {
    total: orders.length,
    dineIn: dineInOrders.length,
    takeaway: takeawayOrders.length,
  };

  const filteredTakeaways = useMemo(() => {
    if (activeTab === "dine_in") return [];
    return takeawayOrders.filter((o) => {
      // Map OrderStatus enum to filter status strings
      const statusString = o.status === OrderStatus.Serving ? "tk_inprocess" : "tk_ready";
      const matchesStatus =
        selectedStatuses.length === 0 || selectedStatuses.includes(statusString);
      const matchesSearch =
        searchQuery === "" || o.orderCode.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [takeawayOrders, selectedStatuses, searchQuery, activeTab]);

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const resetFilters = () => {
    setSelectedStatuses([]);
    setSearchQuery("");
  };

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <Loader2 className="size-10 animate-spin text-primary" />
        <span className="ml-3 font-bold text-muted-foreground uppercase tracking-widest">
          Đang tải dữ liệu đơn hàng...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-background overflow-hidden font-sans">
      <OrderBoardHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={setSelectedStatuses}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dateRange={dateRange}
        setDateRange={setDateRange}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        stats={stats}
        resetFilters={resetFilters}
      />

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
          className="w-[300px] p-0 rounded-2xl shadow-2xl overflow-hidden"
          align="end"
        >
          <div className="bg-primary/5 px-4 py-3 border-b flex items-center justify-between">
            <h4 className="font-black text-[11px] text-primary uppercase">Trạng thái</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-6 text-[9px] font-black uppercase"
            >
              Xóa
            </Button>
          </div>
          <div className="p-4 space-y-2">
            {DINE_IN_STATUSES.map((s) => (
              <div
                key={s.value}
                onClick={() => toggleStatus(s.value)}
                className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <Checkbox checked={selectedStatuses.includes(s.value)} />
                <span className="text-xs font-bold">{s.label}</span>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Tabs
        value={activeTab}
        className="w-full"
        onValueChange={(value) => setActiveTab(value as ActiveTab)}
      >
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

      {/* Content Area */}
      <div className="flex-1 min-h-0 relative bg-background">
        <ScrollArea className="h-full w-full" type="always">
          {/* Section: Dine-In Tables */}
          {(activeTab === "all" || activeTab === "dine_in") && (
            <div className="col-span-full mb-2">
              <div className="flex items-center gap-2 text-slate-500 mb-4 px-2">
                <Armchair className="size-4" />
                <h3 className="text-xs font-black uppercase tracking-widest">Khu vực bàn</h3>
                <div className="h-px flex-1 bg-border/50 ml-4"></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 12 }, (_, i) => {
                  const tableNumber = i + 1;
                  const tableId = tableNumber.toString().padStart(2, "0");

                  // Find if there's an active order for this table
                  const activeOrder = dineInOrders.find((o) => {
                    if (!o.tableId) return false;
                    const normalizedTableId = o.tableId.toLowerCase().replace(/-/g, "");
                    const idMatch =
                      normalizedTableId.endsWith(tableId) ||
                      o.tableId === tableId ||
                      normalizedTableId.includes(tableId);
                    if (!idMatch) return false;

                    // If filtering, check if status matches, otherwise only show Serving
                    if (selectedStatuses.length > 0) {
                      const statusString = o.status === OrderStatus.Serving ? "inprocess" : "ready";
                      return selectedStatuses.includes(statusString);
                    }
                    return o.status === OrderStatus.Serving;
                  });

                  const tableData: Table = activeOrder
                    ? {
                        tableNumber: tableNumber,
                        status:
                          activeOrder.status === OrderStatus.Completed ? "READY" : "INPROCESS",
                        label: `Bàn ${tableId}`,
                        people: 4,
                        price: new Intl.NumberFormat("vi-VN").format(activeOrder.totalAmount) + "đ",
                        elapsedTime: "25m",
                      }
                    : {
                        tableNumber: tableNumber,
                        status: "READY",
                        label: `Bàn ${tableId}`,
                        people: 0,
                      };

                  // Filter by search query
                  if (
                    searchQuery &&
                    !tableData.label.toLowerCase().includes(searchQuery.toLowerCase())
                  ) {
                    return null;
                  }

                  return <TableItem key={`table-${tableNumber}`} table={tableData} />;
                })}
              </div>
            </div>
          )}

          {/* Section: Takeaway Orders */}
          {(activeTab === "all" || activeTab === "takeaway") && (
            <div className="col-span-full mt-8">
              <div className="flex items-center gap-2 text-slate-500 mb-4 px-2">
                <ShoppingCart className="size-4" />
                <h3 className="text-xs font-black uppercase tracking-widest">Đơn mang đi</h3>
                <div className="h-px flex-1 bg-border/50 ml-4"></div>
              </div>
              {filteredTakeaways.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredTakeaways.map((order) => {
                    return (
                      <TakeawayItem
                        key={order.orderId}
                        order={{
                          id: order.orderId,
                          orderCode: order.orderCode,
                          status: order.status === OrderStatus.Serving ? "INPROCESS" : "READY",
                          label: "Mang đi",
                          people: 1,
                          price: new Intl.NumberFormat("vi-VN").format(order.totalAmount) + "đ",
                          elapsedTime: "5m",
                        }}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground italic text-[10px] uppercase">
                  Không có đơn mang đi
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default OrderBoard;

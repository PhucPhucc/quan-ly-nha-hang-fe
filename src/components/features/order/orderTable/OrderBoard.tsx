"use client";

import React, { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";

import OrderBoardHeader from "./components/OrderBoardHeader";
import OrderBoardList from "./components/OrderBoardList";
import { DINE_IN_STATUSES, TAKEAWAY_STATUSES } from "./constants";
import { mockTables, mockTakeawayOrders } from "./mockData";

export type ActiveTab = "all" | "dine_in" | "takeaway";

const OrderBoard = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("all");
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

  const resetFilters = () => {
    setSelectedStatuses([]);
    setSearchQuery("");
    setSortOrder("newest");
    setDateRange({ from: new Date(), to: new Date() });
  };

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

      <OrderBoardList filteredTables={filteredTables} filteredTakeaways={filteredTakeaways} />
    </div>
  );
};

export default OrderBoard;

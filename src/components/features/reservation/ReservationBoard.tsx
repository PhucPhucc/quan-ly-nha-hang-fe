"use client";
import React from "react";

import { useReservationBoard } from "@/hooks/useReservationBoard";

import { ReservationFilter } from "./ReservationFilter";
import { ReservationStatus } from "./ReservationStatus";
import { ReservationTable } from "./ReservationTable";

const TableBookingBoard = () => {
  const { data, totalItems, totalPages, stats, filters, setFilter, resetFilters, handleRefresh } =
    useReservationBoard();

  return (
    <div className="p-6 rounded-xl bg-background h-full flex flex-col">
      <ReservationStatus
        total={stats.total}
        booked={stats.booked}
        checkedIn={stats.checkedIn}
        cancelled={stats.cancelled}
      />

      <ReservationFilter
        search={filters.search}
        onSearchChange={(val) => setFilter("search", val)}
        date={filters.dateStr}
        onDateChange={(val) => setFilter("dateStr", val)}
        area={filters.area}
        onAreaChange={(val) => setFilter("area", val)}
        status={filters.status}
        onStatusChange={(val) => setFilter("status", val)}
        onReset={resetFilters}
        onRefresh={handleRefresh}
      />

      <ReservationTable
        data={data}
        totalItems={totalItems}
        currentPage={filters.currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setFilter("currentPage", page)}
        onRefresh={handleRefresh}
      />
    </div>
  );
};

export default TableBookingBoard;

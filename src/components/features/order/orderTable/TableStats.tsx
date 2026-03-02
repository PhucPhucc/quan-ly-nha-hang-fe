"use client";

import React from "react";

import { UI_TEXT } from "@/lib/UI_Text";
import { OrderStatus } from "@/types/enums";

import { Table } from "./TableItem";

interface TableStatsProps {
  tables: Table[];
}

const TableStats = ({ tables }: TableStatsProps) => {
  const stats = {
    total: tables.length,
    available: tables.filter((t) => t.status === OrderStatus.Ready).length,
    occupied: tables.filter((t) => t.status === OrderStatus.Serving).length,
    reserved: tables.filter((t) => t.status === OrderStatus.Reserved).length,
    cleaning: tables.filter((t) => t.status === OrderStatus.Cleaning).length,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-2 px-2">
      <StatCard
        label={UI_TEXT.COMMON.ALL}
        value={stats.total}
        color="bg-slate-100 text-slate-900 border-slate-200"
      />
      <StatCard
        label={UI_TEXT.TABLE.READY}
        value={stats.available}
        color="bg-table-empty/30 text-table-empty-dark border-table-empty/50"
      />
      <StatCard
        label={UI_TEXT.TABLE.INPROCESS}
        value={stats.occupied}
        color="bg-table-inprocess/30 text-table-inprocess border-table-inprocess/50"
      />
      <StatCard
        label={UI_TEXT.TABLE.RESERVED}
        value={stats.reserved}
        color="bg-table-reserved/30 text-amber-900 border-table-reserved/50"
      />
      <StatCard
        label={UI_TEXT.TABLE.CLEANING}
        value={stats.cleaning}
        color="bg-table-cleaning/30 text-table-cleaning border-table-cleaning/50"
      />
    </div>
  );
};

const StatCard = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div
    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all shadow-sm ${color}`}
  >
    <span className="text-xl font-black leading-tight">{value}</span>
    <span className="text-[8px] font-black uppercase tracking-tighter opacity-80">{label}</span>
  </div>
);

export default TableStats;

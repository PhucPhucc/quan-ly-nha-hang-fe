"use client";

import { ShoppingCart } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

export type TakeawayStatus = "INPROCESS" | "READY" | "COMPLETED" | "CANCELLED";

export type TakeawayOrder = {
  id: string;
  orderCode: string;
  status: TakeawayStatus;
  label: string;
  people: number;
  elapsedTime?: string;
  price?: string;
};

export interface TakeawayItemProps {
  order: TakeawayOrder;
  onClick?: (order: TakeawayOrder) => void;
}

const TakeawayItem = ({ order, onClick }: TakeawayItemProps) => {
  const getStatusColorClass = (status: TakeawayStatus) => {
    switch (status) {
      case "READY":
        return "text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]";
      case "INPROCESS":
        return "text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.3)]";
      case "COMPLETED":
        return "text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]";
      case "CANCELLED":
        return "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusBgClass = (status: TakeawayStatus) => {
    switch (status) {
      case "READY":
        return "bg-emerald-500/10";
      case "INPROCESS":
        return "bg-orange-500/10";
      case "COMPLETED":
        return "bg-blue-500/10";
      case "CANCELLED":
        return "bg-red-500/10";
      default:
        return "bg-muted";
    }
  };

  return (
    <div
      onClick={() => onClick?.(order)}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick(order);
        }
      }}
      role="button"
      tabIndex={0}
      className="flex flex-col items-center justify-center cursor-pointer transition-all active:scale-90 group px-1 relative focus:outline-none"
    >
      {/* Container for Info Overlays */}
      <div className="relative w-28 h-20 sm:w-32 sm:h-24 flex items-center justify-center">
        {/* Large Shopping Cart Icon as the main visual */}
        <div
          className={cn(
            "p-4 rounded-full transition-all duration-300 group-hover:scale-110",
            getStatusBgClass(order.status)
          )}
        >
          <ShoppingCart
            className={cn(
              "size-12 sm:size-16 transition-all duration-300",
              getStatusColorClass(order.status)
            )}
          />
        </div>

        {/* Floating Badges */}
        <div className="absolute top-0 right-0">
          {order.status === "INPROCESS" && (
            <div className="bg-orange-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-sm animate-pulse">
              {order.elapsedTime || "5m"}
            </div>
          )}
          {order.status === "READY" && (
            <div className="bg-emerald-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-sm uppercase">
              Sẵn
            </div>
          )}
        </div>

        <div className="absolute -top-1 -left-1">
          <div className="bg-background/80 backdrop-blur-sm border border-border px-1.5 py-0.5 rounded-md shadow-xs">
            <p className="text-[9px] font-black font-mono text-muted-foreground leading-none">
              #{order.orderCode.split("-").pop()}
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 right-0">
          {order.price && (
            <div className="bg-primary text-primary-foreground text-[9px] font-black px-2 py-0.5 rounded-lg shadow-sm">
              {order.price}
            </div>
          )}
        </div>
      </div>

      <p
        className={cn(
          "mt-3 text-[10px] font-black uppercase tracking-tighter transition-colors text-center w-full truncate px-2",
          order.status === "READY" ? "text-muted-foreground" : "text-foreground"
        )}
      >
        {order.label}
      </p>
    </div>
  );
};

export default TakeawayItem;

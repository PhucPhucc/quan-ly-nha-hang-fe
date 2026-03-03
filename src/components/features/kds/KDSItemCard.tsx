"use client";

import { Check, RotateCcw } from "lucide-react";
import React from "react";

import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";
import { OrderItemStatus } from "@/types/enums";
import { KDSItemCardProps } from "@/types/Kds";

import { KDSRejectModal } from "./KDSRejectModal";

export function KDSItemCard({ item, orderCode, orderType, onDone, onReturn }: KDSItemCardProps) {
  const [isRejectModalOpen, setIsRejectModalOpen] = React.useState(false);
  const isReady = item.status === OrderItemStatus.Ready;

  const handleDone = () => onDone?.(item.orderItemId);
  const handleReturnConfirm = (reason: string) => onReturn?.(item.orderItemId, reason);

  const getStationColor = (stationName?: string) => {
    const name = (stationName || "STATION").toLowerCase();
    if (name.includes("hot") || name.includes("nóng"))
      return "bg-orange-100 text-orange-700 border-orange-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]";
    if (name.includes("cold") || name.includes("lạnh") || name.includes("salad"))
      return "bg-emerald-100 text-emerald-700 border-emerald-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]";
    if (name.includes("bar") || name.includes("pha chế"))
      return "bg-blue-100 text-blue-700 border-blue-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]";
    return "bg-indigo-100 text-indigo-700 border-indigo-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]";
  };

  return (
    <div className="flex flex-row w-full h-full bg-white relative group animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Left Section: Order Info & Station */}
      <div className="flex flex-col justify-start gap-3 p-5 border-r border-border-subtle shrink-0 min-w-[180px] bg-slate-50/50">
        <span className="font-mono text-[11px] font-bold text-slate-400 tracking-[0.2em] uppercase">
          Order #{orderCode}
        </span>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-white rounded text-[10px] font-black text-slate-500 uppercase tracking-widest shadow-sm border border-slate-100">
            {orderType}
          </span>
          <span className="text-[11px] font-black text-slate-600 uppercase tracking-tighter">
            {item.itemCodeSnapshot}
          </span>
        </div>
        <span
          className={cn(
            "text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border w-fit flex items-center gap-1.5",
            getStationColor(item.stationSnapshot)
          )}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></div>
          {item.stationSnapshot || "STATION"}
        </span>
      </div>

      {/* Middle Section: Item Name & Notes */}
      <div className="flex-1 p-5 flex flex-col justify-start gap-4 min-w-0">
        <div className="flex items-start justify-between gap-4">
          {/* Quantity & Info Side */}
          <div className="flex-1 flex items-start gap-4">
            <span className="text-sky-600 font-extrabold text-3xl shrink-0 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-100 flex items-center justify-center min-w-[56px] mt-0.5">
              x{item.quantity}
            </span>
            <div className="flex flex-col gap-2 mt-1 w-full">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 w-full">
                <h3 className="text-2xl font-black text-black leading-tight uppercase tracking-tight line-clamp-2">
                  {item.itemNameSnapshot}
                </h3>
                {item.itemOptions && (
                  <div className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md text-sm font-semibold flex items-baseline gap-1.5 shrink-0">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40 shrink-0">
                      T.Chọn:
                    </span>
                    <span>{item.itemOptions}</span>
                  </div>
                )}
              </div>

              {/* Plain Text Notes */}
              {item.itemNote && (
                <div className="flex items-start gap-2 mt-1 mb-1 w-full text-black font-medium leading-relaxed">
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] mt-1 shrink-0 opacity-40">
                    Ghi chú:
                  </span>
                  <span className="text-sm">{item.itemNote}</span>
                </div>
              )}
            </div>
          </div>

          {/* Status Label Side */}
          <div className="flex flex-col items-end gap-2 shrink-0 ml-4 mt-1.5">
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border shadow-sm",
                isReady
                  ? "bg-emerald-500 text-white border-emerald-600"
                  : "bg-white text-sky-600 border-sky-100"
              )}
            >
              {isReady ? UI_TEXT.KDS.ITEM.DONE : UI_TEXT.KDS.ITEM.STATUS_COOKING}
            </span>
            {item.updatedAt && (
              <span className="text-[9px] font-bold text-text-secondary/30 uppercase tracking-wider">
                Cập nhật:{" "}
                {new Date(item.updatedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Section: Actions */}
      <div className="p-4 flex flex-col justify-center gap-2 shrink-0 w-[180px] bg-slate-50/50 border-l border-border-subtle">
        {!isReady && (
          <button
            onClick={handleDone}
            className="w-full bg-[#10b981] hover:bg-emerald-600 text-white py-3 rounded-xl font-black uppercase tracking-[0.2em] text-xs shadow-lg shadow-emerald-100 transition-all hover:translate-y-[-2px] active:translate-y-0 flex items-center justify-center gap-2 group/btn"
          >
            <Check className="w-4 h-4 group-hover/btn:scale-110 transition-transform stroke-3" />
            {UI_TEXT.KDS.ITEM.DONE}
          </button>
        )}

        <button
          onClick={() => setIsRejectModalOpen(true)}
          className="w-full bg-white hover:bg-rose-50 text-rose-500 border border-slate-200 hover:border-rose-200 py-3 rounded-xl font-black uppercase tracking-[0.15em] text-[10px] transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {UI_TEXT.KDS.ITEM.RETURN}
        </button>
      </div>

      <KDSRejectModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleReturnConfirm}
        itemName={item.itemNameSnapshot}
      />
    </div>
  );
}

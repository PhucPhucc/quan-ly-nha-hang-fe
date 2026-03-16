"use client";

import { Check, Clock, RotateCcw } from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";
import { useKdsStore } from "@/store/useKdsStore";
import { OrderItemStatus } from "@/types/enums";
import { KDSItemCardProps } from "@/types/Kds";

import { KDSRejectModal } from "./KDSRejectModal";

export function KDSItemCard({ item, orderCode, orderType }: KDSItemCardProps) {
  const [isRejectModalOpen, setIsRejectModalOpen] = React.useState(false);
  const markItemReady = useKdsStore((s) => s.markItemReady);
  const rejectItem = useKdsStore((s) => s.rejectItem);

  const isReady = item.status === OrderItemStatus.Ready;

  const handleDone = () => markItemReady(item.orderItemId);
  const handleReturnConfirm = (reason: string) => rejectItem(item.orderItemId, reason);

  const orderTypeLabel =
    String(orderType) === "0" || String(orderType) === "DineIn" ? "Dine-In" : "Takeaway";

  return (
    <div className="flex w-full flex-col gap-2.5 bg-card p-7">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="px-2 py-1 text-xs font-semibold">
            {UI_TEXT.KDS.ORDER_PREFIX}
            {orderCode.slice(-4)}
          </Badge>
          <Badge variant="outline" className="text-xs font-semibold">
            {UI_TEXT.KDS.ORDER_TYPE_LABEL} {orderTypeLabel}
          </Badge>
          <Badge variant="outline" className="text-xs font-semibold">
            {UI_TEXT.KDS.STATION_LABEL} {item.stationSnapshot || UI_TEXT.SIDE_BAR.TABLE}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={isReady ? "default" : "secondary"} className="text-[11px] font-bold">
            {isReady ? UI_TEXT.KDS.ITEM.DONE : UI_TEXT.KDS.ITEM.STATUS_COOKING}
          </Badge>
          {item.updatedAt && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {new Date(item.updatedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-start gap-2.5 min-w-0">
          <span className="text-base font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md">
            {UI_TEXT.KDS.ITEM.QTY_PREFIX}
            {item.quantity}
          </span>
          <div className="flex flex-col gap-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground truncate">
              {item.itemNameSnapshot}
            </h3>
            {item.itemOptions && (
              <p className="text-xs text-muted-foreground truncate">
                {UI_TEXT.KDS.OPTION_LABEL} {item.itemOptions}
              </p>
            )}
            {item.itemNote && (
              <p className="text-xs text-muted-foreground truncate">
                {UI_TEXT.KDS.NOTE_LABEL} {item.itemNote}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsRejectModalOpen(true)}
            className="gap-2"
          >
            <RotateCcw className="size-4" />
            {UI_TEXT.KDS.ITEM.RETURN}
          </Button>
          {!isReady && (
            <Button size="sm" onClick={handleDone} className="gap-2">
              <Check className="size-4" />
              {UI_TEXT.KDS.ITEM.DONE}
            </Button>
          )}
        </div>
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

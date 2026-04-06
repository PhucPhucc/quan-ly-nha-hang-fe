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
  const completeItemCooking = useKdsStore((s) => s.completeItemCooking);
  const rejectItem = useKdsStore((s) => s.rejectItem);

  const isPreparing = item.status === OrderItemStatus.Preparing;
  const isCooking = item.status === OrderItemStatus.Cooking;
  const isCompleted = item.status === OrderItemStatus.Completed;
  const statusLabel = isCompleted
    ? UI_TEXT.KDS.ITEM.DONE
    : isCooking
      ? UI_TEXT.KDS.ITEM.STATUS_COOKING
      : UI_TEXT.KDS.ITEM.STATUS_PREPARING;

  const handleDone = () => completeItemCooking(item.orderItemId);
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
          <Badge variant={isCompleted ? "default" : "secondary"} className="text-[11px] font-bold">
            {statusLabel}
          </Badge>
          {item.updatedAt && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {new Date(item.updatedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-start justify-between gap-2.5">
        <div className="min-w-0 flex items-start gap-2.5">
          <span className="rounded-md bg-primary/10 px-2.5 py-1 text-base font-bold text-primary">
            {UI_TEXT.KDS.ITEM.QTY_PREFIX}
            {item.quantity}
          </span>
          <div className="flex min-w-0 flex-col gap-1">
            <h3 className="truncate text-lg font-semibold text-foreground">
              {item.itemNameSnapshot}
            </h3>
            {item.itemOptions && (
              <p className="truncate text-xs text-muted-foreground">
                {UI_TEXT.KDS.OPTION_LABEL} {item.itemOptions}
              </p>
            )}
            {item.itemNote && (
              <p className="truncate text-xs text-muted-foreground">
                {UI_TEXT.KDS.NOTE_LABEL} {item.itemNote}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          {isCooking && (
            <Button onClick={handleDone} className="gap-2">
              <Check className="size-4" />
              {UI_TEXT.KDS.ITEM.DONE}
            </Button>
          )}
          {isPreparing && (
            <Badge
              variant="outline"
              className="w-full justify-center py-2 text-[11px] font-semibold"
            >
              {UI_TEXT.KDS.ITEM.STATUS_PREPARING}
            </Badge>
          )}
          <Button
            variant="outline"
            onClick={() => setIsRejectModalOpen(true)}
            className="w-full gap-2"
          >
            <RotateCcw className="size-4" />
            {UI_TEXT.KDS.ITEM.RETURN}
          </Button>
        </div>
      </div>

      <KDSRejectModal
        key={isRejectModalOpen ? "open" : "close"}
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleReturnConfirm}
        itemName={item.itemNameSnapshot}
      />
    </div>
  );
}

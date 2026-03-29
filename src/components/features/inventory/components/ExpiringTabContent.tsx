import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableShell,
} from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";
import { useBrandingFormatter } from "@/lib/branding-formatting";
import { UI_TEXT } from "@/lib/UI_Text";
import { InventoryExpiryAlertItem } from "@/types/Inventory";

import { DisposeLotModal } from "./DisposeLotModal";

interface ExpiringTabContentProps {
  items: InventoryExpiryAlertItem[];
}

export function ExpiringTabContent({ items }: ExpiringTabContentProps) {
  const { formatDate } = useBrandingFormatter();
  return (
    <TabsContent value="expiring" className="m-0 border-none outline-none">
      <TableShell>
        <Table>
          <TableHeader>
            <TableRow variant="header">
              <TableHead>{UI_TEXT.INVENTORY.ALERTS.COL_LOT}</TableHead>
              <TableHead>{UI_TEXT.INVENTORY.TABLE.COL_ITEM}</TableHead>
              <TableHead className={`text-center`}>
                {UI_TEXT.INVENTORY.TABLE.COL_CURRENT_STOCK}
              </TableHead>
              <TableHead className={`text-center`}>
                {UI_TEXT.INVENTORY.TABLE.COL_EXPIRATION}
              </TableHead>
              <TableHead className={`text-center`}>
                {UI_TEXT.INVENTORY.ALERTS.COL_DAYS_REMAINING}
              </TableHead>
              <TableHead className={`text-center`}>{UI_TEXT.INVENTORY.ALERTS.COL_NOTE}</TableHead>
              <TableHead className={`text-center`}>{UI_TEXT.INVENTORY.TABLE.COL_STATUS}</TableHead>
              <TableHead className={`text-right`}>{UI_TEXT.INVENTORY.TABLE.COL_ACTIONS}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-32 text-center text-muted-foreground/30 font-medium italic"
                >
                  {UI_TEXT.INVENTORY.TABLE.EMPTY_EXPIRING}
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, index) => {
                const today = new Date();
                const expDate = item.expiryDate ? new Date(item.expiryDate) : today;
                const diffTime = expDate.getTime() - today.getTime();
                const diffDays = item.daysRemaining ?? Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                let badgeClass = "table-pill-neutral";
                let badgeText = UI_TEXT.INVENTORY.ALERTS.TAB_EXPIRING;
                let noteText = "";

                if (diffDays < 0) {
                  badgeClass = "table-pill-danger";
                  badgeText = UI_TEXT.INVENTORY.ALERTS.BADGE_EXPIRED;
                  noteText =
                    UI_TEXT.INVENTORY.ALERTS.MSG_NOTE_URGENT ||
                    UI_TEXT.INVENTORY.ALERTS.MSG_NOTE_CHECK;
                } else if (diffDays === 0) {
                  badgeClass = "table-pill-warning";
                  badgeText = UI_TEXT.INVENTORY.ALERTS.BADGE_URGENT;
                  noteText = UI_TEXT.INVENTORY.ALERTS.MSG_NOTE_TODAY;
                } else if (diffDays <= 3) {
                  badgeClass = "table-pill-warning";
                  badgeText = UI_TEXT.INVENTORY.ALERTS.BADGE_EXPIRING;
                  noteText = UI_TEXT.INVENTORY.ALERTS.MSG_NOTE_PLAN;
                } else {
                  badgeClass = "table-pill-neutral";
                  badgeText = UI_TEXT.INVENTORY.ALERTS.BADGE_EXPIRING;
                  noteText = UI_TEXT.INVENTORY.ALERTS.MSG_NOTE_ALLOCATE;
                }

                return (
                  <TableRow key={item.inventoryLotId || index} className="text-card-foreground">
                    <TableCell className="font-mono text-[10px] font-bold uppercase tracking-tight">
                      {item.lotCode || UI_TEXT.INVENTORY.TABLE.EM_DASH}
                    </TableCell>
                    <TableCell className="">{item.ingredientName}</TableCell>
                    <TableCell className="text-center font-semibold tabular-nums">
                      {item.remainingQuantity} {item.unit}
                    </TableCell>
                    <TableCell className="text-center font-semibold tabular-nums italic text-xs">
                      {item.expiryDate
                        ? formatDate(item.expiryDate)
                        : UI_TEXT.INVENTORY.TABLE.EM_DASH}
                    </TableCell>
                    <TableCell className="text-center font-semibold tabular-nums">
                      {diffDays < 0 ? (
                        <span className="text-danger">
                          {UI_TEXT.INVENTORY.ALERTS.MSG_EXPIRED} {Math.abs(diffDays)}{" "}
                          {UI_TEXT.INVENTORY.ALERTS.TXT_DAYS}
                        </span>
                      ) : (
                        <span className={diffDays <= 3 ? "text-warning" : "text-foreground"}>
                          {UI_TEXT.INVENTORY.ALERTS.MSG_REMAINING} {diffDays}{" "}
                          {UI_TEXT.INVENTORY.ALERTS.TXT_DAYS}
                        </span>
                      )}
                    </TableCell>
                    <TableCell
                      className="text-center text-xs text-card-foreground/80 max-w-38 truncate"
                      title={noteText}
                    >
                      {noteText}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`table-pill text-[10px] ${badgeClass}`}>{badgeText}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DisposeLotModal item={item} />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableShell>
    </TabsContent>
  );
}

"use client";

import { UtensilsCrossed } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/ui/empty-state";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UI_TEXT } from "@/lib/UI_Text";
import { OrderAuditLogResponse, orderService } from "@/services/orderService";
import { useOrderBoardStore } from "@/store/useOrderStore";

const OrderHistory = () => {
  const [history, setHistory] = useState<OrderAuditLogResponse[] | null>(null);
  const selectedId = useOrderBoardStore((state) => state.selectedOrderId);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (!selectedId) {
          setHistory(null);
          return;
        }

        const res = await orderService.getOrderHistory(selectedId);

        if (!res.isSuccess) {
          toast.error("Không thể tải lịch sử đơn hàng");
          return;
        }
        setHistory(res.data.items);
      } catch (error) {
        console.error("Failed to fetch order history:", error);
      }
    };

    fetchHistory();
  }, [selectedId]);

  if (!selectedId) {
    return (
      <EmptyState
        title={UI_TEXT.AUDIT_LOG.EMPTY}
        description="Chưa có đơn hàng nào được hoàn thành"
        icon={UtensilsCrossed}
      />
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow className="">
            <TableHead className="px-3 py-2">{UI_TEXT.ORDER.BOARD.ORDER_CODE}</TableHead>
            <TableHead className="px-3 py-2">{UI_TEXT.AUDIT_LOG.ACTOR_NAME}</TableHead>
            <TableHead className="px-3 py-2">{UI_TEXT.AUDIT_LOG.TIME}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history && history.length > 0 ? (
            history.map((item) => (
              <Popover key={item.logId}>
                <PopoverTrigger asChild>
                  <TableRow className="cursor-pointer">
                    <TableCell>{item.orderCode}</TableCell>
                    <TableCell>{item.actionName}</TableCell>
                    <TableCell>{item.formattedTime}</TableCell>
                  </TableRow>
                </PopoverTrigger>

                <PopoverContent>
                  <PopoverHeader>
                    <PopoverTitle className="font-bold text-lg">{item.orderCode}</PopoverTitle>
                  </PopoverHeader>
                  <div>
                    <p>
                      <strong>{UI_TEXT.AUDIT_LOG.ACTOR}:</strong> {item.actionName}
                    </p>
                    <p>
                      <strong>{UI_TEXT.AUDIT_LOG.ACTOR_NAME}:</strong> {item.actorName}
                    </p>
                    <p>
                      <strong>{UI_TEXT.AUDIT_LOG.ACTOR_ROLE}:</strong> {item.actorRole}
                    </p>
                    <p>
                      <strong>{UI_TEXT.AUDIT_LOG.OLD_VALUE}:</strong> {item.oldValue}
                    </p>

                    <p>
                      <strong>{UI_TEXT.AUDIT_LOG.NEW_VALUE}:</strong> {item.newValue}
                    </p>

                    <p>
                      <strong>{UI_TEXT.AUDIT_LOG.REASON}:</strong> {item.changeReason}
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                {UI_TEXT.AUDIT_LOG.EMPTY}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderHistory;

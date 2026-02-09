import React from "react";

import { ScrollArea } from "@/components/ui/scroll-area";

import { TableItemProps } from "../TableItem";
import TableItem from "../TableItem";
import { TakeawayItemProps } from "../TakeawayItem";
import TakeawayItem from "../TakeawayItem";

interface OrderBoardListProps {
  filteredTables: TableItemProps["table"][];
  filteredTakeaways: TakeawayItemProps["order"][];
}

const OrderBoardList: React.FC<OrderBoardListProps> = ({ filteredTables, filteredTakeaways }) => {
  return (
    <div className="flex-1 min-h-0 relative bg-background">
      <ScrollArea className="h-full w-full" type="always">
        <div className="p-6 grid grid-cols-4 gap-6 pb-32">
          {filteredTables.map((table) => (
            <TableItem key={`table-${table.tableNumber}`} table={table} />
          ))}
          {filteredTakeaways.map((order) => (
            <TakeawayItem key={`takeaway-${order.id}`} order={order} />
          ))}
        </div>

        {filteredTables.length === 0 && filteredTakeaways.length === 0 && (
          <div className="flex flex-col items-center justify-center py-40 text-muted-foreground uppercase font-black text-xs">
            Không tìm thấy kết quả
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default OrderBoardList;

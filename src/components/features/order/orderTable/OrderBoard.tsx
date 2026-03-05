"use client";

import { Armchair, ShoppingCart } from "lucide-react";
import { useEffect } from "react";

import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UI_TEXT } from "@/lib/UI_Text";
import { useOrderBoardStore } from "@/store/useOrderStore";
import { OrderStatus } from "@/types/enums";

import OrderBoardHeader from "./components/OrderBoardHeader";
import TableList from "./TableList";
import TakeawayItem from "./TakeawayItem";

const OrderBoard = () => {
  const { loading, activeTab, fetchOrders, filteredTakeaways } = useOrderBoardStore();

  useEffect(() => {
    fetchOrders({ pageSize: 12, pageNumber: 1 });
  }, [fetchOrders]);

  if (loading) {
    return <LoadingSpinner label={UI_TEXT.ORDER.FETCH_ORDERING} />;
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <OrderBoardHeader />

      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full w-full">
          {(activeTab === "all" || activeTab === "dine_in") && (
            <section>
              <div className="flex items-center gap-2 my-4 px-4 text-slate-500">
                <Armchair className="size-4" />
                <h3 className="text-xs font-black uppercase">Khu vực bàn</h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <TableList />
              </div>
            </section>
          )}

          {(activeTab === "all" || activeTab === "takeaway") && (
            <section className="mt-8">
              <div className="flex items-center gap-2 mb-4 px-2 text-slate-500">
                <ShoppingCart className="size-4" />
                <h3 className="text-xs font-black uppercase">Đơn mang đi</h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {filteredTakeaways().map((o) => (
                  <TakeawayItem
                    key={o.orderId}
                    order={{
                      id: o.orderId,
                      orderCode: o.orderCode,
                      status: o.status === OrderStatus.Serving ? "SERVING" : "READY",
                      label: "Mang đi",
                      people: 1,
                      price: new Intl.NumberFormat("vi-VN").format(o.totalAmount) + "đ",
                      elapsedTime: "5m",
                    }}
                  />
                ))}
              </div>
            </section>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default OrderBoard;

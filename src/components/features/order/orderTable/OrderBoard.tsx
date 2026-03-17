"use client";

import { Armchair, ShoppingCart } from "lucide-react";
import { useEffect } from "react";

import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UI_TEXT } from "@/lib/UI_Text";
import { useOrderBoardStore } from "@/store/useOrderStore";
import { useTableStore } from "@/store/useTableStore";
import { OrderStatus } from "@/types/enums";
import { AreaStatus } from "@/types/Table-Layout";

import OrderBoardHeader from "./components/OrderBoardHeader";
import TableList from "./TableList";
import TakeawayItem from "./TakeawayItem";

const TAKEAWAY_TAB = "takeaway";
const currencyFormatter = new Intl.NumberFormat("vi-VN");

const OrderBoard = () => {
  const { loading, activeTab, filteredTakeaways } = useOrderBoardStore();
  const fetchOrders = useOrderBoardStore((s) => s.fetchOrders);
  const setActiveTab = useOrderBoardStore((s) => s.setActiveTab);

  const areas = useTableStore((s) => s.areas);
  const fetchAreas = useTableStore((s) => s.fetchAreas);

  // Fetch areas + orders on mount
  useEffect(() => {
    fetchAreas();
    fetchOrders({ pageSize: 50, pageNumber: 1 });
  }, [fetchAreas, fetchOrders]);

  // Default to first active area when areas load (only if no tab is set yet)
  useEffect(() => {
    if (!activeTab && areas.length > 0) {
      const firstActive = areas.find((a) => a.status === AreaStatus.Active);
      if (firstActive) {
        setActiveTab(firstActive.areaId);
      }
    }
  }, [areas, activeTab, setActiveTab]);

  const isTakeaway = activeTab === TAKEAWAY_TAB;

  if (loading && !activeTab) {
    return <LoadingSpinner label={UI_TEXT.ORDER.FETCH_ORDERING} />;
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <OrderBoardHeader />

      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full w-full">
          {!isTakeaway && activeTab && (
            <section>
              <div className="flex items-center gap-2 my-4 px-4 text-slate-500">
                <Armchair className="size-4" />
                <h3 className="text-xs font-black uppercase">{UI_TEXT.ORDER.BOARD.TABLE_ZONE}</h3>
              </div>

              {/* <TableStats tables={tableCards} /> */}

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-2">
                <TableList areaId={activeTab} />
              </div>
            </section>
          )}

          {isTakeaway && (
            <section className="mt-8">
              <div className="flex items-center gap-2 mb-4 px-2 text-slate-500">
                <ShoppingCart className="size-4" />
                <h3 className="text-xs font-black uppercase">
                  {UI_TEXT.ORDER.BOARD.TAKEAWAY_ORDERS}
                </h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {filteredTakeaways().map((o) => (
                  <TakeawayItem
                    key={o.orderId}
                    order={{
                      id: o.orderId,
                      orderCode: o.orderCode,
                      status: o.status === OrderStatus.Serving ? "SERVING" : "READY",
                      label: UI_TEXT.ORDER.BOARD.TAKEAWAY,
                      people: 1,
                      price: currencyFormatter.format(o.totalAmount) + "đ",
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

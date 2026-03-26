"use client";

import { Armchair, Plus, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UI_TEXT } from "@/lib/UI_Text";
import { orderService } from "@/services/orderService";
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
  // const fetchOrders = useOrderBoardStore((s) => s.fetchOrders);
  const setActiveTab = useOrderBoardStore((s) => s.setActiveTab);
  const setActiveView = useOrderBoardStore((s) => s.setActiveView);
  const setSelectedOrderId = useOrderBoardStore((s) => s.setSelectedOrderId);

  const [loadingTakeaway, setLoadingTakeaway] = useState(false);

  const handleCreateTakeaway = async () => {
    if (loadingTakeaway) return;
    setLoadingTakeaway(true);
    try {
      const res = await orderService.createTakeAwayOrder();
      console.log("res: " + JSON.stringify(res));
      if (res.isSuccess) {
        const newOrderId = res.data;
        setSelectedOrderId(newOrderId);
        setActiveView("menu");
      } else {
        toast.error(UI_TEXT.ORDER.BOARD.CREATE_ORDER_ERROR || "Lỗi tạo đơn");
      }
    } catch (e) {
      toast.error(UI_TEXT.ORDER.BOARD.CREATE_ORDER_ERROR || "Lỗi tạo đơn");
      console.error(e);
    } finally {
      setLoadingTakeaway(false);
    }
  };

  const areas = useTableStore((s) => s.areas);
  const fetchAreas = useTableStore((s) => s.fetchAreas);

  // Fetch areas on mount
  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

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
            <section className="my-4 mx-2">
              <div className="flex items-end gap-2 text-slate-500 mb-5">
                <ShoppingCart className="size-5" />
                <h3 className="text-xs font-black uppercase">
                  {UI_TEXT.ORDER.BOARD.TAKEAWAY_ORDERS}
                </h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 items-center justify-center gap-6">
                {filteredTakeaways().map((o) => (
                  <TakeawayItem
                    key={o.orderId}
                    order={{
                      id: o.orderId,
                      orderCode: o.orderCode,
                      status: o.status === OrderStatus.Serving ? "SERVING" : "READY",
                      label: UI_TEXT.ORDER.BOARD.TAKEAWAY,
                      people: 1,
                      price: currencyFormatter.format(o.totalAmount) + UI_TEXT.COMMON.CURRENCY,
                      elapsedTime: "5" + UI_TEXT.COMMON.MINUTES,
                    }}
                    onClick={() => {
                      setSelectedOrderId(o.orderId);
                    }}
                  />
                ))}
                <Button
                  variant="ghost"
                  onClick={handleCreateTakeaway}
                  disabled={loadingTakeaway}
                  size="icon"
                  className="size-24 mx-auto bg-muted-foreground/10 border-dashed border-2 border-muted-foreground
                   rounded-full hover:scale-105 transition duration-200 cursor-pointer"
                >
                  <Plus className="size-12 text-muted-foreground" />
                </Button>
              </div>
            </section>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default OrderBoard;

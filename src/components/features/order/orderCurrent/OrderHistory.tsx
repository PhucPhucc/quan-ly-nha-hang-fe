"use client";

import OrderAuditLogPanel from "@/components/features/order/manager/OrderAuditLogPanel";
import { UI_TEXT } from "@/lib/UI_Text";
import { useOrderBoardStore } from "@/store/useOrderStore";

const OrderHistory = () => {
  const selectedId = useOrderBoardStore((state) => state.selectedOrderId);

  return (
    <div className="h-full overflow-auto p-4">
      <OrderAuditLogPanel
        orderId={selectedId}
        title={UI_TEXT.ORDER.DETAIL.TAB_AUDIT}
        description={UI_TEXT.ORDER.DETAIL.AUDIT_BE_DESC}
        className="h-full"
      />
    </div>
  );
};

export default OrderHistory;

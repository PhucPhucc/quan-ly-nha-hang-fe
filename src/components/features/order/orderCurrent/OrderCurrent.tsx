"use client";

import { UI_TEXT } from "@/lib/UI_Text";

import CardContainer from "../CardContainer";
import OrderCurrentHeader from "./components/OrderCurrentHeader";
import OrderItemList from "./components/OrderItemList";
import OrderSummaryFooter from "./components/OrderSummaryFooter";

const OrderCurrent = () => {
  // Mock data for demonstration - will be replaced by state/API later
  const orderItems = [
    { id: 1, name: "Phở Bò Tái Lăn", price: 65000, quantity: 2, status: "COOKING" },
    { id: 2, name: "Gỏi Cuốn Tôm Thịt", price: 45000, quantity: 1, status: "PENDING" },
    { id: 3, name: "Trà Đào Cam Sả", price: 35000, quantity: 3, status: "SERVED" },
  ];

  const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <CardContainer className="h-full">
      <div className="flex flex-col h-full min-h-0">
        <OrderCurrentHeader
          tableName="Bàn số 05"
          itemCount={orderItems.length}
          status={UI_TEXT.TABLE.INPROCESS}
        />
        <OrderItemList items={orderItems} />
        <OrderSummaryFooter subtotal={subtotal} tax={tax} total={total} />
      </div>
    </CardContainer>
  );
};

export default OrderCurrent;

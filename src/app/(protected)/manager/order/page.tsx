import { Metadata } from "next";

import OrderBoardClient from "@/components/features/order/manager/OrderBoardClient";

export const metadata: Metadata = {
  title: "Tổng quan Đơn hàng | Manager | FoodHub",
  description: "Trang tổng quan đơn hàng dành cho Quản lý",
};

export default function OrderPage() {
  return <OrderBoardClient />;
}

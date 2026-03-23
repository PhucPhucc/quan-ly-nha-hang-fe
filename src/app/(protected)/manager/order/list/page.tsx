import { Metadata } from "next";

import OrderListPage from "@/components/features/order/manager/OrderListPage";

export const metadata: Metadata = {
  title: "Danh sách đơn hàng | Manager | FoodHub",
  description: "Danh sách đơn hàng dành cho Quản lý",
};

export default function OrderListRoute() {
  return <OrderListPage />;
}

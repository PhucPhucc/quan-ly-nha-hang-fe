import { Metadata } from "next";

import BillingHistoryPage from "@/components/features/order/manager/BillingHistoryPage";

export const metadata: Metadata = {
  title: "Lịch sử thanh toán | Manager | FoodHub",
  description: "Lịch sử thanh toán đơn hàng dành cho Quản lý",
};

export default function BillingHistoryRoute() {
  return <BillingHistoryPage />;
}

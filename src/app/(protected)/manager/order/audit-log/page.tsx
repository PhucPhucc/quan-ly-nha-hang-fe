import { Metadata } from "next";

import OrderAuditLogPage from "@/components/features/order/manager/OrderAuditLogPage";

export const metadata: Metadata = {
  title: "Nhật ký thao tác | Manager | FoodHub",
  description: "Nhật ký thao tác đơn hàng dành cho Quản lý",
};

export default function AuditLogRoute() {
  return <OrderAuditLogPage />;
}

import { Metadata } from "next";

import OrderDetailPage from "@/components/features/order/manager/OrderDetailPage";

export const metadata: Metadata = {
  title: "Chi tiết đơn hàng | Cashier | FoodHub",
  description: "Chi tiết đơn hàng dành cho Nhân viên thu ngân",
};

export default async function OrderDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrderDetailPage orderId={id} />;
}

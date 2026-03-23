import { Metadata } from "next";

import OrderDetailPage from "@/components/features/order/manager/OrderDetailPage";

export const metadata: Metadata = {
  title: "Chi tiết đơn hàng | Manager | FoodHub",
  description: "Chi tiết đơn hàng dành cho Quản lý",
};

export default function OrderDetailRoute({ params }: { params: { id: string } }) {
  return <OrderDetailPage orderId={params.id} />;
}

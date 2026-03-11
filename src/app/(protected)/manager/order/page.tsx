import { Metadata } from "next";

import OrderBoardClient from "./OrderBoardClient";

export const metadata: Metadata = {
  title: "Quản lý Đơn hàng | Manager | FoodHub",
  description: "Trang quản lý đơn hàng dành cho Quản lý",
};

export default function OrderPage() {
  return <OrderBoardClient />;
}

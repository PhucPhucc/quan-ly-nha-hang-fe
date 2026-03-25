import { Metadata } from "next";

import VoucherManagement from "@/components/features/voucher/VoucherManagement";

export const metadata: Metadata = {
  title: "Quản lý Voucher | Manager | FoodHub",
  description: "Trang quản lý mã giảm giá và chương trình khuyến mãi",
};

export default function VoucherPage() {
  return <VoucherManagement />;
}

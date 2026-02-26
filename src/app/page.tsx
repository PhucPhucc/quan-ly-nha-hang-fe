import { Metadata } from "next";

import { LandingPage as LandingPageClient } from "@/components/features/Landing/LandingPage";

export const metadata: Metadata = {
  title: "FoodHub | Hệ thống Quản lý Nhà hàng 4.0",
  description:
    "Nền tảng quản lý nhà hàng hiện đại, tối ưu hóa vận hành, quản lý kho và kết nối nhà bếp thông minh.",
};

export default function Page() {
  return <LandingPageClient />;
}

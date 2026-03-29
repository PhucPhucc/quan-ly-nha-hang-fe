import { Metadata } from "next";

import { LandingPage as LandingPageClient } from "@/components/features/Landing/LandingPage";
import { fetchBrandingSettingsServer } from "@/lib/branding-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const branding = await fetchBrandingSettingsServer();

  return {
    title: branding?.appTitle || "FoodHub | Hệ thống Quản lý Nhà hàng 4.0",
    description:
      branding?.billFooter ||
      "Nền tảng quản lý nhà hàng hiện đại, tối ưu hóa vận hành, quản lý kho và kết nối nhà bếp thông minh.",
  };
}

export default function Page() {
  return <LandingPageClient />;
}

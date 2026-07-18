import { Metadata } from "next";

import { RestaurantLandingPage as RestaurantLandingPageClient } from "@/components/features/Landing/RestaurantLandingPage";
import { fetchBrandingSettingsServer } from "@/lib/branding-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const branding = await fetchBrandingSettingsServer();

  return {
    title: branding?.restaurantName
      ? `${branding.restaurantName} | Đặt bàn & Thực đơn`
      : "Nhà hàng | Đặt bàn & Thực đơn",
    description: branding?.billFooter || "Khám phá thực đơn đa dạng và đặt bàn ngay hôm nay.",
  };
}

export default function RestaurantPage() {
  return <RestaurantLandingPageClient />;
}

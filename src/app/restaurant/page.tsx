import { Metadata } from "next";

import { RestaurantLandingPage as RestaurantLandingPageClient } from "@/components/features/Landing/RestaurantLandingPage";
import { fetchBrandingSettingsServer } from "@/lib/branding-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const branding = await fetchBrandingSettingsServer();

  return {
    title: branding?.restaurantName ? `${branding.restaurantName} | Đặt bàn` : "Nhà hàng | Đặt bàn",
    description:
      branding?.billFooter ||
      "Trải nghiệm ẩm thực tuyệt vời tại nhà hàng của chúng tôi. Đặt bàn ngay hôm nay.",
  };
}

export default function RestaurantPage() {
  return <RestaurantLandingPageClient />;
}

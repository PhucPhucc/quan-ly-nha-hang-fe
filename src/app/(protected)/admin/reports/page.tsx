"use client";

import SalesAnalyticsSection from "@/components/features/Admin/Reports/SalesAnalyticsSection";
import { UI_TEXT } from "@/lib/UI_Text";

export default function AdminReportsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{UI_TEXT.ADMIN.REPORTS_ANALYTICS}</h1>
      <SalesAnalyticsSection />
    </div>
  );
}

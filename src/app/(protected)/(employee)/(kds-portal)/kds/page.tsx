import React, { Suspense } from "react";

import LoadingSpinner from "@/components/shared/LoadingSpinner";

import { KDSDashboardClient } from "./KDSDashboardClient";

export default function KDSDashboardPage() {
  return (
    <Suspense fallback={<LoadingSpinner label="Dang tai KDS..." />}>
      <KDSDashboardClient />
    </Suspense>
  );
}

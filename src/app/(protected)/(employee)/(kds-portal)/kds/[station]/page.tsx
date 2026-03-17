import React, { Suspense } from "react";

import { KDSDashboardClient } from "@/components/features/kds/KDSDashboardClient";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { UI_TEXT } from "@/lib/UI_Text";

export default function KDSDashboardPage() {
  return (
    <Suspense fallback={<LoadingSpinner label={UI_TEXT.COMMON.LOADING} />}>
      <KDSDashboardClient />
    </Suspense>
  );
}

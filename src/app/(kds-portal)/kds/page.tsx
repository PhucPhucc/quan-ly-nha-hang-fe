import React, { Suspense } from "react";

import { KDSDashboardClient } from "./KDSDashboardClient";

export default function KDSDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex w-full h-full items-center justify-center">Đang tải KDS...</div>
      }
    >
      <KDSDashboardClient />
    </Suspense>
  );
}

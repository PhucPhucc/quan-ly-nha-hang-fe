import React from "react";

import { UI_TEXT } from "@/lib/UI_Text";

export default function AnalyticsPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-primary mb-4">
        {UI_TEXT.ANALYTICS.TITLE}
      </h1>
      <p className="text-muted-foreground max-w-md">{UI_TEXT.ANALYTICS.WIP_DESC}</p>
    </div>
  );
}

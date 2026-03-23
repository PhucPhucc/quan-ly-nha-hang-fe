"use client";

import { History } from "lucide-react";

import OrderAuditLogPanel from "@/components/features/order/manager/OrderAuditLogPanel";
import { Card, CardContent } from "@/components/ui/card";
import { UI_TEXT } from "@/lib/UI_Text";

export default function OrderAuditLogPage() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4 p-4">
      <Card className="overflow-hidden border bg-[linear-gradient(135deg,color-mix(in_oklab,var(--card)_92%,var(--primary)_8%)_0%,var(--card)_100%)]">
        <CardContent className="p-4">
          <div className="rounded-2xl border bg-card p-4 text-sm text-muted-foreground">
            {UI_TEXT.AUDIT_LOG.PLACEHOLDER.TITLE}
          </div>
        </CardContent>
      </Card>

      <OrderAuditLogPanel selectedOrder={null} />
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <History className="h-4 w-4" />
        {UI_TEXT.AUDIT_LOG.PLACEHOLDER.DESCRIPTION}
      </div>
    </div>
  );
}

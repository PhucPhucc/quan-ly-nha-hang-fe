import { Badge } from "@/components/ui/badge";
import { UI_TEXT } from "@/lib/UI_Text";
import { AlertThresholdStatus } from "@/types/Inventory";

type Props = { status: AlertThresholdStatus };

export function StatusBadge({ status }: Props) {
  if (status === AlertThresholdStatus.NORMAL) {
    return (
      <Badge className="bg-success text-success-foreground">
        {UI_TEXT.INVENTORY.STOCK.STATUS_NORMAL}
      </Badge>
    );
  }
  if (status === AlertThresholdStatus.LOW_STOCK) {
    return (
      <Badge className="bg-warning text-warning-foreground">
        {UI_TEXT.INVENTORY.STOCK.STATUS_LOW}
      </Badge>
    );
  }
  return (
    <Badge className="bg-destructive text-destructive-foreground">
      {UI_TEXT.INVENTORY.STOCK.STATUS_OUT}
    </Badge>
  );
}

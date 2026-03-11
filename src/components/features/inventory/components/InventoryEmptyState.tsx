import { Package } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import { UI_TEXT } from "@/lib/UI_Text";

export function InventoryEmptyState() {
  return <EmptyState icon={Package} title={UI_TEXT.INVENTORY.TABLE.EMPTY_TITLE} />;
}

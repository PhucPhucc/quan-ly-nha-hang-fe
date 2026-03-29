import { INVENTORY_PAGE_CLASS } from "@/components/features/inventory/components/inventoryStyles";
import { InventoryCheckTable } from "@/components/features/inventory/InventoryCheckTable";

export default function InventoryCheckListPage() {
  return (
    <div className={INVENTORY_PAGE_CLASS}>
      <InventoryCheckTable />
    </div>
  );
}

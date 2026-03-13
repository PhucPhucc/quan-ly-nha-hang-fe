import {
  DEFAULT_INVENTORY_SETTINGS,
  getInventorySettingsFormValues,
} from "@/components/features/inventory/inventorySettings.constants";
import { InventorySettingsFormContainer } from "@/components/features/inventory/InventorySettingsFormContainer";
import { inventoryService } from "@/services/inventory.service";

export default async function InventorySettingsPage() {
  let initialValues = DEFAULT_INVENTORY_SETTINGS;

  try {
    const response = await inventoryService.getInventorySettings();

    if (response.isSuccess) {
      initialValues = getInventorySettingsFormValues(response.data);
    }
  } catch (error) {
    console.error("Failed to fetch inventory settings:", error);
  }

  return <InventorySettingsFormContainer initialValues={initialValues} />;
}

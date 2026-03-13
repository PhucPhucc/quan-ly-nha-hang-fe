"use client";

import React, { useState } from "react";
import { toast } from "sonner";

import { UI_TEXT } from "@/lib/UI_Text";
import type { InventorySettingsInput } from "@/lib/zod-schemas/inventory";
import { inventoryService } from "@/services/inventory.service";

import { InventorySettingsForm } from "./InventorySettingsForm";

const { SETTINGS } = UI_TEXT.INVENTORY;

type Props = {
  initialValues: InventorySettingsInput;
};

export function InventorySettingsFormContainer({ initialValues }: Props) {
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (data: InventorySettingsInput) => {
    setSaving(true);

    try {
      const response = await inventoryService.updateInventorySettings(data);

      if (response.isSuccess) {
        toast.success(SETTINGS.SUCCESS_UPDATE);
        return;
      }

      toast.error(response.message || UI_TEXT.API.NETWORK_ERROR);
    } catch {
      toast.error(UI_TEXT.API.NETWORK_ERROR);
    } finally {
      setSaving(false);
    }
  };

  return (
    <InventorySettingsForm initialValues={initialValues} onSubmit={handleSubmit} saving={saving} />
  );
}

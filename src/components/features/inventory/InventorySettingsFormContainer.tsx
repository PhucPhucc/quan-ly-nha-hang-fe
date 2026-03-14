"use client";

import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { UI_TEXT } from "@/lib/UI_Text";
import type { InventorySettingsInput } from "@/lib/zod-schemas/inventory";
import { inventoryService } from "@/services/inventory.service";

import {
  DEFAULT_INVENTORY_SETTINGS,
  getInventorySettingsFormValues,
} from "./inventorySettings.constants";
import { InventorySettingsForm } from "./InventorySettingsForm";

const { SETTINGS } = UI_TEXT.INVENTORY;

type Props = {
  initialValues?: InventorySettingsInput;
};

export function InventorySettingsFormContainer({
  initialValues = DEFAULT_INVENTORY_SETTINGS,
}: Props) {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [formValues, setFormValues] = useState<InventorySettingsInput>(initialValues);

  useEffect(() => {
    let cancelled = false;

    const fetchSettings = async () => {
      try {
        const response = await inventoryService.getInventorySettings();

        if (response.isSuccess && response.data && !cancelled) {
          setFormValues(getInventorySettingsFormValues(response.data));
        }
      } catch (error) {
        console.error("Failed to fetch inventory settings:", error);
      }
    };

    fetchSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (data: InventorySettingsInput) => {
    setSaving(true);

    try {
      const response = await inventoryService.updateInventorySettings(data);

      if (response.isSuccess && response.data) {
        const nextValues = getInventorySettingsFormValues(response.data);

        setFormValues(nextValues);
        queryClient.setQueryData(["inventory-settings"], response.data);
        await queryClient.invalidateQueries({ queryKey: ["inventory-settings"] });
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
    <InventorySettingsForm initialValues={formValues} onSubmit={handleSubmit} saving={saving} />
  );
}

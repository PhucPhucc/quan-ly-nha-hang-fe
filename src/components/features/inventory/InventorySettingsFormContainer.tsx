"use client";

import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { Spinner } from "@/components/ui/spinner";
import { getErrorMessage } from "@/lib/error";
import { UI_TEXT } from "@/lib/UI_Text";
import type { InventorySettingsInput } from "@/lib/zod-schemas/inventory";
import { inventoryService } from "@/services/inventory.service";
import type { InventorySettings } from "@/types/Inventory";

import { invalidateInventoryQueries } from "./inventoryQueryInvalidation";
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
  const [loading, setLoading] = useState(true);
  const [formValues, setFormValues] = useState<InventorySettingsInput>(initialValues);
  const [settingsMetadata, setSettingsMetadata] = useState<Partial<InventorySettings> | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchSettings = async () => {
      try {
        const response = await inventoryService.getInventorySettings();

        if (response.isSuccess && mounted) {
          setFormValues(getInventorySettingsFormValues(response.data));
          setSettingsMetadata(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch inventory settings:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchSettings();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (data: InventorySettingsInput) => {
    setSaving(true);

    try {
      const payload = {
        ...settingsMetadata,
        ...data,
      } as InventorySettings;

      const response = await inventoryService.updateInventorySettings(payload);

      if (response.isSuccess && response.data) {
        const nextValues = getInventorySettingsFormValues(response.data);

        setFormValues(nextValues);
        setSettingsMetadata(response.data);
        queryClient.setQueryData(["inventory-settings"], response.data);
        await invalidateInventoryQueries(queryClient);
        toast.success(SETTINGS.SUCCESS_UPDATE);
        return;
      }

      toast.error(response.message || UI_TEXT.API.NETWORK_ERROR);
    } catch (error) {
      toast.error(getErrorMessage(error) || UI_TEXT.API.NETWORK_ERROR);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <InventorySettingsForm
      initialValues={formValues}
      metadata={settingsMetadata ?? undefined}
      onSubmit={handleSubmit}
      saving={saving}
    />
  );
}

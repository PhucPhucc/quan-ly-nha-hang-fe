"use client";

import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { getErrorMessage } from "@/lib/error";
import { UI_TEXT } from "@/lib/UI_Text";
import { voucherService } from "@/services/voucherService";
import {
  CreateVoucherPayload,
  UpdateVoucherPayload,
  Voucher,
  VOUCHER_TYPE_OPTIONS,
  VoucherType,
} from "@/types/voucher";

import { ItemSearchSelect } from "./components/ItemSearchSelect";

interface CreateVoucherModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingVoucher?: Voucher | null;
  onSuccess: () => void;
}

const V = UI_TEXT.VOUCHER;

const initialFormData: CreateVoucherPayload = {
  code: "",
  type: VoucherType.Percent,
  value: 0,
  maxDiscount: undefined,
  minOrderValue: undefined,
  itemId: undefined,
  freeQuantity: undefined,
  startDate: "",
  endDate: "",
  startTime: undefined,
  endTime: undefined,
  usageLimit: 100,
  isActive: true,
};

const CreateVoucherModal: React.FC<CreateVoucherModalProps> = ({
  open,
  onOpenChange,
  editingVoucher,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<CreateVoucherPayload>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = !!editingVoucher;

  useEffect(() => {
    if (open) {
      if (editingVoucher) {
        setFormData({
          code: editingVoucher.code,
          type: editingVoucher.type,
          value: editingVoucher.value,
          maxDiscount: editingVoucher.maxDiscount || undefined,
          minOrderValue: editingVoucher.minOrderValue || undefined,
          itemId: editingVoucher.itemId || undefined,
          freeQuantity: editingVoucher.freeQuantity || undefined,
          startDate: editingVoucher.startDate
            ? new Date(editingVoucher.startDate).toISOString().split("T")[0]
            : "",
          endDate: editingVoucher.endDate
            ? new Date(editingVoucher.endDate).toISOString().split("T")[0]
            : "",
          startTime: editingVoucher.startTime || undefined,
          endTime: editingVoucher.endTime || undefined,
          usageLimit: editingVoucher.usageLimit,
          isActive: editingVoucher.isActive,
        });
      } else {
        setFormData(initialFormData);
      }
      setError("");
    }
  }, [open, editingVoucher]);

  const handleChange = (field: keyof CreateVoucherPayload, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!formData.code.trim()) {
        throw new Error(V.VALIDATE_CODE_REQUIRED);
      }
      if (!formData.startDate || !formData.endDate) {
        throw new Error(V.VALIDATE_DATE_REQUIRED);
      }
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        throw new Error(V.VALIDATE_DATE_ORDER);
      }

      const payload = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      };

      if (isEditing && editingVoucher) {
        const updatePayload: UpdateVoucherPayload = {
          ...payload,
          promotionId: editingVoucher.promotionId,
        };
        await voucherService.update(editingVoucher.promotionId, updatePayload);
      } else {
        await voucherService.create(payload);
      }

      onSuccess();
      onOpenChange(false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const discountLabel =
    formData.type === VoucherType.Percent ? V.FIELD_DISCOUNT_PERCENT : V.FIELD_DISCOUNT_FIXED;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] max-h-[90vh] p-0 flex flex-col overflow-hidden rounded-2xl">
        <div className="px-6 pt-5 sticky top-0 z-10 bg-background border-b border-border/50">
          <DialogHeader className="pb-3">
            <DialogTitle className="text-xl font-bold">{isEditing ? V.EDIT : V.CREATE}</DialogTitle>
            <DialogDescription>{isEditing ? V.EDIT_DESC : V.CREATE_DESC}</DialogDescription>
          </DialogHeader>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-4 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
                <span className="flex items-center justify-center size-5 rounded bg-primary/10 text-primary text-[10px] font-bold">
                  {V.SECTION_NUM_1}
                </span>
                {V.SECTION_BASIC}
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">
                    {V.FIELD_CODE} {UI_TEXT.COMMON.ASTERISK}
                  </Label>
                  <Input
                    id="code"
                    placeholder={V.FIELD_CODE_PLACEHOLDER}
                    value={formData.code ?? ""}
                    onChange={(e) => handleChange("code", e.target.value.toUpperCase())}
                    className="font-mono uppercase"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">{V.FIELD_TYPE}</Label>
                  <Select
                    value={formData.type.toString()}
                    onValueChange={(v) => handleChange("type", parseInt(v))}
                  >
                    <SelectTrigger id="type" className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {VOUCHER_TYPE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value.toString()} value={opt.value.toString()}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Section 2: Value & Limits */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
                <span className="flex items-center justify-center size-5 rounded bg-primary/10 text-primary text-[10px] font-bold">
                  {V.SECTION_NUM_2}
                </span>
                {V.SECTION_VALUE}
              </h3>

              <div className="grid grid-cols-3 gap-4">
                {formData.type !== VoucherType.FreeItem && (
                  <div className="space-y-2">
                    <Label htmlFor="value">{discountLabel}</Label>
                    <Input
                      id="value"
                      type="number"
                      min={0}
                      value={formData.value ?? ""}
                      onChange={(e) =>
                        handleChange("value", e.target.value === "" ? 0 : Number(e.target.value))
                      }
                    />
                  </div>
                )}
                {formData.type === VoucherType.Percent && (
                  <div className="space-y-2">
                    <Label htmlFor="maxDiscount">{V.FIELD_MAX_DISCOUNT}</Label>
                    <Input
                      id="maxDiscount"
                      type="number"
                      min={0}
                      placeholder={V.FIELD_MAX_DISCOUNT_PLACEHOLDER}
                      value={formData.maxDiscount ?? ""}
                      onChange={(e) =>
                        handleChange(
                          "maxDiscount",
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="minOrderValue">{V.FIELD_MIN_ORDER}</Label>
                  <Input
                    id="minOrderValue"
                    type="number"
                    min={0}
                    placeholder="0"
                    value={formData.minOrderValue ?? ""}
                    onChange={(e) =>
                      handleChange(
                        "minOrderValue",
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                  />
                </div>
              </div>

              {formData.type === VoucherType.FreeItem && (
                <div className="rounded-lg border border-rose-200 bg-rose-50/50 dark:border-rose-800 dark:bg-rose-950/20 p-4 space-y-3">
                  <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                    {V.FREE_ITEM_TITLE}
                  </span>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{V.FREE_ITEM_ID}</Label>
                      <ItemSearchSelect
                        value={formData.itemId}
                        initialName={editingVoucher?.itemName}
                        onChange={(val) => handleChange("itemId", val)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{V.FREE_ITEM_QTY}</Label>
                      <Input
                        type="number"
                        min={1}
                        value={formData.freeQuantity ?? ""}
                        onChange={(e) =>
                          handleChange(
                            "freeQuantity",
                            e.target.value === "" ? undefined : Number(e.target.value)
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Validity Period */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
                <span className="flex items-center justify-center size-5 rounded bg-primary/10 text-primary text-[10px] font-bold">
                  {V.SECTION_NUM_3}
                </span>
                {V.SECTION_VALIDITY}
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">
                    {V.FIELD_START_DATE} {UI_TEXT.COMMON.ASTERISK}
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate ?? ""}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">
                    {V.FIELD_END_DATE} {UI_TEXT.COMMON.ASTERISK}
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate ?? ""}
                    onChange={(e) => handleChange("endDate", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">{V.FIELD_START_TIME}</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime ?? ""}
                    onChange={(e) => handleChange("startTime", e.target.value || undefined)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">{V.FIELD_END_TIME}</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime ?? ""}
                    onChange={(e) => handleChange("endTime", e.target.value || undefined)}
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Usage & Status */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
                <span className="flex items-center justify-center size-5 rounded bg-primary/10 text-primary text-[10px] font-bold">
                  {V.SECTION_NUM_4}
                </span>
                {V.SECTION_USAGE}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="usageLimit">{V.FIELD_USAGE_LIMIT}</Label>
                  <Input
                    id="usageLimit"
                    type="number"
                    min={1}
                    value={formData.usageLimit ?? ""}
                    onChange={(e) =>
                      handleChange(
                        "usageLimit",
                        e.target.value === "" ? undefined : Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>{V.FIELD_STATUS}</Label>
                  <div className="flex items-center gap-3 pt-2">
                    <Switch
                      checked={formData.isActive}
                      onCheckedChange={(v) => handleChange("isActive", v)}
                    />
                    <span className="text-sm text-muted-foreground">
                      {formData.isActive ? V.FIELD_STATUS_ON : V.FIELD_STATUS_OFF}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                {V.ACTION_CANCEL}
              </Button>
              <Button type="submit" disabled={loading} className="min-w-[140px]">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {V.SAVING}
                  </span>
                ) : isEditing ? (
                  V.UPDATE
                ) : (
                  V.ACTION_SAVE
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateVoucherModal;

import { Control, Controller, FieldErrors, UseFormRegister } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";
import { InventoryUnit } from "@/types/Inventory";

import { IngredientFormValues } from "../ingredientSchema";

type Props = {
  register: UseFormRegister<IngredientFormValues>;
  errors: FieldErrors<IngredientFormValues>;
  control: Control<IngredientFormValues>;
  isEditing?: boolean;
  setHasCustomCode?: (custom: boolean) => void;
};

export function IngredientFormFields({
  register,
  errors,
  control,
  isEditing,
  setHasCustomCode,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-foreground">
          {UI_TEXT.INVENTORY.FORM.NAME}
        </label>
        <Input
          {...register("name")}
          placeholder={UI_TEXT.INVENTORY.FORM.PLACEHOLDER_NAME}
          className={cn(errors.name && "border-destructive")}
        />
        {errors.name?.message && (
          <span className="text-xs text-destructive">{errors.name.message}</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-foreground">
            {UI_TEXT.INVENTORY.FORM.SKU}
          </label>
          <Input
            {...register("code")}
            placeholder={UI_TEXT.INVENTORY.FORM.PLACEHOLDER_SKU}
            onChange={() => setHasCustomCode?.(true)}
            className={cn(errors.code && "border-destructive")}
          />
          {errors.code?.message && (
            <span className="text-xs text-destructive">{errors.code.message}</span>
          )}
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-foreground">
            {isEditing
              ? UI_TEXT.INVENTORY.FORM.CURRENT_STOCK
              : UI_TEXT.INVENTORY.FORM.INITIAL_STOCK}
          </label>
          <Input
            type="number"
            step="0.01"
            readOnly
            aria-readonly
            tabIndex={-1}
            {...register("currentStock", { valueAsNumber: true })}
            className={cn(
              "bg-muted text-foreground/80",
              errors.currentStock && "border-destructive"
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-foreground">
            {UI_TEXT.INVENTORY.FORM.UNIT}
          </label>
          <select
            {...register("unit")}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              errors.unit && "border-destructive"
            )}
          >
            <option value="">{UI_TEXT.INVENTORY.FORM.SELECT_UNIT}</option>
            {Object.values(InventoryUnit).map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
          {errors.unit?.message && (
            <span className="text-xs text-destructive">{errors.unit.message}</span>
          )}
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-foreground">
            {UI_TEXT.INVENTORY.FORM.COST}
          </label>
          <Input
            type="number"
            step="0.01"
            readOnly
            aria-readonly
            tabIndex={-1}
            {...register("costPrice", { valueAsNumber: true })}
            className={cn("bg-muted text-foreground/80", errors.costPrice && "border-destructive")}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-semibold text-foreground">
          {UI_TEXT.INVENTORY.FORM.ALERT_THRESHOLD}
        </label>
        <Input
          type="number"
          {...register("lowStockThreshold", { valueAsNumber: true })}
          className={cn(errors.lowStockThreshold && "border-destructive")}
        />
        {errors.lowStockThreshold?.message && (
          <span className="text-xs text-destructive">{errors.lowStockThreshold.message}</span>
        )}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-semibold text-foreground">
          {UI_TEXT.INVENTORY.FORM.DESCRIPTION}
        </label>
        <Textarea
          {...register("description")}
          placeholder={UI_TEXT.INVENTORY.FORM.PLACEHOLDER_DESCRIPTION}
          rows={3}
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm bg-muted/30">
        <div className="space-y-0.5">
          <label className="text-sm font-semibold text-foreground">
            {UI_TEXT.INVENTORY.FORM.IS_ACTIVE}
          </label>
        </div>
        <Controller
          name="isActive"
          control={control}
          render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
        />
      </div>
    </div>
  );
}

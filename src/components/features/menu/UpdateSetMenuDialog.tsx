"use client";

import { Edit, Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

import ImagePicker from "@/components/shared/ImagePicker";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UI_TEXT } from "@/lib/UI_Text";
import { uploadImage } from "@/services/imageService";
import { Category, MenuItem, SetMenu, SetMenuUpdateBody } from "@/types/Menu";

interface SetMenuItemDetail {
  menuItemId: string;
  quantity: number;
}

interface ComboItemForm {
  menuItemId: string;
  name: string;
  quantity: number;
  imageUrl?: string;
  costPrice: number;
}

interface SetMenuFormValues {
  name: string;
  price: number;
  costPrice: number;
  description: string;
  imageUrl: string;
  imageFile: File | null;
  removeExistingImage: boolean;
  items: ComboItemForm[];
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: SetMenu | null;
  allMenuItems: MenuItem[];
  categories: Category[];
  onSubmit: (payload: SetMenuUpdateBody) => void;
};

export default function UpdateSetMenuDialog({
  open,
  onOpenChange,
  initialData,
  allMenuItems,
  categories,
  onSubmit,
}: Props) {
  const { register, handleSubmit, reset, setValue, control, formState } =
    useForm<SetMenuFormValues>({
      defaultValues: {
        name: "",
        price: 0,
        costPrice: 0,
        description: "",
        imageUrl: "",
        imageFile: null,
        removeExistingImage: false,
        items: [],
      },
    });

  const watchedValues = useWatch({
    control,
    name: ["imageFile", "imageUrl", "items"],
  });

  const imageFile = watchedValues[0] as File | null;
  const imageUrl = watchedValues[1] as string;

  const selectedItems = useMemo(
    () => (watchedValues[2] as ComboItemForm[]) || [],
    [watchedValues[2]]
  );
  const totalCostPrice = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + item.costPrice * item.quantity, 0);
  }, [selectedItems]);

  useEffect(() => {
    if (open) {
      setValue("costPrice", totalCostPrice, { shouldDirty: true });
    }
  }, [totalCostPrice, open, setValue]);

  useEffect(() => {
    if (open && initialData) {
      const rawItems = initialData.items || initialData.setMenuItems || [];

      const mappedItems: ComboItemForm[] = rawItems.map((si) => {
        const detail = allMenuItems.find((m) => m.menuItemId === si.menuItemId);
        return {
          menuItemId: si.menuItemId,
          quantity: si.quantity || 1,
          name: detail?.name ?? `Món ID: ${si.menuItemId.substring(0, 6)}`,
          imageUrl: detail?.imageUrl ?? "",
          costPrice: detail?.costPrice ?? 0,
        };
      });

      reset({
        name: initialData.name || "",
        price: initialData.price || 0,
        costPrice: initialData.costPrice || 0,
        description: initialData.description || "",
        imageUrl: initialData.imageUrl || "",
        imageFile: null,
        removeExistingImage: false,
        items: mappedItems,
      });
    }
  }, [open, initialData, reset, allMenuItems]);

  const onLocalSubmit = async (data: SetMenuFormValues) => {
    if (!initialData) return;
    let finalImageUrl = data.imageUrl || initialData.imageUrl;

    try {
      if (data.imageFile) {
        const uploadRes = await uploadImage(data.imageFile, "combos");
        if (uploadRes?.success) finalImageUrl = uploadRes.imageUrl || "";
      }

      if (!finalImageUrl) {
        alert("Combo bắt buộc phải có hình ảnh!");
        return;
      }

      const comboCategory = categories.find((c) => c.name.toLowerCase() === "combo");

      const body: SetMenuUpdateBody = {
        setMenuId: initialData.setMenuId,
        name: data.name.trim(),
        setType: "COMBO",
        categoryId: comboCategory?.categoryId || "23ebc3d6-210d-4389-b143-1b7fbc21f4df",
        imageUrl: finalImageUrl,
        description: data.description?.trim() || "",
        price: Number(data.price),
        costPrice: Number(data.costPrice),
        items: data.items.map((i) => ({
          menuItemId: i.menuItemId,
          quantity: Number(i.quantity),
        })),
      };

      onSubmit(body);
    } catch (error) {
      console.error("Lỗi submit combo:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh] bg-background border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground font-bold">
            <Edit size={20} className="text-primary" />
            {UI_TEXT.FORM.EDIT_COMBO}: <span className="text-primary">{initialData?.name}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onLocalSubmit)} className="space-y-6">
          <div className="bg-card p-1 rounded-lg shadow-sm border border-border">
            <ImagePicker
              label={UI_TEXT.FORM.IMAGE_LABEL}
              file={imageFile}
              currentUrl={imageUrl || initialData?.imageUrl || null}
              onFileChange={(f) => {
                setValue("imageFile", f, { shouldDirty: true });
                if (f) setValue("removeExistingImage", false);
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground/80 font-medium">{UI_TEXT.FORM.ITEM_NAME}</Label>
              <Input
                {...register("name", { required: true })}
                className="bg-card border-input focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground/80 font-medium">
                {UI_TEXT.FORM.PRICE_CONFIG} (VNĐ)
              </Label>
              <Input
                type="number"
                {...register("price", { valueAsNumber: true })}
                className="bg-card border-input text-primary font-bold focus:ring-primary"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label className="text-info font-bold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-info animate-pulse" />
                {UI_TEXT.FORM.COST_PRICE}
              </Label>
              <Input
                type="number"
                {...register("costPrice")}
                disabled
                className="bg-secondary/50 border-dashed border-info/30 font-bold text-foreground opacity-100"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label className="text-foreground/80 font-medium">{UI_TEXT.FORM.DESCRIPTION}</Label>
              <Textarea
                {...register("description")}
                rows={2}
                className="bg-card border-input resize-none"
              />
            </div>
          </div>

          <div className="space-y-4 border-t border-border pt-6">
            <div className="flex justify-between items-center">
              <Label className="font-bold text-lg text-foreground">
                {UI_TEXT.FORM.COMBO_COMPONENTS}{" "}
                <span className="text-primary">({selectedItems.length})</span>
              </Label>
              <Select
                onValueChange={(val) => {
                  const item = allMenuItems.find((m) => m.menuItemId === val);
                  if (item && !selectedItems.some((si) => si.menuItemId === val)) {
                    setValue(
                      "items",
                      [
                        ...selectedItems,
                        {
                          menuItemId: item.menuItemId,
                          name: item.name,
                          quantity: 1,
                          imageUrl: item.imageUrl,
                          costPrice: item.costPrice,
                        },
                      ],
                      { shouldDirty: true }
                    );
                  }
                }}
              >
                <SelectTrigger className="w-56 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 border transition-colors font-semibold">
                  <Plus size={18} className="mr-2" />{" "}
                  <SelectValue placeholder={UI_TEXT.FORM.SELECT_ITEM_FALLBACK} />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <ScrollArea className="h-56">
                    {allMenuItems.map((m) => (
                      <SelectItem
                        key={m.menuItemId}
                        value={m.menuItemId}
                        className="hover:bg-accent cursor-pointer"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{m.name}</span>
                          <span className="text-xs text-muted-foreground italic">
                            {UI_TEXT.FORM.COST_PRICE}: {m.costPrice.toLocaleString()}đ
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {selectedItems.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-muted rounded-xl bg-muted/20">
                  <p className="text-muted-foreground text-sm italic">{UI_TEXT.COMMON.EMPTY}</p>
                </div>
              ) : (
                selectedItems.map((item, index) => (
                  <div
                    key={item.menuItemId}
                    className="glass-card flex items-center gap-4 p-3 rounded-xl border border-border"
                  >
                    <img
                      src={item.imageUrl || "/placeholder-food.png"}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover shadow-sm border border-border"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-foreground">{item.name}</p>
                      <p className="text-xs text-info font-medium">
                        {UI_TEXT.FORM.COST_PRICE}: {item.costPrice.toLocaleString()}đ
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] text-muted-foreground font-bold mb-1 uppercase">
                          {UI_TEXT.FORM.QUANTITY}
                        </span>
                        <Input
                          type="number"
                          className="w-20 h-9 text-center font-bold bg-background border-input focus:ring-primary"
                          value={item.quantity}
                          onChange={(e) => {
                            const newItems = [...selectedItems];
                            newItems[index].quantity = Math.max(1, Number(e.target.value));
                            setValue("items", newItems, { shouldDirty: true });
                          }}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-danger hover:bg-danger/10 hover:text-danger mt-4"
                        onClick={() =>
                          setValue(
                            "items",
                            selectedItems.filter((i) => i.menuItemId !== item.menuItemId),
                            { shouldDirty: true }
                          )
                        }
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 pt-4 border-t border-border">
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
              className="bg-secondary text-secondary-foreground hover:bg-muted"
            >
              {UI_TEXT.COMMON.CANCEL}
            </Button>
            <Button
              type="submit"
              disabled={formState.isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary-hover shadow-md shadow-primary/20 min-w-[120px]"
            >
              {formState.isSubmitting ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <Edit className="mr-2" size={16} />
              )}
              {UI_TEXT.BUTTON.SAVE_CHANGES}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

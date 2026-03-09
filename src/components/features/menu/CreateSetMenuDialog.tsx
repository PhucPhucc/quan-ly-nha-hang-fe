"use client";

import { Loader2, Plus, PlusCircle, Trash2, Utensils } from "lucide-react";
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
import { Category, MenuItem, SetMenuCreateBody, SetMenuFormValues } from "@/types/Menu";

interface SelectedItem {
  menuItemId: string;
  name: string;
  quantity: number;
  imageUrl?: string;
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allMenuItems: MenuItem[];
  categories: Category[];
  onSubmit: (payload: SetMenuCreateBody) => Promise<void>;
};

export default function CreateSetMenuDialog({
  open,
  onOpenChange,
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
        categoryId: "",
        items: [],
      },
    });

  const watchedValues = useWatch({
    control,
    name: ["imageFile", "imageUrl", "items", "categoryId"],
  });

  const imageFile = watchedValues[0] as File | null;
  const imageUrl = watchedValues[1] as string;
  const currentCategoryId = watchedValues[3] as string;

  const selectedItems = useMemo(
    () => (watchedValues[2] as SelectedItem[]) || [],
    [watchedValues[2]]
  );

  const totalCostPrice = useMemo(() => {
    return selectedItems.reduce((sum, item) => {
      const detail = allMenuItems.find((m) => m.menuItemId === item.menuItemId);
      return sum + (detail?.costPrice || 0) * item.quantity;
    }, 0);
  }, [selectedItems, allMenuItems]);

  useEffect(() => {
    setValue("costPrice", totalCostPrice);
  }, [totalCostPrice, setValue]);

  useEffect(() => {
    if (open && categories?.length > 0) {
      const comboCat = categories.find((c) => c.name.toLowerCase() === "combo");
      if (comboCat) setValue("categoryId", comboCat.categoryId);
    }
  }, [open, categories, setValue]);

  const onLocalSubmit = async (data: SetMenuFormValues) => {
    if (!data.imageFile) return alert(UI_TEXT.MENU.IMAGE_REQUIRED || "Vui lòng chọn ảnh");

    if (selectedItems.length === 0)
      return alert(UI_TEXT.MENU.COMBO_EMPTY_ERROR || "Combo phải có ít nhất 1 món");

    try {
      const uploadRes = await uploadImage(data.imageFile, "combos");
      if (!uploadRes.success) throw new Error("Upload ảnh thất bại");

      const payload: SetMenuCreateBody = {
        name: data.name.trim(),
        setType: "COMBO",
        categoryId: data.categoryId,
        imageUrl: uploadRes.imageUrl || "",
        description: data.description?.trim() || "",
        price: Number(data.price),
        costPrice: Number(data.costPrice),
        items: selectedItems.map((i) => ({
          menuItemId: i.menuItemId,
          quantity: Number(i.quantity),
        })),
      };

      await onSubmit(payload);
      reset();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      alert(UI_TEXT.COMMON.ERROR_UNKNOWN);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh] bg-background border-border shadow-xl">
        <DialogHeader className="border-b border-border pb-4">
          <DialogTitle className="flex items-center gap-2 text-foreground font-bold text-xl">
            <PlusCircle size={22} className="text-primary" />
            {UI_TEXT.FORM.ADD_COMBO}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onLocalSubmit)} className="space-y-6 pt-4">
          <div className="bg-card p-3 rounded-xl border border-border/60 shadow-sm glass-card">
            <ImagePicker
              label={UI_TEXT.FORM.IMAGE_LABEL}
              file={imageFile}
              currentUrl={imageUrl || null}
              onFileChange={(f) => setValue("imageFile", f, { shouldDirty: true })}
            />
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div className="space-y-2">
              <Label className="text-foreground/80 font-medium">{UI_TEXT.FORM.ITEM_NAME}</Label>
              <Input
                {...register("name", { required: true })}
                placeholder={UI_TEXT.FORM.NAME_PLACEHOLDER_COMBO || "Tên Combo..."}
                className="bg-card border-input focus:ring-primary h-10"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground/80 font-medium">{UI_TEXT.FORM.CATEGORY}</Label>
              <Select value={currentCategoryId} onValueChange={(v) => setValue("categoryId", v)}>
                <SelectTrigger className="bg-secondary/30 border-input h-10 font-medium">
                  <SelectValue placeholder={UI_TEXT.FORM.SELECT_CATEGORY_FALLBACK} />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {categories
                    .filter((c) => c.name.toLowerCase() === "combo")
                    .map((c) => (
                      <SelectItem key={c.categoryId} value={c.categoryId}>
                        {c.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground/80 font-medium">
                {UI_TEXT.FORM.PRICE_CONFIG} (VNĐ)
              </Label>
              <Input
                type="number"
                {...register("price", { valueAsNumber: true })}
                className="bg-card border-input text-primary font-bold focus:ring-primary h-10"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-info font-bold">
                {UI_TEXT.FORM.COST_PRICE} ({UI_TEXT.COMMON.AUTO_CALC || "Tự tính"})
              </Label>
              <Input
                type="number"
                {...register("costPrice")}
                disabled
                className="bg-secondary/50 border-dashed border-info/30 font-bold text-foreground h-10 opacity-100"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label className="text-foreground/80 font-medium">{UI_TEXT.FORM.DESCRIPTION}</Label>
              <Textarea
                {...register("description")}
                rows={2}
                placeholder={UI_TEXT.FORM.DESCRIPTION_PLACEHOLDER}
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
                    setValue("items", [
                      ...selectedItems,
                      {
                        menuItemId: item.menuItemId,
                        name: item.name,
                        quantity: 1,
                        imageUrl: item.imageUrl,
                      },
                    ]);
                  }
                }}
              >
                <SelectTrigger className="w-56 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 border transition-colors font-semibold shadow-sm">
                  <Plus size={18} className="mr-2" />
                  <SelectValue placeholder={UI_TEXT.FORM.SELECT_ITEM_FALLBACK} />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <ScrollArea className="h-56">
                    {allMenuItems.map((m) => (
                      <SelectItem key={m.menuItemId} value={m.menuItemId}>
                        <div className="flex flex-col">
                          <span className="font-medium">{m.name}</span>
                          <span className="text-[10px] text-muted-foreground italic">
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
                <div className="text-center py-8 border-2 border-dashed border-muted rounded-xl bg-muted/10">
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
                      className="w-12 h-12 rounded-lg object-cover border border-border"
                      alt={item.name}
                    />
                    <div className="flex-1 text-sm font-bold">{item.name}</div>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] text-muted-foreground font-bold mb-1 uppercase">
                          {UI_TEXT.FORM.QUANTITY}
                        </span>
                        <Input
                          type="number"
                          className="w-16 h-9 text-center font-bold"
                          value={item.quantity}
                          onChange={(e) => {
                            const newItems = [...selectedItems];
                            newItems[index] = {
                              ...newItems[index],
                              quantity: Math.max(1, Number(e.target.value)),
                            };
                            setValue("items", newItems);
                          }}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-danger hover:bg-danger/10 mt-5"
                        onClick={() =>
                          setValue(
                            "items",
                            selectedItems.filter((i) => i.menuItemId !== item.menuItemId)
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

          <DialogFooter className="gap-3 border-t border-border pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-6"
            >
              {UI_TEXT.COMMON.CANCEL}
            </Button>
            <Button
              type="submit"
              disabled={formState.isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary-hover px-8 transition-all"
            >
              {formState.isSubmitting ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <Utensils className="mr-2" size={16} />
              )}
              {UI_TEXT.MENU.CREATE_COMBO_NOW || "Tạo Combo ngay"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

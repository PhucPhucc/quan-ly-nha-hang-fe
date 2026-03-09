"use client";

import { Edit, Loader2 } from "lucide-react";
import { useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UI_TEXT } from "@/lib/UI_Text"; // ✅ Import UI_TEXT
import { uploadImage } from "@/services/imageService";
import { Station } from "@/types/enums";
import { Category, MenuItem, MenuItemFormValues, MenuItemUpdateBody } from "@/types/Menu";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: MenuItem | null;
  categories: Category[];
  onSubmit: (body: MenuItemUpdateBody) => void;
};

export default function UpdateMenuItemDialog({
  open,
  onOpenChange,
  initialData,
  categories,
  onSubmit,
}: Props) {
  const { register, handleSubmit, reset, setValue, control, formState } =
    useForm<MenuItemFormValues>({
      defaultValues: {
        code: "",
        name: "",
        imageUrl: "",
        imageFile: null,
        removeExistingImage: false,
        price: 0,
        costPrice: 0,
        categoryId: "",
        station: Station.BAR,
        description: "",
        expectedTime: 1,
      },
    });

  const watchedValues = useWatch({
    control,
    name: ["imageFile", "imageUrl", "categoryId", "station"],
  });

  const [imageFile, imageUrl, currentCategoryId, currentStation] = watchedValues as [
    File | null,
    string,
    string,
    Station,
  ];

  useEffect(() => {
    if (open && initialData) {
      reset({
        code: initialData.code || "",
        name: initialData.name || "",
        imageUrl: initialData.imageUrl || "",
        imageFile: null,
        removeExistingImage: false,
        price: initialData.price || 0,
        costPrice: initialData.costPrice || 0,
        categoryId: initialData.categoryId || "",
        station: initialData.station,
        description: initialData.description || "",
        expectedTime: initialData.expectedTime || 1,
      });
    }
  }, [open, initialData, reset]);

  const onLocalSubmit = async (data: MenuItemFormValues) => {
    if (!initialData) return;
    let finalImageUrl = initialData.imageUrl;

    try {
      if (data.imageFile) {
        const uploadRes = await uploadImage(data.imageFile, "menu-items");
        if (uploadRes && uploadRes.success) {
          finalImageUrl = uploadRes.imageUrl;
        } else {
          alert(`${UI_TEXT.COMMON.ERROR}: ${uploadRes.message || UI_TEXT.COMMON.EMPTY}`);
          return;
        }
      } else if (data.removeExistingImage) {
        alert(UI_TEXT.COMMON.EMPTY); // Hoặc một câu cảnh báo phù hợp từ UI_TEXT
        return;
      }

      if (!finalImageUrl) {
        alert(UI_TEXT.COMMON.EMPTY);
        return;
      }

      const body: MenuItemUpdateBody = {
        menuItemId: initialData.menuItemId,
        name: data.name.trim(),
        imageUrl: finalImageUrl,
        description: data.description.trim(),
        categoryId: data.categoryId,
        station: data.station,
        expectedTime: data.expectedTime,
        price: data.price,
        costPrice: data.costPrice,
      };

      onSubmit(body);
    } catch (error) {
      console.error("Lỗi submit:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh] bg-background border-border shadow-xl">
        <DialogHeader className="border-b border-border pb-4">
          <DialogTitle className="flex items-center gap-2 text-foreground font-bold text-xl">
            <Edit size={22} className="text-primary" />
            {UI_TEXT.FORM.UPDATE_ITEM}: <span className="text-primary">{initialData?.name}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onLocalSubmit)} className="space-y-6 pt-4">
          {/* Section: Image */}
          <div className="bg-card p-2 rounded-xl border border-border/60 shadow-sm">
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

          {/* Section: Basic Info */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div className="space-y-2">
              <Label className="text-foreground/80 font-medium">{UI_TEXT.FORM.ITEM_NAME}</Label>
              <Input
                {...register("name")}
                className="bg-card border-input focus:ring-primary h-10"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground/80 font-medium italic">
                {UI_TEXT.FORM.SKU_CODE}
              </Label>
              <Input
                {...register("code")}
                disabled
                className="bg-secondary/50 border-dashed cursor-not-allowed font-mono"
              />
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
              <Label className="text-foreground/80 font-medium">{UI_TEXT.FORM.COST_PRICE}</Label>
              <Input
                type="number"
                {...register("costPrice", { valueAsNumber: true })}
                className="bg-card border-input focus:ring-primary h-10"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-info font-medium">{UI_TEXT.FORM.COOKING_TIME} (phút)</Label>
              <Input
                type="number"
                {...register("expectedTime", { valueAsNumber: true })}
                className="bg-card border-input focus:ring-info h-10 font-bold text-info"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground/80 font-medium">{UI_TEXT.FORM.CATEGORY}</Label>
              <Select
                value={currentCategoryId}
                onValueChange={(v) => setValue("categoryId", v, { shouldDirty: true })}
              >
                <SelectTrigger className="bg-card border-input h-10">
                  <SelectValue placeholder={UI_TEXT.FORM.SELECT_CATEGORY_FALLBACK} />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {categories
                    .filter((c) => c.name !== "Combo")
                    .map((c) => (
                      <SelectItem key={c.categoryId} value={c.categoryId}>
                        {c.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 col-span-2">
              <Label className="text-foreground/80 font-medium">{UI_TEXT.FORM.STATION}</Label>
              <Select
                value={currentStation?.toString()}
                onValueChange={(v) =>
                  setValue("station", parseInt(v) as Station, { shouldDirty: true })
                }
              >
                <SelectTrigger className="bg-card border-input h-10">
                  <SelectValue placeholder={UI_TEXT.FORM.SELECT_STATION_FALLBACK} />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="1" className="text-danger font-medium">
                    {UI_TEXT.STATION.HOT_KITCHEN}
                  </SelectItem>
                  <SelectItem value="2" className="text-info font-medium">
                    {UI_TEXT.STATION.COLD_KITCHEN}
                  </SelectItem>
                  <SelectItem value="3" className="text-warning font-medium">
                    {UI_TEXT.STATION.BAR}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 col-span-2">
              <Label className="text-foreground/80 font-medium">{UI_TEXT.FORM.DESCRIPTION}</Label>
              <Textarea
                {...register("description")}
                rows={3}
                className="bg-card border-input resize-none"
                placeholder={UI_TEXT.FORM.DESCRIPTION_PLACEHOLDER}
              />
            </div>
          </div>

          <DialogFooter className="gap-3 border-t border-border pt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
              className="bg-secondary text-secondary-foreground hover:bg-muted px-6"
            >
              {UI_TEXT.COMMON.CANCEL}
            </Button>
            <Button
              type="submit"
              disabled={formState.isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary-hover shadow-glow shadow-primary/20 px-8 transition-all"
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

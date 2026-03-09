"use client";

import { Loader2, PlusCircle, Utensils } from "lucide-react";
import { useForm, useWatch } from "react-hook-form"; // ✅ Thêm useWatch

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
import { UI_TEXT } from "@/lib/UI_Text";
import { uploadImage } from "@/services/imageService";
import { Station } from "@/types/enums";
import { Category, MenuItemFormValues } from "@/types/Menu";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  onSubmit: (fd: FormData) => void;
};

export default function CreateMenuItemDialog({ open, onOpenChange, categories, onSubmit }: Props) {
  // ✅ Lấy thêm 'control' từ useForm để dùng cho useWatch
  const { register, handleSubmit, setValue, control, formState, reset } =
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

  // ✅ Thay thế các biến watch() bằng useWatch
  const imageFile = useWatch({ control, name: "imageFile" });
  const imageUrl = useWatch({ control, name: "imageUrl" });
  const currentCategoryId = useWatch({ control, name: "categoryId" });
  const currentStation = useWatch({ control, name: "station" });

  const onLocalSubmit = async (data: MenuItemFormValues) => {
    if (!data.imageFile) {
      alert(UI_TEXT.MENU.IMAGE_REQUIRED || "Vui lòng chọn ảnh cho món lẻ.");
      return;
    }

    try {
      const uploadRes = await uploadImage(data.imageFile, "menu-items");

      if (!uploadRes || !uploadRes.success) {
        alert(`${UI_TEXT.COMMON.UPDATE_ERROR}: ${uploadRes.message || "Unknown"}`);
        return;
      }

      const fd = new FormData();
      fd.append("Code", data.code.trim());
      fd.append("Name", data.name.trim());
      fd.append("Description", data.description.trim());
      fd.append("CategoryId", data.categoryId);
      fd.append("Station", String(data.station));
      fd.append("ExpectedTime", String(data.expectedTime));
      fd.append("Price", String(data.price));
      fd.append("Cost", String(data.costPrice));
      fd.append("ImageUrl", uploadRes.imageUrl);

      await onSubmit(fd);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Lỗi tạo món:", error);
      alert(UI_TEXT.COMMON.ERROR_UNKNOWN);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh] bg-background border-border shadow-xl">
        <DialogHeader className="border-b border-border pb-4">
          <DialogTitle className="flex items-center gap-2 text-foreground font-bold text-xl">
            <PlusCircle size={22} className="text-primary" />
            {UI_TEXT.FORM.ADD_ITEM}
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
                {...register("name", { required: "Không được để trống tên" })}
                placeholder="VD: Phở Bò Tái Lăn"
                className={`bg-card border-input focus:ring-primary h-10 ${formState.errors.name ? "border-destructive" : ""}`}
              />
              {formState.errors.name && (
                <p className="text-xs text-destructive">{formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-foreground/80 font-medium">{UI_TEXT.FORM.SKU_CODE}</Label>
              <Input
                {...register("code", { required: "Không được để trống Code" })}
                placeholder="VD: FOOD01"
                className={`bg-card border-input focus:ring-primary h-10 font-mono ${formState.errors.code ? "border-destructive" : ""}`}
              />
              {formState.errors.code && (
                <p className="text-xs text-destructive">{formState.errors.code.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-foreground/80 font-medium">{UI_TEXT.FORM.PRICE_CONFIG}</Label>
              <Input
                type="number"
                {...register("price", { valueAsNumber: true, min: 0 })}
                className="bg-card border-input text-primary font-bold focus:ring-primary h-10"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground/80 font-medium">{UI_TEXT.FORM.COST_PRICE}</Label>
              <Input
                type="number"
                {...register("costPrice", { valueAsNumber: true, min: 0 })}
                className="bg-card border-input focus:ring-primary h-10"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-info font-medium">{UI_TEXT.FORM.COOKING_TIME} (phút)</Label>
              <Input
                type="number"
                min={1}
                {...register("expectedTime", { valueAsNumber: true })}
                className="bg-card border-input focus:ring-info h-10 font-bold text-info"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground/80 font-medium">{UI_TEXT.FORM.CATEGORY}</Label>
              <Select
                value={currentCategoryId}
                onValueChange={(v) => setValue("categoryId", v, { shouldValidate: true })}
              >
                <SelectTrigger className="bg-card border-input h-10">
                  <SelectValue placeholder={UI_TEXT.FORM.SELECT_CATEGORY_FALLBACK} />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {categories
                    .filter((c) => c.name.toLowerCase() !== "combo")
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
                value={String(currentStation)}
                onValueChange={(v) => setValue("station", Number(v), { shouldValidate: true })}
              >
                <SelectTrigger className="bg-card border-input h-10">
                  <SelectValue placeholder={UI_TEXT.FORM.SELECT_STATION_FALLBACK} />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem
                    value={String(Station.HOT_KITCHEN)}
                    className="text-danger font-medium"
                  >
                    🔥 {UI_TEXT.STATION.HOT_KITCHEN}
                  </SelectItem>
                  <SelectItem
                    value={String(Station.COLD_KITCHEN)}
                    className="text-info font-medium"
                  >
                    ❄️ {UI_TEXT.STATION.COLD_KITCHEN}
                  </SelectItem>
                  <SelectItem value={String(Station.BAR)} className="text-warning font-medium">
                    ☕ {UI_TEXT.STATION.BAR}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 col-span-2">
              <Label className="text-foreground/80 font-medium">{UI_TEXT.FORM.DESCRIPTION}</Label>
              <Textarea
                {...register("description")}
                rows={3}
                placeholder={UI_TEXT.FORM.DESCRIPTION_PLACEHOLDER}
                className="bg-card border-input resize-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-3 border-t border-border pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-6 border-border hover:bg-secondary"
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
                <Utensils className="mr-2" size={16} />
              )}
              {UI_TEXT.MENU.SAVE_ITEM_NOW || "Lưu món ngay"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

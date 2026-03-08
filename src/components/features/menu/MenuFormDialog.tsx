"use client";

import {
  Clock,
  FileText,
  Loader2,
  Plus,
  ShoppingBag,
  Store,
  Trash2,
  Upload,
  Utensils,
  Wallet,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

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
import { Category } from "@/types/Menu";

type MenuFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  categories: Category[];
  forcedType?: "combo" | "single";
  allMenuItems?: any[];
};

export function MenuFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  categories = [],
  forcedType,
  allMenuItems = [],
}: MenuFormDialogProps) {
  const { register, handleSubmit, reset, setValue, control } = useForm<any>();
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [currentStation, currentCategory, imageUrl] = useWatch({
    control,
    name: ["Station", "CategoryId", "ImageUrl"],
  });

  const filteredCategories = useMemo(() => {
    return categories.filter((cat: Category) => {
      const name = (cat.name || "").toUpperCase();
      const id = (cat.categoryId || "").toUpperCase();
      const isComboCat = name.includes("COMBO") || id.includes("COMBO");

      // Nếu là tạo Combo: Chỉ lấy danh mục có chữ COMBO
      if (forcedType === "combo") return isComboCat;

      // Nếu là tạo Món lẻ: Loại bỏ danh mục có chữ COMBO
      return !isComboCat;
    });
  }, [categories, forcedType]);

  // 1. Sửa lại useEffect để hiện ảnh khi bấm "Sửa"
  useEffect(() => {
    if (!open) return;

    if (initialData) {
      const d = initialData;

      let sVal = "Bar";
      if (d.station === 1 || d.Station === 1) sVal = "KitchenHot";
      else if (d.station === 2 || d.Station === 2) sVal = "KitchenCold";

      const currentImg = d.imageUrl ?? d.ImageUrl ?? "";
      setPreviewUrl(currentImg);

      reset({
        Name: d.name ?? d.Name ?? "",
        Code: d.code ?? d.Code ?? "",
        ImageUrl: currentImg,
        PriceDineIn: d.priceDineIn ?? d.price ?? d.PriceDineIn ?? 0,
        PriceTakeAway: d.priceTakeAway ?? d.PriceTakeAway ?? 0,
        CostPrice: d.costPrice ?? d.CostPrice ?? 0,
        CategoryId: d.categoryId ?? d.CategoryId ?? "",
        Station: sVal,
        Description: d.description ?? d.Description ?? "",
        ExpectedTime: d.expectedTime ?? d.ExpectedTime ?? 0,
      });
    } else {
      setPreviewUrl(null);
      setSelectedItems([]);
      reset({
        Name: "",
        Code: forcedType === "combo" ? "COMBO-" : "",
        ImageUrl: "",
        PriceDineIn: "",
        PriceTakeAway: "",
        CostPrice: "",
        CategoryId: "",
        Station: "Bar",
        Description: "",
        ExpectedTime: 0,
      });
    }
  }, [open, initialData]);

  useEffect(() => {
    if (!open || forcedType !== "combo") {
      setSelectedItems([]);
      return;
    }

    const comboItems = initialData?.items || initialData?.setMenuItems || [];

    if (comboItems.length > 0 && allMenuItems.length > 0) {
      const mapped = comboItems.map((item: any) => {
        const detail = allMenuItems.find(
          (m: any) => String(m.menuItemId || m.id) === String(item.menuItemId)
        );

        return {
          menuItemId: item.menuItemId,
          name: detail?.name || "Món không xác định",
          quantity: item.quantity || 1,
          imageUrl: detail?.imageUrl || detail?.ImageUrl || "",
        };
      });
      setSelectedItems(mapped);
    } else {
      setSelectedItems([]);
    }
  }, [open, initialData, forcedType, allMenuItems]);

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    // Đảm bảo tên preset này trùng khớp 100% với tên ông tạo trên Web Cloudinary
    formData.append("upload_preset", "foodhub_preset");

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dgdi71ciq/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        const cloudUrl = data.secure_url;
        // QUAN TRỌNG: Phải là "ImageUrl" (chữ I hoa) để khớp với register/reset
        setValue("ImageUrl", cloudUrl);
        setPreviewUrl(cloudUrl);
        console.log("Link ảnh Cloudinary:", cloudUrl);
      } else {
        alert("Lỗi Cloudinary: " + data.error.message);
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const addItemToCombo = (itemId: string) => {
    const item = allMenuItems.find((i: any) => String(i.menuItemId || i.id) === String(itemId));
    if (item) {
      const isExisted = selectedItems.some(
        (si: any) => String(si.menuItemId || si.id) === String(itemId)
      );
      if (!isExisted) {
        setSelectedItems([
          ...selectedItems,
          {
            menuItemId: item.menuItemId || item.id,
            name: item.name,
            quantity: 1,
            imageUrl: item.imageUrl || item.ImageUrl || "", // Lưu thêm ảnh vào state local
          },
        ]);
      }
    }
  };

  const updateQty = (id: string, qty: number) => {
    setSelectedItems((prev) =>
      prev.map((i) =>
        String(i.menuItemId || i.id) === String(id) ? { ...i, quantity: Math.max(1, qty) } : i
      )
    );
  };
  // Tính tổng giá trị của các món lẻ trong combo để hiển thị đối chiếu
  const totalItemsPrice = useMemo(() => {
    // Nếu không có món nào được chọn, trả về 0
    if (!selectedItems || selectedItems.length === 0) return 0;

    return selectedItems.reduce((sum, item) => {
      // Tìm món gốc trong danh sách allMenuItems để lấy giá chuẩn
      const original = allMenuItems.find(
        (m: any) => String(m.menuItemId || m.id) === String(item.menuItemId || item.id)
      );

      // Ưu tiên lấy giá tại chỗ (priceDineIn), nếu không có thì lấy price
      const price = original?.priceDineIn || original?.price || 0;
      const quantity = Number(item.quantity) || 0;

      return sum + price * quantity;
    }, 0);
  }, [selectedItems, allMenuItems]);

  const onLocalSubmit = (data: any) => {
    // Xác định mã Station (Backend thường nhận số)
    let sNum = 3;
    if (data.Station === "KitchenHot") sNum = 1;
    else if (data.Station === "KitchenCold") sNum = 2;

    const payload = {
      // 1. Thông tin cơ bản (Map từ form về chuẩn API)
      name: data.Name,
      code: data.Code,
      imageUrl: data.ImageUrl || previewUrl || "",
      categoryId: data.CategoryId,
      description: data.Description,
      expectedTime: Number(data.ExpectedTime) || 0,
      station: sNum,

      // 2. Giá cả (Phải ép kiểu Number để tránh lỗi Validation chuỗi)
      price: Number(data.PriceDineIn) || 0,
      priceTakeAway: Number(data.PriceTakeAway) || 0,
      costPrice: Number(data.CostPrice) || 0,
      setType: forcedType === "combo" ? 1 : 0,
      // 3. Xử lý danh sách món trong combo
      // Đảm bảo lọc bỏ chính nó nếu lỡ tay chọn (tránh vòng lặp vô hạn)
      items:
        forcedType === "combo"
          ? selectedItems
              .filter(
                (i) =>
                  String(i.menuItemId || i.id) !==
                  String(initialData?.menuItemId || initialData?.id)
              )
              .map((i) => ({
                menuItemId: i.menuItemId || i.id,
                quantity: Number(i.quantity),
              }))
          : [],

      // Nếu API yêu cầu isCombo để xác định loại món ăn
      isCombo: forcedType === "combo",
    };

    console.log("Payload gửi đi thực tế:", payload);
    onSubmit(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[650px] p-0 overflow-hidden bg-background border-none shadow-2xl">
        <DialogHeader className="p-6 border-b bg-muted/30">
          <DialogTitle className="flex items-center gap-3 text-xl font-bold text-foreground">
            <div className="p-2 bg-primary rounded-lg text-primary-foreground">
              <Utensils size={20} />
            </div>
            {forcedType === "combo"
              ? initialData
                ? UI_TEXT.FORM.EDIT_COMBO
                : UI_TEXT.FORM.ADD_COMBO
              : initialData
                ? UI_TEXT.FORM.EDIT_ITEM
                : UI_TEXT.FORM.ADD_ITEM}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onLocalSubmit)}
          className="p-6 space-y-5 max-h-[85vh] overflow-y-auto"
        >
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-2 space-y-2">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {UI_TEXT.FORM.IMAGE_LABEL}
              </Label>
              <div
                className="group relative aspect-square rounded-2xl border-2 border-dashed border-border bg-muted/20 flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                {previewUrl || imageUrl ? (
                  <img
                    src={previewUrl || imageUrl}
                    className="w-full h-full object-cover"
                    alt="Preview"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "";
                      setPreviewUrl(null);
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center text-muted-foreground">
                    <Upload size={24} className="mb-1" />
                    <span className="text-[10px]">Tải ảnh</span>
                  </div>
                )}

                {isUploading && (
                  <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                    <Loader2 className="animate-spin text-primary" size={24} />
                  </div>
                )}
              </div>

              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleUploadImage}
              />

              <Input
                {...register("ImageUrl")}
                placeholder="Hoặc dán URL..."
                className="text-[10px] h-7 px-2 focus-visible:ring-1"
              />
            </div>

            <div className="col-span-4 space-y-4">
              <div className="grid gap-2">
                <Label className="font-bold text-foreground">{UI_TEXT.FORM.ITEM_NAME}</Label>
                <Input
                  {...register("Name", { required: true })}
                  placeholder="Nhập tên món..."
                  className="h-10"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="font-bold text-foreground">{UI_TEXT.FORM.SKU_CODE}</Label>
                  <Input
                    {...register("Code", { required: true })}
                    placeholder="VD:TEA-001..."
                    className="uppercase font-mono h-10"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="font-bold text-foreground">{UI_TEXT.FORM.CATEGORY}</Label>
                  <Select
                    value={currentCategory}
                    onValueChange={(v) => setValue("CategoryId", v)}
                    // Khóa luôn, không cho người dùng đổi danh mục nếu đang ở chế độ Combo
                    disabled={forcedType === "combo"}
                  >
                    <SelectTrigger
                      className={`h-10 ${forcedType === "combo" ? "bg-muted cursor-not-allowed" : ""}`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredCategories.map((cat: Category) => (
                        <SelectItem key={cat.categoryId} value={cat.categoryId}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {forcedType === "combo" && (
                    <p className="text-[10px] text-muted-foreground mt-1">
                      * Danh mục cố định cho Combo
                    </p>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <Label className="font-bold text-foreground flex items-center gap-2">
                  <FileText size={14} /> {UI_TEXT.FORM.DESCRIPTION}
                </Label>
                <Textarea
                  {...register("Description")}
                  placeholder="Mô tả món ăn..."
                  className="h-20 resize-none bg-muted/10"
                />
              </div>
            </div>
          </div>
          {forcedType === "combo" && (
            <div className="p-4 space-y-3 bg-warning/10 border-2 border-warning/20 rounded-xl">
              <div className="flex justify-between items-center">
                <Label className="flex items-center gap-2 text-sm font-black text-warning uppercase">
                  <Plus size={16} /> {UI_TEXT.FORM.COMBO_COMPONENTS}
                </Label>
                {/* Hiện tổng tiền món lẻ ở đây */}
                <div className="px-2 py-1 bg-warning/20 rounded text-[11px] font-bold text-warning-foreground">
                  Tổng món lẻ: {(totalItemsPrice || 0).toLocaleString()}đ
                </div>
              </div>

              <Select onValueChange={addItemToCombo}>
                <SelectTrigger className="bg-card">
                  <SelectValue placeholder={UI_TEXT.FORM.SELECT_ITEM_FALLBACK} />
                </SelectTrigger>
                <SelectContent>
                  {allMenuItems && allMenuItems.length > 0 ? (
                    allMenuItems
                      .filter((m) => !m.isCombo && !m.IsCombo) // Lọc bỏ combo
                      .map((item) => (
                        <SelectItem
                          key={item.menuItemId || item.id}
                          value={String(item.menuItemId || item.id)}
                        >
                          <div className="flex items-center gap-3 py-1">
                            <img
                              src={item.imageUrl || item.ImageUrl || "/placeholder-food.png"}
                              className="w-8 h-8 rounded-md object-cover border"
                            />
                            <div className="flex flex-col text-left">
                              <span className="font-medium text-sm">{item.name}</span>
                              <span className="text-[10px] text-muted-foreground">
                                {Number(item.price || item.priceDineIn || 0).toLocaleString()}đ
                              </span>
                            </div>
                          </div>
                        </SelectItem>
                      ))
                  ) : (
                    <div className="p-2 text-center text-xs text-muted-foreground">
                      Đang tải dữ liệu...
                    </div>
                  )}
                </SelectContent>
              </Select>

              <div className="space-y-2 overflow-y-auto max-h-40 pr-1">
                {selectedItems.map((item) => (
                  <div
                    key={item.menuItemId || item.id}
                    className="flex items-center gap-3 p-2 bg-card border border-border rounded-lg shadow-sm"
                  >
                    {/* Hiện ảnh món đã chọn */}
                    <img
                      src={item.imageUrl || "/placeholder-food.png"}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                    <span className="flex-1 text-sm font-medium">{item.name}</span>
                    <Input
                      type="number"
                      className="w-14 h-8 text-center"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQty(item.menuItemId || item.id, parseInt(e.target.value))
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-danger h-8 w-8"
                      onClick={() =>
                        setSelectedItems((prev) =>
                          prev.filter(
                            (i) => (i.menuItemId || i.id) !== (item.menuItemId || item.id)
                          )
                        )
                      }
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Label className="text-xs font-black text-info uppercase">
              {UI_TEXT.FORM.PRICE_CONFIG}
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 space-y-2 border border-border rounded-xl bg-muted/20">
                <Label className="flex items-center gap-1.5 text-[11px] font-bold text-info">
                  <Store size={12} /> {UI_TEXT.FORM.PRICE_DINE_IN}
                </Label>
                <Input
                  type="number"
                  {...register("PriceDineIn")}
                  className="h-10 font-bold text-info"
                />
              </div>
              <div className="p-3 space-y-2 border border-border rounded-xl bg-muted/20">
                <Label className="flex items-center gap-1.5 text-[11px] font-bold text-warning">
                  <ShoppingBag size={12} /> {UI_TEXT.FORM.PRICE_TAKE_AWAY}
                </Label>
                <Input
                  type="number"
                  {...register("PriceTakeAway")}
                  className="h-10 font-bold text-warning"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-bold text-danger">
                <Wallet size={14} /> {UI_TEXT.FORM.COST_PRICE}
              </Label>
              <Input
                type="number"
                {...register("CostPrice")}
                className="font-bold text-danger bg-danger/5 border-danger/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-bold text-foreground">
                <Clock size={14} /> {UI_TEXT.FORM.PREP_TIME}
              </Label>
              <Input type="number" {...register("ExpectedTime")} className="font-bold" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-bold text-foreground">
                <Utensils size={14} /> {UI_TEXT.FORM.STATION}
              </Label>
              <Select value={currentStation} onValueChange={(v) => setValue("Station", v)}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bar">Quầy Bar</SelectItem>
                  <SelectItem value="KitchenHot">Bếp Nóng</SelectItem>
                  <SelectItem value="KitchenCold">Bếp Lạnh</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11 px-8"
            >
              {UI_TEXT.FORM.CANCEL}
            </Button>
            <Button
              type="submit"
              disabled={isUploading}
              className="flex-1 h-11 px-8 font-bold text-primary-foreground uppercase bg-primary hover:bg-primary-hover"
            >
              {isUploading && <Loader2 className="animate-spin mr-2" />}
              {UI_TEXT.FORM.CONFIRM_SAVE}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import {
  DollarSign,
  FileText,
  Image as ImageIcon,
  LayoutGrid,
  Store,
  Tag,
  Utensils,
  Wallet,
} from "lucide-react";
import { useEffect } from "react";
// 1. Import thêm useWatch từ react-hook-form
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
import { Station } from "@/types/enums";
import { Category, MenuItem } from "@/types/Menu";

interface MenuFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MenuItem) => void;
  initialData?: MenuItem | null;
  categories: Category[];
}

export function MenuFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  categories,
}: MenuFormDialogProps) {
  // 2. Lấy thêm 'control' từ useForm
  const { register, handleSubmit, reset, setValue, control } = useForm<MenuItem>();

  // 3. THAY ĐỔI QUAN TRỌNG: Dùng useWatch thay cho watch để fix lỗi Compiler
  const [currentStation, currentCategory, imageUrl] = useWatch({
    control,
    name: ["station", "category_id", "image_url"],
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset(initialData);
      } else {
        reset({
          name: "",
          code: "",
          description: "",
          image_url: "",
          dine_in_price: 0,
          cost_price: 0,
          station: Station.BAR,
          category_id: categories[0]?.category_id || "",
        });
      }
    }
  }, [open, initialData, reset, categories]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="bg-white p-6 border-b">
          <DialogTitle className="flex items-center gap-3 text-2xl font-extrabold text-slate-900">
            <div className="p-2.5 bg-red-50 rounded-xl text-[#cc0000]">
              <Utensils size={24} strokeWidth={2.5} />
            </div>
            {initialData ? "Chỉnh sửa món ăn" : "Thêm món mới"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-5 bg-white max-h-[80vh] overflow-y-auto"
        >
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div className="col-span-2 flex items-center gap-4 p-4 bg-red-50/30 rounded-xl border border-dashed border-red-200">
              <div className="h-20 w-20 rounded-lg overflow-hidden border border-red-100 bg-white flex-shrink-0">
                <img
                  src={imageUrl || "https://placehold.co/100x100?text=FoodHub"}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-1.5">
                <Label
                  htmlFor="image_url"
                  className="text-[10px] font-bold uppercase tracking-wider text-red-600 flex items-center gap-2"
                >
                  <ImageIcon size={14} /> Đường dẫn ảnh món ăn
                </Label>
                <Input
                  id="image_url"
                  {...register("image_url")}
                  placeholder="Dán link ảnh tại đây..."
                  className="h-9 bg-white border-red-100 focus-visible:ring-[#cc0000]"
                />
              </div>
            </div>

            <div className="space-y-1.5 col-span-2">
              <Label
                htmlFor="name"
                className="text-sm font-bold flex items-center gap-2 text-slate-700"
              >
                <Tag size={14} className="text-[#cc0000]" /> Tên món ăn
              </Label>
              <Input
                id="name"
                {...register("name", { required: true })}
                placeholder="Ví dụ: Cà phê Muối"
                className="h-11 font-medium focus-visible:ring-[#cc0000]"
              />
            </div>

            <div className="space-y-1.5 col-span-2">
              <Label
                htmlFor="description"
                className="text-sm font-bold flex items-center gap-2 text-slate-700"
              >
                <FileText size={14} className="text-[#cc0000]" /> Mô tả chi tiết
              </Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Mô tả hương vị, nguyên liệu..."
                className="resize-none h-20 focus-visible:ring-[#cc0000]"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="code"
                className="text-sm font-bold flex items-center gap-2 text-slate-700"
              >
                <LayoutGrid size={14} className="text-[#cc0000]" /> Mã SKU
              </Label>
              <Input
                id="code"
                {...register("code", { required: true })}
                className="h-11 uppercase focus-visible:ring-[#cc0000]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-bold flex items-center gap-2 text-slate-700">
                <LayoutGrid size={14} className="text-[#cc0000]" /> Danh mục
              </Label>
              <Select value={currentCategory} onValueChange={(val) => setValue("category_id", val)}>
                <SelectTrigger className="h-11 focus:ring-[#cc0000]">
                  <SelectValue placeholder="Chọn nhóm" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.category_id} value={cat.category_id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="price"
                className="text-sm font-bold flex items-center gap-2 text-[#cc0000]"
              >
                <DollarSign size={14} /> Giá bán (VNĐ)
              </Label>
              <Input
                id="price"
                type="number"
                {...register("dine_in_price")}
                className="h-11 font-black text-[#cc0000] border-red-100 bg-red-50/30 focus-visible:ring-[#cc0000]"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="cost_price"
                className="text-sm font-bold flex items-center gap-2 text-slate-500"
              >
                <Wallet size={14} /> Giá vốn (VNĐ)
              </Label>
              <Input
                id="cost_price"
                type="number"
                {...register("cost_price")}
                className="h-11 font-bold text-slate-600 focus-visible:ring-slate-400"
              />
            </div>

            <div className="space-y-1.5 col-span-2">
              <Label className="text-sm font-bold flex items-center gap-2 text-slate-700">
                <Store size={14} className="text-[#cc0000]" /> Trạm thực hiện
              </Label>
              <Select
                value={currentStation || Station.BAR}
                onValueChange={(val) => setValue("station", val as Station)}
              >
                <SelectTrigger className="h-11 focus:ring-[#cc0000]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Station.BAR}>Quầy Bar (Đồ uống)</SelectItem>
                  <SelectItem value={Station.KITCHEN_HOT}>Bếp Nóng (Món chính)</SelectItem>
                  <SelectItem value={Station.KITCHEN_COLD}>Bếp Lạnh (Salad/Tráng miệng)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-6 border-t mt-4 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-slate-200 text-slate-500 hover:bg-slate-50 font-bold"
            >
              HỦY BỎ
            </Button>
            <Button
              type="submit"
              className="flex-[2] bg-[#cc0000] hover:bg-[#aa0000] text-white shadow-lg shadow-red-100 font-bold uppercase tracking-wider"
            >
              {initialData ? "Lưu thay đổi" : "Xác nhận thêm món"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

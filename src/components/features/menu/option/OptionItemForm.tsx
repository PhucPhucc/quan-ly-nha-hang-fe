"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OptionItem } from "@/types/Menu";

interface OptionItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: OptionItem | null;
  onSubmit: (data: Partial<OptionItem>) => Promise<void>;
}

export function OptionItemForm({ open, onOpenChange, initialData, onSubmit }: OptionItemFormProps) {
  const [formData, setFormData] = useState({
    label: initialData?.label || "",
    extraPrice: initialData?.extraPrice || 0,
  });

  const handleSubmit = async () => {
    await onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Sửa lựa chọn" : "Thêm lựa chọn"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Tên lựa chọn (Ví dụ: Size L, Trân châu đen)</Label>
            <Input
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder="Nhập tên lựa chọn..."
            />
          </div>

          <div className="space-y-2">
            <Label>Giá thêm (VNĐ)</Label>
            <Input
              type="number"
              min={0}
              step={1000}
              value={formData.extraPrice}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  extraPrice: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="Nhập số tiền..."
            />
            <p className="text-xs text-slate-500">Giữ nguyên 0 nếu miễn phí</p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>Lưu</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

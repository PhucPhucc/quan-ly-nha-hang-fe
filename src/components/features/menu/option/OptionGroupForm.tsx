"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { OptionGroup } from "@/types/Menu";

interface OptionGroupFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: OptionGroup | null;
  onSubmit: (data: Partial<OptionGroup>) => Promise<void>;
}

export function OptionGroupForm({
  open,
  onOpenChange,
  initialData,
  onSubmit,
}: OptionGroupFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    isRequired: initialData?.isRequired || false,
    minSelect: initialData?.minSelect || 0,
    maxSelect: initialData?.maxSelect || 1,
  });

  const handleSubmit = async () => {
    await onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Sửa nhóm tùy chọn" : "Thêm nhóm tùy chọn"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Tên nhóm (Ví dụ: Size, Topping)</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nhập tên nhóm..."
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={formData.isRequired}
              onCheckedChange={(c) => setFormData({ ...formData, isRequired: c })}
            />
            <Label>Bắt buộc chọn (Khách hàng phải chọn ít nhất 1)</Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Chọn tối thiểu</Label>
              <Input
                type="number"
                min={0}
                value={formData.minSelect}
                onChange={(e) =>
                  setFormData({ ...formData, minSelect: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Chọn tối đa</Label>
              <Input
                type="number"
                min={1}
                value={formData.maxSelect}
                onChange={(e) =>
                  setFormData({ ...formData, maxSelect: parseInt(e.target.value) || 1 })
                }
              />
            </div>
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

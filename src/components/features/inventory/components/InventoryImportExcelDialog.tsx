"use client";

import { Download, FileDown, FileSpreadsheet, Upload, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UI_TEXT } from "@/lib/UI_Text";
import { inventoryService } from "@/services/inventory.service";
import { ParsedInventoryBalanceDto } from "@/types/Inventory";

const { OPENING_STOCK } = UI_TEXT.INVENTORY;

interface InventoryImportExcelDialogProps {
  onImport: (data: ParsedInventoryBalanceDto[]) => void;
  disabled?: boolean;
}

export function InventoryImportExcelDialog({
  onImport,
  disabled,
}: InventoryImportExcelDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && (droppedFile.name.endsWith(".xlsx") || droppedFile.name.endsWith(".xls"))) {
      setFile(droppedFile);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setIsParsing(true);
    try {
      const res = await inventoryService.parseOpeningStockExcel(file);

      if (res.isSuccess) {
        toast.success(
          "Đã phân tích file Excel. Vui lòng kiểm tra lại dữ liệu trên bảng trước khi lưu."
        );
        onImport(res.data);
        setIsOpen(false);
        setFile(null);
      } else {
        toast.error(res.message || UI_TEXT.COMMON.ERROR || "Không thể phân tích file");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Lỗi hệ thống";
      toast.error(message);
    } finally {
      setIsParsing(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const res = await inventoryService.getImportExcelTemplate();
      if (res.isSuccess && res.data) {
        const url = window.URL.createObjectURL(res.data);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "inventory_balance_template.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        toast.success("Tải file mẫu thành công");
      } else {
        toast.error(res.message || "Không thể tải file mẫu");
      }
    } catch (_error) {
      toast.error("Lỗi khi kết nối máy chủ để tải file");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className="rounded-lg border-border bg-card px-4 text-xs font-bold text-muted-foreground shadow-sm hover:bg-secondary hover:text-success"
        >
          <FileSpreadsheet className="size-4 text-success" />
          {OPENING_STOCK.IMPORT_EXCEL}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-success" />
            {OPENING_STOCK.IMPORT_EXCEL_TITLE}
          </DialogTitle>
          <DialogDescription>{OPENING_STOCK.IMPORT_EXCEL_DESC}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between rounded-xl border border-border bg-info/10 p-4 transition-all hover:bg-info/15">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/20 text-info">
                <FileDown className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  {OPENING_STOCK.DOWNLOAD_TEMPLATE}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {OPENING_STOCK.DOWNLOAD_TEMPLATE_DESC}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownloadTemplate}
              className="h-9 px-3 text-info hover:bg-info/20 hover:text-info"
            >
              <Download className="mr-2 h-3.5 w-3.5" />
              {OPENING_STOCK.BTN_DOWNLOAD_TEMPLATE}
            </Button>
          </div>

          {!file ? (
            <label
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  fileInputRef.current?.click();
                }
              }}
              className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-secondary/50 py-12 transition-all hover:border-primary/50 hover:bg-primary/5"
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".xlsx, .xls"
                title={OPENING_STOCK.IMPORT_EXCEL_BTN}
                onChange={handleFileChange}
              />
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-card shadow-sm ring-4 ring-secondary transition-all group-hover:scale-110 group-hover:ring-primary/20">
                <Upload className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-primary" />
              </div>
              <p className="mt-4 text-sm font-semibold text-foreground">
                {OPENING_STOCK.DRAG_DROP_MSG}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {OPENING_STOCK.SUPPORTED_FORMATS}
              </p>
            </label>
          ) : (
            <div className="flex items-center justify-between rounded-2xl border border-success/30 bg-success/5 p-5 ring-1 ring-success/20">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/20 text-success shadow-sm">
                  <FileSpreadsheet className="h-6 w-6" />
                </div>
                <div>
                  <p className="max-w-[200px] truncate text-sm font-bold text-foreground">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} {OPENING_STOCK.KB}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setFile(null)}
                className="h-8 w-8 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button
            variant="ghost"
            onClick={() => setIsOpen(false)}
            className="h-11 rounded-xl px-6 font-medium text-muted-foreground hover:bg-secondary"
          >
            {OPENING_STOCK.BTN_CANCEL}
          </Button>
          <Button
            onClick={handleImport}
            disabled={!file || isParsing}
            className="h-11 min-w-[140px] rounded-xl bg-primary px-8 font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary-hover disabled:opacity-50"
          >
            {isParsing ? OPENING_STOCK.PROCESSING : OPENING_STOCK.BTN_IMPORT}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

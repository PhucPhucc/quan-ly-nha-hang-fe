"use client";

import { ArrowBigRightDash, Receipt } from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";

interface KDSRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  itemName: string;
}

const QUICK_REASONS = ["Hết hàng", "Bếp quá tải", "Thiết bị hỏng"];
const MAX_CHARS = 200;

export function KDSRejectModal({ isOpen, onClose, onConfirm, itemName }: KDSRejectModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError(UI_TEXT.KDS.AUDIT.REJECT_MODAL.REQUIRED);
      return;
    }
    onConfirm(reason.trim());
    setReason("");
    setError(null);
    onClose();
  };

  const handleQuickReason = (text: string) => {
    setReason(text);
    setError(null);
  };

  const handleCancel = () => {
    setReason("");
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden border-none rounded-[16px] shadow-xl">
        {/* Simplified Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex flex-col gap-1 bg-white">
          <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">
            {UI_TEXT.KDS.AUDIT.REJECT_MODAL.TITLE}
          </h2>
          <p className="text-gray-500 text-[11px] font-medium leading-normal">
            Hành động này sẽ gửi thông báo đến nhân viên phục vụ và khách hàng.
          </p>
        </div>

        <div className="p-6 flex flex-col gap-6 bg-white">
          {/* Design: Context Line */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
            <Receipt className="text-gray-400" size={18} />
            <p className="text-gray-700 text-xs font-bold uppercase tracking-tight">
              Bạn đang thực hiện từ chối món:{" "}
              <span className="text-primary font-black">{itemName}</span>
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[11px] font-black uppercase text-gray-500 tracking-wider">
              Tại sao bạn lại từ chối món này?
            </label>
            <div className="relative">
              <Textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (e.target.value.trim()) setError(null);
                }}
                placeholder={UI_TEXT.KDS.AUDIT.REJECT_MODAL.PLACEHOLDER}
                className="min-h-[120px] resize-none border-gray-200 focus:border-primary focus:ring-primary rounded-xl text-sm p-4 bg-gray-50/50"
                maxLength={200}
              />
              <span className="absolute bottom-3 right-3 text-[10px] font-bold text-gray-400">
                {reason.length}/200
              </span>
            </div>

            {/* Quick Reason Buttons for speed */}
            <div className="flex flex-wrap gap-2 mt-1">
              {QUICK_REASONS.map((r) => (
                <button
                  key={r}
                  onClick={() => handleQuickReason(r)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[10px] font-black uppercase transition-all border",
                    reason === r
                      ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                      : "bg-white text-gray-500 border-gray-200 hover:border-primary hover:text-primary"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
            {error && (
              <p className="text-[10px] font-black text-accent-red uppercase italic mt-1">
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-5 bg-gray-50 flex justify-end gap-3 rounded-b-[16px]">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="border-none bg-transparent hover:bg-gray-200 text-gray-500 text-xs font-black uppercase rounded-lg"
          >
            {UI_TEXT.COMMON.CANCEL}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!reason.trim()}
            className="bg-primary hover:bg-orange-600 text-white px-6 py-5 rounded-xl text-xs font-black uppercase flex items-center gap-2 group shadow-lg shadow-primary/25 disabled:opacity-50 disabled:shadow-none transition-all"
          >
            <span>{UI_TEXT.KDS.AUDIT.REJECT_MODAL.CONFIRM}</span>
            <ArrowBigRightDash
              className="group-hover:translate-x-1 transition-transform"
              size={18}
            />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { ArrowBigRightDash, Receipt } from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { UI_TEXT } from "@/lib/UI_Text";

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
            <span className="material-symbols-outlined text-gray-400 text-lg">
              <Receipt />
            </span>
            <p className="text-gray-700 text-xs font-bold uppercase tracking-tight">
              Bạn đang thực hiện từ chối món:{" "}
              <span className="text-primary font-black">{itemName}</span>
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <label
              className="text-gray-900 text-xs font-black uppercase tracking-wider"
              htmlFor="reject-reason"
            >
              Lý do từ chối <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <Textarea
                id="reject-reason"
                placeholder={UI_TEXT.KDS.AUDIT.REJECT_MODAL.PLACEHOLDER}
                value={reason}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_CHARS) {
                    setReason(e.target.value);
                    if (e.target.value.trim()) setError(null);
                  }
                }}
                className="w-full min-h-[140px] bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus-visible:ring-primary p-4 text-sm font-medium resize-none transition-all"
              />
              <div className="absolute bottom-3 right-3 text-[10px] font-black text-gray-400 tabular-nums">
                {reason.length}/{MAX_CHARS}
              </div>
            </div>

            {/* Design: Quick Selection Buttons */}
            <div className="flex flex-wrap gap-2">
              {QUICK_REASONS.map((r) => (
                <Button
                  key={r}
                  onClick={() => handleQuickReason(r)}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-[10px] font-bold text-gray-600 uppercase transition-all shadow-sm active:scale-95"
                >
                  {r}
                </Button>
              ))}
            </div>

            {error && (
              <p className="text-[10px] font-black text-accent-red uppercase italic mt-1">
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Design: Red Shadowed Footer Buttons */}
        <div className="p-6 pt-2 flex items-center justify-end gap-3 bg-white">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="px-6 py-2.5 h-auto rounded-xl border border-gray-200 text-gray-600 font-black text-xs hover:bg-gray-50 hover:text-gray-900 transition-all uppercase tracking-tight"
          >
            {UI_TEXT.COMMON.CANCEL}
          </Button>
          <Button
            onClick={handleConfirm}
            className="px-6 py-2.5 h-auto rounded-xl bg-primary hover:bg-primary-dark text-white font-black text-xs shadow-lg shadow-red-500/30 transition-all flex items-center gap-2 group uppercase tracking-tight"
          >
            <span>{UI_TEXT.KDS.AUDIT.REJECT_MODAL.CONFIRM}</span>
            <span className="material-symbols-outlined text-lg group-hover:translate-x-0.5 transition-transform">
              <ArrowBigRightDash />
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

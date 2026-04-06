"use client";

import { ArrowBigRightDash, Receipt } from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UI_TEXT } from "@/lib/UI_Text";

interface KDSRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  itemName: string;
}

const QUICK_REASONS = UI_TEXT.KDS.AUDIT.REJECT_MODAL.REASONS;
const MAX_CHARS = 200;
const DEFAULT_REASON = "Tạm thời không có nguyên liệu";

export function KDSRejectModal({ isOpen, onClose, onConfirm, itemName }: KDSRejectModalProps) {
  const [reason, setReason] = useState(DEFAULT_REASON);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = () => {
    const finalReason = reason.trim() || DEFAULT_REASON;
    onConfirm(finalReason);
    setReason("");
    setError(null);
    onClose();
  };

  const handleQuickReason = (text: string) => {
    setReason(text);
    setError(null);
  };

  const handleCancel = () => {
    setReason(DEFAULT_REASON);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-130 p-0 overflow-hidden border-none rounded-2xl shadow-xl">
        {/* Simplified Header */}
        <DialogHeader className="px-6 py-5 border-b border-border flex flex-col gap-1">
          <DialogTitle className="text-2xl">{UI_TEXT.KDS.AUDIT.REJECT_MODAL.TITLE}</DialogTitle>
          <DialogDescription className="text-muted-foreground font-medium leading-normal mt-1">
            {UI_TEXT.KDS.REJECT_WARNING}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 flex flex-col gap-4">
          {/* Design: Context Line */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted border border-border">
            <span className="material-symbols-outlined text-access text-lg">
              <Receipt />
            </span>
            <p className="text-gray-700 text-xs font-bold uppercase tracking-tight">
              {UI_TEXT.KDS.REJECT_CONFIRM}{" "}
              <span className="text-primary font-black">{itemName}</span>
            </p>
          </div>

          <Field className="flex flex-col gap-2.5">
            <Label
              className="text-foreground text-xs font-black uppercase tracking-wider"
              htmlFor="reject-reason"
            >
              {UI_TEXT.KDS.REASON} <span className="text-primary">{UI_TEXT.COMMON.ASTERISK}</span>
            </Label>
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
                className="w-full min-h-35 bg-white border border-border rounded-xl 
                text-foreground placeholder:text-gray-400 focus-visible:ring-primary 
                p-4 text-sm font-medium resize-none transition-all"
              />
              <div className="absolute bottom-3 right-3 text-[10px] font-black text-gray-400 tabular-nums">
                {reason.length}
                {UI_TEXT.COMMON.SLASH}
                {MAX_CHARS}
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
          </Field>
        </div>

        {/* Design: Red Shadowed Footer Buttons */}
        <div className="p-6 pt-2 flex items-center justify-end gap-3">
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

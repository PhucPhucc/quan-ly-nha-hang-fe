import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { CheckCircle2 } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { UI_TEXT } from "@/lib/UI_Text";

interface SuccessDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  actionType: "checkin" | "checkout" | null;
  actionInfo: { time: string; duration?: string } | null;
}

export function SuccessDialog({
  isOpen,
  onOpenChange,
  actionType,
  actionInfo,
}: SuccessDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <VisuallyHidden>
        <DialogTitle />
      </VisuallyHidden>
      <DialogContent
        className="sm:max-w-md rounded-[2rem] p-8 bg-white border-0 shadow-2xl"
        aria-describedby={undefined}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-100">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-2xl font-black text-slate-900 mb-2">
            {actionType === "checkin"
              ? UI_TEXT.ATTENDANCE.MODAL_CHECK_IN_SUCCESS
              : UI_TEXT.ATTENDANCE.MODAL_CHECK_OUT_SUCCESS}
          </h2>

          <p className="text-base text-slate-600 font-medium mb-8">
            {actionType === "checkin"
              ? UI_TEXT.ATTENDANCE.MODAL_CHECK_IN_TIME
              : UI_TEXT.ATTENDANCE.MODAL_CHECK_OUT_TIME}{" "}
            <span className="font-bold text-slate-900">{actionInfo?.time}</span>
          </p>

          {actionType === "checkin" ? (
            <p className="text-slate-500 text-sm italic">{UI_TEXT.ATTENDANCE.MODAL_GREETING}</p>
          ) : (
            <div className="w-full bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-6">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                {UI_TEXT.ATTENDANCE.MODAL_STATS_TODAY}
              </p>
              <p className="text-sm font-bold text-slate-700 mb-1">
                {UI_TEXT.ATTENDANCE.MODAL_TOTAL_TIME}
              </p>
              <p className="text-xl font-black text-slate-900">{actionInfo?.duration}</p>
            </div>
          )}

          <Button
            className="w-full h-14 bg-[#cc0000] hover:bg-[#aa0000] text-white rounded-xl font-bold mt-4"
            onClick={() => onOpenChange(false)}
          >
            {UI_TEXT.ATTENDANCE.MODAL_UNDERSTOOD}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

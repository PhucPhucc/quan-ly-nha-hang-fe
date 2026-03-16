import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { UI_TEXT } from "@/lib/UI_Text";
import { reservationService } from "@/services/reservationService";

import { ReservationDto } from "@/services/reservationService";

interface StartServingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  bookingData?: ReservationDto | null;
}

export const StartServingDialog = ({
  open,
  onOpenChange,
  onSuccess,
  bookingData,
}: StartServingDialogProps) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!bookingData?.id) return;

    try {
      setLoading(true);
      const res = await reservationService.checkInReservation(bookingData.id);
      if (res.isSuccess) {
        toast.success(UI_TEXT.COMMON.UPDATE_SUCCESS);
        onOpenChange(false);
        if (onSuccess) onSuccess();
      } else {
        toast.error(res.message || UI_TEXT.RESERVATION.ERROR_SAVE_FAILED);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : UI_TEXT.RESERVATION.ERROR_CONNECTION;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const description = `${UI_TEXT.RESERVATION.CONFIRM_ARRIVAL_DESC_1} ${bookingData?.customerName || ""} (${bookingData?.code || ""}) ${UI_TEXT.RESERVATION.CONFIRM_ARRIVAL_DESC_2}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] rounded-3xl p-8 outline-none border-none shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-md shadow-emerald-500/30">
              {loading ? (
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              ) : (
                <Check className="h-6 w-6 text-white stroke-[3]" />
              )}
            </div>
          </div>

          <h2 className="text-[26px] font-bold text-slate-800 tracking-tight mb-2">
            {UI_TEXT.RESERVATION.CONFIRM_ARRIVAL_TITLE}
          </h2>

          <p className="text-[15px] text-slate-500 mb-8 max-w-[280px]">{description}</p>

          <div className="w-full bg-slate-50/80 border border-slate-100/50 rounded-2xl p-4 mb-8">
            <div className="flex justify-between items-center py-2 border-b border-slate-200/60 pb-3">
              <span className="text-[15px] text-slate-500 font-medium tracking-wide">
                {UI_TEXT.RESERVATION.CONFIRM_ARRIVAL_TABLE}
              </span>
              <span className="text-[15px] font-bold text-slate-800">{bookingData?.area}</span>
            </div>
            <div className="flex justify-between items-center py-2 pt-3">
              <span className="text-[15px] text-slate-500 font-medium tracking-wide">
                {UI_TEXT.RESERVATION.CONFIRM_ARRIVAL_PEOPLE}
              </span>
              <span className="text-[15px] font-bold text-slate-800">{bookingData?.people}</span>
            </div>
          </div>

          <div className="w-full flex gap-3">
            <button
              disabled={loading}
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12 rounded-full font-bold text-slate-600 bg-white hover:bg-slate-50 border-none transition-colors disabled:opacity-50"
            >
              {UI_TEXT.RESERVATION.BTN_CLOSE_DIALOG}
            </button>
            <button
              disabled={loading}
              onClick={handleConfirm}
              className="flex-1 h-12 rounded-full font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {UI_TEXT.RESERVATION.BTN_CONFIRM_ARRIVAL}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

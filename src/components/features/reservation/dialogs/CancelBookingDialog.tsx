import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getErrorMessage } from "@/lib/error";
import { UI_TEXT } from "@/lib/UI_Text";
import { reservationService } from "@/services/reservationService";
import { ReservationDto } from "@/services/reservationService";

interface CancelBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  bookingData?: ReservationDto | null;
}

export const CancelBookingDialog = ({
  open,
  onOpenChange,
  onSuccess,
  bookingData,
}: CancelBookingDialogProps) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!bookingData?.id) return;

    try {
      setLoading(true);
      const res = await reservationService.cancelReservation(bookingData.id);
      if (res.isSuccess) {
        toast.success(UI_TEXT.COMMON.UPDATE_SUCCESS);
        onOpenChange(false);
        if (onSuccess) onSuccess();
      } else {
        toast.error(res.message || UI_TEXT.RESERVATION.ERROR_SAVE_FAILED);
      }
    } catch (error: unknown) {
      const message = getErrorMessage(error) || UI_TEXT.RESERVATION.ERROR_CONNECTION;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const description = `${UI_TEXT.RESERVATION.CANCEL_BOOKING_DESC_1} ${bookingData?.customerName || ""} ${UI_TEXT.RESERVATION.CANCEL_BOOKING_DESC_2}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] rounded-3xl p-8 outline-none border-none shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-md shadow-red-500/30">
              {loading ? (
                <Loader2 className="h-5 w-5 text-white animate-spin" />
              ) : (
                <Trash2 className="h-5 w-5 text-white" />
              )}
            </div>
          </div>

          <h2 className="text-[26px] font-bold text-slate-800 tracking-tight mb-2">
            {UI_TEXT.RESERVATION.CANCEL_BOOKING_TITLE}
          </h2>

          <p className="text-[15px] text-slate-500 mb-8 max-w-[280px]">{description}</p>

          <div className="w-full flex gap-3">
            <button
              disabled={loading}
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12 rounded-full font-bold text-slate-600 bg-white hover:bg-slate-50 border-none transition-colors disabled:opacity-50"
            >
              {UI_TEXT.RESERVATION.BTN_BACK}
            </button>
            <button
              disabled={loading}
              onClick={handleConfirm}
              className="flex-1 h-12 rounded-full font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {UI_TEXT.RESERVATION.BTN_CONFIRM_CANCEL}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

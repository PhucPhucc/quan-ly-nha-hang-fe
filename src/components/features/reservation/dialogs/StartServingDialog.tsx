import { Check, ChevronLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UI_TEXT } from "@/lib/UI_Text";
import { reservationService } from "@/services/reservationService";
import { ReservationDto } from "@/services/reservationService";
import { tableService } from "@/services/tableService";
import { Area } from "@/types/Table-Layout";

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
  const [isSwitchMode, setIsSwitchMode] = useState(false);

  // States for manual area switch
  const [areas, setAreas] = useState<Area[]>([]);
  const [selectedAreaId, setSelectedAreaId] = useState<string>("");

  // Reset states when dialog opens
  useEffect(() => {
    if (open) {
      setIsSwitchMode(false);
      setSelectedAreaId("");
    }
  }, [open]);

  // Fetch areas when entering switch mode
  useEffect(() => {
    if (isSwitchMode && areas.length === 0) {
      tableService.getAreas().then((res) => {
        if (res.isSuccess) setAreas(res.data);
      });
    }
  }, [isSwitchMode, areas.length]);

  const handleConfirm = async (newAreaId?: string) => {
    if (!bookingData?.id) return;

    try {
      setLoading(true);
      const res = await reservationService.checkInReservation(bookingData.id, newAreaId);
      if (res.isSuccess) {
        toast.success(UI_TEXT.COMMON.UPDATE_SUCCESS);
        onOpenChange(false);
        if (onSuccess) onSuccess();
      } else {
        toast.error(res.message || UI_TEXT.RESERVATION.ERROR_SAVE_FAILED);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : UI_TEXT.RESERVATION.ERROR_CONNECTION;
      // Catch Conflict error to show "Switch Area" option
      if (errorMessage?.includes("hết bàn trống") || errorMessage?.includes("Conflict")) {
        setIsSwitchMode(true);
        toast.info(UI_TEXT.RESERVATION.MSG_SWITCH_INFO);
      } else {
        toast.error(errorMessage || UI_TEXT.RESERVATION.ERROR_CONNECTION);
      }
    } finally {
      setLoading(false);
    }
  };

  const description = `${UI_TEXT.RESERVATION.CONFIRM_ARRIVAL_DESC_1} ${bookingData?.customerName || ""} (${bookingData?.code || ""}) ${UI_TEXT.RESERVATION.CONFIRM_ARRIVAL_DESC_2}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] rounded-3xl p-8 outline-none border-none shadow-[0_4px_24px_rgba(0,0,0,0.05)] overflow-hidden">
        {!isSwitchMode ? (
          /* --- MODE 1: NORMAL CONFIRMATION --- */
          <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
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
                className="flex-1 h-12 rounded-full font-bold text-slate-400 bg-white hover:bg-slate-50 border-none transition-colors disabled:opacity-50"
              >
                {UI_TEXT.RESERVATION.BTN_CLOSE_DIALOG}
              </button>
              <button
                disabled={loading}
                onClick={() => handleConfirm()}
                className="flex-1 h-12 rounded-full font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {UI_TEXT.RESERVATION.BTN_CONFIRM_ARRIVAL}
              </button>
            </div>
          </div>
        ) : (
          /* --- MODE 2: SWITCH AREA ONLY --- */
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <button
              onClick={() => setIsSwitchMode(false)}
              className="mb-4 flex items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors text-sm font-medium"
            >
              <ChevronLeft className="h-4 w-4" />
              {UI_TEXT.RESERVATION.BTN_BACK}
            </button>

            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {UI_TEXT.RESERVATION.SWITCH_AREA_TITLE}
            </h2>
            <p className="text-sm text-slate-500 mb-6">{UI_TEXT.RESERVATION.SWITCH_AREA_DESC}</p>

            <div className="space-y-4 mb-8">
              <div className="space-y-2">
                <label className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider ml-1">
                  {UI_TEXT.RESERVATION.SWITCH_AREA_SELECT_LABEL}
                </label>
                <Select value={selectedAreaId} onValueChange={setSelectedAreaId}>
                  <SelectTrigger className="h-12 rounded-2xl border-slate-200 focus:ring-emerald-500">
                    <SelectValue placeholder={UI_TEXT.RESERVATION.SWITCH_AREA_SELECT_PLACEHOLDER} />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-200">
                    {areas.map((area) => (
                      <SelectItem key={area.areaId} value={area.areaId}>
                        {area.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="w-full flex gap-3">
              <button
                disabled={loading}
                onClick={() => onOpenChange(false)}
                className="flex-1 h-12 rounded-full font-bold text-slate-400 bg-white hover:bg-slate-50 border-none transition-colors"
              >
                {UI_TEXT.RESERVATION.BTN_CANCEL}
              </button>
              <button
                disabled={loading || !selectedAreaId}
                onClick={() => handleConfirm(selectedAreaId)}
                className="flex-[2] h-12 rounded-full font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {UI_TEXT.RESERVATION.BTN_CONFIRM_SWITCH_CHECKIN}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

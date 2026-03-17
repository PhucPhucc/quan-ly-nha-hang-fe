import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RESERVATION_RULES } from "@/constants/reservation";
import { UI_TEXT } from "@/lib/UI_Text";
import { reservationService } from "@/services/reservationService";
import { tableService } from "@/services/tableService";
import { Area, AreaStatus, AreaType } from "@/types/Table-Layout";

const OPEN_TIME_MINUTES = 9 * 60;
const CLOSE_TIME_MINUTES = 20 * 60;
const MIN_LEAD_TIME_MINUTES = 45;
const LAST_BOOKING_MINUTES = CLOSE_TIME_MINUTES - 90;
const VIP_GUEST_THRESHOLD = RESERVATION_RULES.VIP_MIN_GUEST_COUNT;

const formatReservationTime = (value: string) => {
  const segments = value.split(":");
  return segments.length === 2 ? `${value}:00` : value;
};

interface CreateBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface FormData {
  customerName: string;
  customerPhone: string;
  reservationDate: string;
  reservationTime: string;
  guestCount: number;
  partyType: string;
  areaId: string;
}

export const CreateBookingDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: CreateBookingDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    customerName: "",
    customerPhone: "",
    reservationDate: "",
    reservationTime: "",
    guestCount: 2,
    partyType: "normal",
    areaId: "all",
  });
  const [areas, setAreas] = useState<Area[]>([]);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await tableService.getAreas();
        if (res.isSuccess) setAreas(res.data.filter((a) => a.status === AreaStatus.Active));
      } catch (err) {
        console.error(err);
      }
    };
    if (open) fetchAreas();
  }, [open]);

  const handleChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedTime = formatReservationTime(formData.reservationTime);

    if (!formData.reservationDate || !normalizedTime) {
      toast.error(UI_TEXT.RESERVATION.VALIDATION_REQUIRED_DATE_TIME);
      return;
    }

    const reservationDateTime = new Date(`${formData.reservationDate}T${normalizedTime}`);

    if (Number.isNaN(reservationDateTime.getTime())) {
      toast.error(UI_TEXT.RESERVATION.VALIDATION_REQUIRED_DATE_TIME);
      return;
    }

    const leadMinutes = (reservationDateTime.getTime() - Date.now()) / (1000 * 60);
    if (leadMinutes < MIN_LEAD_TIME_MINUTES) {
      toast.error(UI_TEXT.RESERVATION.VALIDATION_MIN_LEAD_TIME);
      return;
    }

    const minutesOfDay = reservationDateTime.getHours() * 60 + reservationDateTime.getMinutes();
    if (minutesOfDay < OPEN_TIME_MINUTES || minutesOfDay > LAST_BOOKING_MINUTES) {
      toast.error(UI_TEXT.RESERVATION.VALIDATION_WITHIN_OPERATING_HOURS);
      return;
    }

    try {
      setLoading(true);
      const res = await reservationService.createReservation({
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        reservationDate: formData.reservationDate,
        reservationTime: normalizedTime,
        guestCount: Number(formData.guestCount),
        partyType: formData.partyType,
        areaId: formData.areaId === "all" ? undefined : formData.areaId,
      });

      if (res.isSuccess) {
        onOpenChange(false);
        // Reset form to initial state
        setFormData({
          customerName: "",
          customerPhone: "",
          reservationDate: "",
          reservationTime: "",
          guestCount: 2,
          partyType: "normal",
          areaId: "all",
        });
        if (onSuccess) onSuccess();
        toast.success(UI_TEXT.COMMON.UPDATE_SUCCESS);
      } else {
        // Log business error from API
        console.error("[CreateReservation] API Error:", res.error || res.message);
        toast.error(res.message || res.error || UI_TEXT.RESERVATION.ERROR_CREATE_FAILED);
      }
    } catch (error: unknown) {
      // Log technical error (e.g. connection timeout)
      console.error("[CreateReservation] Connection Error:", error);
      const errorMessage =
        error instanceof Error ? error.message : UI_TEXT.RESERVATION.ERROR_CONNECTION;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const guestCountValue = Number(formData.guestCount) || 0;
  const requiresVipArea = guestCountValue > VIP_GUEST_THRESHOLD;

  useEffect(() => {
    if (requiresVipArea && formData.areaId !== "all") {
      const selectedArea = areas.find((a) => a.areaId === formData.areaId);
      if (selectedArea && selectedArea.type !== AreaType.VIP) {
        setFormData((prev) => ({ ...prev, areaId: "all" }));
        toast.info(UI_TEXT.RESERVATION.VALIDATION_VIP_REQUIRED);
      }
    }
  }, [requiresVipArea, formData.areaId, areas]);

  const filteredAreas = requiresVipArea ? areas.filter((a) => a.type === AreaType.VIP) : areas;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-500px">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{UI_TEXT.RESERVATION.CREATE_DIALOG_TITLE}</DialogTitle>
            <DialogDescription>
              {UI_TEXT.RESERVATION.CREATE_DIALOG_DESC}
              {requiresVipArea && (
                <div className="mt-2 text-amber-600 font-medium text-sm flex items-center gap-1">
                  {UI_TEXT.RESERVATION.VALIDATION_VIP_REQUIRED}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">
                  {UI_TEXT.RESERVATION.FIELD_CUSTOMER_NAME}{" "}
                  <span className="text-red-500">{UI_TEXT.RESERVATION.REQUIRED_MARK}</span>
                </Label>
                <Input
                  id="name"
                  name="customerName"
                  placeholder={UI_TEXT.RESERVATION.FIELD_CUSTOMER_NAME_PLACEHOLDER}
                  className="col-span-3"
                  value={formData.customerName}
                  onChange={(e) => handleChange("customerName", e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">
                  {UI_TEXT.RESERVATION.FIELD_PHONE}{" "}
                  <span className="text-red-500">{UI_TEXT.RESERVATION.REQUIRED_MARK}</span>
                </Label>
                <Input
                  id="phone"
                  name="customerPhone"
                  placeholder={UI_TEXT.RESERVATION.FIELD_PHONE_PLACEHOLDER}
                  className="col-span-3"
                  value={formData.customerPhone}
                  onChange={(e) => handleChange("customerPhone", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="date">
                  {UI_TEXT.RESERVATION.FIELD_DATE}{" "}
                  <span className="text-red-500">{UI_TEXT.RESERVATION.REQUIRED_MARK}</span>
                </Label>
                <Input
                  id="date"
                  name="reservationDate"
                  type="date"
                  className="col-span-3"
                  value={formData.reservationDate}
                  onChange={(e) => handleChange("reservationDate", e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="time">
                  {UI_TEXT.RESERVATION.FIELD_TIME}{" "}
                  <span className="text-red-500">{UI_TEXT.RESERVATION.REQUIRED_MARK}</span>
                </Label>
                <Input
                  id="time"
                  name="reservationTime"
                  type="time"
                  className="col-span-3"
                  value={formData.reservationTime}
                  onChange={(e) => handleChange("reservationTime", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="people">
                  {UI_TEXT.RESERVATION.FIELD_PEOPLE_COUNT}{" "}
                  <span className="text-red-500">{UI_TEXT.RESERVATION.REQUIRED_MARK}</span>
                </Label>
                <Input
                  id="people"
                  name="guestCount"
                  type="number"
                  min="1"
                  className="col-span-3"
                  value={formData.guestCount}
                  onChange={(e) => handleChange("guestCount", e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="partyType">{UI_TEXT.RESERVATION.FIELD_PARTY_TYPE}</Label>
                <Select
                  name="partyType"
                  value={formData.partyType}
                  onValueChange={(val) => handleChange("partyType", val)}
                >
                  <SelectTrigger id="partyType">
                    <SelectValue placeholder={UI_TEXT.RESERVATION.PLACEHOLDER_PARTY_TYPE} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">{UI_TEXT.RESERVATION.PARTY_TYPE_NORMAL}</SelectItem>
                    <SelectItem value="birthday">
                      {UI_TEXT.RESERVATION.PARTY_TYPE_BIRTHDAY}
                    </SelectItem>
                    <SelectItem value="anniversary">
                      {UI_TEXT.RESERVATION.PARTY_TYPE_ANNIVERSARY}
                    </SelectItem>
                    <SelectItem value="corporate">
                      {UI_TEXT.RESERVATION.PARTY_TYPE_CORPORATE}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="area">{UI_TEXT.RESERVATION.FIELD_AREA}</Label>
              <Select
                name="areaId"
                value={formData.areaId}
                onValueChange={(val) => handleChange("areaId", val)}
              >
                <SelectTrigger id="area">
                  <SelectValue placeholder={UI_TEXT.RESERVATION.PLACEHOLDER_AREA} />
                </SelectTrigger>
                <SelectContent>
                  {!requiresVipArea && (
                    <SelectItem value="all">{UI_TEXT.RESERVATION.AREA_ANY}</SelectItem>
                  )}
                  {filteredAreas.map((a) => (
                    <SelectItem key={a.areaId} value={a.areaId}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {UI_TEXT.COMMON.CANCEL}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? UI_TEXT.RESERVATION.BTN_SAVING : UI_TEXT.COMMON.SAVE}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

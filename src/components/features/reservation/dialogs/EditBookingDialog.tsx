import { Info } from "lucide-react";
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
import { ReservationDto, reservationService } from "@/services/reservationService";
import { tableService } from "@/services/tableService";
import { Area, AreaStatus, AreaType } from "@/types/Table-Layout";

interface EditBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingData?: ReservationDto | null;
  onSuccess?: () => void;
}

const VIP_GUEST_THRESHOLD = RESERVATION_RULES.VIP_MIN_GUEST_COUNT;

export const EditBookingDialog = ({
  open,
  onOpenChange,
  bookingData,
  onSuccess,
}: EditBookingDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    reservationDate: "",
    reservationTime: "",
    guestCount: 2,
    partyType: "normal",
    areaId: "all",
  });
  const [areas, setAreas] = useState<Area[]>([]);
  const guestCountValue = Number(formData.guestCount) || 0;
  const requiresVipArea = guestCountValue > VIP_GUEST_THRESHOLD;

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await tableService.getAreas();
        if (res.isSuccess) setAreas(res.data.filter((a) => a.status === AreaStatus.Active));
      } catch (err) {
        console.error("Failed to fetch areas:", err);
      }
    };
    if (open) fetchAreas();
  }, [open]);

  useEffect(() => {
    if (bookingData) {
      setFormData({
        customerName: bookingData.customerName || "",
        customerPhone: bookingData.phone || "", // Note: API uses 'phone' in DTO
        reservationDate: bookingData.date || "",
        reservationTime: bookingData.time || "",
        guestCount: bookingData.people || 2,
        partyType: bookingData.partyType?.toLowerCase() || "normal",
        areaId: bookingData.area || "all",
      });
    }
  }, [bookingData, open]);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingData?.id) return;

    try {
      setLoading(true);
      const res = await reservationService.updateReservation(bookingData.id, {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        reservationDate: formData.reservationDate,
        reservationTime:
          formData.reservationTime.includes(":") && formData.reservationTime.split(":").length === 2
            ? formData.reservationTime + ":00"
            : formData.reservationTime,
        guestCount: Number(formData.guestCount),
        partyType: formData.partyType,
        areaId: formData.areaId === "all" ? undefined : formData.areaId,
      });

      if (res.isSuccess) {
        toast.success(UI_TEXT.COMMON.UPDATE_SUCCESS);
        onOpenChange(false);
        if (onSuccess) onSuccess();
      } else {
        console.error("[EditBooking] API Error:", res.error || res.message);
        toast.error(res.message || res.error || UI_TEXT.RESERVATION.ERROR_SAVE_FAILED);
      }
    } catch (error: unknown) {
      console.error("[EditBooking] Connection Error:", error);
      toast.error((error as Error).message || UI_TEXT.RESERVATION.ERROR_CONNECTION);
    } finally {
      setLoading(false);
    }
  };

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
      <DialogContent className="sm:max-w-125">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{UI_TEXT.RESERVATION.EDIT_DIALOG_TITLE}</DialogTitle>
            <DialogDescription>
              {UI_TEXT.RESERVATION.EDIT_DIALOG_DESC || "Chỉnh sửa thông tin đơn đặt bàn hiện tại."}
              {requiresVipArea && (
                <div className="mt-2 text-amber-600 font-medium text-sm flex items-center gap-1">
                  <Info /> {UI_TEXT.RESERVATION.VALIDATION_VIP_REQUIRED}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-name">
                  {UI_TEXT.RESERVATION.FIELD_CUSTOMER_NAME}{" "}
                  <span className="text-red-500">{UI_TEXT.RESERVATION.REQUIRED_MARK}</span>
                </Label>
                <Input
                  id="edit-name"
                  value={formData.customerName}
                  onChange={(e) => handleChange("customerName", e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-phone">
                  {UI_TEXT.RESERVATION.FIELD_PHONE}{" "}
                  <span className="text-red-500">{UI_TEXT.RESERVATION.REQUIRED_MARK}</span>
                </Label>
                <Input
                  id="edit-phone"
                  value={formData.customerPhone}
                  onChange={(e) => handleChange("customerPhone", e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-date">
                  {UI_TEXT.RESERVATION.FIELD_DATE}{" "}
                  <span className="text-red-500">{UI_TEXT.RESERVATION.REQUIRED_MARK}</span>
                </Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={formData.reservationDate}
                  onChange={(e) => handleChange("reservationDate", e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-time">
                  {UI_TEXT.RESERVATION.FIELD_TIME}{" "}
                  <span className="text-red-500">{UI_TEXT.RESERVATION.REQUIRED_MARK}</span>
                </Label>
                <Input
                  id="edit-time"
                  type="time"
                  value={formData.reservationTime}
                  onChange={(e) => handleChange("reservationTime", e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-people">
                  {UI_TEXT.RESERVATION.FIELD_PEOPLE_COUNT}{" "}
                  <span className="text-red-500">{UI_TEXT.RESERVATION.REQUIRED_MARK}</span>
                </Label>
                <Input
                  id="edit-people"
                  type="number"
                  min="1"
                  value={formData.guestCount}
                  onChange={(e) => handleChange("guestCount", e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-partyType">{UI_TEXT.RESERVATION.FIELD_PARTY_TYPE}</Label>
                <Select
                  value={formData.partyType}
                  onValueChange={(val) => handleChange("partyType", val)}
                >
                  <SelectTrigger id="edit-partyType">
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
              <Label htmlFor="edit-area">{UI_TEXT.RESERVATION.FIELD_AREA}</Label>
              <Select value={formData.areaId} onValueChange={(val) => handleChange("areaId", val)}>
                <SelectTrigger id="edit-area">
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

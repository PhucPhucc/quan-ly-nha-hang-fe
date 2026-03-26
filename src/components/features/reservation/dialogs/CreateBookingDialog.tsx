"use client";

import React from "react";

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
import { UI_TEXT } from "@/lib/UI_Text";

import { useCreateBooking } from "./useCreateBooking";

interface CreateBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const CreateBookingDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: CreateBookingDialogProps) => {
  const { loading, formData, areas, timeSlots, requiresVipArea, handleChange, handleSubmit } =
    useCreateBooking(open, onOpenChange, onSuccess);

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
                  placeholder={UI_TEXT.RESERVATION.FIELD_CUSTOMER_NAME_PLACEHOLDER}
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
                  placeholder={UI_TEXT.RESERVATION.FIELD_PHONE_PLACEHOLDER}
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
                  type="date"
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
                <Select
                  value={formData.reservationTime}
                  onValueChange={(val) => handleChange("reservationTime", val)}
                >
                  <SelectTrigger id="time">
                    <SelectValue placeholder={UI_TEXT.RESERVATION.FIELD_TIME} />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    sideOffset={4}
                    className="max-h-[300px] w-[var(--radix-select-trigger-width)]"
                  >
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  type="number"
                  min="1"
                  value={formData.guestCount}
                  onChange={(e) => handleChange("guestCount", e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="partyType">{UI_TEXT.RESERVATION.FIELD_PARTY_TYPE}</Label>
                <Select
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
              <Select value={formData.areaId} onValueChange={(val) => handleChange("areaId", val)}>
                <SelectTrigger id="area">
                  <SelectValue placeholder={UI_TEXT.RESERVATION.PLACEHOLDER_AREA} />
                </SelectTrigger>
                <SelectContent>
                  {!requiresVipArea && (
                    <SelectItem value="all">{UI_TEXT.RESERVATION.AREA_ANY}</SelectItem>
                  )}
                  {areas.map((a) => (
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

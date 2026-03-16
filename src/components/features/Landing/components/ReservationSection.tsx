"use client";

import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ArrowRight, CalendarDays, CheckCircle2, Loader2, MapPin, Phone, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useReservation } from "@/hooks/use-reservation";
import { useReservationSlots } from "@/hooks/use-reservation-slots";
import { UI_TEXT } from "@/lib/UI_Text";

export function ReservationSection() {
  const { RESERVATION } = UI_TEXT.LANDING;

  const {
    date,
    setDate,
    selectedTime,
    setSelectedTime,
    formData,
    updateField,
    isLoading,
    handleSubmit,
    areas,
  } = useReservation(new Date());

  const timeSlots = useReservationSlots(date);

  return (
    <section id="reservation-form" className="py-24 bg-background scroll-mt-24 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-32">
            <div className="space-y-4">
              <h3 className="text-primary font-bold uppercase tracking-widest text-sm">
                {RESERVATION.SUBTITLE}
              </h3>
              <h2 className="text-5xl md:text-6xl font-black leading-[1.1] tracking-tighter">
                {RESERVATION.TITLE_MAIN} <br />
                <span className="text-primary font-serif">{RESERVATION.TITLE_ITALIC}</span>{" "}
                {RESERVATION.TITLE_SUFFIX}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                {RESERVATION.DESCRIPTION}
              </p>
            </div>

            <div className="flex items-center gap-4 group pt-4">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary transition-colors">
                <Phone className="h-5 w-5 group-hover:text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  {RESERVATION.HOTLINE_LABEL}
                </p>
                <p className="font-bold text-xl">{RESERVATION.HOTLINE_NUMBER}</p>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI - FORM CHI TIẾT */}
          <div className="lg:col-span-7 bg-card rounded-[2.5rem] p-8 md:p-12 border shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
              {/* Họ tên */}
              <div className="space-y-2.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">
                  {RESERVATION.FORM.NAME_LABEL}
                </Label>
                {/* Thay absolute bằng flex items-center */}
                <div className="flex items-center group border-b-2 border-border/50 focus-within:border-primary transition-colors pb-1">
                  <User className="h-5 w-5 text-muted-foreground shrink-0" />
                  <Input
                    value={formData.customerName}
                    onChange={(e) => updateField("customerName", e.target.value)}
                    placeholder={RESERVATION.FORM.NAME_PLACEHOLDER}
                    className="border-0 pl-3 bg-transparent focus-visible:ring-0 text-lg font-medium h-10"
                  />
                </div>
              </div>

              {/* Số điện thoại (tương tự) */}
              <div className="space-y-2.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">
                  {RESERVATION.FORM.PHONE_LABEL}
                </Label>
                <div className="flex items-center group border-b-2 border-border/50 focus-within:border-primary transition-colors pb-1">
                  <Phone className="h-5 w-5 text-muted-foreground shrink-0" />
                  <Input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => updateField("customerPhone", e.target.value)}
                    placeholder={RESERVATION.FORM.PHONE_PLACEHOLDER}
                    className="border-0 pl-3 bg-transparent focus-visible:ring-0 text-lg font-medium h-10"
                  />
                </div>
              </div>

              {/* Trường NGÀY DÙNG BỮA */}
              <div className="space-y-2.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">
                  {RESERVATION.FORM.DATE_LABEL}
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    {/* Thêm cursor-pointer và đồng nhất border/height */}
                    <div className="flex items-center gap-3 border-b-2 border-border/50 hover:border-primary transition-colors h-11 pb-1 cursor-pointer">
                      <CalendarDays className="h-5 w-5 text-muted-foreground shrink-0" />
                      <span className="text-lg font-medium leading-none truncate">
                        {date
                          ? format(date, "PPP", { locale: vi })
                          : RESERVATION.FORM.DATE_PICKER_EMPTY}
                      </span>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Trường GIỜ NHẬN BÀN */}
              <div className="space-y-2.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">
                  {RESERVATION.FORM.TIME_LABEL}
                </Label>
                <Select
                  value={selectedTime}
                  onValueChange={setSelectedTime}
                  disabled={timeSlots.length === 0}
                >
                  <SelectTrigger className="flex items-center gap-3 border-0 border-b-2 border-border/50 rounded-none px-0 h-11 pb-1 bg-transparent focus:ring-0 focus:border-primary transition-colors shadow-none">
                    <CheckCircle2 className="h-5 w-5 text-muted-foreground shrink-0" />
                    <div className="text-lg font-medium">
                      <SelectValue
                        placeholder={
                          timeSlots.length > 0
                            ? RESERVATION.FORM.TIME_PLACEHOLDER
                            : RESERVATION.FORM.TIME_EMPTY
                        }
                      />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">
                  {RESERVATION.FORM.AREA_LABEL}
                </Label>
                <Select value={formData.areaId} onValueChange={(val) => updateField("areaId", val)}>
                  <SelectTrigger className="rounded-xl border-border/50 bg-background">
                    <MapPin className="mr-2 h-4 w-4 text-primary" />
                    <SelectValue placeholder={RESERVATION.FORM.AREA_PLACEHOLDER} />
                  </SelectTrigger>

                  <SelectContent>
                    {areas && areas.length > 0 ? (
                      areas.map((area) => (
                        <SelectItem key={area.areaId} value={area.areaId}>
                          {area.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="loading" disabled></SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">
                  {RESERVATION.FORM.GUESTS_LABEL}
                </Label>
                <div className="flex items-center group border-b-2 border-border/50 focus-within:border-primary transition-colors pb-1">
                  <User className="h-5 w-5 text-muted-foreground shrink-0" />
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    value={formData.guestCount}
                    onChange={(e) => updateField("guestCount", parseInt(e.target.value) || 1)}
                    placeholder="Số người"
                    className="border-0 pl-3 bg-transparent focus-visible:ring-0 text-lg font-medium h-10"
                  />
                </div>
              </div>
              <div className="md:col-span-2 space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">
                  {RESERVATION.FORM.NOTE_LABEL}
                </Label>
                <Textarea
                  value={formData.note}
                  onChange={(e) => updateField("note", e.target.value)}
                  placeholder={RESERVATION.FORM.NOTE_PLACEHOLDER}
                  className="rounded-2xl min-h-[100px]"
                />
                <p
                  className={`text-xs text-right ${
                    formData.note.length > 180 ? "text-destructive" : "text-muted-foreground"
                  }`}
                >
                  {formData.note.length}
                </p>
              </div>

              {/* Nút xác nhận */}
              <div className="md:col-span-2 pt-4">
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={isLoading || timeSlots.length === 0}
                  className="w-full h-16 rounded-2xl text-lg font-black tracking-widest group uppercase shadow-xl shadow-primary/20"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : timeSlots.length > 0 ? (
                    RESERVATION.FORM.SUBMIT_BUTTON
                  ) : (
                    RESERVATION.FORM.SUBMIT_DISABLED
                  )}
                  {!isLoading && (
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  )}
                </Button>
                <p className="text-center text-[10px] text-muted-foreground mt-8 uppercase tracking-widest">
                  {RESERVATION.FORM.FOOTER_NOTE}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

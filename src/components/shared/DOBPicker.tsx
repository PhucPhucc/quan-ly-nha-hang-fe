"use client";
import React, { useEffect } from "react";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useBrandingFormatter } from "@/lib/branding-formatting";
import { UI_TEXT } from "@/lib/UI_Text";

import { Button } from "../ui/button";
import { Field } from "../ui/field";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const DOBPicker = ({ dob }: { dob: string | undefined }) => {
  const { formatDate } = useBrandingFormatter();
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  useEffect(() => {
    if (!dob) {
      return;
    }

    if (dob) {
      const d = new Date(dob);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDate(isNaN(d.getTime()) ? undefined : d);
    }
  }, [dob]);

  // Handle date selection
  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setOpen(false);
  };

  const formattedDate = date
    ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    : "";

  return (
    <Field className="">
      <Label htmlFor="date">{UI_TEXT.EMPLOYEE.DOB}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="justify-start font-normal border-input w-full"
          >
            {date ? formatDate(date) : "Select date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            defaultMonth={date}
            captionLayout="dropdown"
            fromYear={1900}
            toYear={new Date().getFullYear()}
            onSelect={handleSelect}
          />
        </PopoverContent>
      </Popover>
      <Input type="hidden" name="dateOfBirth" value={formattedDate} />
    </Field>
  );
};

export default DOBPicker;

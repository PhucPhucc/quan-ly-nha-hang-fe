"use client";
import React, { useEffect } from "react";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useBrandingFormatter } from "@/lib/branding-formatting";
import { UI_TEXT } from "@/lib/UI_Text";

import { Button } from "../ui/button";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

const DOBPicker = ({
  dob,
  onChange,
}: {
  dob: string | undefined;
  onChange?: (date: string) => void;
}) => {
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
    if (onChange) {
      const formatted = selectedDate
        ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
        : "";
      onChange(formatted);
    }
  };

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);

  const formattedDate = date
    ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    : "";

  return (
    <Field className="">
      <FieldLabel htmlFor="date">{UI_TEXT.EMPLOYEE.DOB}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="justify-start items-baseline font-normal border-input w-full bg-card text-card-foreground"
          >
            {date ? formatDate(date) : "Select date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            defaultMonth={date || maxDate}
            captionLayout="dropdown"
            fromYear={1900}
            toYear={maxDate.getFullYear()}
            disabled={(d) => d > maxDate}
            onSelect={handleSelect}
          />
        </PopoverContent>
      </Popover>
      <Input type="hidden" name="dateOfBirth" value={formattedDate} />
    </Field>
  );
};

export default DOBPicker;

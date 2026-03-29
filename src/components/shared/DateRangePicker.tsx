"use client";

import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useBrandingFormatter } from "@/lib/branding-formatting";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (date: DateRange | undefined) => void;
  className?: string;
  numberOfMonths?: number;
  yearRange?: {
    from: number;
    to: number;
  };
}

export function DateRangePicker({
  value,
  onChange,
  className,
  numberOfMonths = 2,
  yearRange,
}: DateRangePickerProps) {
  const { formatDate } = useBrandingFormatter();
  const today = new Date();
  const fromYear = yearRange?.from ?? today.getFullYear() - 5;
  const toYear = yearRange?.to ?? today.getFullYear() + 5;

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-65 justify-start text-left font-normal bg-card border-border hover:bg-muted/50 transition-all rounded-lg",
              !value && "text-card-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
            {value?.from ? (
              value.to ? (
                <>
                  {formatDate(value.from)} {UI_TEXT.COMMON.HYPHEN} {formatDate(value.to)}
                </>
              ) : (
                formatDate(value.from)
              )
            ) : (
              <span>{UI_TEXT.COMMON.SELECT_DATE_RANGE}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={onChange}
            numberOfMonths={numberOfMonths}
            captionLayout={numberOfMonths === 1 ? "dropdown" : "label"}
            fromYear={fromYear}
            toYear={toYear}
            className="rounded-xl shadow-2xl bg-background"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

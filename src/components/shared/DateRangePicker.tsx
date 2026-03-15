"use client";

import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar as CalendarIcon, X } from "lucide-react";
import * as React from "react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  className?: string;
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
}

export function DateRangePicker({
  className,
  value,
  onChange,
  placeholder = "Chọn khoảng ngày",
}: DateRangePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "h-11 justify-start text-left font-normal rounded-2xl bg-slate-50 border-slate-100 hover:bg-slate-100/50 transition-colors",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "dd/MM/yyyy", { locale: vi })} {UI_TEXT.COMMON.HYPHEN}
                  {format(value.to, "dd/MM/yyyy", { locale: vi })}
                </>
              ) : (
                format(value.from, "dd/MM/yyyy", { locale: vi })
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 rounded-2xl border-slate-100 shadow-xl" align="start">
          <div className="p-3 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <span className="text-sm font-semibold text-slate-700">
              {UI_TEXT.COMMON.SELECT_TIME}
            </span>
            {value && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs text-slate-500 hover:text-destructive hover:bg-destructive/10 rounded-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange?.(undefined);
                }}
              >
                <X className="h-3 w-3 mr-1" />
                {UI_TEXT.COMMON.CLEAR_FILTER}
              </Button>
            )}
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={onChange}
            numberOfMonths={2}
            locale={vi}
            className="p-3"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

import { Filter } from "lucide-react";
import React from "react";
import { DateRange } from "react-day-picker";

import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UI_TEXT } from "@/lib/UI_Text";

interface AttendanceFilterProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  employeeSearch: string;
  onEmployeeSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onFilter: () => void;
}

const AttendanceFilter = ({
  dateRange,
  onDateRangeChange,
  employeeSearch,
  onEmployeeSearchChange,
  statusFilter,
  onStatusFilterChange,
  onFilter,
}: AttendanceFilterProps) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-background rounded-xl w-full">
      <div className="flex flex-1 flex-wrap items-center justify-start gap-3 w-full">
        <div className=" ">
          <DateRangePicker
            value={dateRange}
            onChange={onDateRangeChange}
            className="w-full rounded-lg"
          />
        </div>

        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="flex-1">
            <div className="relative group">
              <Input
                placeholder={UI_TEXT.ATTENDANCE.FILTER_ALL_EMPLOYEES}
                value={employeeSearch}
                onChange={(e) => onEmployeeSearchChange(e.target.value)}
                className="pl-10 bg-card border text-[13px] rounded-lg focus-visible:ring-primary/20 shadow-sm transition-all "
              />
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground group-focus-within:text-primary transition-colors" />
            </div>
          </div>

          <div className="w-24">
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="bg-card border flex items-center text-sm rounded-lg text-card-foreground shadow-sm transition-all focus:ring-primary/20 ">
                <SelectValue placeholder={UI_TEXT.ATTENDANCE.FILTER_ALL} />
              </SelectTrigger>
              <SelectContent className="rounded-lg border shadow-xl">
                <SelectItem value="all">{UI_TEXT.ATTENDANCE.FILTER_ALL}</SelectItem>
                <SelectItem value="ontime">{UI_TEXT.ATTENDANCE.STATUS_ON_TIME}</SelectItem>
                <SelectItem value="late">{UI_TEXT.ATTENDANCE.STATUS_LATE}</SelectItem>
                <SelectItem value="earlyleave">{UI_TEXT.ATTENDANCE.STATUS_EARLY_LEAVE}</SelectItem>
                <SelectItem value="absent">{UI_TEXT.ATTENDANCE.STATUS_ABSENT}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Button
        onClick={onFilter}
        className="rounded-lg"
        // className="shrink-0 rounded-lg bg-primary hover:bg-primary/90 text-white px-8 shadow-lg shadow-primary/20 transition-all active:scale-95  w-full lg:w-auto"
      >
        <Filter className="size-4 mr-2" />
        {UI_TEXT.ATTENDANCE.FILTER_BUTTON}
      </Button>
    </div>
  );
};

export default AttendanceFilter;

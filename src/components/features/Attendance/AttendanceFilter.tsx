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
    <div className="flex flex-col xl:flex-row items-end gap-2 w-full">
      <div className="space-y-1.5 flex-1 w-full xl:w-auto">
        <DateRangePicker value={dateRange} onChange={onDateRangeChange} className="w-full" />
      </div>

      <div className="space-y-1.5 flex-1 min-w-[200px] w-full xl:w-auto">
        <div className="relative group">
          <Input
            placeholder={UI_TEXT.ATTENDANCE.FILTER_ALL_EMPLOYEES}
            value={employeeSearch}
            onChange={(e) => onEmployeeSearchChange(e.target.value)}
            className="h-11 pl-10 rounded-2xl bg-slate-50/80 border-slate-100 focus-visible:ring-primary/20 focus-visible:bg-white transition-all font-medium text-sm"
          />
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-primary transition-colors" />
        </div>
      </div>

      <div className="space-y-1.5 w-full xl:w-48">
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="h-11 rounded-2xl bg-slate-50/80 border-slate-100 focus:ring-primary/20 font-medium text-slate-600">
            <SelectValue placeholder={UI_TEXT.ATTENDANCE.FILTER_ALL} />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-slate-100 shadow-xl p-1">
            <SelectItem value="all" className="rounded-xl">
              {UI_TEXT.ATTENDANCE.FILTER_ALL}
            </SelectItem>
            <SelectItem value="ontime" className="rounded-xl">
              {UI_TEXT.ATTENDANCE.STATUS_ON_TIME}
            </SelectItem>
            <SelectItem value="late" className="rounded-xl">
              {UI_TEXT.ATTENDANCE.STATUS_LATE}
            </SelectItem>
            <SelectItem value="earlyleave" className="rounded-xl">
              {UI_TEXT.ATTENDANCE.STATUS_EARLY_LEAVE}
            </SelectItem>
            <SelectItem value="absent" className="rounded-xl">
              {UI_TEXT.ATTENDANCE.STATUS_ABSENT}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={onFilter}
        className="bg-[#cc0000] hover:bg-[#aa0000] text-white h-11 px-8 rounded-2xl font-bold shadow-lg shadow-red-100 gap-2 w-full xl:w-auto transition-all active:scale-[0.98]"
      >
        <Filter className="size-4" />
        {UI_TEXT.ATTENDANCE.FILTER_BUTTON}
      </Button>
    </div>
  );
};

export default AttendanceFilter;

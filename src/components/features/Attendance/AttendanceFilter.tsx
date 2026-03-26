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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">
          {UI_TEXT.ATTENDANCE.FILTER_DATE}
        </label>
        <DateRangePicker value={dateRange} onChange={onDateRangeChange} />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">
          {UI_TEXT.ATTENDANCE.FILTER_EMPLOYEE}
        </label>
        <Input
          placeholder={UI_TEXT.ATTENDANCE.FILTER_ALL_EMPLOYEES}
          value={employeeSearch}
          onChange={(e) => onEmployeeSearchChange(e.target.value)}
          className="h-11 rounded-2xl bg-slate-50 border-slate-100"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">
          {UI_TEXT.ATTENDANCE.FILTER_STATUS}
        </label>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="h-11 rounded-2xl bg-slate-50 border-slate-100">
            <SelectValue placeholder={UI_TEXT.ATTENDANCE.FILTER_ALL} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{UI_TEXT.ATTENDANCE.FILTER_ALL}</SelectItem>
            <SelectItem value="ontime">{UI_TEXT.ATTENDANCE.STATUS_ON_TIME}</SelectItem>
            <SelectItem value="late">{UI_TEXT.ATTENDANCE.STATUS_LATE}</SelectItem>
            <SelectItem value="earlyleave">{UI_TEXT.ATTENDANCE.STATUS_EARLY_LEAVE}</SelectItem>
            <SelectItem value="absent">{UI_TEXT.ATTENDANCE.STATUS_ABSENT}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={onFilter}
        className="bg-[#cc0000] hover:bg-[#aa0000] text-white h-11 rounded-2xl font-bold shadow-md shadow-red-100 gap-2 w-full transition-all active:scale-[0.98]"
      >
        <Filter className="size-4" />
        {UI_TEXT.ATTENDANCE.FILTER_BUTTON}
      </Button>
    </div>
  );
};

export default AttendanceFilter;

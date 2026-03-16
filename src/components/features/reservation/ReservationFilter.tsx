import { CalendarIcon, RotateCw, Search } from "lucide-react";
import { useEffect, useState } from "react";

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
import { tableService } from "@/services/tableService";
import { Area } from "@/types/Table-Layout";

import { CreateBookingDialog } from "./dialogs/CreateBookingDialog";

interface ReservationFilterProps {
  search: string;
  onSearchChange: (val: string) => void;
  date: string;
  onDateChange: (val: string) => void;
  area: string;
  onAreaChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
  onReset: () => void;
  onRefresh?: () => void;
}

export const ReservationFilter = ({
  search,
  onSearchChange,
  date,
  onDateChange,
  area,
  onAreaChange,
  status,
  onStatusChange,
  onReset,
  onRefresh,
}: ReservationFilterProps) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [areas, setAreas] = useState<Area[]>([]);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await tableService.getAreas();
        if (res.isSuccess) {
          setAreas(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch areas:", err);
      }
    };
    fetchAreas();
  }, []);

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-end justify-between">
        <div className="flex flex-1 flex-wrap gap-3 w-full items-end">
          <div className="flex-1 min-w-[280px] max-w-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={UI_TEXT.RESERVATION.SEARCH_PLACEHOLDER}
                className="pl-10 h-11 bg-white border-gray-200 text-[13px] rounded-full focus-visible:ring-primary/20 shadow-sm"
              />
            </div>
          </div>

          <div className="w-[180px]">
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="date"
                value={date}
                onChange={(e) => onDateChange(e.target.value)}
                className="pl-10 h-11 bg-white border-gray-200 text-[13px] rounded-full text-slate-600 focus-visible:ring-primary/20 shadow-sm"
              />
            </div>
          </div>

          <div className="w-[160px]">
            <Select value={area} onValueChange={onAreaChange}>
              <SelectTrigger className="h-11 bg-white border-gray-200 text-[13px] rounded-full text-slate-600 shadow-sm">
                <SelectValue placeholder={UI_TEXT.RESERVATION.AREA_FILTER} />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">{UI_TEXT.RESERVATION.ALL_AREAS}</SelectItem>
                {areas.map((a) => (
                  <SelectItem key={a.areaId} value={a.areaId}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-[160px]">
            <Select value={status} onValueChange={onStatusChange}>
              <SelectTrigger className="h-11 bg-white border-gray-200 text-[13px] rounded-full text-slate-600 shadow-sm">
                <SelectValue placeholder={UI_TEXT.RESERVATION.STATUS_FILTER} />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">{UI_TEXT.RESERVATION.ALL_STATUSES}</SelectItem>
                <SelectItem value="booked">{UI_TEXT.RESERVATION.STATUS_FILTER_BOOKED}</SelectItem>
                <SelectItem value="checked_in">
                  {UI_TEXT.RESERVATION.STATUS_FILTER_ARRIVED}
                </SelectItem>
                <SelectItem value="cancelled">
                  {UI_TEXT.RESERVATION.STATUS_FILTER_CANCELLED}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={onReset}
            variant="outline"
            size="icon"
            className="h-11 w-11 shrink-0 rounded-full border-gray-200 text-slate-500 hover:text-primary hover:bg-orange-50 transition-colors shadow-sm"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>

        <Button
          className="h-11 shrink-0 bg-primary hover:bg-primary/90 text-white font-bold rounded-full px-6 shadow-sm shadow-orange-200/50"
          onClick={() => setIsCreateOpen(true)}
        >
          <span className="text-lg leading-none mr-2 font-light">{"+"}</span>{" "}
          {UI_TEXT.RESERVATION.CREATE_BTN}
        </Button>
      </div>

      <CreateBookingDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={onRefresh}
      />
    </div>
  );
};

import { CalendarIcon, Plus, RotateCw, Search } from "lucide-react";
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
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-background p-2.5 rounded-2xl border">
        <div className="flex flex-1 flex-wrap items-center gap-3 w-full">
          {/* Search Box */}
          <div className="flex-1 min-w-[280px] max-w-md">
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={UI_TEXT.RESERVATION.SEARCH_PLACEHOLDER}
                className="pl-10 bg-white border text-[13px] rounded-xl focus-visible:ring-primary/20 shadow-sm hover:border-slate-200 transition-all"
              />
            </div>
          </div>

          {/* Filters Group */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-44">
              <div className="relative">
                <CalendarIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => onDateChange(e.target.value)}
                  className="pl-10 bg-white border text-[13px] rounded-full text-slate-600 focus-visible:ring-primary/20 shadow-sm hover:border-slate-200 transition-all cursor-pointer"
                />
              </div>
            </div>

            <div>
              <Select value={area} onValueChange={onAreaChange}>
                <SelectTrigger className="bg-white border text-[13px] rounded-full text-slate-600 shadow-sm hover:border-slate-200 transition-all focus:ring-primary/20">
                  <div className="flex items-center gap-2">
                    <SelectValue placeholder={UI_TEXT.RESERVATION.AREA_FILTER} />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                  <SelectItem value="all">{UI_TEXT.RESERVATION.ALL_AREAS}</SelectItem>
                  {areas.map((a) => (
                    <SelectItem key={a.areaId} value={a.areaId}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={status} onValueChange={onStatusChange}>
                <SelectTrigger className="bg-white border text-[13px] rounded-full text-slate-600 shadow-sm hover:border-slate-200 transition-all focus:ring-primary/20">
                  <SelectValue placeholder={UI_TEXT.RESERVATION.STATUS_FILTER} />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100 shadow-xl">
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
              className="p-2 shrink-0 rounded-full border-white bg-white text-slate-400 hover:text-primary hover:bg-white hover:border-primary/20 transition-all shadow-sm"
              title="Làm mới bộ lọc"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            className="shrink-0 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold px-8 shadow-lg shadow-primary/20 transition-all active:scale-95"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="h-5 w-5 mr-2 stroke-[3px]" />
            {UI_TEXT.RESERVATION.CREATE_BTN}
          </Button>
        </div>
      </div>

      <CreateBookingDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={onRefresh}
      />
    </div>
  );
};

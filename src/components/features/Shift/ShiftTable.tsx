import { Clock, Edit2, MoreHorizontal, Power, Trash2 } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UI_TEXT } from "@/lib/UI_Text";
import { Shift, ShiftStatus } from "@/types/Shift";

interface ShiftTableProps {
  shifts: Shift[];
  onEdit: (shift: Shift) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
  isLoading?: boolean;
}

const ShiftTable = ({ shifts, onEdit, onDelete, onToggleStatus, isLoading }: ShiftTableProps) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden w-full">
      <Table className="min-w-[800px]">
        <TableHeader className="bg-slate-50/50 border-b border-slate-100">
          <TableRow className="border-none hover:bg-transparent">
            <TableHead className="font-semibold text-slate-500 uppercase tracking-wider text-xs py-3 pl-6">
              {UI_TEXT.SHIFT.SHIFT_NAME}
            </TableHead>
            <TableHead className="font-semibold text-slate-500 uppercase tracking-wider text-xs py-3">
              {UI_TEXT.SHIFT.START_TIME}
            </TableHead>
            <TableHead className="font-semibold text-slate-500 uppercase tracking-wider text-xs py-3">
              {UI_TEXT.SHIFT.END_TIME}
            </TableHead>
            <TableHead className="font-semibold text-slate-500 uppercase tracking-wider text-xs py-3">
              {UI_TEXT.SHIFT.STATUS}
            </TableHead>
            <TableHead className="font-semibold text-slate-500 uppercase tracking-wider text-xs py-3 pr-6 text-right">
              {UI_TEXT.COMMON.ACTION}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="h-48 text-center text-slate-400">
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                    {UI_TEXT.COMMON.LOADING}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            <>
              {shifts.map((shift) => (
                <TableRow
                  key={shift.shiftId}
                  className="hover:bg-slate-50/80 transition-all duration-300 border-b border-slate-50 last:border-0 group/row bg-white"
                >
                  <TableCell className="font-medium text-slate-800 text-sm py-3 pl-6">
                    {shift.name}
                  </TableCell>
                  <TableCell className="text-slate-600 font-bold text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="size-4 text-slate-400 group-hover/row:text-primary transition-colors" />
                      {shift.startTime}
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600 font-bold text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="size-4 text-slate-400 group-hover/row:text-primary transition-colors" />
                      {shift.endTime}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Switch
                        checked={shift.status === ShiftStatus.ACTIVE}
                        onCheckedChange={(checked) => onToggleStatus(shift.shiftId, checked)}
                        className="data-[state=checked]:bg-primary"
                      />
                      <span
                        className={`table-pill !py-1.5 !px-3 !text-[9px] ${
                          shift.status === ShiftStatus.ACTIVE
                            ? "table-pill-success"
                            : "table-pill-neutral"
                        }`}
                      >
                        <div
                          className={`table-status-dot ${
                            shift.status === ShiftStatus.ACTIVE ? "table-status-dot-active" : ""
                          }`}
                        />
                        {shift.status === ShiftStatus.ACTIVE
                          ? UI_TEXT.SHIFT.ACTIVE
                          : UI_TEXT.SHIFT.INACTIVE}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-3 pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-xl hover:bg-slate-100 transition-colors"
                        >
                          <MoreHorizontal className="size-5 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-48 p-2 rounded-2xl border-none shadow-2xl ring-1 ring-black/5"
                      >
                        <DropdownMenuItem
                          onClick={() => onEdit(shift)}
                          className="flex items-center gap-3 p-3 cursor-pointer rounded-xl focus:bg-primary/5 focus:text-primary transition-colors group"
                        >
                          <Edit2 className="size-4 text-slate-400 group-focus:text-primary" />
                          <span className="font-bold text-sm">{UI_TEXT.COMMON.EDIT}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            onToggleStatus(shift.shiftId, shift.status !== ShiftStatus.ACTIVE)
                          }
                          className="flex items-center gap-3 p-3 cursor-pointer rounded-xl focus:bg-rose-50 focus:text-rose-600 transition-colors group"
                        >
                          <Power className="size-4 text-slate-400 group-focus:text-rose-500" />
                          <span className="font-bold text-sm text-destructive">
                            {shift.status === ShiftStatus.ACTIVE
                              ? UI_TEXT.SHIFT.INACTIVE
                              : UI_TEXT.SHIFT.ACTIVE}
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(shift.shiftId)}
                          className="flex items-center gap-3 p-3 cursor-pointer rounded-xl focus:bg-rose-50 focus:text-rose-600 transition-colors group"
                        >
                          <Trash2 className="size-4 text-rose-500" />
                          <span className="font-bold text-sm text-destructive">
                            {UI_TEXT.COMMON.DELETE || "Xóa"}
                          </span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {shifts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center bg-slate-50/30">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                        {UI_TEXT.COMMON.EMPTY}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ShiftTable;

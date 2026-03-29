import { Clock, Edit2, List, Power, Trash2 } from "lucide-react";
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
  TableShell,
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
    <TableShell>
      <Table>
        <TableHeader>
          <TableRow variant="header">
            <TableHead className="px-3">{UI_TEXT.SHIFT.SHIFT_NAME}</TableHead>
            <TableHead className="px-3">{UI_TEXT.SHIFT.START_TIME}</TableHead>
            <TableHead className="px-3">{UI_TEXT.SHIFT.END_TIME}</TableHead>
            <TableHead className="px-3">{UI_TEXT.SHIFT.STATUS}</TableHead>
            <TableHead className="px-3 text-right">{UI_TEXT.COMMON.ACTION}</TableHead>
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
                <TableRow key={shift.shiftId} className="group/row">
                  <TableCell>{shift.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="size-4 text-slate-400 group-hover/row:text-primary transition-colors" />
                      <span className="font-medium">{shift.startTime}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="size-4 text-slate-400 group-hover/row:text-primary transition-colors" />
                      <span className="font-medium">{shift.endTime}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Switch
                        checked={shift.status === ShiftStatus.ACTIVE}
                        onCheckedChange={(checked) => onToggleStatus(shift.shiftId, checked)}
                      />
                      <span
                        className={`table-pill font-bold py-1 px-3 ${
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
                  <TableCell className="text-right">
                    <div className="flex justify-end opacity-100 transition-opacity md:opacity-0 md:group-hover/row:opacity-100">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="p-2 hover:bg-muted-foreground/20"
                          >
                            <List className="size-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-32 shadow-2xl text-foreground"
                        >
                          <DropdownMenuItem
                            onClick={() => onEdit(shift)}
                            // className="flex items-center gap-3 cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors"
                          >
                            <Edit2 className="size-4" />
                            <span className="text-sm">{UI_TEXT.COMMON.EDIT}</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              onToggleStatus(shift.shiftId, shift.status !== ShiftStatus.ACTIVE)
                            }
                          >
                            <Power className="size-4" />
                            <span className="text-sm">
                              {shift.status === ShiftStatus.ACTIVE
                                ? UI_TEXT.SHIFT.INACTIVE
                                : UI_TEXT.SHIFT.ACTIVE}
                            </span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDelete(shift.shiftId)}>
                            <Trash2 className="size-4 " />
                            <span className="text-sm">{UI_TEXT.COMMON.DELETE || "Xóa"}</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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
    </TableShell>
  );
};

export default ShiftTable;

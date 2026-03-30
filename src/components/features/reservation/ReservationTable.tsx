import { CheckCircle2, Edit, List, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableShell,
} from "@/components/ui/table";
import { useBrandingFormatter } from "@/lib/branding-formatting";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";

import { CancelBookingDialog } from "./dialogs/CancelBookingDialog";
import { EditBookingDialog } from "./dialogs/EditBookingDialog";
import { StartServingDialog } from "./dialogs/StartServingDialog";

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "BOOKED":
      return (
        <div className="flex items-center text-orange-500 text-[11px] font-medium tracking-tight">
          <div className="size-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)] mr-2" />
          {UI_TEXT.RESERVATION.STATUS_BOOKED}
        </div>
      );
    case "CHECKED_IN":
      return (
        <div className="flex items-center text-emerald-600 text-[11px] font-medium tracking-tight">
          <div className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] mr-2" />
          {UI_TEXT.RESERVATION.STATUS_CHECKED_IN}
        </div>
      );
    case "CANCELLED":
      return (
        <div className="flex items-center text-red-500 text-[11px] font-medium tracking-tight">
          <div className="size-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)] mr-2" />
          {UI_TEXT.RESERVATION.STATUS_CANCELLED}
        </div>
      );
    case "NO_SHOW":
      return (
        <div className="flex items-center text-slate-400 text-[11px] font-medium tracking-tight">
          <div className="size-1.5 rounded-full bg-slate-300 mr-2" />
          {UI_TEXT.RESERVATION.STATUS_NO_SHOW}
        </div>
      );
    default:
      return null;
  }
};

import PaginationTable from "@/components/shared/PaginationTable";
import { ReservationDto } from "@/services/reservationService";

interface ReservationTableProps {
  data: ReservationDto[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRefresh?: () => void;
}

export const ReservationTable = ({
  data,
  currentPage,
  totalPages,
  onPageChange,
  onRefresh,
}: ReservationTableProps) => {
  const { formatDate, formatTime } = useBrandingFormatter();
  const [actionRow, setActionRow] = useState<ReservationDto | null>(null);
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  const handleStartServing = (row: ReservationDto) => {
    setActionRow(row as ReservationDto);
    setIsStartOpen(true);
  };
  const handleEdit = (row: ReservationDto) => {
    setActionRow(row as ReservationDto);
    setIsEditOpen(true);
  };
  const handleCancel = (row: ReservationDto) => {
    setActionRow(row as ReservationDto);
    setIsCancelOpen(true);
  };

  return (
    <div className="relative w-full overflow-hidden flex-1 flex flex-col">
      <div className="flex-1 overflow-auto">
        <TableShell>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{UI_TEXT.RESERVATION.COL_CODE}</TableHead>
                <TableHead>{UI_TEXT.RESERVATION.COL_CUSTOMER}</TableHead>
                <TableHead>{UI_TEXT.RESERVATION.COL_DATETIME}</TableHead>
                <TableHead>{UI_TEXT.RESERVATION.COL_AREA}</TableHead>
                <TableHead>{UI_TEXT.RESERVATION.COL_PEOPLE}</TableHead>
                <TableHead>{UI_TEXT.RESERVATION.COL_STATUS}</TableHead>
                <TableHead className="text-center w-32">
                  {UI_TEXT.RESERVATION.COL_ACTIONS}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                data.map((row) => (
                  <TableRow
                    key={row.id}
                    className={cn(
                      "group transition-all duration-200 border-b border",
                      "hover:bg-muted/50"
                    )}
                  >
                    <TableCell className="text-card-foreground text-sm w-30">{row.code}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-card-foreground text-sm leading-tight">
                          {row.customerName}
                        </span>
                        <span className="text-[11px] text-card-foreground">{row.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-muted-foreground text-sm">
                          {formatDate(row.date)}
                        </span>
                        <span className="text-[11px] text-muted-foreground/70">
                          {formatTime(row.time)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm font-semibold">
                      {row.area}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider bg-orange-50 text-orange-600 border border-orange-100">
                        {row.people}
                      </span>
                    </TableCell>
                    <TableCell className="w-35">
                      <StatusBadge status={row.status} />
                    </TableCell>
                    <TableCell className="text-right pr-6 w-25">
                      <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {row.status === "BOOKED" && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-success hover:bg-success/10 bg-success/15 rounded-full"
                              onClick={() => handleStartServing(row)}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <List className="h-5 w-5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-32">
                                <DropdownMenuItem onClick={() => handleEdit(row)}>
                                  <Edit className="h-4 w-4" />
                                  {UI_TEXT.RESERVATION.ACTION_EDIT}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleCancel(row)}>
                                  <Trash2 className="h-4 w-4" />
                                  {UI_TEXT.RESERVATION.ACTION_CANCEL}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-foreground">
                    {UI_TEXT.RESERVATION.EMPTY_DATA}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableShell>
      </div>

      <PaginationTable
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />

      <StartServingDialog
        open={isStartOpen}
        onOpenChange={setIsStartOpen}
        onSuccess={onRefresh}
        bookingData={actionRow}
      />

      <EditBookingDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        bookingData={actionRow}
        onSuccess={onRefresh}
      />

      <CancelBookingDialog
        open={isCancelOpen}
        onOpenChange={setIsCancelOpen}
        onSuccess={onRefresh}
        bookingData={actionRow}
      />
    </div>
  );
};

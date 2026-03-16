import { CheckCircle2, Edit, MoreVertical, Trash2 } from "lucide-react";
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
} from "@/components/ui/table";
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
  totalItems,
  currentPage,
  totalPages,
  onPageChange,
  onRefresh,
}: ReservationTableProps) => {
  const [actionRow, setActionRow] = useState<any>(null);
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

  const startOffset = (currentPage - 1) * 8 + 1;
  const endOffset = Math.min(currentPage * 8, totalItems);

  return (
    <div className="relative w-full overflow-hidden bg-white rounded-2xl border-2 border-orange-50 shadow-sm flex-1 flex flex-col">
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="bg-[#fcf9f2] sticky top-0 z-10 border-b border-orange-100">
            <TableRow className="hover:bg-[#fcf9f2] border-none">
              <TableHead className="pl-6 w-[120px] font-bold text-slate-700 h-12 uppercase text-[11px] tracking-wider">
                {UI_TEXT.RESERVATION.COL_CODE}
              </TableHead>
              <TableHead className="font-bold text-slate-700 h-12 uppercase text-[11px] tracking-wider">
                {UI_TEXT.RESERVATION.COL_CUSTOMER}
              </TableHead>
              <TableHead className="font-bold text-slate-700 h-12 uppercase text-[11px] tracking-wider">
                {UI_TEXT.RESERVATION.COL_DATETIME}
              </TableHead>
              <TableHead className="font-bold text-slate-700 h-12 uppercase text-[11px] tracking-wider">
                {UI_TEXT.RESERVATION.COL_AREA}
              </TableHead>
              <TableHead className="font-bold text-slate-700 h-12 uppercase text-[11px] tracking-wider">
                {UI_TEXT.RESERVATION.COL_PEOPLE}
              </TableHead>
              <TableHead className="font-bold text-slate-700 h-12 uppercase text-[11px] tracking-wider">
                {UI_TEXT.RESERVATION.COL_PARTY_TYPE}
              </TableHead>
              <TableHead className="w-[140px] font-bold text-slate-700 h-12 uppercase text-[11px] tracking-wider">
                {UI_TEXT.RESERVATION.COL_STATUS}
              </TableHead>
              <TableHead className="pr-6 text-right w-[100px] font-bold text-slate-700 h-12 uppercase text-[11px] tracking-wider">
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
                    "group transition-all duration-200 border-b border-slate-50",
                    "hover:bg-[#fcf9f2]/50"
                  )}
                >
                  <TableCell className="pl-6 font-semibold text-slate-600 text-[13px] w-[120px]">
                    {row.code}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 text-sm leading-tight">
                        {row.customerName}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">{row.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-700 text-[13px]">{row.date}</span>
                      <span className="text-[11px] text-slate-500 font-medium">{row.time}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600 text-[13px] font-semibold">
                    {row.area}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider bg-orange-50 text-orange-600 border border-orange-100">
                      {row.people}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-600 text-[13px] font-semibold">
                    {row.partyType}
                  </TableCell>
                  <TableCell className="w-[140px]">
                    <StatusBadge status={row.status} />
                  </TableCell>
                  <TableCell className="text-right pr-6 w-[100px]">
                    <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {row.status === "BOOKED" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 bg-emerald-50/50 rounded-lg"
                            onClick={() => handleStartServing(row)}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-400 hover:text-slate-600 rounded-lg rounded-full"
                              >
                                <MoreVertical className="h-5 w-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={() => handleEdit(row)}>
                                <Edit className="h-4 w-4 mr-2" />
                                {UI_TEXT.RESERVATION.ACTION_EDIT}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleCancel(row)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
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
                <TableCell colSpan={8} className="text-center py-10 text-slate-500">
                  {UI_TEXT.RESERVATION.EMPTY_DATA}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-6 py-4 border-t border-orange-50 bg-white">
        <div className="text-sm font-medium text-slate-500">
          {UI_TEXT.RESERVATION.PAGINATION_SHOWING}{" "}
          <span className="font-bold text-slate-800">
            {totalItems > 0 ? startOffset : 0}
            {"-"}
            {endOffset}
          </span>{" "}
          {UI_TEXT.RESERVATION.PAGINATION_OF}{" "}
          <span className="font-bold text-slate-800">{totalItems}</span>{" "}
          {UI_TEXT.RESERVATION.PAGINATION_UNIT}
        </div>
        <div className="flex gap-1.5">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 p-0 border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <span className="sr-only">{"Previous page"}</span>
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
            >
              <path
                d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84182L5.43521 7.49991L8.86462 11.158C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "ghost"}
              className={cn(
                "h-8 w-8 p-0 rounded-lg font-medium",
                currentPage === page
                  ? "bg-primary hover:bg-primary/90 shadow-sm font-bold"
                  : "text-slate-600 hover:bg-slate-100"
              )}
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 p-0 border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <span className="sr-only">{"Next page"}</span>
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
            >
              <path
                d="M6.1584 3.13508C5.95698 3.32394 5.94678 3.64036 6.13564 3.84182L9.56505 7.49991L6.13564 11.158C5.94678 11.3594 5.95698 11.6758 6.1584 11.8647C6.35981 12.0535 6.67623 12.0433 6.86509 11.8419L10.6151 7.84188C10.7954 7.64955 10.7954 7.35027 10.6151 7.15794L6.86509 3.15794C6.67623 2.95648 6.35981 2.94628 6.1584 3.13508Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </Button>
        </div>
      </div>

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

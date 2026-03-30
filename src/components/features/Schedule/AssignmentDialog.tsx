"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar as CalendarIcon, Clock, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useBrandingFormatter } from "@/lib/branding-formatting";
import { UI_TEXT } from "@/lib/UI_Text";
import { shiftAssignmentService } from "@/services/shiftAssignmentService";
import { shiftService } from "@/services/shiftService";
import { useAuthStore } from "@/store/useAuthStore";
import { Employee, EmployeeRole } from "@/types/Employee";
import { Shift } from "@/types/Shift";
import { ShiftAssignment } from "@/types/ShiftAssignment";

const assignmentSchema = z.object({
  shiftId: z.string().min(1, UI_TEXT.FORM.REQUIRED),
  note: z.string().optional(),
});

type AssignmentFormValues = z.infer<typeof assignmentSchema>;

interface AssignmentDialogProps {
  employee: Employee | null;
  date: string | null; // "YYYY-MM-DD"
  assignment?: ShiftAssignment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AssignmentDialog = ({
  employee,
  date,
  assignment,
  open,
  onOpenChange,
  onSuccess,
}: AssignmentDialogProps) => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loadingShifts, setLoadingShifts] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const form = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      shiftId: "",
      note: "",
    },
  });

  const currentUser = useAuthStore((state) => state.employee);
  const isManager = currentUser?.role === EmployeeRole.MANAGER;

  useEffect(() => {
    if (open && isManager) {
      const fetchShifts = async () => {
        setLoadingShifts(true);
        try {
          const res = await shiftService.getShifts({ pageSize: 100 });
          if (res.isSuccess && res.data) {
            setShifts(res.data.items);
          }
        } catch (error) {
          console.error("Failed to fetch shifts:", error);
        } finally {
          setLoadingShifts(false);
        }
      };
      fetchShifts();

      if (assignment) {
        form.reset({
          shiftId: assignment.shiftId,
          note: assignment.note || "",
        });
      } else {
        form.reset({ shiftId: "", note: "" });
      }
    }
  }, [open, form, assignment, isManager]);

  const onSubmit = async (values: AssignmentFormValues) => {
    if (!employee || !date) return;

    setSubmitting(true);
    try {
      const res = assignment
        ? await shiftAssignmentService.updateAssignment(assignment.shiftAssignmentId, {
            shiftAssignmentId: assignment.shiftAssignmentId,
            shiftId: values.shiftId,
            assignedDate: date,
            note: values.note,
          })
        : await shiftAssignmentService.createAssignment({
            employeeId: employee.employeeId,
            shiftId: values.shiftId,
            assignedDate: date,
            note: values.note,
          });

      if (res.isSuccess) {
        toast.success(assignment ? UI_TEXT.SCHEDULE.UPDATE_SUCCESS : UI_TEXT.SHIFT.CREATE_SUCCESS);
        onSuccess();
        onOpenChange(false);
      } else {
        toast.error(res.error || UI_TEXT.COMMON.ERROR_UNKNOWN);
      }
    } catch (err) {
      toast.error((err as Error).message || UI_TEXT.COMMON.ERROR_UNKNOWN);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!assignment) return;
    if (!confirm(UI_TEXT.SCHEDULE.CONFIRM_DELETE)) return;

    setDeleting(true);
    try {
      const res = await shiftAssignmentService.deleteAssignment(assignment.shiftAssignmentId);
      if (res.isSuccess) {
        toast.success(UI_TEXT.SCHEDULE.DELETE_SUCCESS);
        onSuccess();
        onOpenChange(false);
      } else {
        toast.error(res.error || UI_TEXT.COMMON.ERROR_UNKNOWN);
      }
    } catch (err) {
      toast.error((err as Error).message || UI_TEXT.COMMON.ERROR_UNKNOWN);
    } finally {
      setDeleting(false);
    }
  };

  const { formatDate } = useBrandingFormatter();
  const formattedDate = date ? formatDate(date) : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-125 p-0 overflow-hidden border-none rounded-3xl shadow-2xl">
        <div className="bg-muted px-6 py-6 border-b relative overflow-hidden group">
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-primary/10 rounded-lg transition-transform group-hover:rotate-5">
              <Clock className="size-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-muted-foreground tracking-tight">
                {assignment ? UI_TEXT.SCHEDULE.EDIT_TITLE : UI_TEXT.SCHEDULE.ASSIGN_TITLE}
              </DialogTitle>
              <p className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest mt-1">
                {UI_TEXT.SCHEDULE.ASSIGN_DESC}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 py-6 space-y-6">
          <FieldGroup className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel className="text-[10px] font-semibold text-card-foreground uppercase tracking-[0.15em] mb-2">
                  {UI_TEXT.SCHEDULE.EMPLOYEE_NAME}
                </FieldLabel>
                <div className="flex items-center gap-3 p-3 rounded-lg border shadow-sm cursor-not-allowed">
                  <User className="size-4 text-card-foreground" />
                  <span className="text-sm font-semibold">{employee?.fullName}</span>
                </div>
              </Field>

              <Field>
                <FieldLabel className="text-[10px] font-semibold text-card-foreground uppercase tracking-[0.15em] mb-2">
                  {UI_TEXT.SCHEDULE.WORK_DATE}
                </FieldLabel>
                <div className="flex items-center gap-3 p-3 rounded-lg border shadow-sm cursor-not-allowed">
                  <CalendarIcon className="size-4 text-card-foreground" />
                  <span className="text-sm font-semibold">{formattedDate}</span>
                </div>
              </Field>
            </div>

            <Field>
              <FieldLabel
                htmlFor="shiftId"
                className="text-sm font-semibold text-card-foreground mb-2 block"
              >
                {UI_TEXT.SCHEDULE.SELECT_SHIFT}
                <span className="text-primary ml-1">{UI_TEXT.COMMON.ASTERISK}</span>
              </FieldLabel>
              <Select
                onValueChange={(val) => form.setValue("shiftId", val)}
                value={form.watch("shiftId")}
              >
                <SelectTrigger>
                  <SelectValue
                    id="shiftId"
                    placeholder={UI_TEXT.SCHEDULE.SELECT_SHIFT_PLACEHOLDER}
                  />
                </SelectTrigger>
                <SelectContent className="rounded-lg border shadow-2xl">
                  {loadingShifts ? (
                    <div className="p-4 flex justify-center">
                      <Spinner className="border-primary" />
                    </div>
                  ) : (
                    shifts.map((shift) => (
                      <SelectItem
                        key={shift.shiftId}
                        value={shift.shiftId}
                        className="rounded-xl px-3 py-2.5 mb-1 last:mb-0 focus:bg-primary/5 focus:text-primary transition-colors"
                      >
                        <div className="flex items-center justify-between w-full gap-4">
                          <span className="font-semi">{shift.name}</span>
                          <span className="text-[10px] font-semibold text-card-foreground/30 bg-card px-2 py-1 rounded-lg">
                            {shift.startTime.slice(0, 5)} {UI_TEXT.COMMON.HYPHEN}{" "}
                            {shift.endTime.slice(0, 5)}
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {form.formState.errors.shiftId && (
                <p className="text-xs text-danger mt-1 font-medium">
                  {form.formState.errors.shiftId.message}
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel
                htmlFor="note"
                className="text-sm font-semibold text-card-foreground mb-2 block"
              >
                {UI_TEXT.SCHEDULE.NOTE_LABEL}
              </FieldLabel>
              <Input
                id="note"
                {...form.register("note")}
                placeholder={UI_TEXT.SCHEDULE.NOTE_PLACEHOLDER}
                className="h-12 rounded-xl border-slate-200 focus:ring-primary shadow-sm"
              />
            </Field>
          </FieldGroup>

          <div className="flex gap-3 justify-end pt-6 border-t border-slate-50">
            {assignment && (
              <Button
                type="button"
                variant="ghost"
                disabled={deleting}
                onClick={handleDelete}
                className="h-12 px-6 rounded-xl font-semibold text-xs uppercase tracking-widest text-rose-500 hover:bg-rose-50 hover:text-rose-600 mr-auto transition-all active:scale-95"
              >
                {UI_TEXT.SCHEDULE.REMOVE_BUTTON}
                {deleting && <Spinner className="ml-2 border-rose-500" />}
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {UI_TEXT.COMMON.CANCEL}
            </Button>
            <Button type="submit" disabled={submitting}>
              {assignment ? UI_TEXT.COMMON.SAVE : UI_TEXT.SCHEDULE.ASSIGN_BUTTON}
              {submitting && <Spinner className="ml-2" />}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignmentDialog;

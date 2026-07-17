"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Circle } from "lucide-react";
import React from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/lib/error";
import { UI_TEXT } from "@/lib/UI_Text";
import { changeEmployeeRole } from "@/services/employeeService";
import { useEmployeeStore } from "@/store/useEmployeeStore";

// ─── Schema ────────────────────────────────────────────────────────────────────
const changeRoleSchema = z.object({
  newRole: z.string().min(1, { message: "Vui lòng chọn vai trò mới" }),
  reason: z.string().min(1, { message: UI_TEXT.EMPLOYEE.REASON_REQUIRED }),
  confirmed: z.boolean().refine((v) => v === true, {
    message: UI_TEXT.EMPLOYEE.CONFIRM_REQUIRED,
  }),
});

type ChangeRoleFormValues = z.infer<typeof changeRoleSchema>;

// ─── ValidationRules ───────────────────────────────────────────────────────────
const ValidationRules = ({
  value,
  rules,
}: {
  value: string;
  rules: { text: string; test: (v: string) => boolean }[];
}) => (
  <div className="mt-2 space-y-1">
    {rules.map((rule, idx) => {
      const isMet = rule.test(value || "");
      return (
        <div
          key={idx}
          className={`flex items-center gap-2 text-xs ${
            isMet ? "text-green-600" : "text-muted-foreground"
          }`}
        >
          {isMet ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
          <span>{rule.text}</span>
        </div>
      );
    })}
  </div>
);

// ─── Component ─────────────────────────────────────────────────────────────────
const EmployeeChangeRole = ({
  open,
  role,
  employeeCode,
  onToggle,
}: {
  open: boolean;
  role: string | number | undefined;
  employeeCode: string | undefined;
  onToggle: (v: boolean) => void;
}) => {
  const fetchEmployees = useEmployeeStore((state) => state.fetchEmployees);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, isValid },
  } = useForm<ChangeRoleFormValues>({
    mode: "onChange",
    resolver: zodResolver(changeRoleSchema),
    defaultValues: { newRole: "", reason: "", confirmed: false },
  });

  const newRoleValue = useWatch({ control, name: "newRole" }) ?? "";
  const reasonValue = useWatch({ control, name: "reason" }) ?? "";
  const confirmedValue = useWatch({ control, name: "confirmed" }) ?? false;

  const onSubmit = async (data: ChangeRoleFormValues) => {
    if (data.newRole === role) {
      toast.error(UI_TEXT.EMPLOYEE.ROLE_MISMATCH);
      return;
    }
    if (!employeeCode) {
      toast.error(UI_TEXT.EMPLOYEE.INVALID_CODE);
      return;
    }
    try {
      await changeEmployeeRole(employeeCode, role as string, data.newRole, data.reason);
      toast.success(UI_TEXT.EMPLOYEE.CHANGE_SUCCESS);
      fetchEmployees();
      reset();
      onToggle(false);
    } catch (error) {
      toast.error(getErrorMessage(error) || UI_TEXT.EMPLOYEE.CHANGE_FAILED);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onToggle(v);
      }}
    >
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{UI_TEXT.EMPLOYEE.CHANGE_ROLE_TITLE}</DialogTitle>
            <DialogDescription>{UI_TEXT.EMPLOYEE.CHANGE_ROLE_DESC_FULL}</DialogDescription>
          </DialogHeader>
          <FieldGroup className="mt-4 gap-4">
            {/* Current Role — readonly */}
            <Field>
              <Label>{UI_TEXT.ROLE.CURRENT_ROLE}</Label>
              <Input readOnly defaultValue={role} />
            </Field>

            {/* New Role */}
            <Field>
              <FieldLabel>{UI_TEXT.EMPLOYEE.ROLE}</FieldLabel>
              <Controller
                name="newRole"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn vai trò mới" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="admin">{UI_TEXT.ROLE.ADMIN}</SelectItem>
                      <SelectItem value="manager">{UI_TEXT.ROLE.MANAGER}</SelectItem>
                      <SelectItem value="cashier">{UI_TEXT.ROLE.CASHIER}</SelectItem>
                      <SelectItem value="chefbar">{UI_TEXT.ROLE.CHEF}</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <ValidationRules
                value={newRoleValue}
                rules={[
                  {
                    text: "Đã chọn vai trò mới",
                    test: (v) => v.trim().length > 0,
                  },
                  {
                    text: "Vai trò mới khác vai trò hiện tại",
                    test: (v) => v.trim().length > 0 && v !== String(role),
                  },
                ]}
              />
            </Field>

            {/* Reason */}
            <Field>
              <FieldLabel htmlFor="reason">{UI_TEXT.EMPLOYEE.REASON}</FieldLabel>
              <FieldContent>
                <Textarea
                  id="reason"
                  placeholder={UI_TEXT.EMPLOYEE.REASON_PLACEHOLDER}
                  {...register("reason")}
                />
              </FieldContent>
              <ValidationRules
                value={reasonValue}
                rules={[
                  {
                    text: UI_TEXT.PROFILE.VALIDATION.RULE_NOT_EMPTY,
                    test: (v) => v.trim().length > 0,
                  },
                ]}
              />
            </Field>

            {/* Info box */}
            <div className="bg-yellow-100 rounded-md p-4 text-yellow-800 text-sm">
              <p className="font-semibold">{UI_TEXT.EMPLOYEE.INFO_TITLE}</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>{UI_TEXT.EMPLOYEE.INFO_1}</li>
                <li>{UI_TEXT.EMPLOYEE.INFO_2}</li>
                <li>
                  {UI_TEXT.EMPLOYEE.INFO_3}
                  <span className="font-medium">{UI_TEXT.AUTH.EMAIL}</span>
                  {UI_TEXT.COMMON.DOT}
                </li>
              </ul>
            </div>

            {/* Confirm checkbox */}
            <Controller
              name="confirmed"
              control={control}
              render={({ field }) => (
                <Field orientation="horizontal" className="shadow-none border-none p-0 mt-4">
                  <Checkbox
                    id="confirm_changes"
                    checked={field.value}
                    onCheckedChange={(v) => field.onChange(v === true)}
                  />
                  <FieldContent>
                    <FieldLabel htmlFor="confirm_changes">
                      {UI_TEXT.EMPLOYEE.CONFIRM_CHANGE_ROLE}
                    </FieldLabel>
                    <FieldDescription>{UI_TEXT.EMPLOYEE.AGREE_TERMS}</FieldDescription>
                    <div className="mt-1 space-y-1">
                      <div
                        className={`flex items-center gap-2 text-xs ${
                          confirmedValue ? "text-green-600" : "text-muted-foreground"
                        }`}
                      >
                        {confirmedValue ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <Circle className="w-3.5 h-3.5" />
                        )}
                        <span>{UI_TEXT.EMPLOYEE.CONFIRM_CHANGE_ROLE}</span>
                      </div>
                    </div>
                  </FieldContent>
                </Field>
              )}
            />
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={() => reset()}>
                {UI_TEXT.BUTTON.CLOSE}
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting || !isValid}>
              {UI_TEXT.BUTTON.SAVE_CHANGES}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeChangeRole;

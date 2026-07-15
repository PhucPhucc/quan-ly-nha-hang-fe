"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Circle } from "lucide-react";
import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UI_TEXT } from "@/lib/UI_Text";
import { changeEmployeePassword } from "@/services/employeeService";

import SwitchChangePassword from "./SwitchChangePassword";

// ─── Schema ────────────────────────────────────────────────────────────────────
const changePasswordSchema = z.object({
  reason: z
    .string()
    .min(1, { message: "Vui lòng nhập lý do thay đổi mật khẩu" })
    .min(10, { message: "Lý do phải có ít nhất 10 ký tự" }),
});

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

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
const EmployeeChangePassword = ({
  open,
  employeeId,
  onToggle,
}: {
  open: boolean;
  employeeId: string;
  onToggle: (v: boolean) => void;
}) => {
  // password is managed outside react-hook-form (controlled by SwitchChangePassword)
  const [newPassword, setNewPassword] = React.useState<string | undefined>(undefined);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, isValid },
  } = useForm<ChangePasswordFormValues>({
    mode: "onChange",
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { reason: "" },
  });

  const reasonValue = useWatch({ control, name: "reason" }) ?? "";

  const handleClose = () => {
    reset();
    setNewPassword(undefined);
    onToggle(false);
  };

  const onSubmit = async (data: ChangePasswordFormValues) => {
    if (!employeeId) {
      toast.error("Mã nhân viên không hợp lệ");
      return;
    }
    try {
      await changeEmployeePassword(employeeId, data.reason, newPassword);
      toast.success("Thay đổi mật khẩu thành công");
      handleClose();
    } catch {
      toast.error("Thay đổi mật khẩu thất bại");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{UI_TEXT.EMPLOYEE.CHANGE_PASSWORD}</DialogTitle>
            <DialogDescription>{UI_TEXT.EMPLOYEE.CHANGE_PASSWORD_DESC}</DialogDescription>
          </DialogHeader>
          <FieldGroup className="mt-4 gap-4">
            <Field>
              <Label htmlFor="reason">{UI_TEXT.EMPLOYEE.CHANGE_PASSWORD_REASON}</Label>
              <Textarea
                id="reason"
                placeholder="Nhập lý do thay đổi mật khẩu..."
                {...register("reason")}
              />
              <ValidationRules
                value={reasonValue}
                rules={[
                  {
                    text: UI_TEXT.PROFILE.VALIDATION.RULE_NOT_EMPTY,
                    test: (v) => v.trim().length > 0,
                  },
                  {
                    text: "Ít nhất 10 ký tự",
                    test: (v) => v.trim().length >= 10,
                  },
                ]}
              />
            </Field>
            <SwitchChangePassword onPasswordChange={setNewPassword} />
          </FieldGroup>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={handleClose}>
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

export default EmployeeChangePassword;

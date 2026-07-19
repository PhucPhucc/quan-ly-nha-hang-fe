"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Circle, Mail, User } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
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
import { UI_TEXT } from "@/lib/UI_Text";
import { employeeService } from "@/services/employeeService";
import { Employee, EmployeeRole } from "@/types/Employee";

// ─── Zod schema ────────────────────────────────────────────────────────────────
const employeeSchema = z.object({
  fullName: z
    .string()
    .min(1, { message: UI_TEXT.PROFILE.VALIDATION.FULL_NAME_REQUIRED })
    .min(2, { message: UI_TEXT.PROFILE.VALIDATION.RULE_FULL_NAME_MIN }),
  email: z
    .string()
    .min(1, { message: UI_TEXT.PROFILE.VALIDATION.EMAIL_REQUIRED })
    .email({ message: UI_TEXT.PROFILE.VALIDATION.EMAIL_INVALID }),
  role: z.string().min(1, { message: UI_TEXT.ADMIN.SELECT_ROLE }),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

// ─── ValidationRules ──────────────────────────────────────────────────────────
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
          className={`flex items-center gap-2 text-xs ${isMet ? "text-green-600" : "text-muted-foreground"}`}
        >
          {isMet ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
          <span>{rule.text}</span>
        </div>
      );
    })}
  </div>
);

// ─── Component ─────────────────────────────────────────────────────────────────
interface AccountFormProps {
  employee?: Employee;
  onSuccess: () => void;
  onSubmit?: (data: EmployeeFormValues) => void;
  isLoading?: boolean;
}

const AccountForm = ({
  employee,
  onSuccess,
  onSubmit: onSubmitProp,
  isLoading,
}: AccountFormProps) => {
  const isEditing = !!employee;

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, isValid },
  } = useForm<EmployeeFormValues>({
    mode: "onChange",
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      fullName: employee?.fullName ?? "",
      email: employee?.email ?? "",
      role: employee?.role?.toLowerCase() ?? "",
    },
  });

  const fullNameValue = useWatch({ control, name: "fullName" }) ?? "";
  const emailValue = useWatch({ control, name: "email" }) ?? "";
  const roleValue = useWatch({ control, name: "role" }) ?? "";

  const onSubmit = async (data: EmployeeFormValues) => {
    if (onSubmitProp) {
      onSubmitProp(data);
      return;
    }

    try {
      await employeeService.add({
        fullName: data.fullName,
        email: data.email,
        role: data.role as EmployeeRole,
      });
      onSuccess();
      toast.success(UI_TEXT.ADMIN.CREATE_ACCOUNT);
    } catch (err) {
      toast.error((err as Error).message || "Failed to create account");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup className="grid grid-cols-1 gap-4">
        {/* Full Name */}
        <Field>
          <FieldLabel htmlFor="fullName">{UI_TEXT.ADMIN.FULL_NAME}</FieldLabel>
          <div className="group relative">
            <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-slate-900" />
            <Input
              id="fullName"
              type="text"
              placeholder={UI_TEXT.ADMIN.ENTER_FULL_NAME}
              className="rounded-lg pl-10"
              {...register("fullName")}
            />
          </div>
          <ValidationRules
            value={fullNameValue}
            rules={[
              {
                text: UI_TEXT.PROFILE.VALIDATION.RULE_NOT_EMPTY,
                test: (v) => v.trim().length > 0,
              },
              {
                text: UI_TEXT.PROFILE.VALIDATION.RULE_FULL_NAME_MIN,
                test: (v) => v.trim().length >= 2,
              },
            ]}
          />
        </Field>

        {/* Email */}
        <Field>
          <FieldLabel htmlFor="email">{UI_TEXT.ADMIN.EMAIL_ADDRESS}</FieldLabel>
          <div className="group relative">
            <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-slate-900" />
            <Input
              id="email"
              type="email"
              placeholder={UI_TEXT.ADMIN.ENTER_EMAIL}
              className="rounded-lg pl-10"
              {...register("email")}
            />
          </div>
          <ValidationRules
            value={emailValue}
            rules={[
              {
                text: UI_TEXT.PROFILE.VALIDATION.RULE_NOT_EMPTY,
                test: (v) => v.trim().length > 0,
              },
              {
                text: UI_TEXT.PROFILE.VALIDATION.RULE_EMAIL_FORMAT,
                test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
              },
            ]}
          />
        </Field>

        {/* Role */}
        <Field>
          <FieldLabel>{UI_TEXT.ADMIN.SELECT_ROLE}</FieldLabel>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder={UI_TEXT.ADMIN.SELECT_ROLE} />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem className="hover:bg-secondary-foreground/20" value="manager">
                    {UI_TEXT.ROLE.MANAGER}
                  </SelectItem>
                  <SelectItem className="hover:bg-secondary-foreground/20" value="cashier">
                    {UI_TEXT.ROLE.CASHIER}
                  </SelectItem>
                  <SelectItem className="hover:bg-secondary-foreground/20" value="chefbar">
                    {UI_TEXT.ROLE.CHEF}
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <ValidationRules
            value={roleValue}
            rules={[
              {
                text: UI_TEXT.ADMIN.ROLE_SELECTED,
                test: (v) => v.trim().length > 0,
              },
            ]}
          />
        </Field>
      </FieldGroup>

      <div className="flex gap-4 justify-end mt-4">
        <DialogClose asChild>
          <Button type="button" variant="secondary" className="hover:bg-secondary-foreground/20">
            {UI_TEXT.BUTTON.CLOSE}
          </Button>
        </DialogClose>

        <Button type="submit" disabled={isSubmitting || !isValid || isLoading}>
          {isEditing ? UI_TEXT.ADMIN.EDIT_ACCOUNT : UI_TEXT.ADMIN.CREATE_ACCOUNT}{" "}
          {isSubmitting && <Spinner />}
        </Button>
      </div>
    </form>
  );
};

export default AccountForm;

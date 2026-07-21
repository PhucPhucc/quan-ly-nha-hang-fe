"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, User } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { ValidationRules } from "@/components/shared/ValidationRules";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
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
import { addEmployee } from "@/services/employeeService";
import { useEmployeeStore } from "@/store/useEmployeeStore";
import { EmployeeRole } from "@/types/Employee";

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
  role: z.string().min(1, { message: "Vui lòng chọn vai trò" }),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

// ─── Component ─────────────────────────────────────────────────────────────────
const EmployeeForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const fetchEmployees = useEmployeeStore((state) => state.fetchEmployees);

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, isValid, errors },
  } = useForm<EmployeeFormValues>({
    mode: "onChange",
    resolver: zodResolver(employeeSchema),
    defaultValues: { fullName: "", email: "", role: "" },
  });

  const fullNameValue = useWatch({ control, name: "fullName" }) ?? "";
  const emailValue = useWatch({ control, name: "email" }) ?? "";
  const roleValue = useWatch({ control, name: "role" }) ?? "";

  const onSubmit = async (data: EmployeeFormValues) => {
    try {
      await addEmployee({
        fullName: data.fullName,
        email: data.email,
        role: data.role as EmployeeRole,
      });
      fetchEmployees();
      onSuccess();
      toast.success(UI_TEXT.EMPLOYEE.ADD_SUSCESS);
    } catch (err) {
      toast.error((err as Error).message || UI_TEXT.EMPLOYEE.ADD_FAILED);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup className="grid grid-cols-1 gap-4">
        {/* Full Name */}
        <Field>
          <FieldLabel htmlFor="fullName">{UI_TEXT.EMPLOYEE.FULLNAME}</FieldLabel>
          <div className="group relative">
            <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-slate-900" />
            <Input
              id="fullName"
              type="text"
              placeholder={UI_TEXT.EMPLOYEE.FULLNAME_PLACEHOLDER}
              className="rounded-lg pl-10"
              {...register("fullName")}
            />
          </div>
          <FieldError errors={[errors.fullName]} />
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
          <FieldLabel htmlFor="email">{UI_TEXT.EMPLOYEE.EMAIL}</FieldLabel>
          <div className="group relative">
            <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-slate-900" />
            <Input
              id="email"
              type="email"
              placeholder={`Nhập ${UI_TEXT.EMPLOYEE.EMAIL}`}
              className="rounded-lg pl-10"
              {...register("email")}
            />
          </div>
          <FieldError errors={[errors.email]} />
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
          <FieldLabel>{UI_TEXT.ROLE.TITLE}</FieldLabel>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vai trò" />
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
          <FieldError errors={[errors.role]} />
          <ValidationRules
            value={roleValue}
            rules={[
              {
                text: "Đã chọn vai trò",
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

        <Button type="submit" disabled={isSubmitting || !isValid}>
          {UI_TEXT.BUTTON.SUBMIT} {isSubmitting && <Spinner />}
        </Button>
      </div>
    </form>
  );
};

export default EmployeeForm;

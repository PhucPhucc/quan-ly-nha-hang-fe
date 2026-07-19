"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Circle, Mail, MapPin, Phone, User } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import DOBPicker from "@/components/shared/DOBPicker";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SheetClose } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/lib/error";
import { UI_TEXT } from "@/lib/UI_Text";
import { updateEmployee } from "@/services/employeeService";
import { useEmployeeStore } from "@/store/useEmployeeStore";
import { Employee, EmployeeRole, EmployeeStatus, normalizeEmployeeRole } from "@/types/Employee";

import SwitchActive from "./SwitchActive";

const getRoleLabel = (raw: string | undefined) => {
  if (!raw) return "";
  const normalized = normalizeEmployeeRole(raw as EmployeeRole);
  if (normalized === EmployeeRole.MANAGER) return UI_TEXT.ROLE.MANAGER;
  if (normalized === EmployeeRole.CASHIER) return UI_TEXT.ROLE.CASHIER;
  if (normalized === EmployeeRole.CHEFBAR) return UI_TEXT.ROLE.CHEF;
  return raw;
};

// ─── Schema ────────────────────────────────────────────────────────────────────
const updateSchema = z.object({
  fullName: z
    .string()
    .min(1, { message: UI_TEXT.PROFILE.VALIDATION.FULL_NAME_REQUIRED })
    .min(2, { message: UI_TEXT.PROFILE.VALIDATION.RULE_FULL_NAME_MIN }),
  email: z
    .string()
    .min(1, { message: UI_TEXT.PROFILE.VALIDATION.EMAIL_REQUIRED })
    .email({ message: UI_TEXT.PROFILE.VALIDATION.EMAIL_INVALID }),
  phone: z
    .string()
    .regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, {
      message: UI_TEXT.PROFILE.VALIDATION.PHONE_INVALID,
    })
    .or(z.literal("")),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
});

type UpdateFormValues = z.infer<typeof updateSchema>;

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
const EmployeeUpdateForm = ({ employee }: { employee?: Employee | null }) => {
  const fetchEmployees = useEmployeeStore((state) => state.fetchEmployees);

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, isValid },
  } = useForm<UpdateFormValues>({
    mode: "onChange",
    resolver: zodResolver(updateSchema),
    defaultValues: {
      fullName: employee?.fullName || "",
      email: employee?.email || "",
      phone: employee?.phone || "",
      dateOfBirth: employee?.dateOfBirth || "",
      address: employee?.address || "",
    },
  });

  const fullNameValue = useWatch({ control, name: "fullName" }) ?? "";
  const emailValue = useWatch({ control, name: "email" }) ?? "";
  const phoneValue = useWatch({ control, name: "phone" }) ?? "";

  const onSubmit = async (data: UpdateFormValues) => {
    try {
      await updateEmployee({
        employeeId: employee?.employeeId,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || undefined,
        dateOfBirth: data.dateOfBirth || undefined,
        address: data.address || undefined,
        status: employee?.status as EmployeeStatus,
        role: employee?.role,
      });
      toast.success(UI_TEXT.EMPLOYEE.UPDATE_SUSCESS);
      fetchEmployees();
    } catch (err) {
      toast.error(getErrorMessage(err) || UI_TEXT.COMMON.UPDATE_ERROR);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup className="grid grid-cols-2 gap-x-2 gap-y-4 px-0.5">
        {/* Employee Code — readonly */}
        <Field>
          <Label>{UI_TEXT.EMPLOYEE.EMPLOYEECODE}</Label>
          <Input
            disabled
            defaultValue={employee?.employeeCode || ""}
            className="cursor-not-allowed"
          />
        </Field>

        {/* Full Name */}
        <Field>
          <Label htmlFor="fullName">{UI_TEXT.EMPLOYEE.FULLNAME}</Label>
          <div className="group relative">
            <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-slate-900" />
            <Input id="fullName" className="rounded-lg pl-10" {...register("fullName")} />
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
          <Label htmlFor="email">{UI_TEXT.EMPLOYEE.EMAIL}</Label>
          <div className="group relative">
            <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-slate-900" />
            <Input id="email" type="email" className="rounded-lg pl-10" {...register("email")} />
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

        {/* Phone */}
        <Field>
          <Label htmlFor="phone">{UI_TEXT.EMPLOYEE.PHONE}</Label>
          <div className="group relative">
            <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-slate-900" />
            <Input id="phone" type="text" className="rounded-lg pl-10" {...register("phone")} />
          </div>
          <ValidationRules
            value={phoneValue}
            rules={[
              {
                text: UI_TEXT.PROFILE.VALIDATION.RULE_PHONE_PREFIX,
                test: (v) => v === "" || /^(0|\+84)/.test(v),
              },
              {
                text: UI_TEXT.PROFILE.VALIDATION.RULE_PHONE_LENGTH,
                test: (v) => v === "" || /^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(v),
              },
            ]}
          />
        </Field>

        {/* DOB — controlled via Controller */}
        <Controller
          name="dateOfBirth"
          control={control}
          render={({ field }) => (
            <DOBPicker dob={field.value} onChange={(date) => field.onChange(date)} />
          )}
        />

        {/* Role — readonly */}
        <Field>
          <Label>{UI_TEXT.EMPLOYEE.ROLE}</Label>
          <Input disabled defaultValue={getRoleLabel(employee?.role)} />
        </Field>

        {/* Created At */}
        <Field>
          <Label>{UI_TEXT.COMMON.CREATE_AT}</Label>
          <Input
            disabled
            defaultValue={employee?.createdAt ? new Date(employee.createdAt).toLocaleString() : ""}
          />
        </Field>

        {/* Updated At */}
        <Field>
          <Label>{UI_TEXT.COMMON.UPDATE_AT}</Label>
          <Input
            disabled
            defaultValue={employee?.updatedAt ? new Date(employee.updatedAt).toLocaleString() : ""}
          />
        </Field>

        {/* Status switch */}
        <SwitchActive status={employee?.status} />

        {/* Address */}
        <Field className="col-span-2">
          <Label htmlFor="address">{UI_TEXT.EMPLOYEE.ADDRESS}</Label>
          <div className="group relative">
            <MapPin className="absolute left-3 top-3 size-4 text-muted-foreground transition-colors group-focus-within:text-slate-900" />
            <Textarea
              id="address"
              placeholder={UI_TEXT.EMPLOYEE.ADDRESS}
              className="pl-10"
              {...register("address")}
            />
          </div>
        </Field>

        {/* Buttons */}
        <Field orientation="horizontal" className="flex gap-4 mt-2 col-span-2">
          <Button type="submit" className="flex-1/2" disabled={isSubmitting || !isValid}>
            {UI_TEXT.COMMON.SAVE}
            {isSubmitting && <Spinner />}
          </Button>
          <SheetClose asChild className="flex-1/2">
            <Button type="button" variant="outline">
              {UI_TEXT.COMMON.CANCEL_EN}
            </Button>
          </SheetClose>
        </Field>
      </FieldGroup>
    </form>
  );
};

export default EmployeeUpdateForm;

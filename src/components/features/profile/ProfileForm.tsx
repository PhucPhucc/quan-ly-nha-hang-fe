"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  Circle,
  Contact,
  CreditCard,
  Hash,
  LucideIcon,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Save,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import DOBPicker from "@/components/shared/DOBPicker";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { getErrorMessage } from "@/lib/error";
import { UI_TEXT } from "@/lib/UI_Text";
import { getMyProfile, updateMyProfile } from "@/services/profileService";
import { useAuthStore } from "@/store/useAuthStore";

const profileSchema = z.object({
  fullName: z.string().min(1, { message: UI_TEXT.PROFILE.VALIDATION.FULL_NAME_REQUIRED }),
  email: z
    .string()
    .min(1, { message: UI_TEXT.PROFILE.VALIDATION.EMAIL_REQUIRED })
    .email({ message: UI_TEXT.PROFILE.VALIDATION.EMAIL_INVALID }),
  phone: z
    .string()
    .regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, { message: UI_TEXT.PROFILE.VALIDATION.PHONE_INVALID }),
  dateOfBirth: z.string().min(1, { message: "Vui lòng chọn ngày sinh" }),
  address: z.string().min(1, { message: UI_TEXT.PROFILE.VALIDATION.ADDRESS_REQUIRED }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const SectionTitle = ({ icon: Icon, title }: { icon: LucideIcon; title: string }) => (
  <div className="mb-4 flex items-center gap-2">
    <div className="flex size-8 items-center justify-center rounded-lg bg-secondary">
      <Icon className="size-4 text-secondary-foreground" />
    </div>
    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{title}</h3>
  </div>
);

const ValidationRules = ({
  value,
  rules,
}: {
  value: string;
  rules: { text: string; test: (v: string) => boolean }[];
}) => {
  return (
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
};

const ProfileForm = () => {
  const { employee, setEmployee } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { isDirty, isValid },
  } = useForm<ProfileFormValues>({
    mode: "onChange",
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: employee?.fullName || "",
      email: employee?.email || "",
      phone: employee?.phone || "",
      dateOfBirth: employee?.dateOfBirth || "",
      address: employee?.address || "",
    },
  });

  const fullNameValue = watch("fullName") || "";
  const emailValue = watch("email") || "";
  const phoneValue = watch("phone") || "";
  const dobValue = watch("dateOfBirth") || "";
  const addressValue = watch("address") || "";

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const res = await getMyProfile();
      if (res.data) {
        setEmployee(res.data);
        reset({
          fullName: res.data.fullName || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          dateOfBirth: res.data.dateOfBirth || "",
          address: res.data.address || "",
        });
      }
      setLoading(false);
    };
    fetchProfile();
  }, [setEmployee, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    setLoading(true);
    try {
      await updateMyProfile(data);
      setEmployee({ ...employee, ...data });
      toast.success(UI_TEXT.COMMON.UPDATE_SUCCESS);
      reset(data);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(getErrorMessage(error) || UI_TEXT.COMMON.UPDATE_ERROR);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      {/* Account Info Section */}
      <section>
        <SectionTitle icon={CreditCard} title={UI_TEXT.PROFILE.ACCOUNT_INFO} />
        <FieldGroup className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field>
            <FieldLabel>{UI_TEXT.EMPLOYEE.EMPLOYEECODE}</FieldLabel>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                disabled
                defaultValue={employee?.employeeCode}
                className="rounded-lg border-dashed bg-muted/30 pl-10"
              />
            </div>
          </Field>

          <Field>
            <FieldLabel>{UI_TEXT.EMPLOYEE.ROLE}</FieldLabel>
            <div className="relative">
              <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                disabled
                defaultValue={employee?.role}
                className="rounded-lg border-dashed bg-muted/30 pl-10"
              />
            </div>
          </Field>
        </FieldGroup>
      </section>

      {/* Personal Info Section */}
      <section>
        <SectionTitle icon={Contact} title={UI_TEXT.PROFILE.PERSONAL_INFO} />
        <FieldGroup className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="fullName">{UI_TEXT.EMPLOYEE.FULLNAME}</FieldLabel>
            <div className="group relative">
              <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-slate-900" />
              <Input id="fullName" {...register("fullName")} className="rounded-lg pl-10" />
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

          <Field>
            <FieldLabel htmlFor="email">{UI_TEXT.EMPLOYEE.EMAIL}</FieldLabel>
            <div className="group relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-slate-900" />
              <Input id="email" type="email" {...register("email")} className="rounded-lg pl-10" />
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

          <Field>
            <FieldLabel htmlFor="phone">{UI_TEXT.EMPLOYEE.PHONE}</FieldLabel>
            <div className="group relative">
              <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-slate-900" />
              <Input type="text" id="phone" {...register("phone")} className="rounded-lg pl-10" />
            </div>
            <ValidationRules
              value={phoneValue}
              rules={[
                {
                  text: UI_TEXT.PROFILE.VALIDATION.RULE_NOT_EMPTY,
                  test: (v) => v.trim().length > 0,
                },
                {
                  text: UI_TEXT.PROFILE.VALIDATION.RULE_PHONE_PREFIX,
                  test: (v) => /^(0|\+84)/.test(v),
                },
                {
                  text: UI_TEXT.PROFILE.VALIDATION.RULE_PHONE_LENGTH,
                  test: (v) => /^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(v),
                },
              ]}
            />
          </Field>

          <div className="flex flex-col">
            <Controller
              name="dateOfBirth"
              control={control}
              render={({ field }) => (
                <DOBPicker dob={field.value} onChange={(date) => field.onChange(date)} />
              )}
            />
            <ValidationRules
              value={dobValue}
              rules={[
                {
                  text: UI_TEXT.PROFILE.VALIDATION.RULE_NOT_EMPTY,
                  test: (v) => v.trim().length > 0,
                },
                {
                  text: UI_TEXT.PROFILE.VALIDATION.RULE_DOB_18 || "Đủ 18 tuổi",
                  test: (v) => {
                    if (!v) return false;
                    const d = new Date(v);
                    const maxDate = new Date();
                    maxDate.setFullYear(maxDate.getFullYear() - 18);
                    // To handle exact day logic properly
                    maxDate.setHours(23, 59, 59, 999);
                    return d <= maxDate;
                  },
                },
              ]}
            />
          </div>

          <Field className="col-span-2">
            <FieldLabel htmlFor="address">{UI_TEXT.EMPLOYEE.ADDRESS}</FieldLabel>
            <div className="group relative">
              <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-slate-900" />
              <Input id="address" {...register("address")} className="rounded-lg pl-10" />
            </div>
            <ValidationRules
              value={addressValue}
              rules={[
                {
                  text: UI_TEXT.PROFILE.VALIDATION.RULE_NOT_EMPTY,
                  test: (v) => v.trim().length > 0,
                },
              ]}
            />
          </Field>
        </FieldGroup>
      </section>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={() => reset()} className="px-6">
          <RefreshCw className="mr-2 h-4 w-4" />
          {UI_TEXT.COMMON.RESET}
        </Button>

        <Button type="submit" disabled={!isDirty || loading || !isValid}>
          {loading ? <Spinner className="mr-2" /> : <Save className="mr-2 h-4 w-4" />}
          {loading ? UI_TEXT.COMMON.LOADING : UI_TEXT.COMMON.SAVE}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;

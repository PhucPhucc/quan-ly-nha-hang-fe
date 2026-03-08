"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { UI_TEXT } from "@/lib/UI_Text";
import { requestPasswordReset } from "@/services/authService";

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const employeeCode = formData.get("employeeCode") as string;

    try {
      const response = await requestPasswordReset(employeeCode);
      if (response.isSuccess) {
        toast.success(response.data || UI_TEXT.COMMON.REQUEST_SENT);
      } else {
        toast.error(response.message || UI_TEXT.COMMON.SEND_FAILED);
      }
    } catch (error) {
      toast.error(UI_TEXT.COMMON.SOMETHING_WENT_WRONG);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-primary bg-card px-5 py-6 shadow-2xl"
    >
      <h1 className="mb-2 text-center text-3xl font-semibold">
        {UI_TEXT.AUTH.FORGOT_PASSWORD_TITLE}
      </h1>
      <p className="mb-6 text-center text-sm text-muted-foreground">
        {UI_TEXT.AUTH.FORGOT_PASSWORD_DESC}
      </p>
      <FieldGroup>
        <Field className="gap-1">
          <FieldLabel htmlFor="employeeCode">{UI_TEXT.AUTH.EMPLOYEE_CODE}</FieldLabel>
          <Input
            id="employeeCode"
            name="employeeCode"
            placeholder={UI_TEXT.AUTH.FORGOT_PASSWORD_PLACEHOLDER}
            required
            className="border-primary"
          />
        </Field>
      </FieldGroup>
      <Button
        type="submit"
        size="lg"
        disabled={isLoading}
        className="mt-6 w-full hover:bg-primary-hover"
      >
        {isLoading ? UI_TEXT.COMMON.SENDING : UI_TEXT.AUTH.SEND_REQUEST}
      </Button>
      <div className="mt-4 text-center text-sm">
        <Link href="/login" className="underline hover:text-primary-hover">
          {UI_TEXT.AUTH.BACK_TO_LOGIN}
        </Link>
      </div>
    </form>
  );
};

export default ForgotPasswordPage;

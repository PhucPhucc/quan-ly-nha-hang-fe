"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";

import FieldPassword from "@/components/shared/FieldPassword";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { UI_TEXT } from "@/lib/UI_Text";
import { resetPassword } from "@/services/authService";

const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      toast.error(UI_TEXT.AUTH.RESET_PASSWORD.INVALID_TOKEN);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      toast.error(UI_TEXT.AUTH.RESET_PASSWORD.MISMATCH);
      return;
    }

    setIsLoading(true);

    try {
      const response = await resetPassword({
        token,
        newPassword,
        confirmPassword,
      });

      if (response.isSuccess) {
        toast.success(UI_TEXT.AUTH.RESET_PASSWORD.SUCCESS);
        router.push("/login");
      } else {
        toast.error(response.message || UI_TEXT.AUTH.RESET_PASSWORD.FAILED);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(UI_TEXT.COMMON.SOMETHING_WENT_WRONG);
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="rounded-2xl border border-primary bg-card px-5 py-6 shadow-2xl text-center">
        <h1 className="mb-2 text-3xl font-semibold text-destructive">
          {UI_TEXT.AUTH.RESET_PASSWORD.ERROR_TITLE}
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          {UI_TEXT.AUTH.RESET_PASSWORD.TOKEN_MISSING}
        </p>
        <Link href="/forgot" className="underline hover:text-primary-hover">
          {UI_TEXT.AUTH.RESET_PASSWORD.REQUEST_NEW}
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-primary bg-card px-5 py-6 shadow-2xl"
    >
      <h1 className="mb-2 text-center text-3xl font-semibold">
        {UI_TEXT.AUTH.RESET_PASSWORD.TITLE}
      </h1>
      <p className="mb-6 text-center text-sm text-muted-foreground">
        {UI_TEXT.AUTH.RESET_PASSWORD.DESC}
      </p>
      <FieldGroup className="gap-4">
        <FieldPassword
          name="newPassword"
          label={UI_TEXT.AUTH.RESET_PASSWORD.NEW_PASSWORD}
          placeholder={UI_TEXT.AUTH.RESET_PASSWORD.NEW_PASSWORD_PLACEHOLDER}
          className="border-primary"
        />
        <FieldPassword
          name="confirmPassword"
          label={UI_TEXT.AUTH.RESET_PASSWORD.CONFIRM_NEW_PASSWORD}
          placeholder={UI_TEXT.AUTH.RESET_PASSWORD.CONFIRM_NEW_PASSWORD_PLACEHOLDER}
          className="border-primary"
        />
      </FieldGroup>
      <Button
        type="submit"
        size="lg"
        disabled={isLoading}
        className="mt-6 w-full hover:bg-primary-hover"
      >
        {isLoading ? UI_TEXT.COMMON.PROCESSING : UI_TEXT.AUTH.RESET_PASSWORD.UPDATE_BUTTON}
      </Button>
    </form>
  );
};

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<div className="text-center">{UI_TEXT.COMMON.LOADING}</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
};

export default ResetPasswordPage;

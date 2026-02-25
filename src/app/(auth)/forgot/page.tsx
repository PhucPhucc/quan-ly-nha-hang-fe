"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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
        toast.success(response.data || "Yêu cầu đã được gửi. Vui lòng kiểm tra email.");
      } else {
        toast.error(response.message || "Gửi yêu cầu thất bại.");
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
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
      <h1 className="mb-2 text-center text-3xl font-semibold">Quên mật khẩu?</h1>
      <p className="mb-6 text-center text-sm text-muted-foreground">
        Vui lòng nhập Mã nhân viên của bạn để khôi phục mật khẩu.
      </p>
      <FieldGroup>
        <Field className="gap-1">
          <FieldLabel htmlFor="employeeCode">Mã nhân viên</FieldLabel>
          <Input
            id="employeeCode"
            name="employeeCode"
            placeholder="Ví dụ: WA001"
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
        {isLoading ? "Đang gửi..." : "Gửi yêu cầu"}
      </Button>
      <div className="mt-4 text-center text-sm">
        <Link href="/login" className="underline hover:text-primary-hover">
          Quay lại đăng nhập
        </Link>
      </div>
    </form>
  );
};

export default ForgotPasswordPage;

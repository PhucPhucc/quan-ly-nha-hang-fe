"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";

import FieldPassword from "@/components/shared/FieldPassword";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { resetPassword } from "@/services/authService";

const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      toast.error("Token không hợp lệ hoặc đã hết hạn.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp.");
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
        toast.success("Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.");
        router.push("/login");
      } else {
        toast.error(response.message || "Đặt lại mật khẩu thất bại.");
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="rounded-2xl border border-primary bg-card px-5 py-6 shadow-2xl text-center">
        <h1 className="mb-2 text-3xl font-semibold text-destructive">Lỗi!</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Token khôi phục mật khẩu không tồn tại hoặc không hợp lệ.
        </p>
        <Link href="/forgot" className="underline hover:text-primary-hover">
          Yêu cầu mã mới
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-primary bg-card px-5 py-6 shadow-2xl"
    >
      <h1 className="mb-2 text-center text-3xl font-semibold">Đặt lại mật khẩu</h1>
      <p className="mb-6 text-center text-sm text-muted-foreground">
        Vui lòng nhập mật khẩu mới cho tài khoản của bạn.
      </p>
      <FieldGroup className="gap-4">
        <FieldPassword
          name="newPassword"
          label="Mật khẩu mới"
          placeholder="Nhập mật khẩu mới"
          className="border-primary"
        />
        <FieldPassword
          name="confirmPassword"
          label="Xác nhận mật khẩu mới"
          placeholder="Nhập lại mật khẩu mới"
          className="border-primary"
        />
      </FieldGroup>
      <Button
        type="submit"
        size="lg"
        disabled={isLoading}
        className="mt-6 w-full hover:bg-primary-hover"
      >
        {isLoading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
      </Button>
    </form>
  );
};

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<div className="text-center">Đang tải...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
};

export default ResetPasswordPage;

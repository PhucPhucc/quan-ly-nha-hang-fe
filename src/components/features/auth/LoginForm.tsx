"use client";

import { Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import FieldPassword from "@/components/shared/FieldPassword";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { UI_TEXT } from "@/lib/UI_Text";
import { login } from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";
const LoginForm = () => {
  const router = useRouter();
  const [error, setError] = useState("");

  const setEmployee = useAuthStore((state) => state.setEmployee);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const data = await login({
        employeeCode: formData.get("employeeCode") as string,
        password: formData.get("password") as string,
      });
      setEmployee({
        email: data.email,
        username: data.employeeCode,
        fullName: data.fullName,
        role: data.role,
      });

      setAccessToken(data.accessToken);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      console.log(data);
      router.push("/dashboard");
    } catch {
      setError(UI_TEXT.AUTH.ERROR_INVALID_CREDENTIALS);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="border border-primary bg-card rounded-2xl px-5 py-6 shadow-2xl"
    >
      <p className="font-semibold text-3xl mb-6 text-center">{UI_TEXT.AUTH.LOGIN_TITLE}</p>

      <FieldGroup>
        <Field className="gap-1">
          <FieldLabel htmlFor="employeeCode">{UI_TEXT.AUTH.EMPLOYEE_CODE}</FieldLabel>
          <Input
            id="employeeCode"
            name="employeeCode"
            placeholder={UI_TEXT.AUTH.EMPLOYEE_CODE_PLACEHOLDER}
            required
          />
        </Field>

        <FieldPassword name="password" label={UI_TEXT.AUTH.PASSWORD} />
      </FieldGroup>

      <div className="text-sm flex mt-2 mb-4 justify-between">
        <Field orientation="horizontal">
          <Checkbox name="remember" id="remember" />
          <FieldLabel htmlFor="remember">{UI_TEXT.AUTH.REMEMBER_ME}</FieldLabel>
        </Field>

        <Link href="/forgot" className="underline whitespace-nowrap">
          {UI_TEXT.AUTH.FORGOT_PASSWORD}
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-2 mb-2 bg-danger/10 rounded-lg text-danger">
          <Info className="size-4" />
          <span>{error}</span>
        </div>
      )}

      <Button type="submit" size="lg" className="w-full">
        {UI_TEXT.AUTH.LOGIN}
      </Button>
    </form>
  );
};

export default LoginForm;

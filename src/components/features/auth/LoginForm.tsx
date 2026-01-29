"use client";

import FieldPassword from "@/components/shared/FieldPassword";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { login } from "@/services/authService";

const LoginForm = () => {
  const router = useRouter();
  const [error, setError] = useState("");

  const setUser = useAuthStore((state) => state.setUser);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const data = await login({
        employeeCode: formData.get("employeeCode") as string,
        password: formData.get("password") as string,
      });

      setUser({
        username: data.user.employeeCode,
        role: data.user.role,
        permissions: data.user.permissions ?? [],
      });

      router.push("/dashboard");
    } catch {
      setError("Invalid username or password");
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="border border-primary bg-card rounded-2xl px-5 py-6 shadow-2xl"
    >
      <p className="font-semibold text-3xl mb-6 text-center">Welcome Back</p>

      <FieldGroup>
        <Field className="gap-1">
          <FieldLabel htmlFor="employeeCode">Employee Code</FieldLabel>
          <Input
            id="employeeCode"
            name="employeeCode"
            placeholder="Ex: M000001"
            required
          />
        </Field>

        <FieldPassword name="password" label="Password" />
      </FieldGroup>

      <div className="text-sm flex mt-2 mb-4 justify-between">
        <Field orientation="horizontal">
          <Checkbox name="remember" id="remember" />
          <FieldLabel htmlFor="remember">Remember me</FieldLabel>
        </Field>

        <Link href="/forgot" className="underline">
          Forgot Your Password?
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-2 mb-2 bg-danger/10 rounded-lg text-danger">
          <Info className="size-4" />
          <span>{error}</span>
        </div>
      )}

      <Button type="submit" size="lg" className="w-full">
        Login
      </Button>
    </form>
  );
};

export default LoginForm;

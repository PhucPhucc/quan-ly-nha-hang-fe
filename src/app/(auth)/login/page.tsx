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
<<<<<<< HEAD
import { useAuthStore } from "@/store/useAuthStore";
import { login } from "@/services/authService";
=======
>>>>>>> ca2629262827584f63d0fe67e54804bb6126b32b

const Page = () => {
  const router = useRouter();
  const [error, setError] = useState("");

<<<<<<< HEAD
  const setUser = useAuthStore((state) => state.setUser);

=======
>>>>>>> ca2629262827584f63d0fe67e54804bb6126b32b
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
<<<<<<< HEAD

    try {
      const data = await login({
        employeeCode: formData.get("employeeCode"),
        password: formData.get("password"),
      });

      setUser({
        username: data.user.employeeCode,
        role: data.user.role,
        permissions: data.user.permissions ?? [],
      });

      router.push("/dashboard");
    } catch {
=======
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Login failed");
      }

      const data = await res.json();

      // lưu token
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/dashboard");
    } catch (err) {
>>>>>>> ca2629262827584f63d0fe67e54804bb6126b32b
      setError("Invalid username or password");
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="border border-primary bg-card rounded-2xl px-5 py-6 shadow-2xl"
    >
<<<<<<< HEAD
      <p className="font-semibold text-3xl mb-6 text-center">Welcome Back</p>

      <FieldGroup>
        <Field className="gap-1">
          <FieldLabel className="text-md" htmlFor="employeeCode">
            Employee Code
=======
      <p className="font-semibold text-3xl mb-6 text-center">
        Welcome Back
      </p>

      <FieldGroup>
        <Field className="gap-1">
          <FieldLabel className="text-md" htmlFor="username">
            Username
>>>>>>> ca2629262827584f63d0fe67e54804bb6126b32b
          </FieldLabel>
          <Input
            className="border-primary outline-none ring-0"
            type="text"
<<<<<<< HEAD
            id="employeeCode"
            name="employeeCode"
            placeholder="Ex: M000001"
=======
            id="username"
            name="username"
            placeholder="Enter Username"
>>>>>>> ca2629262827584f63d0fe67e54804bb6126b32b
            required
          />
        </Field>

        <FieldPassword name="password" label="Password" />
      </FieldGroup>

      <div className="text-sm flex mt-2 mb-4 justify-between">
        <FieldGroup>
          <Field orientation="horizontal">
            <Checkbox name="remember" id="remember" />
<<<<<<< HEAD
            <FieldLabel htmlFor="remember">Remember me</FieldLabel>
=======
            <FieldLabel htmlFor="remember">
              Remember me
            </FieldLabel>
>>>>>>> ca2629262827584f63d0fe67e54804bb6126b32b
          </Field>
        </FieldGroup>

        <Link
          className="flex-1 text-nowrap underline hover:text-primary-hover"
          href="/forgot"
        >
          Forgot Your Password?
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-2 mb-2 bg-danger/10 rounded-lg text-danger">
          <Info className="size-4" />
          <span>{error}</span>
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full cursor-pointer hover:bg-primary-hover"
      >
        Login
      </Button>
    </form>
  );
};

export default Page;

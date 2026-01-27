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

const Page = () => {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
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
      setError("Invalid username or password");
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="border border-primary bg-card rounded-2xl px-5 py-6 shadow-2xl"
    >
      <p className="font-semibold text-3xl mb-6 text-center">
        Welcome Back
      </p>

      <FieldGroup>
        <Field className="gap-1">
          <FieldLabel className="text-md" htmlFor="username">
            Username
          </FieldLabel>
          <Input
            className="border-primary outline-none ring-0"
            type="text"
            id="username"
            name="username"
            placeholder="Enter Username"
            required
          />
        </Field>

        <FieldPassword name="password" label="Password" />
      </FieldGroup>

      <div className="text-sm flex mt-2 mb-4 justify-between">
        <FieldGroup>
          <Field orientation="horizontal">
            <Checkbox name="remember" id="remember" />
            <FieldLabel htmlFor="remember">
              Remember me
            </FieldLabel>
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

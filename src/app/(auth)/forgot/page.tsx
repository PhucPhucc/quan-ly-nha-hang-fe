
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const ForgotPasswordPage = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Submit forgot password");
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-primary bg-card px-5 py-6 shadow-2xl"
    >
      <h1 className="mb-2 text-center text-3xl font-semibold">
        Forgot your password?
      </h1>
      <p className="mb-6 text-center text-sm text-muted-foreground">
        Please enter your username or email to recover your password
      </p>
      <FieldGroup>
        <Field className="gap-1">
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <Input
            id="username"
            name="username"
            placeholder="Enter your username"
            required
            className="border-primary"
          />
        </Field>
      </FieldGroup>
      <Button
        type="submit"
        size="lg"
        className="mt-6 w-full hover:bg-primary-hover"
      >
        Submit Now
      </Button>
      <div className="mt-4 text-center text-sm">
        <Link
          href="/login"
          className="underline hover:text-primary-hover"
        >
          Back to login
        </Link>
      </div>
    </form>
  );
};

export default ForgotPasswordPage;

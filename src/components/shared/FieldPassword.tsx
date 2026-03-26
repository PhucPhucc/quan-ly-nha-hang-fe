"use client";

import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { InputHTMLAttributes } from "react";

import { Button } from "../ui/button";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

type FieldPasswordProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
};

const FieldPassword = ({ name, label, ...props }: FieldPasswordProps) => {
  const [isShowPass, setIsShowPass] = useState(false);

  return (
    <Field className="gap-1">
      <FieldLabel className="text-md" htmlFor={name}>
        {label}
      </FieldLabel>

      {/* <InputGroup>
        <InputGroupInput
          id={name}
          name={name}
          type={isShowPass ? "text" : "password"}
          placeholder="********"
          {...props}
          required
        />

        <InputGroupAddon
          align="inline-end"
          className="cursor-pointer"
          onClick={() => setIsShowPass((prev) => !prev)}
        >
          {isShowPass ? <Eye /> : <EyeClosed />}
        </InputGroupAddon>
      </InputGroup> */}

      <div className="relative">
        <Input
          id={name}
          name={name}
          type={isShowPass ? "text" : "password"}
          placeholder="********"
          {...props}
          required
        />

        <Button
          size="icon"
          variant="ghost"
          type="button"
          onClick={() => setIsShowPass((prev) => !prev)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:bg-transparent cursor-pointer"
        >
          {isShowPass ? <Eye className="size-4" /> : <EyeClosed className="size-4" />}
        </Button>
      </div>
    </Field>
  );
};

export default FieldPassword;

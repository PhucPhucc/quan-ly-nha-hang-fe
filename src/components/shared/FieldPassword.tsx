"use client";

import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { InputHTMLAttributes } from "react";

import { Field, FieldLabel } from "../ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";

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

      <InputGroup>
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
      </InputGroup>
    </Field>
  );
};

export default FieldPassword;

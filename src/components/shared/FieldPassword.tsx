"use client";

import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";

import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

type FieldPasswordProps = {
  name: string;
  label: string;
};

const FieldPassword = ({ name, label }: FieldPasswordProps) => {
  const [isShowPass, setIsShowPass] = useState(false);

  return (
    <Field className="gap-1">
      <FieldLabel className="text-md" htmlFor={name}>
        {label}
      </FieldLabel>
      <InputGroup className="border border-primary">
        <InputGroupInput
          id={name}
          name={name}
          type={isShowPass ? "text" : "password"}
          placeholder="Enter password"
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

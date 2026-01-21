"use client";

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Eye, EyeClosed, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const FieldPassword = () => {
  const [isShowPass, setIsShowPass] = useState(false);

  return (
    <Field className='gap-1'>
      <FieldLabel className='text-md' htmlFor='password'>
        Password
      </FieldLabel>
      <InputGroup className="border border-primary">
        <InputGroupInput
          id='password'
          type={isShowPass ? 'text' : 'password'}
          placeholder='Enter password'
        />
        <InputGroupAddon
          align='inline-end'
          className='cursor-pointer'
          onClick={() => setIsShowPass((prev) => !prev)}
        >
          {isShowPass ? <Eye /> : <EyeClosed />}
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription className='text-right'>
        <Link href={"/forgot"}>Forgot password</Link>
      </FieldDescription>
    </Field>
  );
};

export default FieldPassword;

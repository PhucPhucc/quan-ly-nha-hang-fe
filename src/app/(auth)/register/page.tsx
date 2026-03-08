import Link from "next/link";

import FieldPassword from "@/components/shared/FieldPassword";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { UI_TEXT } from "@/lib/UI_Text";

const page = () => {
  return (
    <form
      action=""
      method="post"
      className=" border border-primary bg-card rounded-2xl px-5 py-6 shadow-2xl"
    >
      <p className="font-semibold text-3xl mb-6 text-center">{UI_TEXT.AUTH.LOGIN_TITLE}</p>

      <FieldGroup>
        <Field className="gap-1">
          <FieldLabel className="text-md" htmlFor="username">
            {UI_TEXT.AUTH.EMPLOYEE_CODE}
          </FieldLabel>
          <Input
            className="border-primary outline-none ring-0"
            type="text"
            id="username"
            placeholder={UI_TEXT.AUTH.EMPLOYEE_CODE_PLACEHOLDER}
            required
          />
        </Field>

        <Field>
          <FieldLabel className="text-md" htmlFor="fullName">
            {UI_TEXT.EMPLOYEE.FULLNAME}
          </FieldLabel>
          <Input
            className="border-primary outline-none ring-0"
            type="text"
            id="fullName"
            placeholder={UI_TEXT.EMPLOYEE.FULLNAME_PLACEHOLDER}
            required
          />
        </Field>

        <FieldPassword name="password" label={UI_TEXT.AUTH.PASSWORD} />
      </FieldGroup>

      <div className="text-sm flex mt-2 mb-4 flex-row-reverse justify-between">
        <Link className="decoration-1 underline hover:text-primary-hover" href={"/forgot"}>
          {UI_TEXT.AUTH.FORGOT_PASSWORD}
        </Link>
        {/* <span className='flex items-center gap-1 text-danger'>
              <Info className='size-4' />
              Invalid username or password
            </span> */}
      </div>
      <Button size="lg" className="w-full cursor-pointer hover:bg-primary-hover">
        {UI_TEXT.AUTH.LOGIN}
      </Button>
    </form>
  );
};

export default page;

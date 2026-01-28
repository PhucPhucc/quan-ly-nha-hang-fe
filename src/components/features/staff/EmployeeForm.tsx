import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { DialogClose } from "@radix-ui/react-dialog";
import EmployeeRole from "./EmployeeRole";
import { UI_TEXT } from "@/lib/UI_Text";

const EmployeeForm = () => {
  return (
    <form>
      <FieldGroup className='grid grid-cols-1 gap-4'>
        <Field>
          <FieldLabel htmlFor='fullName'>{UI_TEXT.EMPLOYEE.FULLNAME}</FieldLabel>
          <Input
            id='fullName'
            name='fullName'
            type='text'
            placeholder={`Enter ${UI_TEXT.EMPLOYEE.FULLNAME}`}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor='email'>{UI_TEXT.EMPLOYEE.EMAIL}</FieldLabel>
          <Input
            id='email'
            name='email'
            type='email'
            placeholder={`Enter ${UI_TEXT.EMPLOYEE.EMAIL}`}
          />
        </Field>

        <EmployeeRole />
      </FieldGroup>

      <div className='flex gap-4 justify-end mt-4'>
        <DialogClose asChild>
          <Button
            type='button'
            variant='secondary'
            className='hover:bg-secondary-foreground/20'
          >
            {UI_TEXT.BUTTON.CLOSE}
          </Button>
        </DialogClose>

        <Button type='submit'>{UI_TEXT.BUTTON.SUBMIT}</Button>
      </div>
    </form>
  );
};

export default EmployeeForm;

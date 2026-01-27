import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { DialogClose } from "@radix-ui/react-dialog";
import EmployeeRole from "./EmployeeRole";

const EmployeeForm = () => {
  return (
    <form>
      <FieldGroup className='grid grid-cols-1 gap-4'>
        <Field>
          <FieldLabel htmlFor='fullName'>Full Name</FieldLabel>
          <Input id='fullName' name='fullName' placeholder='Enter Full Name' />
        </Field>

        <Field>
          <FieldLabel htmlFor='email'>Email</FieldLabel>
          <Input
            id='email'
            name='email'
            type='email'
            placeholder='Enter Email'
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
            Close
          </Button>
        </DialogClose>

        <Button type='submit'>Create</Button>
      </div>
    </form>
  );
};

export default EmployeeForm;

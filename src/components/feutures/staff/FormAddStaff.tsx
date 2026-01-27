import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

const FormAddStaff = () => {
  return (
    <form>
      <FieldGroup className='grid grid-cols-2 gap-x-4'>
        <Field>
          <FieldLabel htmlFor='username'>Username</FieldLabel>
          <Input id='username' name='username' placeholder='Enter username' />
        </Field>
        <Field>
          <FieldLabel htmlFor='fullName'>Full Name</FieldLabel>
          <Input id='fullName' name='fullName' placeholder='Enter Full Name' />
        </Field>

        <Field>
          <FieldLabel htmlFor='phone'>Phone Number</FieldLabel>
          <Input
            id='phone'
            name='phone'
            type='number'
            placeholder='Enter Phone Number'
          />
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

        <Field>
          <FieldLabel htmlFor='email'>Date of Birth</FieldLabel>
          <Input id='email' name='email' placeholder='Enter Date of Birth' />
        </Field>
        <Field>
          <FieldLabel>Role of Staff</FieldLabel>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder='Role' />
            </SelectTrigger>
            <SelectContent position='popper'>
              <SelectItem value='manager'>Manager</SelectItem>
              <SelectItem value='cashier'>Cashier</SelectItem>
              <SelectItem value='waiter'>Waiter</SelectItem>
              <SelectItem value='chef'>Chef</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field className='col-span-2'>
          <FieldLabel htmlFor='address'>Address</FieldLabel>
          <Textarea id='address' name='address' placeholder='Enter Address' />
        </Field>
      </FieldGroup>

      <div>
        <Button type='reset' variant='secondary' className="hover:bg-secondary-foreground/80">Cancel</Button>
        <Button type='submit'>Create</Button>
      </div>
    </form>
  );
};

export default FormAddStaff;

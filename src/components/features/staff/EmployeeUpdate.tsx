import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UI_TEXT } from "@/lib/UI_Text";
import { Employee } from "@/types/Employee";
const EmployeeUpdate = ({
  open,
  employee,
  onToggle,
}: {
  open: boolean;
  employee?: Employee | null;
  onToggle: (v: boolean) => void;
}) => {
  return (
    <Drawer open={open} onOpenChange={onToggle} direction='right'>
      <DrawerContent className='rounded-l-xl'>
        <DrawerHeader>
          <DrawerTitle className=' text-3xl'>
            {UI_TEXT.EMPLOYEE.EDIT}
          </DrawerTitle>
          <DrawerDescription>{UI_TEXT.EMPLOYEE.INFO}</DrawerDescription>
        </DrawerHeader>
        {/* form edit employee  */}
        <FieldGroup className='px-4 grid grid-cols-2 gap-x-2 gap-y-4'>
          <Field>
            <Label>{UI_TEXT.EMPLOYEE.EMPLOYEECODE}</Label>
            <Input
              disabled
              defaultValue={employee?.employeeCode || UI_TEXT.COMMON.EMPTY}
              className='cursor-not-allowed'
            />
          </Field>

          <Field>
            <Label>{UI_TEXT.EMPLOYEE.FULLNAME}</Label>
            <Input defaultValue={employee?.fullName || UI_TEXT.COMMON.EMPTY} />
          </Field>

          <Field>
            <Label>{UI_TEXT.EMPLOYEE.PHONE}</Label>
            <Input defaultValue={employee?.phone || UI_TEXT.COMMON.EMPTY} />
          </Field>

          <Field>
            <Label>{UI_TEXT.EMPLOYEE.DOB}</Label>
            <Input
              defaultValue={employee?.dateOfBirth || UI_TEXT.COMMON.EMPTY}
            />
          </Field>

          <Field>
            <Label>{UI_TEXT.EMPLOYEE.ROLE}</Label>
            <Input defaultValue={employee?.role || UI_TEXT.COMMON.EMPTY} />
          </Field>

          <Field>
            <Label>{UI_TEXT.EMPLOYEE.STATUS}</Label>
            <Input defaultValue={employee?.status || UI_TEXT.COMMON.EMPTY} />
          </Field>

          <Field>
            <Label>{UI_TEXT.COMMON.CREATE_AT}</Label>
            <Input defaultValue={employee?.created_at || UI_TEXT.COMMON.EMPTY} />
          </Field>

          <Field>
            <Label>{UI_TEXT.COMMON.UPDATE_AT}</Label>
            <Input defaultValue={employee?.updated_at || UI_TEXT.COMMON.EMPTY} />
          </Field>

          <Field className='col-span-2'>
            <Label>{UI_TEXT.EMPLOYEE.EMAIL}</Label>
            <Input defaultValue={employee?.email || UI_TEXT.COMMON.EMPTY} />
          </Field>

          <Field className='col-span-2'>
            <Label>{UI_TEXT.EMPLOYEE.ADDRESS}</Label>
            <Input defaultValue={employee?.address || UI_TEXT.COMMON.EMPTY} />
          </Field>
        </FieldGroup>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default EmployeeUpdate;

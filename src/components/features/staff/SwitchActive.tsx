import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UI_TEXT } from "@/lib/UI_Text";
import { Label } from "@radix-ui/react-label";
import React, { useState } from "react";

const SwitchActive = ({ active }: { active?: string }) => {
  const [isActive, setIsActive] = useState(active === "Active");
  const text = isActive ? "Active" : "InActive";
  return (
    <Field>
      <div className='flex items-center justify-between'>
        <Label htmlFor='employeeStatus'>{UI_TEXT.EMPLOYEE.STATUS}:</Label>
        <Switch
          id='employeeStatus'
          defaultChecked={isActive}
          onClick={() => setIsActive((prev) => !prev)}
        />
      </div>
      <Input name="active" value={text} readOnly defaultValue={text || UI_TEXT.COMMON.EMPTY} />
    </Field>
  );
};

export default SwitchActive;

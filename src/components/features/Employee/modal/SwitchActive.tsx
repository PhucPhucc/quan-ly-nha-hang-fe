import { Label } from "@radix-ui/react-label";
import React, { useState } from "react";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UI_TEXT } from "@/lib/UI_Text";

const SwitchActive = ({ status }: { status?: string | number }) => {
  const [isActive, setIsActive] = useState(status === "Active");

  const text = isActive ? "Active" : "Inactive";
  return (
    <Field>
      <div className="flex items-center justify-between">
        <Label htmlFor="employeeStatus">{UI_TEXT.EMPLOYEE.STATUS}:</Label>

        <Switch id="employeeStatus" checked={isActive} onCheckedChange={setIsActive} />
      </div>

      <Input name="status" value={text} readOnly />
    </Field>
  );
};

export default SwitchActive;

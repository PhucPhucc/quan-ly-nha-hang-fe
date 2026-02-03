import { Label } from "@radix-ui/react-label";
import React, { useEffect, useState } from "react";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UI_TEXT } from "@/lib/UI_Text";

const SwitchActive = ({ active }: { active?: string }) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(active === "Active");
  }, [active]);

  const text = isActive ? "Active" : "InActive";

  return (
    <Field>
      <div className="flex items-center justify-between">
        <Label htmlFor="employeeStatus">{UI_TEXT.EMPLOYEE.STATUS}:</Label>

        <Switch id="employeeStatus" checked={isActive} onCheckedChange={setIsActive} />
      </div>

      <Input name="active" value={text} readOnly />
    </Field>
  );
};

export default SwitchActive;

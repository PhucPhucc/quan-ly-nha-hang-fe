import React, { useState } from "react";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { UI_TEXT } from "@/lib/UI_Text";

const SwitchChangePassword = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <Field>
      <div className="flex items-center space-x-2">
        <Label htmlFor="auto-change-password">{UI_TEXT.EMPLOYEE.AUTO_GEN}</Label>
        <Switch id="password" checked={isActive} onCheckedChange={setIsActive} />
      </div>

      <Input disabled={isActive} name="password" />
    </Field>
  );
};

export default SwitchChangePassword;

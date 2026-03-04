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
      <div className="flex items-center justify-between">
        <Label htmlFor="password">
          {UI_TEXT.EMPLOYEE.CHANGE_PASSWORD_MODAL.AUTO_GENERATE_PASSWORD_LABEL}
        </Label>

        <Switch id="password" checked={isActive} onCheckedChange={setIsActive} />
      </div>

      <Input
        disabled={isActive}
        name="password"
        placeholder={!isActive ? UI_TEXT.EMPLOYEE.CHANGE_PASSWORD_MODAL.NEW_PASSWORD_LABEL : ""}
      />
    </Field>
  );
};

export default SwitchChangePassword;

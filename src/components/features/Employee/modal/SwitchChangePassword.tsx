import React, { useState } from "react";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { UI_TEXT } from "@/lib/UI_Text";

type Props = {
  onPasswordChange: (value: string | undefined) => void;
};

const SwitchChangePassword = ({ onPasswordChange }: Props) => {
  const [isAutoGen, setIsAutoGen] = useState(false);

  const handleSwitchChange = (checked: boolean) => {
    setIsAutoGen(checked);
    if (checked) {
      // auto-generate: send undefined so server generates it
      onPasswordChange(undefined);
    }
  };

  return (
    <Field>
      <div className="flex items-center space-x-2">
        <Label htmlFor="auto-change-password">{UI_TEXT.EMPLOYEE.AUTO_GEN}</Label>
        <Switch
          id="auto-change-password"
          checked={isAutoGen}
          onCheckedChange={handleSwitchChange}
        />
      </div>

      <Input disabled={isAutoGen} onChange={(e) => onPasswordChange(e.target.value || undefined)} />
    </Field>
  );
};

export default SwitchChangePassword;

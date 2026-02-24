import React, { useState } from "react";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const SwitchChangePassword = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <Field>
      <div className="flex items-center justify-between">
        <Label htmlFor="password">Tu dong tao mat khau:</Label>

        <Switch id="password" checked={isActive} onCheckedChange={setIsActive} />
      </div>

      <Input disabled={isActive} name="password" />
    </Field>
  );
};

export default SwitchChangePassword;

import { Label } from "@radix-ui/react-label";
import React, { useEffect, useState } from "react";

import { Switch } from "@/components/ui/switch";
import { UI_TEXT } from "@/lib/UI_Text";
import { EmployeeStatus } from "@/types/Employee";

type SwitchActiveProps = {
  status?: string | number;
  onChange?: (value: EmployeeStatus) => void;
};

const normalizeStatus = (status?: string | number): EmployeeStatus => {
  const value = String(status).toLowerCase();
  if (value === "active" || value === "1") {
    return EmployeeStatus.ACTIVE;
  }
  return EmployeeStatus.INACTIVE;
};

const SwitchActive = ({ status, onChange }: SwitchActiveProps) => {
  const [isActive, setIsActive] = useState(normalizeStatus(status) === EmployeeStatus.ACTIVE);

  useEffect(() => {
    setIsActive(normalizeStatus(status) === EmployeeStatus.ACTIVE);
  }, [status]);

  const handleCheckedChange = (checked: boolean) => {
    setIsActive(checked);
    onChange?.(checked ? EmployeeStatus.ACTIVE : EmployeeStatus.INACTIVE);
  };

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="active-mode" className="flex items-center gap-1">
        {UI_TEXT.EMPLOYEE.STATUS}
        {UI_TEXT.COMMON.COLON}
      </Label>
      <Switch id="active-mode" checked={isActive} onCheckedChange={handleCheckedChange} />
      <input
        type="hidden"
        name="status"
        value={isActive ? EmployeeStatus.ACTIVE : EmployeeStatus.INACTIVE}
      />
    </div>
  );
};

export default SwitchActive;

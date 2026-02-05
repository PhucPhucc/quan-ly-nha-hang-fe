import React from "react";

import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UI_TEXT } from "@/lib/UI_Text";

const EmployeeSelectRole = () => {
  return (
    <Field>
      <FieldLabel>{UI_TEXT.ROLE.TITLE}</FieldLabel>
      <Select name="role" required>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem className="hover:bg-secondary-foreground/20" value="1">
            {UI_TEXT.ROLE.MANAGER}
          </SelectItem>
          <SelectItem className="hover:bg-secondary-foreground/20" value="2">
            {UI_TEXT.ROLE.CASHIER}
          </SelectItem>
          <SelectItem className="hover:bg-secondary-foreground/20" value="3">
            {UI_TEXT.ROLE.WAITER}
          </SelectItem>
          <SelectItem className="hover:bg-secondary-foreground/20" value="4">
            {UI_TEXT.ROLE.CHEF}
          </SelectItem>
        </SelectContent>
      </Select>
    </Field>
  );
};

export default EmployeeSelectRole;

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
          <SelectItem className="hover:bg-secondary-foreground/20" value="manager">
            {UI_TEXT.ROLE.MANAGER}
          </SelectItem>
          <SelectItem className="hover:bg-secondary-foreground/20" value="cashier">
            {UI_TEXT.ROLE.CASHIER}
          </SelectItem>
          <SelectItem className="hover:bg-secondary-foreground/20" value="waiter">
            {UI_TEXT.ROLE.WAITER}
          </SelectItem>
          <SelectItem className="hover:bg-secondary-foreground/20" value="chefbar">
            {UI_TEXT.ROLE.CHEF}
          </SelectItem>
        </SelectContent>
      </Select>
    </Field>
  );
};

export default EmployeeSelectRole;

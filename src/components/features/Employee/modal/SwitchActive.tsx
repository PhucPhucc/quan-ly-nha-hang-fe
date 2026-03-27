import { Label } from "@radix-ui/react-label";

import { Switch } from "@/components/ui/switch";
import { UI_TEXT } from "@/lib/UI_Text";

const SwitchActive = ({ status }: { status?: string | number }) => {
  const isActive = String(status).toLowerCase() === "active" || status === 1;
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="status" className="flex items-center gap-1">
        {UI_TEXT.EMPLOYEE.STATUS}
        {UI_TEXT.COMMON.COLON}
      </Label>
      <Switch
        name="status"
        id="status"
        defaultValue={isActive ? "active" : "inactive"}
        defaultChecked={isActive}
      />
    </div>
  );
};

export default SwitchActive;

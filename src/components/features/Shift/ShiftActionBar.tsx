import { Download } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";

interface ShiftActionBarProps {
  onExport: () => void;
  rightActions?: React.ReactNode;
}

const ShiftActionBar = ({ onExport, rightActions }: ShiftActionBarProps) => {
  return (
    <div className="flex justify-end bg-background p-2.5 rounded-xl w-full">
      <div className="flex items-center gap-3 w-full lg:w-auto">
        <Button
          variant="outline"
          className="flex-1 lg:flex-none px-4 gap-2 rounded-lg bg-card text-card-foreground hover:text-primary hover:border-primary/20 transition-all shadow-sm"
          onClick={onExport}
        >
          <Download className="size-4" />
          <span>{UI_TEXT.COMMON.EXPORT}</span>
        </Button>
        {rightActions}
      </div>
    </div>
  );
};

export default ShiftActionBar;

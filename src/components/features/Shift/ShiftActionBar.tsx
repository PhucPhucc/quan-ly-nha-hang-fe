import { Download, Search } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UI_TEXT } from "@/lib/UI_Text";

interface ShiftActionBarProps {
  onSearch: (value: string) => void;
  onExport: () => void;
  rightActions?: React.ReactNode;
}

const ShiftActionBar = ({ onSearch, onExport, rightActions }: ShiftActionBarProps) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-background p-2.5 rounded-xl border w-full">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground transition-colors" />
        <Input
          placeholder={UI_TEXT.COMMON.SEARCH}
          className="pl-10 bg-card border text-[13px] rounded-lg focus-visible:ring-primary/20 shadow-sm transition-all w-full"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

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

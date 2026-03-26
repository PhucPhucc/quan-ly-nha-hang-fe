import { Download, Search } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UI_TEXT } from "@/lib/UI_Text";

interface ShiftActionBarProps {
  onSearch: (value: string) => void;
  onExport: () => void;
}

const ShiftActionBar = ({ onSearch, onExport }: ShiftActionBarProps) => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-3 w-full">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        <Input
          placeholder={UI_TEXT.COMMON.SEARCH}
          className="pl-10 h-11 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all w-full"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto">
        <Button
          variant="outline"
          className="flex-1 md:flex-none h-11 px-4 gap-2 rounded-2xl border-slate-100 text-slate-600 font-semibold hover:bg-slate-50"
          onClick={onExport}
        >
          <Download className="size-4" />
          <span>{UI_TEXT.COMMON.EXPORT}</span>
        </Button>
      </div>
    </div>
  );
};

export default ShiftActionBar;

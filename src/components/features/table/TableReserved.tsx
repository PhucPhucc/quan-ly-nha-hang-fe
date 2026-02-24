import { Plus } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";

const TableReserved = () => {
  return (
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      <span className="hidden md:inline">{UI_TEXT.TABLE.RESERVATION_BTN}</span>
    </Button>
  );
};

export default TableReserved;

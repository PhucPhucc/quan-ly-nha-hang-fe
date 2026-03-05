import { Filter } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UI_TEXT } from "@/lib/UI_Text";

const TableFilter = () => {
  return (
    <Select>
      <SelectTrigger className="flex w-auto  items-center gap-2 px-2 py-1.5 md:w-36">
        <Filter className="md:hidden h-4 w-4" />

        <span className="hidden md:inline">
          <SelectValue placeholder={UI_TEXT.COMMON.FILTER} />
        </span>
      </SelectTrigger>

      <SelectContent position="popper">
        <SelectItem value="manager">{UI_TEXT.TABLE.READY}</SelectItem>
        <SelectItem value="cashier">{UI_TEXT.TABLE.SERVING}</SelectItem>
        <SelectItem value="waiter">{UI_TEXT.TABLE.RESERVED}</SelectItem>
        <SelectItem value="chef">{UI_TEXT.TABLE.CLEANING}</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default TableFilter;

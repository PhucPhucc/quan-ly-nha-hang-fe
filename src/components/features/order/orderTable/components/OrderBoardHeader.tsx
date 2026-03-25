import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useOrderBoardStore } from "@/store/useOrderStore";

import SelectAreaTable from "./SelectAreaTable";

const OrderBoardHeader = () => {
  const searchQuery = useOrderBoardStore((s) => s.searchQuery);
  const setSearchQuery = useOrderBoardStore((s) => s.setSearchQuery);

  return (
    <div className="px-5 py-4 border-b space-y-4 bg-muted/5">
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo mã đơn hàng..."
            className="pl-10 bg-background border-muted-foreground/20 rounded-2xl shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <SelectAreaTable />
      </div>
    </div>
  );
};

export default OrderBoardHeader;

import { RefreshCcw, Search } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UI_TEXT } from "@/lib/UI_Text";
import { OrderType } from "@/types/enums";

const BillingHistoryFilter = ({
  typeFilter,
  paymentFilter,
  search,
  onSearch,
  onTypeFilter,
  onPaymentFilter,
}: {
  typeFilter: string;
  paymentFilter: string;
  search: string;
  onSearch: (search: string) => void;
  onTypeFilter: (type: string) => void;
  onPaymentFilter: (payment: string) => void;
}) => {
  return (
    <Card className="overflow-hidden border bg-background">
      <CardContent className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto] lg:items-center p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              onSearch(e.target.value);
            }}
            placeholder={UI_TEXT.ORDER.BILLING.SEARCH_PLACEHOLDER}
            className="pl-10 bg-card text-card-foreground placeholder:text-muted-foreground border border-border focus-visible:ring-2 focus-visible:ring-ring/30"
          />
        </div>

        <Select
          value={typeFilter}
          onValueChange={(value) => {
            onTypeFilter(value);
          }}
        >
          <SelectTrigger className=" w-full lg:w-36">
            <SelectValue placeholder={UI_TEXT.ORDER.BILLING.TYPE_PLACEHOLDER} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{UI_TEXT.COMMON.ALL}</SelectItem>
            <SelectItem value={OrderType.DineIn}>{UI_TEXT.ORDER.BILLING.DINE_IN}</SelectItem>
            <SelectItem value={OrderType.Takeaway}>{UI_TEXT.ORDER.BILLING.TAKEAWAY}</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={paymentFilter}
          onValueChange={(value) => {
            onPaymentFilter(value);
          }}
        >
          <SelectTrigger className=" w-full lg:w-52">
            <SelectValue placeholder={UI_TEXT.ORDER.BILLING.METHOD_PLACEHOLDER} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{UI_TEXT.ORDER.BILLING.ALL_METHODS}</SelectItem>
            <SelectItem value="Cash">{UI_TEXT.ORDER.BILLING.CASH}</SelectItem>
            <SelectItem value="BankTransfer">{UI_TEXT.ORDER.BILLING.TRANSFER}</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          className="group"
          onClick={() => {
            onSearch("");
            onTypeFilter("ALL");
            onPaymentFilter("ALL");
          }}
        >
          <RefreshCcw className="size-4 group-hover:animate-spin" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default BillingHistoryFilter;

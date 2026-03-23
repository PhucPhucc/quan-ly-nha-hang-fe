"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import BillingHistoryTable from "@/components/features/order/manager/BillingHistoryTable";
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
import { getErrorMessage } from "@/lib/error";
import { UI_TEXT } from "@/lib/UI_Text";
import { billingService } from "@/services/billingService";
import { BillingHistoryRecord } from "@/types/Billing";
import { OrderType } from "@/types/enums";

export default function BillingHistoryPage() {
  const router = useRouter();
  const [records, setRecords] = useState<BillingHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBilling = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await billingService.getBillingHistory({
        pageNumber,
        pageSize: 10,
        ...(search && { search }),
        ...(typeFilter !== "ALL" && { orderType: typeFilter as OrderType }),
        ...(paymentFilter !== "ALL" && { paymentMethod: paymentFilter }),
      });

      if (response.isSuccess && response.data) {
        setRecords(response.data.items || []);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setError(response.message || UI_TEXT.ORDER.BILLING.FETCH_ERROR);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [pageNumber, paymentFilter, search, typeFilter]);

  useEffect(() => {
    fetchBilling();
  }, [fetchBilling]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 p-4">
      <Card className="overflow-hidden border">
        <CardContent className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto] lg:items-center">
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPageNumber(1);
            }}
            placeholder={UI_TEXT.ORDER.BILLING.SEARCH_PLACEHOLDER}
          />

          <Select
            value={typeFilter}
            onValueChange={(value) => {
              setTypeFilter(value);
              setPageNumber(1);
            }}
          >
            <SelectTrigger className="h-10 w-full lg:w-[180px]">
              <SelectValue placeholder={UI_TEXT.ORDER.BILLING.TYPE_PLACEHOLDER} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{UI_TEXT.COMMON.ALL}</SelectItem>
              <SelectItem value={OrderType.DineIn}>{UI_TEXT.ORDER.BILLING.DINE_IN}</SelectItem>
              <SelectItem value={OrderType.Takeaway}>{UI_TEXT.ORDER.BILLING.TAKEAWAY}</SelectItem>
              <SelectItem value={OrderType.Delivery}>{UI_TEXT.ORDER.BILLING.DELIVERY}</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={paymentFilter}
            onValueChange={(value) => {
              setPaymentFilter(value);
              setPageNumber(1);
            }}
          >
            <SelectTrigger className="h-10 w-full lg:w-[180px]">
              <SelectValue placeholder={UI_TEXT.ORDER.BILLING.METHOD_PLACEHOLDER} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{UI_TEXT.ORDER.BILLING.ALL_METHODS}</SelectItem>
              <SelectItem value="Cash">{UI_TEXT.ORDER.BILLING.CASH}</SelectItem>
              <SelectItem value="BankTransfer">{UI_TEXT.ORDER.BILLING.TRANSFER}</SelectItem>
              <SelectItem value="CreditCard">{UI_TEXT.ORDER.BILLING.CARD}</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => {
              setSearch("");
              setTypeFilter("ALL");
              setPaymentFilter("ALL");
              setPageNumber(1);
            }}
          >
            {UI_TEXT.COMMON.RESET}
          </Button>
        </CardContent>
      </Card>

      <BillingHistoryTable
        records={records}
        loading={loading}
        error={error}
        pageNumber={pageNumber}
        totalPages={totalPages}
        onPageChange={setPageNumber}
        onRetry={fetchBilling}
        onRowSelect={(record) => router.push(`/manager/order/${record.orderId}`)}
      />
    </div>
  );
}

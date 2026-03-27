"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import BillingHistoryTable from "@/components/features/order/manager/BillingHistoryTable";
import { getErrorMessage } from "@/lib/error";
import { UI_TEXT } from "@/lib/UI_Text";
import { billingService } from "@/services/billingService";
import { BillingHistoryRecord } from "@/types/Billing";

import BillingHistoryFilter from "./BillingHistoryFilter";

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
        ...(typeFilter !== "ALL" && { filters: { orderType: typeFilter } }),
        ...(paymentFilter !== "ALL" && { filters: { paymentMethod: paymentFilter } }),
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
      <BillingHistoryFilter
        typeFilter={typeFilter}
        paymentFilter={paymentFilter}
        search={search}
        onSearch={setSearch}
        onTypeFilter={setTypeFilter}
        onPaymentFilter={setPaymentFilter}
      />

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

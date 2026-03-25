import type { QueryClient } from "@tanstack/react-query";

const INVENTORY_QUERY_PREFIXES = [
  ["inventory-settings"],
  ["inventory-groups"],
  ["opening-stock-ingredients"],
  ["ingredients"],
  ["inventory-report"],
  ["inventory-report-ingredients"],
  ["inventory-ledger"],
  ["inventory-ledger-ingredients"],
  ["inventory-transactions"],
  ["inventory-checks"],
  ["inventory-check"],
  ["inventory-check-create-form"],
  ["inventory-alerts"],
  ["inventory-alerts-badge"],
  ["inventory-lots"],
  ["inventory-lots-filter-ingredients"],
] as const;

export function invalidateInventoryQueries(queryClient: QueryClient) {
  return Promise.all(
    INVENTORY_QUERY_PREFIXES.map((queryKey) => queryClient.invalidateQueries({ queryKey }))
  );
}

import { useTableStore } from "@/store/useTableStore";

export interface OrderTableDisplay {
  tableNumber?: number;
  tableCode?: string;
  areaName?: string;
  areaCodePrefix?: string;
  tableLabel?: string;
}

export const resolveOrderTableDisplay = (tableId?: string | null): OrderTableDisplay => {
  if (!tableId) {
    return {};
  }

  const { tables, areas } = useTableStore.getState();
  const table = tables.find((item) => item.tableId === tableId);
  if (table) {
    const area = areas.find((item) => item.areaId === table.areaId);
    const tableCode = table.tableCode || (table.tableNumber ? String(table.tableNumber) : "");
    const areaName = area?.name || area?.codePrefix;
    const tableLabel = areaName
      ? `${areaName} - ${tableCode ? `Bàn ${tableCode}` : `Bàn ${table.tableNumber}`}`
      : tableCode
        ? `Bàn ${tableCode}`
        : `Bàn ${table.tableNumber}`;

    return {
      tableNumber: table.tableNumber,
      tableCode,
      areaName: area?.name,
      areaCodePrefix: area?.codePrefix,
      tableLabel,
    };
  }

  const legacyTableNumber = Number.parseInt(tableId, 10);
  return Number.isFinite(legacyTableNumber)
    ? {
        tableNumber: legacyTableNumber,
        tableLabel: `Bàn ${legacyTableNumber}`,
      }
    : {};
};

export const resolveOrderTableNumber = (tableId?: string | null): number | undefined =>
  resolveOrderTableDisplay(tableId).tableNumber;

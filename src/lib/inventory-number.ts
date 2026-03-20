export const INVENTORY_QUANTITY_SCALE = 3;

export function normalizeInventoryQuantity(
  value: number,
  fractionDigits: number = INVENTORY_QUANTITY_SCALE
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  const factor = 10 ** fractionDigits;
  const normalized = Math.round((value + Number.EPSILON) * factor) / factor;

  return Object.is(normalized, -0) ? 0 : normalized;
}

export function formatInventoryQuantity(
  value: number,
  fractionDigits: number = INVENTORY_QUANTITY_SCALE
): string {
  return normalizeInventoryQuantity(value, fractionDigits).toLocaleString("vi-VN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  });
}

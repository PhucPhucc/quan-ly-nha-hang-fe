import { describe, expect, it } from "vitest";

import { OrderStatus, OrderType } from "@/types/enums";
import { Order } from "@/types/Order";

import { isMergeCandidateOrder, isTableOccupyingOrder } from "../orderTable.utils";

const createOrder = (overrides: Partial<Order> = {}): Order => ({
  orderId: "order-1",
  orderCode: "ORD-001",
  orderType: OrderType.DineIn,
  status: OrderStatus.Serving,
  tableId: "table-1",
  totalAmount: 100000,
  isPriority: false,
  createdAt: new Date().toISOString(),
  orderItems: [],
  ...overrides,
});

describe("isTableOccupyingOrder", () => {
  it("returns true for a serving dine-in order that is still attached to a table", () => {
    expect(isTableOccupyingOrder(createOrder())).toBe(true);
  });

  it("returns false for a merged order so an empty table does not keep showing the old order code", () => {
    expect(isTableOccupyingOrder(createOrder({ status: OrderStatus.Merged }))).toBe(false);
  });

  it("returns false when an order no longer has a table assigned", () => {
    expect(isTableOccupyingOrder(createOrder({ tableId: undefined }))).toBe(false);
  });
});

describe("isMergeCandidateOrder", () => {
  it("returns true for another dine-in serving order on a table", () => {
    expect(isMergeCandidateOrder(createOrder({ orderId: "order-2" }), "order-1")).toBe(true);
  });

  it("returns false for the current source order", () => {
    expect(isMergeCandidateOrder(createOrder(), "order-1")).toBe(false);
  });

  it("returns false for completed orders", () => {
    expect(isMergeCandidateOrder(createOrder({ status: OrderStatus.Completed }), "order-1")).toBe(
      false
    );
  });

  it("returns false for merged orders", () => {
    expect(isMergeCandidateOrder(createOrder({ status: OrderStatus.Merged }), "order-1")).toBe(
      false
    );
  });

  it("returns false for takeaway orders", () => {
    expect(
      isMergeCandidateOrder(
        createOrder({ orderType: OrderType.Takeaway, tableId: undefined }),
        "order-1"
      )
    ).toBe(false);
  });
});

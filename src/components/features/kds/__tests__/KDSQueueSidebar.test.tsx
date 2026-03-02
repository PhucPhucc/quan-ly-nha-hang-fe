import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import React from "react";

import { UI_TEXT } from "@/lib/UI_Text";
import { OrderItemStatus, OrderStatus, OrderType } from "@/types/enums";
import { Order } from "@/types/Order";

import { KDSQueueSidebar } from "../KDSQueueSidebar";

const MOCK_QUEUE_ORDERS: Order[] = [
  {
    orderId: "1",
    orderCode: "ORD-001",
    status: OrderStatus.Serving,
    orderType: OrderType.DineIn,
    totalAmount: 0,
    isPriority: false,
    createdAt: new Date().toISOString(),
    orderItems: [
      {
        orderItemId: "oi1",
        orderId: "1",
        menuItemId: "m1",
        quantity: 1,
        status: OrderItemStatus.Preparing,
        itemCodeSnapshot: "M1",
        itemNameSnapshot: "Item 1",
        unitPriceSnapshot: 0,
        createdAt: new Date().toISOString(),
        stationSnapshot: "HOT",
      },
    ],
  },
  {
    orderId: "2",
    orderCode: "ORD-002",
    status: OrderStatus.Serving,
    orderType: OrderType.DineIn,
    totalAmount: 0,
    isPriority: false,
    createdAt: new Date().toISOString(),
    orderItems: [
      {
        orderItemId: "oi2",
        orderId: "2",
        menuItemId: "m2",
        quantity: 1,
        status: OrderItemStatus.Preparing,
        itemCodeSnapshot: "M2",
        itemNameSnapshot: "Item 2",
        unitPriceSnapshot: 0,
        createdAt: new Date().toISOString(),
        stationSnapshot: "HOT",
      },
    ],
  },
];

describe("KDSQueueSidebar", () => {
  it("renders queue title and current time", () => {
    render(<KDSQueueSidebar queueOrders={[]} currentTime="10:30" />);

    expect(screen.getByText(/Hàng Đợi/i)).toBeInTheDocument();
    expect(screen.getByText("10:30")).toBeInTheDocument();
  });

  it("renders empty message when no orders", () => {
    render(<KDSQueueSidebar queueOrders={[]} currentTime="10:30" />);
    expect(screen.getByText(UI_TEXT.KDS.ORDER.EMPTY_QUEUE)).toBeInTheDocument();
  });

  it("renders queue orders correctly", () => {
    render(<KDSQueueSidebar queueOrders={MOCK_QUEUE_ORDERS} currentTime="10:30" />);

    // Check if the order numbers (last part of ORD-XXX) are displayed
    expect(screen.getByText("#001")).toBeInTheDocument();
    expect(screen.getByText("#002")).toBeInTheDocument();
  });
});

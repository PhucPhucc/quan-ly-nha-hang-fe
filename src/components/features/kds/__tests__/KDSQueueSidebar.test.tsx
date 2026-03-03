import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import React from "react";

import { UI_TEXT } from "@/lib/UI_Text";
import { useKdsStore } from "@/store/useKdsStore";
import { OrderItemStatus, OrderStatus, OrderType } from "@/types/enums";
import { Order } from "@/types/Order";

// Mock the store
vi.mock("@/store/useKdsStore");

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

const mockStartCooking = vi.fn();

function setupStoreMock(queueOrders: Order[] = []) {
  vi.mocked(useKdsStore).mockImplementation((selector: unknown) => {
    const state = {
      queueOrders: queueOrders,
      startCooking: mockStartCooking,
    };
    return typeof selector === "function"
      ? (selector as (s: typeof state) => unknown)(state)
      : state;
  });
}

// We need to import the component after the mock is set up
import { KDSQueueSidebar } from "../KDSQueueSidebar";

describe("KDSQueueSidebar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders queue title and current time", () => {
    setupStoreMock([]);
    render(<KDSQueueSidebar />);

    expect(screen.getByText(/Hàng Đợi/i)).toBeInTheDocument();
    // currentTime is now managed internally, just check the time container exists
    expect(screen.getByText(/\d{2}:\d{2}/)).toBeInTheDocument();
  });

  it("renders empty message when no orders", () => {
    setupStoreMock([]);
    render(<KDSQueueSidebar />);
    expect(screen.getByText(UI_TEXT.KDS.ORDER.EMPTY_QUEUE)).toBeInTheDocument();
  });

  it("renders queue orders correctly", () => {
    setupStoreMock(MOCK_QUEUE_ORDERS);
    render(<KDSQueueSidebar />);

    // Check if the order numbers (last part of ORD-XXX) are displayed
    expect(screen.getByText("#001")).toBeInTheDocument();
    expect(screen.getByText("#002")).toBeInTheDocument();
  });
});

import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import React from "react";

import { Order } from "@/types/Order";

import { KDSQueueHeader } from "../KDSQueueHeader";

describe("KDSQueueHeader", () => {
  it("renders correctly with queue orders and current time", () => {
    const mockOrders = [
      { orderId: "o1", orderCode: "105" } as Order,
      { orderId: "o2", orderCode: "ORD-110" } as Order,
    ];

    render(<KDSQueueHeader queueOrders={mockOrders} currentTime="11:45" />);

    // Checks that the time displays
    expect(screen.getByText("11:45")).toBeInTheDocument();

    // Checks that orders appear in the queue with hash prefixes
    expect(screen.getByText("#105")).toBeInTheDocument();
    expect(screen.getByText("#110")).toBeInTheDocument(); // because the component splits by '-'
  });

  it("renders an empty state text when there are no queue orders", () => {
    render(<KDSQueueHeader queueOrders={[]} currentTime="12:00" />);

    expect(screen.getByText("Không có đơn hàng chờ")).toBeInTheDocument();
  });
});

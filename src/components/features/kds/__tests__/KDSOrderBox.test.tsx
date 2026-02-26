import "@testing-library/jest-dom";

import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import { UI_TEXT } from "@/lib/UI_Text";
import { OrderItemStatus, OrderStatus, OrderType } from "@/types/enums";
import { Order } from "@/types/Order";

import { KDSOrderBox } from "../KDSOrderBox";

describe("KDSOrderBox", () => {
  const mockOrder: Order = {
    orderId: "o1",
    orderCode: "ORD-098",
    orderType: OrderType.DineIn,
    status: OrderStatus.Serving,
    totalAmount: 0,
    isPriority: false,
    createdAt: new Date().toISOString(),
    orderItems: [
      {
        orderItemId: "oi1",
        orderId: "o1",
        menuItemId: "m1",
        itemCodeSnapshot: "M1",
        itemNameSnapshot: "Gà Nướng Mật Ong",
        stationSnapshot: "HOT",
        status: OrderItemStatus.Cooking,
        quantity: 2,
        unitPriceSnapshot: 0,
        createdAt: new Date().toISOString(),
      },
    ],
  };

  it("renders order header information correctly", () => {
    render(<KDSOrderBox order={mockOrder} />);
    expect(screen.getByText("ORD-098")).toBeInTheDocument();
    expect(screen.getByText(UI_TEXT.KDS.ORDER.STATUS_SERVING)).toBeInTheDocument();
  });

  it("renders order items inside the box", () => {
    render(<KDSOrderBox order={mockOrder} />);
    expect(screen.getByText("Gà Nướng Mật Ong")).toBeInTheDocument();
    expect(screen.getByText("x2")).toBeInTheDocument();
  });

  it("displays empty state if no items in order", () => {
    const emptyOrder = { ...mockOrder, orderItems: [] };
    render(<KDSOrderBox order={emptyOrder} />);
    expect(screen.getByText(UI_TEXT.KDS.ORDER.EMPTY)).toBeInTheDocument();
  });

  it("calls onCompleteOrder when the button is clicked", () => {
    const handleComplete = vi.fn();
    render(<KDSOrderBox order={mockOrder} onCompleteOrder={handleComplete} />);

    const labelStr = `Hoàn tất đơn ORD-098`;
    const btn = screen.getByRole("button", { name: labelStr });
    fireEvent.click(btn);

    expect(handleComplete).toHaveBeenCalledWith("o1");
  });
});

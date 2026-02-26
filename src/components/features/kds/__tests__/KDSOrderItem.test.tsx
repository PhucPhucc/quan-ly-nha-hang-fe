import "@testing-library/jest-dom";

import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import { OrderItemStatus } from "@/types/enums";
import { OrderItem } from "@/types/Order";

import { KDSOrderItem } from "../KDSOrderItem";

describe("KDSOrderItem", () => {
  const mockItem: OrderItem = {
    orderItemId: "oi1",
    orderId: "o1",
    menuItemId: "m1",
    itemCodeSnapshot: "M1",
    itemNameSnapshot: "Gà Nướng Mật Ong",
    stationSnapshot: "HOT",
    status: OrderItemStatus.Cooking,
    quantity: 2,
    unitPriceSnapshot: 0,
    itemNote: "Da giòn",
    createdAt: new Date().toISOString(),
  };

  it("displays order item information correctly including quantity and item name", () => {
    render(<KDSOrderItem item={mockItem} />);

    expect(screen.getByText("Gà Nướng Mật Ong")).toBeInTheDocument();
    expect(screen.getByText("x2")).toBeInTheDocument();
    expect(screen.getByText("DA GIÒN")).toBeInTheDocument(); // Tag based on note
  });

  it("calls onDone when button is clicked for an active item", () => {
    const handleDone = vi.fn();
    render(<KDSOrderItem item={mockItem} onDone={handleDone} />);

    // The aria-label is "Hoàn thành món Gà Nướng Mật Ong" locally or we can use the exact message from failure log
    const labelStr = `Hoàn thành món Gà Nướng Mật Ong`;
    const button = screen.getByRole("button", { name: labelStr });
    fireEvent.click(button);

    expect(handleDone).toHaveBeenCalledWith("oi1");
  });

  it("does not show Done button if item status is Ready", () => {
    const readyItem = { ...mockItem, status: OrderItemStatus.Ready };
    render(<KDSOrderItem item={readyItem} />);

    const labelStr = `Hoàn thành món Gà Nướng Mật Ong`;
    const button = screen.queryByRole("button", { name: labelStr });
    expect(button).not.toBeInTheDocument();
  });

  it("shows Return button if note contains return string", () => {
    const returnItem = { ...mockItem, itemNote: "return món này" };
    render(<KDSOrderItem item={returnItem} />);

    const labelStr = `Trả món Gà Nướng Mật Ong`;
    const returnBtn = screen.getByRole("button", { name: labelStr });
    expect(returnBtn).toBeInTheDocument();
  });
});

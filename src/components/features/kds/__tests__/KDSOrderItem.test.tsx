import "@testing-library/jest-dom";

import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import { UI_TEXT } from "@/lib/UI_Text";
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

  it("displays order item information correctly including quantity, name, and note", () => {
    render(<KDSOrderItem item={mockItem} />);

    expect(screen.getByText(/Gà Nướng Mật Ong/i)).toBeInTheDocument();
    expect(screen.getByText("x2")).toBeInTheDocument();
    expect(screen.getByText("Da giòn")).toBeInTheDocument(); // Note text under name
    expect(screen.getByText("DA GIÒN")).toBeInTheDocument(); // Tag at bottom
    expect(screen.getByText(UI_TEXT.KDS.ITEM.STATUS_COOKING)).toBeInTheDocument();
  });

  it("displays Preparing status when item is in Preparing state", () => {
    const preparingItem = { ...mockItem, status: OrderItemStatus.Preparing };
    render(<KDSOrderItem item={preparingItem} />);
    expect(screen.getByText(UI_TEXT.KDS.ITEM.STATUS_PREPARING)).toBeInTheDocument();
  });

  it("calls onDone when button is clicked for an active item", () => {
    const handleDone = vi.fn();
    render(<KDSOrderItem item={mockItem} onDone={handleDone} />);

    const labelStr = `${UI_TEXT.KDS.ITEM.DONE} Gà Nướng Mật Ong`;
    const button = screen.getByRole("button", { name: labelStr });
    fireEvent.click(button);

    expect(handleDone).toHaveBeenCalledWith("oi1");
  });

  it("does not show Done button if item status is Ready", () => {
    const readyItem = { ...mockItem, status: OrderItemStatus.Ready };
    render(<KDSOrderItem item={readyItem} />);

    const labelStr = `${UI_TEXT.KDS.ITEM.DONE} Gà Nướng Mật Ong`;
    const button = screen.queryByRole("button", { name: labelStr });
    expect(button).not.toBeInTheDocument();
  });

  it("opens Reject Modal when return button is clicked", () => {
    render(<KDSOrderItem item={mockItem} />);

    const labelStr = `${UI_TEXT.KDS.ITEM.RETURN} Gà Nướng Mật Ong`;
    const returnBtn = screen.getByRole("button", { name: labelStr });
    fireEvent.click(returnBtn);

    expect(screen.getByText(UI_TEXT.KDS.AUDIT.REJECT_MODAL.TITLE)).toBeInTheDocument();
  });
});

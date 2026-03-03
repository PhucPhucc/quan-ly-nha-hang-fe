import "@testing-library/jest-dom";

import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import { UI_TEXT } from "@/lib/UI_Text";
import { OrderItemStatus, OrderType } from "@/types/enums";
import { OrderItem } from "@/types/Order";

import { KDSItemCard } from "../KDSItemCard";

describe("KDSItemCard", () => {
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

  const defaultProps = {
    item: mockItem,
    orderCode: "ORD-098",
    orderType: OrderType.DineIn,
    onDone: vi.fn(),
    onReturn: vi.fn(),
  };

  it("renders item and order information correctly", () => {
    render(<KDSItemCard {...defaultProps} />);

    expect(screen.getByText(/Gà Nướng Mật Ong/i)).toBeInTheDocument();
    expect(screen.getByText("x2")).toBeInTheDocument(); // Quantity in ring
    expect(screen.getByText(/ORD-098/i)).toBeInTheDocument();
    expect(screen.getByText("Da giòn")).toBeInTheDocument();
    expect(screen.getByText("HOT")).toBeInTheDocument(); // Station info
  });

  it("calls onDone when the complete button is clicked", () => {
    const handleDone = vi.fn();
    render(<KDSItemCard {...defaultProps} onDone={handleDone} />);

    const doneBtn = screen.getByRole("button", { name: new RegExp(UI_TEXT.KDS.ITEM.DONE, "i") });
    fireEvent.click(doneBtn);

    expect(handleDone).toHaveBeenCalledWith("oi1");
  });

  it("opens reject modal when the return button is clicked", () => {
    render(<KDSItemCard {...defaultProps} />);

    const returnBtn = screen.getByRole("button", {
      name: new RegExp(UI_TEXT.KDS.ITEM.RETURN, "i"),
    });
    fireEvent.click(returnBtn);

    expect(screen.getByText(UI_TEXT.KDS.AUDIT.REJECT_MODAL.TITLE)).toBeInTheDocument();
  });

  it("does not show Done button if item is already Ready", () => {
    const readyItem = { ...mockItem, status: OrderItemStatus.Ready };
    render(<KDSItemCard {...defaultProps} item={readyItem} />);

    const doneBtn = screen.queryByRole("button", { name: new RegExp(UI_TEXT.KDS.ITEM.DONE, "i") });
    expect(doneBtn).not.toBeInTheDocument();
  });
});

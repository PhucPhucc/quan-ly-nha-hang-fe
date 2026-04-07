import "@testing-library/jest-dom";

import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import { UI_TEXT } from "@/lib/UI_Text";
import { useKdsStore } from "@/store/useKdsStore";
import { OrderItemStatus, OrderType } from "@/types/enums";
import { OrderItem } from "@/types/Order";

vi.mock("@/store/useKdsStore");

const mockCompleteItemCooking = vi.fn();
const mockRejectItem = vi.fn();
const mockReturnItem = vi.fn();

function setupStoreMock() {
  vi.mocked(useKdsStore).mockImplementation((selector: unknown) => {
    const state = {
      completeItemCooking: mockCompleteItemCooking,
      rejectItem: mockRejectItem,
      returnItem: mockReturnItem,
    };
    return typeof selector === "function"
      ? (selector as (s: typeof state) => unknown)(state)
      : state;
  });
}

import { KDSItemCard } from "../KDSItemCard";

describe("KDSItemCard", () => {
  const mockItem: OrderItem = {
    orderItemId: "oi1",
    orderId: "o1",
    menuItemId: "m1",
    itemCodeSnapshot: "M1",
    itemNameSnapshot: "Ga Nuong Mat Ong",
    stationSnapshot: "HOT",
    status: OrderItemStatus.Cooking,
    quantity: 2,
    unitPriceSnapshot: 0,
    itemNote: "Da gion",
    createdAt: new Date().toISOString(),
  };

  const defaultProps = {
    item: mockItem,
    orderCode: "ORD-098",
    orderType: OrderType.DineIn,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    setupStoreMock();
  });

  it("renders item and order information correctly", () => {
    render(<KDSItemCard {...defaultProps} />);

    expect(screen.getByText(/Ga Nuong Mat Ong/i)).toBeInTheDocument();
    expect(screen.getByText("x2")).toBeInTheDocument();
    expect(screen.getByText(/ORD-098/i)).toBeInTheDocument();
    expect(screen.getByText("Da gion")).toBeInTheDocument();
    expect(screen.getByText("HOT")).toBeInTheDocument();
  });

  it("calls completeItemCooking when the complete button is clicked", () => {
    render(<KDSItemCard {...defaultProps} />);

    const doneBtn = screen.getByRole("button", { name: new RegExp(UI_TEXT.KDS.ITEM.DONE, "i") });
    fireEvent.click(doneBtn);

    expect(mockCompleteItemCooking).toHaveBeenCalledWith("oi1");
  });

  it("opens reject modal when the return button is clicked", () => {
    render(<KDSItemCard {...defaultProps} />);

    const returnBtn = screen.getByRole("button", {
      name: new RegExp(UI_TEXT.KDS.ITEM.RETURN, "i"),
    });
    fireEvent.click(returnBtn);

    expect(screen.getByText(UI_TEXT.KDS.AUDIT.REJECT_MODAL.TITLE)).toBeInTheDocument();
  });

  it("does not show Done button if item is already completed", () => {
    const completedItem = { ...mockItem, status: OrderItemStatus.Completed };
    render(<KDSItemCard {...defaultProps} item={completedItem} />);

    const doneBtn = screen.queryByRole("button", { name: new RegExp(UI_TEXT.KDS.ITEM.DONE, "i") });
    expect(doneBtn).not.toBeInTheDocument();
  });

  it("shows preparing state instead of done button when item is not cooking yet", () => {
    const preparingItem = { ...mockItem, status: OrderItemStatus.Preparing };
    render(<KDSItemCard {...defaultProps} item={preparingItem} />);

    const doneBtn = screen.queryByRole("button", { name: new RegExp(UI_TEXT.KDS.ITEM.DONE, "i") });
    expect(doneBtn).not.toBeInTheDocument();
    expect(screen.getAllByText(UI_TEXT.KDS.ITEM.STATUS_PREPARING).length).toBeGreaterThan(0);
  });

  it("calls returnItem when a rejected item is returned to queue", () => {
    const rejectedItem = { ...mockItem, status: OrderItemStatus.Rejected };
    render(<KDSItemCard {...defaultProps} item={rejectedItem} />);

    const returnBtn = screen.getByRole("button", {
      name: new RegExp(UI_TEXT.KDS.ITEM.RETURN, "i"),
    });
    fireEvent.click(returnBtn);

    expect(mockReturnItem).toHaveBeenCalledWith("oi1");
  });
});

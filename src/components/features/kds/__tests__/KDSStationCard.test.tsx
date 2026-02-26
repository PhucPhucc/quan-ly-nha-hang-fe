import { fireEvent, render, screen } from "@testing-library/react";
import { Flame } from "lucide-react";
import { describe, expect, it, vi } from "vitest";

import { KDSStationCard } from "../KDSStationCard";

describe("KDSStationCard", () => {
  const defaultProps = {
    title: "TRẠM BẾP (KITCHEN)",
    icon: <Flame data-testid="flame-icon" />,
    waitingItems: 12,
    statusText: "High Activity",
    statusVariant: "critical" as const,
    gradientClass: "bg-gradient-to-br from-orange-50/80",
    onClick: vi.fn(),
  };

  it("renders station information correctly", () => {
    render(<KDSStationCard {...defaultProps} />);

    expect(screen.getByText("TRẠM BẾP (KITCHEN)")).toBeInTheDocument();
    expect(screen.getByText("High Activity")).toBeInTheDocument();
    expect(screen.getByText("12 món đang đợi")).toBeInTheDocument();
    expect(screen.getByTestId("flame-icon")).toBeInTheDocument();
  });

  it("calls onClick when card is clicked", () => {
    render(<KDSStationCard {...defaultProps} />);

    // Use role="button" matching our implementation
    const card = screen.getByRole("button");
    fireEvent.click(card);

    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it("calls onClick when Enter key is pressed", () => {
    render(<KDSStationCard {...defaultProps} />);

    const card = screen.getByRole("button");
    fireEvent.keyDown(card, { key: "Enter", code: "Enter", charCode: 13 });

    expect(defaultProps.onClick).toHaveBeenCalled();
  });

  it("renders different status variants correctly", () => {
    const { rerender } = render(<KDSStationCard {...defaultProps} />);

    // Critical state should have red styling
    const badStatus = screen.getByText("High Activity");
    expect(badStatus).toHaveClass("bg-red-50 text-red-700");

    // Normal state should have green styling
    rerender(<KDSStationCard {...defaultProps} statusText="Normal" statusVariant="normal" />);

    const goodStatus = screen.getByText("Normal");
    expect(goodStatus).toHaveClass("bg-green-50 text-green-700");
  });
});

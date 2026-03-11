import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { UI_TEXT } from "@/lib/UI_Text";

import { KDSQuickNav } from "../KDSQuickNav";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/kds/station"),
  useRouter: () => ({ replace: vi.fn() }),
}));

describe("KDSQuickNav (Dynamic Island)", () => {
  it("renders as a collapsed 'island' by default", () => {
    render(<KDSQuickNav />);

    expect(screen.getByLabelText(UI_TEXT.KDS.NAV.EXPAND)).toBeInTheDocument();

    // The dynamic content container should be collapsed (opacity-0)
    const vaoTramSpan = screen.queryByText(UI_TEXT.KDS.NAV.STATION);
    const container = vaoTramSpan?.parentElement?.parentElement;
    expect(container).toHaveClass("opacity-0");
  });

  it("expands when clicked and shows navigation links", () => {
    render(<KDSQuickNav />);

    const toggleBtn = screen.getByLabelText(UI_TEXT.KDS.NAV.EXPAND);
    fireEvent.click(toggleBtn);

    expect(screen.getByText(UI_TEXT.KDS.NAV.STATION)).toBeInTheDocument();
    expect(screen.getByText(UI_TEXT.KDS.NAV.AUDIT_LOG)).toBeInTheDocument();

    const vaoTramSpan = screen.getByText(UI_TEXT.KDS.NAV.STATION);
    const container = vaoTramSpan.parentElement?.parentElement;
    expect(container).toHaveClass("opacity-100");
    expect(screen.getByLabelText(UI_TEXT.KDS.NAV.COLLAPSE)).toBeInTheDocument();
  });

  it("highlights the active link correctly when expanded", () => {
    render(<KDSQuickNav />);
    fireEvent.click(screen.getByLabelText(UI_TEXT.KDS.NAV.EXPAND));

    const vaoTramLink = screen.getByText(UI_TEXT.KDS.NAV.STATION).closest("a");
    expect(vaoTramLink).toHaveClass("bg-primary");
  });
});

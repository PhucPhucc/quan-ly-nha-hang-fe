import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { UI_TEXT } from "@/lib/UI_Text";
import { inventoryService } from "@/services/inventory.service";
import { InventoryCheckStatus } from "@/types/Inventory";

import { InventoryCheckTable } from "../InventoryCheckTable";

vi.mock("@/services/inventory.service", () => ({
  inventoryService: {
    getInventoryChecks: vi.fn(),
  },
}));

// Mock DateRangePicker since it might use complex libs
vi.mock("@/components/shared/DateRangePicker", () => ({
  DateRangePicker: () => <div data-testid="date-range-picker" />,
}));

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe("InventoryCheckTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display loading state initially", () => {
    vi.mocked(inventoryService.getInventoryChecks).mockImplementation(() => new Promise(() => {}));

    renderWithProviders(<InventoryCheckTable />);

    // Check for skeleton or pulse div
    expect(screen.getByRole("status", { hidden: true })).toBeDefined();
  });

  it("should display empty state when no checks found", async () => {
    vi.mocked(inventoryService.getInventoryChecks).mockResolvedValue({
      isSuccess: true,
      data: { items: [], totalCount: 0, currentPage: 1, pageSize: 10, totalPages: 1 },
    });

    renderWithProviders(<InventoryCheckTable />);

    expect(await screen.findByText(UI_TEXT.INVENTORY.CHECK.EMPTY_TITLE)).toBeInTheDocument();
  });

  it("should display list of inventory checks", async () => {
    const mockCheck = {
      inventoryCheckId: "check-1",
      checkDate: new Date().toISOString(),
      status: InventoryCheckStatus.Draft,
      totalItems: 5,
      note: "Test note",
      createdAt: new Date().toISOString(),
      createdBy: "Admin",
    };

    vi.mocked(inventoryService.getInventoryChecks).mockResolvedValue({
      isSuccess: true,
      data: {
        items: [mockCheck],
        totalCount: 1,
        currentPage: 1,
        pageSize: 10,
        totalPages: 1,
      },
    });

    renderWithProviders(<InventoryCheckTable />);

    expect(await screen.findByText("CHECK-1")).toBeInTheDocument();
    expect(screen.getByText(UI_TEXT.INVENTORY.CHECK.STATUS_DRAFT)).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });
});

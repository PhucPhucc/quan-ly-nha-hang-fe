import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { UI_TEXT } from "@/lib/UI_Text";
import { inventoryService } from "@/services/inventory.service";

import { InventorySettingsForm } from "../InventorySettingsForm";
import { InventorySettingsFormContainer } from "../InventorySettingsFormContainer";

vi.mock("@/services/inventory.service", () => ({
  inventoryService: {
    getInventorySettings: vi.fn(),
    updateInventorySettings: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

vi.stubGlobal("ResizeObserver", ResizeObserverMock);

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

const initialValues = {
  expiryWarningDays: 10,
  defaultLowStockThreshold: 5,
  autoDeductOnCompleted: true,
  costMethod: "Bình quân gia quyền",
  maxCostRecalcDays: 30,
};

describe("InventorySettingsForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(inventoryService.getInventorySettings).mockResolvedValue({
      isSuccess: true,
      data: initialValues,
    });
  });

  it("should render initial settings", async () => {
    render(<InventorySettingsForm initialValues={initialValues} onSubmit={vi.fn()} />);

    await waitFor(() => {
      const inputs = screen.getAllByRole("spinbutton");
      expect(inputs[0]).toHaveValue(10);
      expect(inputs[1]).toHaveValue(5);
    });
  });

  it("should submit form successfully", async () => {
    const handleSubmit = vi.fn();

    const user = userEvent.setup();
    render(<InventorySettingsForm initialValues={initialValues} onSubmit={handleSubmit} />);

    await waitFor(() => {
      expect(screen.getAllByRole("spinbutton")[0]).toBeInTheDocument();
    });

    const expiryInput = screen.getAllByRole("spinbutton")[0];
    await user.clear(expiryInput);
    await user.type(expiryInput, "15");

    const saveBtn = screen.getByRole("button", { name: UI_TEXT.BUTTON.SAVE_CHANGES });
    await user.click(saveBtn);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
      expect(handleSubmit.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          expiryWarningDays: 15,
        })
      );
    });
  });

  it("should show error toast when update returns unsuccessful response", async () => {
    vi.mocked(inventoryService.updateInventorySettings).mockResolvedValue({
      isSuccess: false,
      data: false,
      message: "Cap nhat that bai",
    });

    const user = userEvent.setup();
    renderWithQueryClient(<InventorySettingsFormContainer initialValues={initialValues} />);

    const saveBtn = await screen.findByRole("button", { name: UI_TEXT.BUTTON.SAVE_CHANGES });
    await user.click(saveBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Cap nhat that bai");
    });
  });

  it("should show network error toast when update throws", async () => {
    vi.mocked(inventoryService.updateInventorySettings).mockRejectedValue(
      new Error("Network error")
    );

    const user = userEvent.setup();
    renderWithQueryClient(<InventorySettingsFormContainer initialValues={initialValues} />);

    const saveBtn = await screen.findByRole("button", { name: UI_TEXT.BUTTON.SAVE_CHANGES });
    await user.click(saveBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(UI_TEXT.API.NETWORK_ERROR);
    });
  });

  it("should fetch inventory settings on mount", async () => {
    render(<InventorySettingsFormContainer />);

    await waitFor(() => {
      expect(inventoryService.getInventorySettings).toHaveBeenCalledTimes(1);
      const inputs = screen.getAllByRole("spinbutton");
      expect(inputs[0]).toHaveValue(10);
      expect(inputs[1]).toHaveValue(5);
    });
  });
});

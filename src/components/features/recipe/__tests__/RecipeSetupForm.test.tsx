import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { UI_TEXT } from "@/lib/UI_Text";

import { useRecipeForm } from "../hooks/useRecipeForm";
import { RecipeSetupForm } from "../RecipeSetupForm";

// Mock the hook and components
vi.mock("../hooks/useRecipeForm");
vi.mock("../RecipeIngredientsTable", () => ({
  RecipeIngredientsTable: () => <div data-testid="ingredients-table" />,
}));
vi.mock("../RecipeCostSummary", () => ({
  RecipeCostSummary: () => <div data-testid="cost-summary" />,
}));
vi.mock("../AddIngredientModal", () => ({
  AddIngredientModal: ({
    isOpen,
    onAdd,
  }: {
    isOpen: boolean;
    onAdd: (ing: { ingredientId: string; name: string }, q: number) => void;
  }) => {
    const addText = "Add";
    return isOpen ? (
      <button
        data-testid="add-mock"
        onClick={() => onAdd({ ingredientId: "new", name: "New" }, 10)}
      >
        {addText}
      </button>
    ) : null;
  },
}));

describe("RecipeSetupForm", () => {
  const mockProps = {
    menuItemId: "menu-123",
    initialData: null,
    onSuccess: vi.fn(),
    onCancel: vi.fn(),
  };

  const mockHookReturn = {
    register: vi.fn(),
    handleSubmit: vi.fn((e) => e.preventDefault()),
    fields: [{ id: "1" }], // One field so we don't hit empty state
    remove: vi.fn(),
    setValue: vi.fn(),
    watchedIngredients: [{ ingredientId: "ing-1", totalCost: 50 }],
    totalCost: 50,
    errors: {},
    isSubmitting: false,
    isDirty: false,
    handleAddIngredient: vi.fn(),
  };

  beforeEach(() => {
    vi.mocked(useRecipeForm).mockReturnValue(
      mockHookReturn as unknown as ReturnType<typeof useRecipeForm>
    );
  });

  it("renders the list title and components", () => {
    render(<RecipeSetupForm {...mockProps} />);
    expect(screen.getByText(UI_TEXT.MENU.RECIPE.INGREDIENTS_LIST)).toBeDefined();
    expect(screen.getByTestId("ingredients-table")).toBeDefined();
    expect(screen.getByTestId("cost-summary")).toBeDefined();
  });

  it("calls handleAddIngredient when modal adds an ingredient", () => {
    render(<RecipeSetupForm {...mockProps} />);

    // Open modal
    const addButton = screen.getByText(UI_TEXT.MENU.RECIPE.ADD_INGREDIENT);
    fireEvent.click(addButton);

    // Simulate add from mock modal
    const modalAdd = screen.getByTestId("add-mock");
    fireEvent.click(modalAdd);

    expect(mockHookReturn.handleAddIngredient).toHaveBeenCalled();
  });
});

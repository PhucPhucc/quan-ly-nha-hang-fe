import { describe, expect, it, vi } from "vitest";

import { apiFetch } from "@/services/api";

import { recipeService } from "../recipeService";

vi.mock("@/services/api", () => ({
  apiFetch: vi.fn(),
}));

describe("recipeService", () => {
  it("calls getByMenuItemId with correctly formatted endpoint", async () => {
    vi.mocked(apiFetch).mockResolvedValue({
      isSuccess: true,
      data: [
        {
          ingredientId: "ing-1",
          ingredientName: "Beef",
          baseUnit: "kg",
          quantityPerServing: 0.5,
        },
      ],
    });

    const result = await recipeService.getByMenuItemId("menu-123");

    expect(apiFetch).toHaveBeenCalledWith("/recipes/menu-123");
    expect(result.data.ingredients).toHaveLength(1);
    expect(result.data.ingredients[0].ingredientId).toBe("ing-1");
  });

  it("calls upsertRecipe with POST payload", async () => {
    vi.mocked(apiFetch).mockResolvedValue({
      isSuccess: true,
      data: null,
    });

    const ingredients = [{ ingredientId: "ing-1", quantityPerServing: 0.5 }];
    await recipeService.upsertRecipe("menu-123", ingredients);

    expect(apiFetch).toHaveBeenCalledWith("/recipes/menu-123", {
      method: "POST",
      body: { items: ingredients },
    });
  });
});

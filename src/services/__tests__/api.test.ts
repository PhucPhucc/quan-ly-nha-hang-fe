import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockLogout } = vi.hoisted(() => ({
  mockLogout: vi.fn(),
}));

vi.mock("@/store/useAuthStore", () => ({
  useAuthStore: {
    getState: () => ({
      logout: mockLogout,
    }),
  },
}));

function createJsonResponse(body: unknown, status: number, statusText = "OK"): Response {
  return new Response(JSON.stringify(body), {
    status,
    statusText,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

describe("apiFetch", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { href: "http://localhost/" },
    });
  });

  it("does not refresh token for forbidden responses", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      createJsonResponse({ message: "Bạn không có quyền truy cập." }, 403, "Forbidden")
    );

    const { apiFetch } = await import("../api");

    await expect(apiFetch("/inventory/opening-stock", { method: "POST" })).rejects.toThrow(
      "Bạn không có quyền truy cập."
    );

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(mockLogout).not.toHaveBeenCalled();
  });

  it("returns the retried backend error instead of forcing session expired", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(createJsonResponse({ message: "Unauthorized" }, 401, "Unauthorized"))
      .mockResolvedValueOnce(createJsonResponse({ data: { ok: true } }, 200))
      .mockResolvedValueOnce(
        createJsonResponse({ message: "Bạn không có quyền cập nhật kho." }, 403, "Forbidden")
      );

    const { apiFetch } = await import("../api");

    await expect(apiFetch("/inventory/opening-stock", { method: "POST" })).rejects.toThrow(
      "Bạn không có quyền cập nhật kho."
    );

    expect(fetch).toHaveBeenCalledTimes(3);
    expect(mockLogout).not.toHaveBeenCalled();
  });

  it("logs out only when refresh token really fails", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(createJsonResponse({ message: "Unauthorized" }, 401, "Unauthorized"))
      .mockResolvedValueOnce(
        createJsonResponse({ message: "Refresh token has expired." }, 401, "Unauthorized")
      );

    const { apiFetch } = await import("../api");

    await expect(apiFetch("/auth/me")).rejects.toThrow("Session expired");

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});

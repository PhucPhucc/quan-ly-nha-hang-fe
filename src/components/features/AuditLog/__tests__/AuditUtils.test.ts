import { describe, expect, it } from "vitest";

import { getSummary, getTableSubject } from "../AuditUtils";

describe("AuditUtils table subject formatting", () => {
  it("reduces UUID-like table numbers to a short display value", () => {
    const rawUuid = "00000000-0000-0000-0000-000000000001";
    const state = { TableNumber: rawUuid };

    expect(getTableSubject(state, rawUuid)).toBe("bàn 0001");
  });

  it("keeps the summary free of raw UUID noise", () => {
    const rawUuid = "00000000-0000-0000-0000-000000000001";

    const summary = getSummary({
      logId: "log-1",
      entityName: "Table",
      entityId: rawUuid,
      action: "StatusChange",
      oldValues: JSON.stringify({ TableNumber: rawUuid }),
      newValues: JSON.stringify({ TableNumber: rawUuid }),
      actorInfo: JSON.stringify({ type: "Employee", code: "C004001" }),
      createdAt: "2026-03-24T13:41:13.000Z",
    });

    expect(summary).toContain("bàn 0001");
    expect(summary).not.toContain(rawUuid);
  });
});

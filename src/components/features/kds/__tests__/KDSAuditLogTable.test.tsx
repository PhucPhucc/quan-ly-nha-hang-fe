import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { UI_TEXT } from "@/lib/UI_Text";

import KDSAuditLogTable from "../KDSAuditLogTable";

describe("KDSAuditLogTable", () => {
  const mockLogs = [
    {
      logId: "l1",
      time: "22:10 25/02",
      actorName: "Chef Toàn",
      actorRole: "ChefBar" as const,
      actionType: UI_TEXT.KDS.AUDIT.ACTION_REJECT,
      orderCode: "ORD-102",
      orderItems: "Phở Bò Tái Lăn (x2)",
      reason: "Hết nguyên liệu bò",
    },
    {
      logId: "l2",
      time: "22:05 25/02",
      actorName: "Chef Toàn",
      actorRole: "ChefBar" as const,
      actionType: UI_TEXT.KDS.AUDIT.ACTION_START,
      orderCode: "ORD-102",
      orderItems: "Phở Bò Tái Lăn (x2)",
      reason: "",
    },
  ];

  it("renders loading state correctly", () => {
    render(
      <KDSAuditLogTable
        logs={[]}
        loading={true}
        error={null}
        currentPage={1}
        totalPages={1}
        onPageChange={() => {}}
      />
    );
    expect(screen.getByText(UI_TEXT.COMMON.LOADING)).toBeInTheDocument();
  });

  it("renders error state correctly", () => {
    render(
      <KDSAuditLogTable
        logs={[]}
        loading={false}
        error="Failed to fetch logs"
        currentPage={1}
        totalPages={1}
        onPageChange={() => {}}
      />
    );
    expect(screen.getByText("Failed to fetch logs")).toBeInTheDocument();
  });

  it("renders empty state correctly", () => {
    render(
      <KDSAuditLogTable
        logs={[]}
        loading={false}
        error={null}
        currentPage={1}
        totalPages={1}
        onPageChange={() => {}}
      />
    );
    expect(screen.getByText(UI_TEXT.KDS.AUDIT.EMPTY)).toBeInTheDocument();
  });

  it("renders logs correctly", () => {
    render(
      <KDSAuditLogTable
        logs={mockLogs}
        loading={false}
        error={null}
        currentPage={1}
        totalPages={1}
        onPageChange={() => {}}
      />
    );

    // Check if table headers exist
    expect(screen.getByText(UI_TEXT.KDS.AUDIT.TIME)).toBeInTheDocument();
    expect(screen.getByText(UI_TEXT.KDS.AUDIT.ACTOR)).toBeInTheDocument();

    // Check if data is rendered correctly
    expect(screen.getAllByText("22:10")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Chef Toàn")[0]).toBeInTheDocument();
    // screen.debug(); // Debugging the failure
    expect(screen.getByText(/TỪ CHỐI MÓN/i)).toBeInTheDocument();
    expect(screen.getAllByText("ORD-102")[0]).toBeInTheDocument();
    expect(screen.getByText(/HẾT NGUYÊN LIỆU BÒ/i)).toBeInTheDocument();
  });

  it("calls onUndo when undo button is clicked", () => {
    const handleUndo = vi.fn();
    render(
      <KDSAuditLogTable
        logs={mockLogs}
        loading={false}
        error={null}
        currentPage={1}
        totalPages={1}
        onPageChange={() => {}}
        onUndo={handleUndo}
      />
    );

    const undoButton = screen.getByText(UI_TEXT.KDS.AUDIT.UNDO);
    fireEvent.click(undoButton);

    expect(handleUndo).toHaveBeenCalledTimes(1);
    expect(handleUndo).toHaveBeenCalledWith("l1");
  });
});
